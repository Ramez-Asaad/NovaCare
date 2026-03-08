from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
import sys
import os

# Load environment variables from .env file
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, '.env')
load_dotenv(env_path)

# Add the current directory to the path (since we're now inside NovaCare)
sys.path.insert(0, current_dir)

# Import from LLMs module (after loading .env)
from LLMs.conversational_ai import ConversationalAI

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)  # Enable CORS for cross-origin requests

# Initialize the AI
ai = ConversationalAI()

# Lazy load emotion analyzer (to avoid slow startup)
emotion_analyzer = None

def get_emotion_analyzer():
    """Lazy load the emotion analyzer."""
    global emotion_analyzer
    if emotion_analyzer is None:
        try:
            from emotion_detection import get_analyzer
            emotion_analyzer = get_analyzer()
            print("✓ Emotion analyzer loaded successfully")
        except Exception as e:
            print(f"Warning: Could not load emotion analyzer: {e}")
    return emotion_analyzer

@app.route('/')
def index():
    """Serve the test HTML page"""
    return render_template('test_novabot.html')

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'NovaBot API'
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """Chat endpoint - receives user message and returns AI response"""
    try:
        data = request.json
        
        if not data:
            return jsonify({
                'error': 'No data provided'
            }), 400
        
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({
                'error': 'No message provided'
            }), 400
        
        # Initialize AI if not already initialized
        if not ai._initialized:
            ai.initialize()
        
        # Get AI response
        ai_response = ai.chat(user_message)
        
        # Return response
        return jsonify({
            'response': ai_response,
            'status': 'success'
        })
    
    except Exception as e:
        print(f"[API Error] {str(e)}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'error': str(e),
            'response': "I'm sorry, I encountered an error. Please try again.",
            'status': 'error'
        }), 500

@app.route('/api/clear', methods=['POST'])
def clear_history():
    """Clear conversation history"""
    try:
        ai.clear_history()
        return jsonify({
            'status': 'success',
            'message': 'History cleared'
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500


@app.route('/api/emotion/detect', methods=['POST'])
def detect_emotion():
    """
    Detect emotion from a base64 encoded image.
    
    Expects JSON: { "image": "base64_encoded_image_data" }
    Returns: { "emotion": str, "confidence": float, "all_scores": dict, "status": str }
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({
                'error': 'No data provided',
                'status': 'error'
            }), 400
        
        image_data = data.get('image', '').strip()
        
        if not image_data:
            return jsonify({
                'error': 'No image provided',
                'status': 'error'
            }), 400
        
        # Get or initialize the emotion analyzer
        analyzer = get_emotion_analyzer()
        
        if analyzer is None:
            return jsonify({
                'error': 'Emotion analyzer not available. Please check server logs.',
                'status': 'error'
            }), 500
        
        # Run emotion detection
        result = analyzer.predict_from_base64(image_data, detect_face=True)
        
        if 'error' in result and result.get('emotion') == 'unknown':
            return jsonify({
                'emotion': 'unknown',
                'confidence': 0.0,
                'face_detected': result.get('face_detected', False),
                'error': result.get('error', 'Unknown error'),
                'status': 'error'
            }), 400
        
        return jsonify({
            'emotion': result.get('emotion', 'unknown'),
            'confidence': result.get('confidence', 0.0),
            'face_detected': result.get('face_detected', False),
            'all_scores': result.get('all_scores', {}),
            'status': 'success'
        })
        
    except Exception as e:
        print(f"[Emotion API Error] {str(e)}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'error': str(e),
            'emotion': 'unknown',
            'confidence': 0.0,
            'status': 'error'
        }), 500


@app.route('/api/emotion/health', methods=['GET'])
def emotion_health():
    """Check if emotion detection is available."""
    analyzer = get_emotion_analyzer()
    
    if analyzer is None or analyzer.model is None:
        return jsonify({
            'status': 'unavailable',
            'message': 'Emotion analyzer not loaded'
        }), 503
    
    return jsonify({
        'status': 'available',
        'message': 'Emotion analyzer ready',
        'device': analyzer.device,
        'labels': list(analyzer.id2label.values()) if hasattr(analyzer, 'id2label') else []
    })


if __name__ == '__main__':
    print("=" * 50)
    print("NovaBot API Server")
    print("=" * 50)
    print("Starting server on http://localhost:5000")
    print("API Endpoints:")
    print("  - Chat: POST /api/chat")
    print("  - Emotion: POST /api/emotion/detect")
    print("  - Emotion Health: GET /api/emotion/health")
