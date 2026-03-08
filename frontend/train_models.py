"""
NovaCare - Model Training Script
Note: With API-based models, training is only needed for local face emotion model.
For conversational and medical QA, the HuggingFace Inference API is used.
"""
import os
import sys
import argparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def train_emotion_face(dataset_path=None):
    """Train the facial emotion detection model (requires local dataset)."""
    print("\n" + "="*60)
    print("TRAINING: Facial Emotion Detection")
    print("="*60)
    
    if not dataset_path:
        print("Please provide a dataset path using --emotion-dataset")
        print("Expected: Directory with subdirs for each emotion (angry, happy, sad, etc.)")
        return
    
    try:
        from ai.impl.emotion_analyzer import EmotionAnalyzer
        analyzer = EmotionAnalyzer()
        analyzer.train(dataset_path, mode='face', epochs=25, batch_size=64)
        print("✓ Face emotion training complete!")
        
    except Exception as e:
        print(f"✗ Error: {e}")


def download_datasets():
    """Download datasets from Kaggle."""
    print("\n" + "="*60)
    print("DOWNLOADING: Kaggle Datasets")
    print("="*60)
    
    try:
        import kagglehub
        
        datasets = [
            ("ananthu017/emotion-detection-fer", "Facial Emotion (FER)"),
        ]
        
        for dataset_name, desc in datasets:
            print(f"\nDownloading: {desc}...")
            try:
                path = kagglehub.dataset_download(dataset_name)
                print(f"✓ Downloaded to: {path}")
            except Exception as e:
                print(f"✗ Failed: {e}")
                
    except ImportError:
        print("kagglehub not installed. Run: pip install kagglehub")


def main():
    parser = argparse.ArgumentParser(description="NovaCare Model Training")
    parser.add_argument("--emotion-face", action="store_true", help="Train face emotion model")
    parser.add_argument("--emotion-dataset", type=str, help="Path to facial emotion dataset")
    parser.add_argument("--download", action="store_true", help="Download Kaggle datasets")
    
    args = parser.parse_args()
    
    print("="*60)
    print("NovaCare AI Model Training")
    print("="*60)
    print("\nNote: Conversational AI and Medical QA use HuggingFace API")
    print("Only face emotion model requires local training.\n")
    
    if args.download:
        download_datasets()
        return
    
    if args.emotion_face:
        train_emotion_face(args.emotion_dataset)
    else:
        print("Usage:")
        print("  python train_models.py --emotion-face --emotion-dataset /path/to/fer")
        print("  python train_models.py --download")
    
    print("\n" + "="*60)


if __name__ == "__main__":
    main()
