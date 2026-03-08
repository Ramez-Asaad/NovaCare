"""
Test script for Axiom logging integration
Run this to verify Axiom logging is working correctly
"""
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.axiom_logger import logger

def test_axiom_logging():
    """Test various logging functions"""
    print("=" * 60)
    print("Testing Axiom Logging Integration")
    print("=" * 60)
    print()
    
    # Test basic logging
    print("1. Testing basic log levels...")
    logger.info("Test info message", test_field="info_test")
    logger.warning("Test warning message", test_field="warning_test")
    logger.error("Test error message", test_field="error_test")
    logger.debug("Test debug message", test_field="debug_test")
    print("   ✓ Basic logs sent")
    print()
    
    # Test chat logging
    print("2. Testing chat interaction logging...")
    logger.log_chat(
        user_message="Hello, how are you?",
        ai_response="I'm doing well, thank you! How can I help you?",
        user_id="test_user_123"
    )
    print("   ✓ Chat log sent")
    print()
    
    # Test STT logging
    print("3. Testing STT logging...")
    logger.log_stt(
        transcript="Hello NovaBot",
        confidence=0.95
    )
    print("   ✓ STT log sent")
    print()
    
    # Test TTS logging
    print("4. Testing TTS logging...")
    logger.log_tts(
        text="Hello, this is a test of text to speech"
    )
    print("   ✓ TTS log sent")
    print()
    
    # Test API request logging
    print("5. Testing API request logging...")
    logger.log_api_request(
        endpoint="/api/chat",
        method="POST",
        status_code=200,
        duration_ms=150.5
    )
    print("   ✓ API request log sent")
    print()
    
    # Test error logging
    print("6. Testing error logging...")
    try:
        raise ValueError("This is a test error")
    except Exception as e:
        logger.log_error(e, context="test_script")
    print("   ✓ Error log sent")
    print()
    
    # Test batch logging
    print("7. Testing batch event logging...")
    events = [
        {"event_type": "test", "message": "Batch event 1", "batch_id": 1},
        {"event_type": "test", "message": "Batch event 2", "batch_id": 2},
        {"event_type": "test", "message": "Batch event 3", "batch_id": 3}
    ]
    logger._send_to_axiom(events)
    print("   ✓ Batch events sent")
    print()
    
    print("=" * 60)
    print("✓ All tests completed!")
    print("=" * 60)
    print()
    print("Check your Axiom dashboard at: https://app.axiom.co")
    print("Dataset: nova-care")
    print()
    print("You can query your logs with:")
    print('  ["nova-care"] | where event_type == "test" | limit 100')

if __name__ == "__main__":
    try:
        test_axiom_logging()
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
    except Exception as e:
        print(f"\n❌ Test failed with error: {str(e)}")
        import traceback
        traceback.print_exc()
