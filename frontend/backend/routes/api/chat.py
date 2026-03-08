"""
NovaCare - Chat API (SOLID: Single Responsibility)
Handles chat endpoint with NovaBrain integration.
"""
from flask import Blueprint, request, jsonify
from flask_login import current_user

chat_bp = Blueprint('chat', __name__)

# These will be injected during initialization
_nova = None
_db = None
_logger = None
_ChatHistory = None
_EmotionLog = None
_Alert = None


def init_chat(nova, db, logger, ChatHistory, EmotionLog, Alert):
    """Initialize chat blueprint with dependencies."""
    global _nova, _db, _logger, _ChatHistory, _EmotionLog, _Alert
    _nova = nova
    _db = db
    _logger = logger
    _ChatHistory = ChatHistory
    _EmotionLog = EmotionLog
    _Alert = Alert


@chat_bp.route('/chat', methods=['POST'])
def chat_api():
    """Main chat endpoint with full AI processing."""
    try:
        data = request.json
        user_input = data.get('message', '')
        user_id = current_user.id if current_user.is_authenticated else None
        
        if not user_input:
            return jsonify({'error': 'No message provided'}), 400
        
        # Process with NovaBrain
        result = _nova.process_input(user_input, user_id=user_id)
        
        # Console logging for emotion
        if result.get('text_emotion'):
            emotion = result['text_emotion'].get('emotion', 'unknown')
            confidence = result['text_emotion'].get('confidence', 0)
            print(f"\n{'='*50}")
            print(f"[EMOTION DETECTED] User: '{user_input[:50]}...'")
            print(f"[EMOTION DETECTED] Emotion: {emotion.upper()} (Confidence: {confidence:.0%})")
            print(f"{'='*50}\n")
        
        # Log chat to database
        if user_id and _db:
            try:
                chat_log = _ChatHistory(
                    user_id=user_id,
                    user_message=user_input,
                    bot_response=result['response'],
                    detected_intent=result['intent'],
                    detected_emotion=result['text_emotion'].get('emotion') if result['text_emotion'] else None
                )
                _db.session.add(chat_log)
                
                # Log emotion
                if result['text_emotion']:
                    emotion_log = _EmotionLog(
                        user_id=user_id,
                        emotion=result['text_emotion']['emotion'],
                        confidence=result['text_emotion']['confidence'],
                        source='text'
                    )
                    _db.session.add(emotion_log)
                
                _db.session.commit()
                _logger.log_chat(user_id, user_input, result['response'])
            except Exception as db_error:
                print(f"[DB ERROR] Failed to log chat: {db_error}")
                _db.session.rollback()
        
        # If emergency detected, create alert
        if result.get('is_emergency') and user_id and _db:
            try:
                alert = _Alert(
                    user_id=user_id,
                    type='Emergency Detected',
                    message=user_input,
                    status='New'
                )
                _db.session.add(alert)
                _db.session.commit()
                _logger.log_alert(user_id, 'Emergency Detected', 'New')
            except Exception as alert_error:
                print(f"[ALERT ERROR] Failed to create alert: {alert_error}")
                _db.session.rollback()
        
        return jsonify(result)
    
    except Exception as e:
        print(f"[CHAT API ERROR] {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'response': "I'm sorry, I encountered an error. Please try again.",
            'error': str(e),
            'intent': 'error',
            'text_emotion': {'emotion': 'neutral', 'confidence': 0.5},
            'is_emergency': False
        }), 200
