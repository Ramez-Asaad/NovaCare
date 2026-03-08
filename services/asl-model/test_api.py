"""
Test script for ASL Recognition API

This demonstrates how to use the API from your web dashboard.
"""
import requests
import cv2
import base64
import json
import time

# API base URL
API_URL = "http://localhost:8000"


def test_health():
    """Test the health endpoint"""
    print("1. Testing health endpoint...")
    response = requests.get(f"{API_URL}/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=2)}\n")


def test_classes():
    """Get supported classes"""
    print("2. Getting supported classes...")
    response = requests.get(f"{API_URL}/classes")
    data = response.json()
    print(f"   Total classes: {data['count']}")
    print(f"   Classes: {', '.join(data['classes'][:10])}... (showing first 10)\n")


def test_predict_from_webcam():
    """Capture from webcam and send to API"""
    print("3. Testing prediction from webcam...")
    
    # Capture frame from webcam
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    cap.release()
    
    if not ret:
        print("   ❌ Failed to capture from webcam")
        return
    
    # Encode to base64
    _, buffer = cv2.imencode('.jpg', frame)
    image_b64 = base64.b64encode(buffer).decode('utf-8')
    
    # Send to API
    start_time = time.time()
    response = requests.post(
        f"{API_URL}/predict",
        json={"image": image_b64, "return_landmarks": False}
    )
    elapsed = (time.time() - start_time) * 1000
    
    data = response.json()
    print(f"   Letter: {data['letter'] or '(none)'}")
    print(f"   Confidence: {data['confidence']:.2%}")
    print(f"   Hand detected: {data['hand_detected']}")
    print(f"   API latency: {elapsed:.1f}ms")
    print(f"   Inference time: {data['inference_time_ms']:.1f}ms\n")


def test_accumulator():
    """Test the accumulator functionality"""
    print("4. Testing accumulator...")
    
    # Reset accumulator
    requests.post(f"{API_URL}/reset")
    
    # Add some letters manually
    letters = ['H', 'E', 'L', 'L', 'O']
    for letter in letters:
        response = requests.post(f"{API_URL}/accumulator/add/{letter}")
        print(f"   Added '{letter}': {response.json()['text']}")
    
    # Get accumulated text
    response = requests.get(f"{API_URL}/accumulator")
    data = response.json()
    print(f"   Final text: {data['full_text']}")
    print(f"   Words: {data['words']}\n")


def test_continuous_capture():
    """Test continuous prediction (like video streaming)"""
    print("5. Testing continuous prediction (5 frames)...")
    
    cap = cv2.VideoCapture(0)
    
    for i in range(5):
        ret, frame = cap.read()
        if not ret:
            break
        
        # Encode
        _, buffer = cv2.imencode('.jpg', frame)
        image_b64 = base64.b64encode(buffer).decode('utf-8')
        
        # Predict
        response = requests.post(
            f"{API_URL}/predict",
            json={"image": image_b64}
        )
        
        data = response.json()
        letter = data['letter'] or '?'
        conf = data['confidence']
        
        print(f"   Frame {i+1}: {letter} ({conf:.2%})")
        time.sleep(0.1)  # 100ms between frames
    
    cap.release()
    print()


def integration_example():
    """Show JavaScript integration example"""
    print("\n" + "="*60)
    print("JAVASCRIPT INTEGRATION EXAMPLE")
    print("="*60)
    
    js_code = '''
// Example for your web dashboard

// 1. Capture frame from video element
const video = document.getElementById('webcam');
const canvas = document.createElement('canvas');
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;
canvas.getContext('2d').drawImage(video, 0, 0);

// 2. Convert to base64
const imageData = canvas.toDataURL('image/jpeg').split(',')[1];

// 3. Send to API
const response = await fetch('http://localhost:8000/predict/confirm', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({image: imageData})
});

const result = await response.json();
console.log('Letter:', result.letter);
console.log('Confidence:', result.confidence);

// 4. Get accumulated text
const textResponse = await fetch('http://localhost:8000/accumulator');
const text = await textResponse.json();
document.getElementById('output').textContent = text.full_text;

// 5. For continuous recognition, call this in a loop:
setInterval(async () => {
    // Capture and send frame
    // Update UI with prediction
}, 100); // 10 FPS
'''
    
    print(js_code)


if __name__ == "__main__":
    print("\n" + "="*60)
    print("ASL Recognition API Test Suite")
    print("="*60 + "\n")
    
    try:
        test_health()
        test_classes()
        test_predict_from_webcam()
        test_accumulator()
        test_continuous_capture()
        integration_example()
        
        print("\n✅ All tests completed!")
        print(f"\n📚 API Documentation: {API_URL}/docs")
        print(f"🔗 Interactive testing: {API_URL}/docs (Swagger UI)\n")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to API")
        print("Make sure the API server is running:")
        print("  python -m api.main --port 8000\n")
    except Exception as e:
        print(f"\n❌ Error: {e}\n")
