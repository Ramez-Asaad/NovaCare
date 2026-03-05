"""
NovaCare AI - EmotionAnalyzer
Uses Google Gemini Pro API (REST) for emotion classification.
"""
"""
NovaCare AI - EmotionAnalyzer Implementation
Handles both face (image) and text emotion detection locally.
"""
import os
import numpy as np
from datetime import datetime
from typing import Union, Any, Dict

# Model paths
IMPL_DIR = os.path.dirname(__file__)
AI_DIR = os.path.dirname(IMPL_DIR)
FACE_MODEL_PATH = os.path.join(AI_DIR, 'trained_models', 'emotion_model.h5')
TEXT_MODEL_PATH = os.path.join(AI_DIR, 'trained_models', 'text_emotion_model.pkl')

# Emotion labels
EMOTION_LABELS = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']


class EmotionAnalyzer:
    """
    Unified Emotion Analyzer.
    Handles both face (image) and text emotion detection using local models.
    """
    
    def __init__(self, face_model_path: str = None, text_model_path: str = None):
        self.face_model_path = face_model_path or FACE_MODEL_PATH
        self.text_model_path = text_model_path or TEXT_MODEL_PATH
        
        # Models
        self.face_model = None
        self.text_model = None
        
        # Keyword fallback for text analysis
        self.emotion_keywords = {
            'happy': ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'glad', 'pleased', 'delighted', 'cheerful'],
            'sad': ['sad', 'unhappy', 'depressed', 'down', 'miserable', 'heartbroken', 'devastated', 'grief', 'sorrow', 'crying'],
            'angry': ['angry', 'mad', 'furious', 'annoyed', 'irritated', 'frustrated', 'rage', 'hate'],
            'fear': ['scared', 'afraid', 'frightened', 'terrified', 'nervous', 'anxious', 'worried', 'panic', 'fear'],
            'surprise': ['surprised', 'shocked', 'amazed', 'astonished', 'unexpected', 'wow'],
            'disgust': ['disgusted', 'gross', 'revolting', 'sick', 'nauseated', 'awful'],
            'neutral': ['okay', 'fine', 'alright', 'normal', 'regular']
        }
        
        # Load local models
        self._load_face_model()
        self._load_text_model()
        
        print("[EmotionAnalyzer] Initialized locally")

    def analyze(self, input_data: Union[str, np.ndarray]) -> Dict[str, Any]:
        """Analyze emotion from input (text or face image)."""
        if isinstance(input_data, str):
            return self.analyze_text(input_data)
        elif isinstance(input_data, np.ndarray):
            return self.analyze_face(input_data)
        else:
            return {'emotion': 'unknown', 'confidence': 0, 'source': 'unknown'}

    def analyze_text(self, text: str) -> Dict[str, Any]:
        """Analyze emotion from text input locally."""
        result = {
            'text': text,
            'emotion': 'neutral',
            'confidence': 0.5,
            'source': 'text',
            'method': 'keyword',
            'timestamp': datetime.now().isoformat()
        }

        # 1. Try local ML model first
        if self.text_model is not None:
            try:
                prediction = self.text_model.predict([text])[0]
                probabilities = self.text_model.predict_proba([text])[0]
                max_prob = max(probabilities)
                result['emotion'] = prediction
                result['confidence'] = float(max_prob)
                result['method'] = 'ml_model'
                return result
            except Exception:
                pass

        # 2. Fallback to keyword matching
        text_lower = text.lower()
        emotion_scores = {emotion: 0 for emotion in self.emotion_keywords}

        for emotion, keywords in self.emotion_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    emotion_scores[emotion] += 1

        max_emotion = max(emotion_scores, key=emotion_scores.get)
        max_score = emotion_scores[max_emotion]

        if max_score > 0:
            result['emotion'] = max_emotion
            result['confidence'] = min(0.5 + (max_score * 0.1), 0.95)

        return result

    def analyze_face(self, face_image: np.ndarray) -> Dict[str, Any]:
        """Analyze emotion from face image locally."""
        result = {
            'emotion': 'unknown',
            'confidence': 0,
            'source': 'face',
            'timestamp': datetime.now().isoformat()
        }

        if self.face_model is None:
            result['error'] = 'Face model not loaded'
            return result

        try:
            # Preprocess and Predict
            if len(face_image.shape) == 2:
                face_image = np.expand_dims(face_image, axis=-1)
            face_image = face_image.astype('float32') / 255.0
            face_image = np.expand_dims(face_image, axis=0)

            predictions = self.face_model.predict(face_image, verbose=0)[0]
            emotion_idx = np.argmax(predictions)

            result['emotion'] = EMOTION_LABELS[emotion_idx]
            result['confidence'] = float(predictions[emotion_idx])
        except Exception as e:
            result['error'] = str(e)

        return result

    def train(self, dataset_path: str, mode: str = 'text', **kwargs) -> Any:
        """Train emotion model locally."""
        return True

    def _load_face_model(self):
        """Load pretrained local face emotion model."""
        try:
            from tensorflow.keras.models import load_model
            if os.path.exists(self.face_model_path):
                self.face_model = load_model(self.face_model_path)
                print("[EmotionAnalyzer] Face model loaded")
        except Exception as e:
            print(f"[EmotionAnalyzer] Face model error: {e}")

    def _load_text_model(self):
        """Load pretrained local text emotion model."""
        if os.path.exists(self.text_model_path):
            try:
                import pickle
                with open(self.text_model_path, 'rb') as f:
                    self.text_model = pickle.load(f)
                print("[EmotionAnalyzer] Text model loaded")
            except Exception as e:
                print(f"[EmotionAnalyzer] Text model error: {e}")
