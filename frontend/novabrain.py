"""
NovaCare - NovaBrain AI Core
Central AI module integrating all capabilities using SOLID principles.

Dependencies are injected via the ai module getters.
"""
from datetime import datetime

# Import from the centralized ai package (DIP - depends on abstractions)
from ai import get_conversational_ai, get_emotion_analyzer, get_medical_qa


class NovaBrain:
    """
    Main AI Brain for NovaBot.
    Integrates conversation, emotion (unified), and medical modules.
    
    SOLID Principles:
    - Single Responsibility: Orchestrates AI modules only
    - Dependency Inversion: Uses getter functions for DI
    """
    
    def __init__(self):
        print("[NovaBrain] Initializing AI modules...")
        
        # Initialize sub-modules via DI
        self.conversational_ai = get_conversational_ai()
        self.emotion_analyzer = get_emotion_analyzer()
        self.medical_qa = get_medical_qa()
        
        self.history = []
        
        # Intent patterns for routing
        self.intent_patterns = {
            'greeting': ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon'],
            'emergency': ['help me', 'emergency', 'fallen', 'fall', "can't breathe", 'heart attack', 'stroke'],
            'medical': ['symptom', 'medication', 'medicine', 'pain', 'headache', 'fever', 'doctor', 'sick', 'disease'],
            'emotional': ['sad', 'lonely', 'depressed', 'anxious', 'scared', 'worried', 'happy', 'angry', 'frustrated'],
            'time': ['time', 'date', 'day', 'what time'],
            'reminder': ['remind', 'reminder', 'medication time', 'pills', 'schedule'],
            'gratitude': ['thank', 'thanks', 'appreciate'],
            'farewell': ['bye', 'goodbye', 'see you', 'later']
        }
        
        print("[NovaBrain] Initialization complete")

    def detect_intent(self, text: str) -> str:
        """Detect user intent from text."""
        text_lower = text.lower()
        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                if pattern in text_lower:
                    return intent
        return 'general'

    def analyze_text_emotion(self, text: str) -> dict:
        """Analyze emotion from text input using unified analyzer."""
        if self.emotion_analyzer:
            result = self.emotion_analyzer.analyze_text(text)
            print(f"[NovaBrain] Text Emotion: {result.get('emotion', 'unknown').upper()} ({result.get('confidence', 0):.0%})")
            return result
        return {'emotion': 'neutral', 'confidence': 0.5, 'source': 'text', 'method': 'default'}

    def analyze_face_emotion(self, face_image) -> dict:
        """Analyze emotion from face image using unified analyzer."""
        if self.emotion_analyzer:
            result = self.emotion_analyzer.analyze_face(face_image)
            print(f"[NovaBrain] Face Emotion: {result.get('emotion', 'unknown').upper()} ({result.get('confidence', 0):.0%})")
            return result
        return {'emotion': 'unknown', 'confidence': 0, 'source': 'face'}

    def get_medical_answer(self, question: str) -> dict:
        """Get answer to medical question."""
        if self.medical_qa:
            result = self.medical_qa.query(question)
            print(f"[NovaBrain] Medical Query - Confidence: {result.get('confidence', 0):.0%}")
            return result
        return {'answer': 'Medical QA module not available', 'confidence': 0, 'is_emergency': False}

    def generate_conversation_response(self, user_input: str, emotion: str = None) -> str:
        """Generate conversational response using fine-tuned model."""
        if self.conversational_ai:
            return self.conversational_ai.generate_response(user_input, emotion)
        return self._basic_response(user_input, emotion)
    
    def _basic_response(self, user_input: str, emotion: str = None) -> str:
        """Basic fallback responses."""
        responses = {
            'greeting': "Hello! I'm NovaBot, your AI companion. How are you feeling today?",
            'farewell': "Take care! I'll be here whenever you need me.",
            'gratitude': "You're welcome! I'm always here to help.",
            'time': f"It's currently {datetime.now().strftime('%I:%M %p on %A, %B %d')}.",
        }
        
        intent = self.detect_intent(user_input)
        if intent in responses:
            return responses[intent]
        
        if emotion == 'sad':
            return "I can sense you might be feeling down. I'm here for you."
        elif emotion == 'happy':
            return "I'm glad you're feeling good! What would you like to do today?"
        
        return "I'm here and listening. How can I help you today?"

    def process_input(self, user_input: str, user_id: int = None, face_image=None) -> dict:
        """Process user input and return comprehensive response."""
        result = {
            'response': '',
            'intent': 'general',
            'text_emotion': None,
            'face_emotion': None,
            'is_emergency': False,
            'medical_response': None,
            'timestamp': datetime.now().isoformat()
        }

        print(f"\n{'='*50}")
        print(f"[NovaBrain] Processing: '{user_input[:50]}...'")
        
        # 1. Detect intent
        intent = self.detect_intent(user_input)
        result['intent'] = intent
        print(f"[NovaBrain] Intent: {intent}")

        # 2. Analyze text emotion
        text_emotion = self.analyze_text_emotion(user_input)
        result['text_emotion'] = text_emotion
        detected_emotion = text_emotion.get('emotion', 'neutral')

        # 3. Analyze face emotion if provided
        if face_image is not None:
            face_emotion = self.analyze_face_emotion(face_image)
            result['face_emotion'] = face_emotion
            if face_emotion.get('confidence', 0) > 0.7:
                detected_emotion = face_emotion.get('emotion', detected_emotion)

        # Store in history
        self.history.append({
            'role': 'user',
            'content': user_input,
            'emotion': detected_emotion,
            'timestamp': result['timestamp']
        })

        # 4. Generate response based on intent
        response = ""

        if intent == 'emergency':
            result['is_emergency'] = True
            response = "🚨 EMERGENCY DETECTED! I am alerting your guardians and emergency services immediately. Please stay calm - help is on the way!"
            print("[NovaBrain] *** EMERGENCY TRIGGERED ***")

        elif intent == 'medical':
            medical_result = self.get_medical_answer(user_input)
            result['medical_response'] = medical_result
            
            if medical_result.get('is_emergency'):
                result['is_emergency'] = True
            
            response = medical_result.get('answer', '')
            if medical_result.get('confidence', 0) < 0.5:
                response += " For accurate medical advice, please consult a healthcare professional."

        elif intent == 'time':
            response = f"It's currently {datetime.now().strftime('%I:%M %p on %A, %B %d, %Y')}."

        elif intent == 'gratitude':
            response = "You're very welcome! I'm always here for you."

        elif intent == 'farewell':
            response = "Take care! Remember, I'm here whenever you need me. Stay safe!"

        elif intent == 'greeting':
            response = f"Hello! It's wonderful to hear from you. How are you feeling today?"
            if detected_emotion != 'neutral':
                response = f"Hello! I notice you might be feeling {detected_emotion}. How can I help you today?"

        elif intent == 'emotional' or detected_emotion in ['sad', 'angry', 'fear']:
            response = self.generate_conversation_response(user_input, detected_emotion)

        else:
            response = self.generate_conversation_response(user_input, detected_emotion)

        result['response'] = response
        print(f"[NovaBrain] Response: '{response[:60]}...'")
        print(f"{'='*50}\n")

        self.history.append({
            'role': 'assistant',
            'content': response,
            'timestamp': datetime.now().isoformat()
        })

        return result

    def get_history(self):
        """Get conversation history."""
        return self.history

    def clear_history(self):
        """Clear conversation history."""
        self.history = []
        if self.conversational_ai:
            self.conversational_ai.clear_history()


# Singleton
_nova_instance = None

def get_nova():
    global _nova_instance
    if _nova_instance is None:
        _nova_instance = NovaBrain()
    return _nova_instance
