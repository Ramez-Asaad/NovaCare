"""
Real-time ASL Predictor

Handles webcam capture, landmark extraction, and classification with
temporal smoothing for stable predictions.
"""
import sys
import time
import urllib.request
from pathlib import Path
from collections import deque
from dataclasses import dataclass
from typing import Optional, Tuple
import threading

import numpy as np
import cv2
import torch

sys.path.insert(0, str(Path(__file__).parent.parent))
from config import inference_config, data_config, CHECKPOINT_DIR
from models import create_model

# MediaPipe imports - handle both old and new API
try:
    import mediapipe as mp
    from mediapipe.tasks import python as mp_python
    from mediapipe.tasks.python import vision as mp_vision
    USE_NEW_API = True
except (ImportError, AttributeError):
    import mediapipe as mp
    USE_NEW_API = False


def download_hand_model():
    """Download the hand landmarker model if not present"""
    model_dir = Path(__file__).parent / "models"
    model_dir.mkdir(exist_ok=True)
    model_path = model_dir / "hand_landmarker.task"
    
    if not model_path.exists():
        print("Downloading hand landmarker model...")
        url = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
        urllib.request.urlretrieve(url, model_path)
        print(f"Model saved to {model_path}")
    
    return str(model_path)


@dataclass
class PredictionResult:
    """Container for prediction results"""
    letter: str
    confidence: float
    landmarks: Optional[np.ndarray]
    is_confirmed: bool
    inference_time_ms: float
    hand_detected: bool


