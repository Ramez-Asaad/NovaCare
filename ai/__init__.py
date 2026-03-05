"""
NovaCare AI Package
Clean, simple imports for AI modules.
"""

# Import implementations directly
from ai.impl import EmotionAnalyzer, ConversationalAI, MedicalQA

# Singleton getters
_emotion_analyzer = None
_conversational_ai = None
_medical_qa = None


def get_emotion_analyzer() -> EmotionAnalyzer:
    """Get singleton EmotionAnalyzer."""
    global _emotion_analyzer
    if _emotion_analyzer is None:
        _emotion_analyzer = EmotionAnalyzer()
    return _emotion_analyzer


def get_conversational_ai() -> ConversationalAI:
    """Get singleton ConversationalAI."""
    global _conversational_ai
    if _conversational_ai is None:
        _conversational_ai = ConversationalAI()
    return _conversational_ai


def get_medical_qa() -> MedicalQA:
    """Get singleton MedicalQA."""
    global _medical_qa
    if _medical_qa is None:
        _medical_qa = MedicalQA()
    return _medical_qa


__all__ = [
    'EmotionAnalyzer', 'ConversationalAI', 'MedicalQA',
    'get_emotion_analyzer', 'get_conversational_ai', 'get_medical_qa'
]
