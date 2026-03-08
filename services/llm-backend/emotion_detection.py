"""
Face Emotion Predictor API
Uses model fine-tuned on FER2013 dataset for facial emotion recognition.
Loads from HuggingFace: trpakov/vit-face-expression
"""

import os
# Disable HF progress bars to prevent WinError 6 on Windows
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"

import cv2
import numpy as np
import torch
from typing import Dict, Optional, List, Union
from PIL import Image
import base64

# Try to import transformers for HuggingFace model
try:
    from transformers import AutoImageProcessor, AutoModelForImageClassification
    HF_AVAILABLE = True
except ImportError:
    HF_AVAILABLE = False
    print("Warning: transformers not installed. Install with: pip install transformers")


class FaceEmotionAnalyzer:
    """
    Face-based emotion analyzer using HuggingFace model.
    Analyzes facial expressions to detect emotions.
    """
    
    # FER2013 emotion labels
    EMOTION_LABELS = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
    
    # Image specifications
    TARGET_SIZE = (224, 224)
    
    def __init__(
        self,
        model_path: Optional[str] = None,
        use_huggingface: bool = True,
        device: Optional[str] = None
    ):
        """
        Initialize the Face Emotion Analyzer.
        
        Args:
            model_path: Path to locally saved model (optional).
            use_huggingface: If True, load model from HuggingFace.
            device: Device to run model on ('cuda' or 'cpu').
        """
        self.device = device or ('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = None
        self.processor = None
        
        # Load face detector
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        
        if use_huggingface and HF_AVAILABLE:
            self._load_huggingface_model(model_path)
        elif model_path and os.path.exists(model_path):
            self._load_local_model(model_path)
        else:
            print("Warning: No model loaded. Please provide a model path or enable HuggingFace.")
    
    def _load_huggingface_model(self, model_path: Optional[str] = None):
        """Load model from HuggingFace Hub."""
        # Use custom model or default to a reliable facial emotion model
        model_name = model_path or "trpakov/vit-face-expression"
        print(f"Loading model from HuggingFace: {model_name}")
        
        try:
            # Try loading processor from model
            try:
                self.processor = AutoImageProcessor.from_pretrained(model_name)
            except Exception:
                # Fallback: use ViT base processor (compatible with most image models)
                print("Using fallback processor (google/vit-base-patch16-224)")
                self.processor = AutoImageProcessor.from_pretrained("google/vit-base-patch16-224")
            
            self.model = AutoModelForImageClassification.from_pretrained(model_name)
            self.model.to(self.device)
            self.model.eval()
            
            # Get label mapping from model config
            if hasattr(self.model.config, 'id2label'):
                self.id2label = self.model.config.id2label
            else:
                self.id2label = {i: label for i, label in enumerate(self.EMOTION_LABELS)}
            
            print(f"Model loaded successfully on {self.device}")
            print(f"Labels: {list(self.id2label.values())}")
            
        except Exception as e:
            print(f"Error loading HuggingFace model: {e}")
            self.model = None
            self.processor = None
    
    def _load_local_model(self, model_path: str):
        """Load a locally saved model."""
        print(f"Loading local model from: {model_path}")
        try:
            self.processor = AutoImageProcessor.from_pretrained(model_path)
            self.model = AutoModelForImageClassification.from_pretrained(model_path)
            self.model.to(self.device)
            self.model.eval()
            print("Local model loaded successfully!")
        except Exception as e:
            print(f"Error loading local model: {e}")
            self.model = None
    
    def _preprocess_image(self, image: np.ndarray) -> Image.Image:
        """
        Preprocess image for model input.
        
        Args:
            image: Input image (BGR format from OpenCV).
        
        Returns:
            PIL Image ready for processing.
        """
        # Convert grayscale to RGB if needed
        if len(image.shape) == 2:
            image = np.stack([image, image, image], axis=-1)
        elif image.shape[-1] == 1:
            image = np.concatenate([image, image, image], axis=-1)
        elif image.shape[-1] == 4:
            image = cv2.cvtColor(image, cv2.COLOR_BGRA2RGB)
        elif image.shape[-1] == 3:
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Resize to target size
        image = cv2.resize(image, self.TARGET_SIZE)
        
        # Convert to PIL Image
        return Image.fromarray(image)
    
    def _detect_face(self, image: np.ndarray) -> Optional[np.ndarray]:
        """
        Detect and extract face from image.
        
        Args:
            image: Input image.
        
        Returns:
            Cropped face image or None if no face detected.
        """
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
        
        faces = self.face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30)
        )
        
        if len(faces) == 0:
            return None
        
        # Get the largest face
        x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
        
        # Add padding
        padding = int(0.15 * max(w, h))
        x = max(0, x - padding)
        y = max(0, y - padding)
        w = min(image.shape[1] - x, w + 2 * padding)
        h = min(image.shape[0] - y, h + 2 * padding)
        
        return image[y:y+h, x:x+w]
    
    def predict(
        self,
        image_input: Union[str, np.ndarray],
        detect_face: bool = True,
        return_all_scores: bool = False
    ) -> Dict:
        """
        Predict emotion from face image.
        
        Args:
            image_input: Path to image file or numpy array.
            detect_face: If True, detect and crop face first.
            return_all_scores: If True, return scores for all emotions.
        
        Returns:
            Dictionary with emotion and confidence.
        """
        if self.model is None or self.processor is None:
            return {
                "emotion": "unknown",
                "confidence": 0.0,
                "face_detected": False,
                "error": "Model not loaded"
            }
        
        try:
            # Load image if path provided
            if isinstance(image_input, str):
                image = cv2.imread(image_input)
                if image is None:
                    raise ValueError(f"Could not load image from {image_input}")
            else:
                image = image_input.copy()
            
            # Detect face if requested
            face_detected = True
            if detect_face:
                face = self._detect_face(image)
                if face is not None:
                    image = face
                else:
                    face_detected = False
            
            # Preprocess
            pil_image = self._preprocess_image(image)
            
            # Process with HuggingFace processor
            inputs = self.processor(images=pil_image, return_tensors="pt")
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # Run inference
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
                probabilities = torch.nn.functional.softmax(logits, dim=-1)
            
            # Get predictions
            probs = probabilities[0].cpu().numpy()
            predicted_idx = int(np.argmax(probs))
            confidence = float(probs[predicted_idx])
            
            emotion = self.id2label.get(predicted_idx, self.EMOTION_LABELS[predicted_idx % len(self.EMOTION_LABELS)])
            
            response = {
                "emotion": emotion,
                "confidence": round(confidence, 4),
                "face_detected": face_detected
            }
            
            if return_all_scores:
                response["all_scores"] = {
                    self.id2label.get(i, f"emotion_{i}"): round(float(p), 4)
                    for i, p in enumerate(probs)
                }
            
            return response
            
        except Exception as e:
            print(f"DEBUG: Prediction error: {e}")
            import traceback
            traceback.print_exc()
            return {
                "emotion": "unknown",
                "confidence": 0.0,
                "face_detected": False,
                "error": str(e)
            }
    
    def predict_from_base64(self, base64_image: str, detect_face: bool = True) -> Dict:
        """
        Predict emotion from base64 encoded image.
        
        Args:
            base64_image: Base64 encoded image string.
            detect_face: If True, detect and crop face first.
        
        Returns:
            Dictionary with emotion and confidence.
        """
        try:
            # Remove data URL prefix if present
            if 'base64,' in base64_image:
                base64_image = base64_image.split('base64,')[1]
            
            # Decode base64 to image
            img_bytes = base64.b64decode(base64_image)
            img_array = np.frombuffer(img_bytes, dtype=np.uint8)
            image = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
            
            if image is None:
                return {
                    "emotion": "unknown",
                    "confidence": 0.0,
                    "face_detected": False,
                    "error": "Could not decode image"
                }
            
            return self.predict(image, detect_face=detect_face, return_all_scores=True)
            
        except Exception as e:
            return {
                "emotion": "unknown",
                "confidence": 0.0,
                "face_detected": False,
                "error": str(e)
            }


# Singleton instance
_analyzer_instance = None

def get_analyzer() -> FaceEmotionAnalyzer:
    """Get or create the singleton analyzer instance."""
    global _analyzer_instance
    if _analyzer_instance is None:
        _analyzer_instance = FaceEmotionAnalyzer(use_huggingface=True)
    return _analyzer_instance