class ASLPredictor:
    """
    Real-time ASL fingerspelling predictor
    
    Features:
    - MediaPipe hand landmark extraction
    - Lightweight neural network classification
    - Temporal smoothing for stable predictions
    - Confirmation logic for intentional gestures
    """
    
    def __init__(
        self,
        model_path: str = None,
        model_type: str = "attention",
        confidence_threshold: float = None,
        smoothing_window: int = None,
        confirmation_frames: int = None,
        device: str = "cuda"
    ):
        # Config
        self.confidence_threshold = confidence_threshold or inference_config.confidence_threshold
        self.smoothing_window = smoothing_window or inference_config.smoothing_window
        self.confirmation_frames = confirmation_frames or inference_config.confirmation_frames
        
        # Device
        if device == "cuda" and not torch.cuda.is_available():
            device = "cpu"
        self.device = device
        
        # Load model
        if model_path is None:
            model_path = str(CHECKPOINT_DIR / "latest" / "best_model.pt")
        
        self._load_model(model_path, model_type)
        
        # Initialize MediaPipe
        self.use_new_api = USE_NEW_API
        
        if USE_NEW_API:
            # New MediaPipe Tasks API
            model_path_mp = download_hand_model()
            base_options = mp_python.BaseOptions(model_asset_path=model_path_mp)
            options = mp_vision.HandLandmarkerOptions(
                base_options=base_options,
                running_mode=mp_vision.RunningMode.IMAGE,
                num_hands=inference_config.max_num_hands,
                min_hand_detection_confidence=inference_config.min_detection_confidence,
                min_hand_presence_confidence=inference_config.min_detection_confidence,
                min_tracking_confidence=inference_config.min_tracking_confidence
            )
            self.detector = mp_vision.HandLandmarker.create_from_options(options)
        else:
            # Legacy API
            self.mp_hands = mp.solutions.hands
            self.mp_drawing = mp.solutions.drawing_utils
            self.hands = self.mp_hands.Hands(
                static_image_mode=False,
                max_num_hands=inference_config.max_num_hands,
                min_detection_confidence=inference_config.min_detection_confidence,
                min_tracking_confidence=inference_config.min_tracking_confidence
            )
        
        # Prediction buffer for smoothing
        self.prediction_buffer = deque(maxlen=self.smoothing_window)
        self.confirmation_buffer = deque(maxlen=self.confirmation_frames)
        
        # State
        self.last_confirmed_letter = None
        self.classes = data_config.classes
    
    def _load_model(self, model_path: str, model_type: str):
        """Load trained model"""
        print(f"Loading model from {model_path}")
        
        checkpoint = torch.load(model_path, map_location=self.device, weights_only=False)
        
        # Get model type from checkpoint if available
        saved_type = checkpoint.get("config", {}).get("model_type", model_type)
        
        self.model = create_model(saved_type)
        self.model.load_state_dict(checkpoint["model_state_dict"])
        self.model.to(self.device)
        self.model.eval()
        
        print(f"Model loaded (device: {self.device})")
    
    def _extract_landmarks(self, frame: np.ndarray) -> Tuple[Optional[np.ndarray], Optional[object]]:
        """
        Extract hand landmarks from frame
        
        Args:
            frame: BGR image
            
        Returns:
            (normalized_landmarks, raw_landmarks_for_drawing)
        """
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        if self.use_new_api:
            # New API
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
            results = self.detector.detect(mp_image)
            
            if not results.hand_landmarks:
                return None, None
            
            hand_landmarks = results.hand_landmarks[0]
            
            # Extract coordinates
            landmarks = []
            for lm in hand_landmarks:
                landmarks.extend([lm.x, lm.y, lm.z])
            
            landmarks = np.array(landmarks, dtype=np.float32)
            landmarks = self._normalize_landmarks(landmarks)
            
            return landmarks, results
        else:
            # Legacy API
            results = self.hands.process(rgb_frame)
            
            if not results.multi_hand_landmarks:
                return None, None
            
            hand_landmarks = results.multi_hand_landmarks[0]
            
            landmarks = []
            for lm in hand_landmarks.landmark:
                landmarks.extend([lm.x, lm.y, lm.z])
            
            landmarks = np.array(landmarks, dtype=np.float32)
            landmarks = self._normalize_landmarks(landmarks)
            
            return landmarks, hand_landmarks
    
    def _normalize_landmarks(self, landmarks: np.ndarray) -> np.ndarray:
        """Normalize landmarks relative to wrist"""
        landmarks = landmarks.reshape(21, 3)
        
        # Center on wrist
        wrist = landmarks[0].copy()
        landmarks = landmarks - wrist
        
        # Scale normalize
        reference_dist = np.linalg.norm(landmarks[9])
        if reference_dist > 0:
            landmarks = landmarks / reference_dist
        
        return landmarks.flatten()
    
    def _classify(self, landmarks: np.ndarray) -> Tuple[int, float]:
        """
        Run classification on landmarks
        
        Returns:
            (class_index, confidence)
        """
        with torch.no_grad():
            x = torch.FloatTensor(landmarks).unsqueeze(0).to(self.device)
            logits = self.model(x)
            probs = torch.softmax(logits, dim=-1)
            confidence, predicted = probs.max(dim=-1)
            
            return predicted.item(), confidence.item()
    
    def _smooth_prediction(self, class_idx: int, confidence: float) -> Tuple[int, float]:
        """Apply temporal smoothing to predictions"""
        self.prediction_buffer.append((class_idx, confidence))
        
        if len(self.prediction_buffer) < 3:
            return class_idx, confidence
        
        # Weighted voting based on confidence
        class_votes = {}
        for idx, conf in self.prediction_buffer:
            class_votes[idx] = class_votes.get(idx, 0) + conf
        
        # Get most voted class
        best_class = max(class_votes, key=class_votes.get)
        avg_confidence = class_votes[best_class] / len(self.prediction_buffer)
        
        return best_class, avg_confidence
    
    def _check_confirmation(self, letter: str) -> bool:
        """Check if letter should be confirmed (held steady)"""
        self.confirmation_buffer.append(letter)
        
        if len(self.confirmation_buffer) < self.confirmation_frames:
            return False
        
        # Check if all recent predictions are the same
        return len(set(self.confirmation_buffer)) == 1
    
    def predict_frame(self, frame: np.ndarray) -> PredictionResult:
        """
        Predict ASL letter from a single frame
        
        Args:
            frame: BGR image from webcam
            
        Returns:
            PredictionResult with letter, confidence, and metadata
        """
        start_time = time.time()
        
        # Extract landmarks
        landmarks, raw_landmarks = self._extract_landmarks(frame)
        
        if landmarks is None:
            return PredictionResult(
                letter="",
                confidence=0.0,
                landmarks=None,
                is_confirmed=False,
                inference_time_ms=(time.time() - start_time) * 1000,
                hand_detected=False
            )
        
        # Classify
        class_idx, confidence = self._classify(landmarks)
        
        # Smooth
        class_idx, confidence = self._smooth_prediction(class_idx, confidence)
        
        letter = self.classes[class_idx] if confidence >= self.confidence_threshold else ""
        
        # Check confirmation
        is_confirmed = False
        if letter and letter != self.last_confirmed_letter:
            is_confirmed = self._check_confirmation(letter)
            if is_confirmed:
                self.last_confirmed_letter = letter
                self.confirmation_buffer.clear()
        
        inference_time = (time.time() - start_time) * 1000
        
        return PredictionResult(
            letter=letter,
            confidence=confidence,
            landmarks=landmarks,
            is_confirmed=is_confirmed,
            inference_time_ms=inference_time,
            hand_detected=True
        )
    
    def draw_landmarks(self, frame: np.ndarray, landmarks) -> np.ndarray:
        """Draw hand landmarks on frame"""
        if landmarks is None:
            return frame
        
        if self.use_new_api:
            # New API - draw using OpenCV
            if hasattr(landmarks, 'hand_landmarks') and landmarks.hand_landmarks:
                h, w = frame.shape[:2]
                for hand_lms in landmarks.hand_landmarks:
                    points = []
                    for lm in hand_lms:
                        x, y = int(lm.x * w), int(lm.y * h)
                        points.append((x, y))
                        cv2.circle(frame, (x, y), 5, (0, 255, 0), -1)
                    # Draw connections
                    connections = [
                        (0, 1), (1, 2), (2, 3), (3, 4),  # Thumb
                        (0, 5), (5, 6), (6, 7), (7, 8),  # Index
                        (0, 9), (9, 10), (10, 11), (11, 12),  # Middle
                        (0, 13), (13, 14), (14, 15), (15, 16),  # Ring
                        (0, 17), (17, 18), (18, 19), (19, 20),  # Pinky
                        (5, 9), (9, 13), (13, 17)  # Palm
                    ]
                    for start, end in connections:
                        if start < len(points) and end < len(points):
                            cv2.line(frame, points[start], points[end], (0, 255, 0), 2)
        else:
            # Legacy API
            self.mp_drawing.draw_landmarks(
                frame,
                landmarks,
                self.mp_hands.HAND_CONNECTIONS
            )
        return frame
    
    def reset(self):
        """Reset prediction state"""
        self.prediction_buffer.clear()
        self.confirmation_buffer.clear()
        self.last_confirmed_letter = None
    
    def close(self):
        """Release resources"""
        if self.use_new_api:
            self.detector.close()
        else:
            self.hands.close()


class LetterAccumulator:
    """Accumulates confirmed letters into words"""
    
    def __init__(self):
        self.current_word = ""
        self.words = []
    
    def add_letter(self, letter: str):
        """Add a confirmed letter"""
        if letter == "space":
            if self.current_word:
                self.words.append(self.current_word)
                self.current_word = ""
        elif letter == "del":
            self.current_word = self.current_word[:-1]
        elif letter == "nothing":
            pass
        else:
            self.current_word += letter
    
    def get_text(self) -> str:
        """Get accumulated text"""
        all_words = self.words + ([self.current_word] if self.current_word else [])
        return " ".join(all_words)
    
    def clear(self):
        """Clear all text"""
        self.current_word = ""
        self.words = []


if __name__ == "__main__":
    # Quick test
    print("Testing ASLPredictor initialization...")
    
    try:
        predictor = ASLPredictor()
        print("✅ Predictor initialized successfully")
        predictor.close()
    except FileNotFoundError as e:
        print(f"⚠️ Model not found (train first): {e}")
    except Exception as e:
        print(f"❌ Error: {e}")
