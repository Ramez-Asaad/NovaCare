"""
Pydantic Schemas for ASL API
"""
from pydantic import BaseModel, Field
from typing import Optional, List


class PredictRequest(BaseModel):
    """Request for image-based prediction"""
    image: str = Field(..., description="Base64 encoded image")
    return_landmarks: bool = Field(default=False, description="Include landmarks in response")


class LandmarksRequest(BaseModel):
    """Request for landmark-based prediction (if client extracts landmarks)"""
    landmarks: List[float] = Field(..., description="Flattened 63 landmark values (21 landmarks * 3 coords)")


class PredictResponse(BaseModel):
    """Prediction response"""
    letter: str = Field(..., description="Predicted letter or empty if below threshold")
    confidence: float = Field(..., description="Prediction confidence (0-1)")
    hand_detected: bool = Field(..., description="Whether a hand was detected")
    landmarks: Optional[List[float]] = Field(None, description="Extracted landmarks if requested")
    inference_time_ms: float = Field(..., description="Inference time in milliseconds")


class StreamStartRequest(BaseModel):
    """Request to start a streaming session"""
    camera_id: int = Field(default=0, description="Camera device ID")


class StreamStartResponse(BaseModel):
    """Response for stream start"""
    session_id: str
    status: str


class StreamFrameResponse(BaseModel):
    """Response for each streamed frame"""
    letter: str
    confidence: float
    is_confirmed: bool
    accumulated_text: str
    hand_detected: bool
    timestamp: float


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    model_loaded: bool
    device: str
    version: str = "1.0.0"


class AccumulatorState(BaseModel):
    """Current accumulator state"""
    current_word: str
    words: List[str]
    full_text: str


class ResetResponse(BaseModel):
    """Response for reset endpoint"""
    status: str
    message: str
