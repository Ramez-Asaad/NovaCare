"""
API Routes for ASL Recognition Service
"""
import base64
import io
import time
import uuid
from typing import Optional

import numpy as np
import cv2
from PIL import Image
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse

from .schemas import (
    PredictRequest,
    PredictResponse,
    LandmarksRequest,
    StreamStartRequest,
    StreamStartResponse,
    StreamFrameResponse,
    HealthResponse,
    AccumulatorState,
    ResetResponse
)

router = APIRouter()

# Global state (will be set by main.py)
predictor = None
accumulator = None


def set_predictor(pred, acc):
    """Set global predictor and accumulator (called from main.py)"""
    global predictor, accumulator
    predictor = pred
    accumulator = acc


def decode_base64_image(image_b64: str) -> np.ndarray:
    """Decode base64 image to OpenCV format"""
    try:
        # Handle data URL format
        if "base64," in image_b64:
            image_b64 = image_b64.split("base64,")[1]
        
        # Decode
        image_bytes = base64.b64decode(image_b64)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to OpenCV BGR
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        return frame
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image data: {str(e)}")


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Check API health and model status"""
    return HealthResponse(
        status="healthy",
        model_loaded=predictor is not None,
        device=predictor.device if predictor else "unknown"
    )


@router.post("/predict", response_model=PredictResponse)
async def predict_from_image(request: PredictRequest):
    """
    Predict ASL letter from a base64 encoded image.
    
    Send an image captured from webcam and get the predicted letter.
    """
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Decode image
    frame = decode_base64_image(request.image)
    
    # Predict
    result = predictor.predict_frame(frame)
    
    return PredictResponse(
        letter=result.letter,
        confidence=result.confidence,
        hand_detected=result.hand_detected,
        landmarks=result.landmarks.tolist() if request.return_landmarks and result.landmarks is not None else None,
        inference_time_ms=result.inference_time_ms
    )


@router.post("/predict/landmarks", response_model=PredictResponse)
async def predict_from_landmarks(request: LandmarksRequest):
    """
    Predict ASL letter from pre-extracted landmarks.
    
    Use this if your client already extracts MediaPipe landmarks.
    """
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if len(request.landmarks) != 63:
        raise HTTPException(
            status_code=400, 
            detail=f"Expected 63 landmark values, got {len(request.landmarks)}"
        )
    
    start_time = time.time()
    
    # Convert to numpy
    landmarks = np.array(request.landmarks, dtype=np.float32)
    
    # Classify
    class_idx, confidence = predictor._classify(landmarks)
    letter = predictor.classes[class_idx] if confidence >= predictor.confidence_threshold else ""
    
    inference_time = (time.time() - start_time) * 1000
    
    return PredictResponse(
        letter=letter,
        confidence=confidence,
        hand_detected=True,
        landmarks=None,
        inference_time_ms=inference_time
    )


@router.post("/predict/confirm", response_model=PredictResponse)
async def predict_and_confirm(request: PredictRequest):
    """
    Predict and automatically add to accumulated text if confirmed.
    
    This endpoint handles the confirmation logic and text accumulation.
    """
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Decode image
    frame = decode_base64_image(request.image)
    
    # Predict
    result = predictor.predict_frame(frame)
    
    # Add to accumulator if confirmed
    if result.is_confirmed:
        accumulator.add_letter(result.letter)
        predictor.reset()
    
    return PredictResponse(
        letter=result.letter,
        confidence=result.confidence,
        hand_detected=result.hand_detected,
        landmarks=result.landmarks.tolist() if request.return_landmarks and result.landmarks is not None else None,
        inference_time_ms=result.inference_time_ms
    )


@router.get("/accumulator", response_model=AccumulatorState)
async def get_accumulator_state():
    """Get current accumulated text state"""
    if accumulator is None:
        raise HTTPException(status_code=503, detail="Accumulator not initialized")
    
    return AccumulatorState(
        current_word=accumulator.current_word,
        words=accumulator.words,
        full_text=accumulator.get_text()
    )


@router.post("/accumulator/add/{letter}")
async def add_letter_manually(letter: str):
    """Manually add a letter to the accumulator"""
    if accumulator is None:
        raise HTTPException(status_code=503, detail="Accumulator not initialized")
    
    if letter not in predictor.classes:
        raise HTTPException(status_code=400, detail=f"Invalid letter: {letter}")
    
    accumulator.add_letter(letter)
    
    return {"status": "ok", "text": accumulator.get_text()}


@router.post("/reset", response_model=ResetResponse)
async def reset_state():
    """Reset predictor and accumulator state"""
    if predictor is not None:
        predictor.reset()
    if accumulator is not None:
        accumulator.clear()
    
    return ResetResponse(
        status="ok",
        message="State reset successfully"
    )


@router.get("/classes")
async def get_classes():
    """Get list of supported ASL classes"""
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {"classes": predictor.classes, "count": len(predictor.classes)}
