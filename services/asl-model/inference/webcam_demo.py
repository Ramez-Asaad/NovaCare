"""
Webcam Demo for ASL Recognition

Standalone demo to test real-time ASL fingerspelling recognition.

Usage:
    python -m inference.webcam_demo
"""
import sys
import argparse
from pathlib import Path

import cv2
import numpy as np

sys.path.insert(0, str(Path(__file__).parent.parent))
from inference.predictor import ASLPredictor, LetterAccumulator
from config import CHECKPOINT_DIR


def draw_ui(
    frame: np.ndarray,
    letter: str,
    confidence: float,
    is_confirmed: bool,
    accumulated_text: str,
    fps: float,
    hand_detected: bool
) -> np.ndarray:
    """Draw UI overlay on frame"""
    h, w = frame.shape[:2]
    
    # Semi-transparent overlay for text background
    overlay = frame.copy()
    
    # Top bar
    cv2.rectangle(overlay, (0, 0), (w, 80), (0, 0, 0), -1)
    
    # Bottom bar
    cv2.rectangle(overlay, (0, h - 60), (w, h), (0, 0, 0), -1)
    
    # Blend
    frame = cv2.addWeighted(overlay, 0.7, frame, 0.3, 0)
    
    # Current prediction
    if hand_detected:
        if letter:
            color = (0, 255, 0) if is_confirmed else (0, 255, 255)
            text = f"{letter} ({confidence*100:.0f}%)"
            if is_confirmed:
                text += " ✓"
        else:
            color = (0, 165, 255)
            text = "Low confidence"
    else:
        color = (128, 128, 128)
        text = "No hand detected"
    
    cv2.putText(frame, text, (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.5, color, 3)
    
    # Accumulated text
    cv2.putText(frame, f"Text: {accumulated_text}_", (20, h - 20),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
    
    # FPS
    cv2.putText(frame, f"FPS: {fps:.1f}", (w - 120, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    
    # Instructions
    instructions = "Press 'r' to reset | 'q' to quit"
    cv2.putText(frame, instructions, (w - 350, h - 20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)
    
    return frame


def main():
    parser = argparse.ArgumentParser(description="ASL Webcam Demo")
    parser.add_argument("--camera", type=int, default=0, help="Camera index")
    parser.add_argument("--model", type=str, default=None, help="Path to model checkpoint")
    parser.add_argument("--confidence", type=float, default=0.7, help="Confidence threshold")
    parser.add_argument("--device", type=str, default="cuda", help="Device (cuda/cpu)")
    
    args = parser.parse_args()
    
    # Initialize predictor
    print("Initializing ASL predictor...")
    try:
        predictor = ASLPredictor(
            model_path=args.model,
            confidence_threshold=args.confidence,
            device=args.device
        )
    except FileNotFoundError:
        print("\n❌ Model not found!")
        print("Please train the model first:")
        print("  1. Download ASL Alphabet dataset from Kaggle")
        print("  2. Run: python -m data.prepare_dataset")
        print("  3. Run: python -m training.train")
        return
    
    accumulator = LetterAccumulator()
    
    # Open webcam
    print(f"Opening camera {args.camera}...")
    cap = cv2.VideoCapture(args.camera)
    
    if not cap.isOpened():
        print("❌ Failed to open camera!")
        return
    
    # Set resolution
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    
    print("\n✅ ASL Recognition Demo Started!")
    print("=" * 40)
    print("Show your hand to the camera to spell letters.")
    print("Hold a sign steady to confirm it.")
    print("=" * 40)
    
    # FPS tracking
    fps_buffer = []
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Flip for mirror view
            frame = cv2.flip(frame, 1)
            
            # Predict
            result = predictor.predict_frame(frame)
            
            # Add confirmed letter
            if result.is_confirmed:
                accumulator.add_letter(result.letter)
                predictor.reset()  # Reset buffers after confirmation
            
            # Track FPS
            fps_buffer.append(1000 / max(result.inference_time_ms, 1))
            if len(fps_buffer) > 30:
                fps_buffer.pop(0)
            fps = sum(fps_buffer) / len(fps_buffer)
            
            # Draw landmarks
            if result.hand_detected:
                _, raw_landmarks = predictor._extract_landmarks(frame)
                frame = predictor.draw_landmarks(frame, raw_landmarks)
            
            # Draw UI
            frame = draw_ui(
                frame,
                result.letter,
                result.confidence,
                result.is_confirmed,
                accumulator.get_text(),
                fps,
                result.hand_detected
            )
            
            # Show
            cv2.imshow("ASL Recognition", frame)
            
            # Handle keys
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
            elif key == ord('r'):
                accumulator.clear()
                predictor.reset()
                print("Reset!")
    
    finally:
        cap.release()
        cv2.destroyAllWindows()
        predictor.close()
        
        print(f"\nFinal text: {accumulator.get_text()}")


if __name__ == "__main__":
    main()
