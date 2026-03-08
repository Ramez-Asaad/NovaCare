# ASL Fingerspelling Recognition System

Real-time American Sign Language fingerspelling recognition using MediaPipe hand landmarks and a Transformer-style neural network classifier.

![Python](https://img.shields.io/badge/python-3.10+-blue)
![PyTorch](https://img.shields.io/badge/pytorch-2.0+-red)
![FastAPI](https://img.shields.io/badge/fastapi-0.104+-green)

## Features

- 🖐️ **Real-time hand landmark detection** using MediaPipe
- 🧠 **Attention-based classifier** for accurate letter recognition
- ⚡ **Fast inference** (<50ms per frame)
- 🌐 **REST API** for easy integration
- 📝 **Letter accumulation** into words/sentences
- 🎯 **29 classes**: A-Z + space, delete, nothing

## Project Structure

```
model/
├── config/                 # Configuration
│   ├── __init__.py
│   └── config.py           # All hyperparameters
├── data/                   # Data processing
│   ├── raw/                # Place Kaggle dataset here
│   ├── processed/          # Extracted landmarks
│   └── prepare_dataset.py  # Image → landmarks conversion
├── models/                 # Neural network architecture
│   ├── __init__.py
│   └── landmark_classifier.py
├── training/               # Training pipeline
│   ├── __init__.py
│   ├── augmentation.py     # Data augmentation
│   ├── train.py            # Training loop
│   └── evaluate.py         # Model evaluation
├── inference/              # Real-time prediction
│   ├── __init__.py
│   ├── predictor.py        # Main predictor class
│   └── webcam_demo.py      # Standalone demo
├── api/                    # REST API
│   ├── __init__.py
│   ├── main.py             # FastAPI app
│   ├── routes.py           # API endpoints
│   └── schemas.py          # Request/response models
├── checkpoints/            # Saved models
├── requirements.txt
└── README.md
```

## Quick Start

### 1. Install Dependencies

```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install requirements
pip install -r requirements.txt
```

### 2. Download Dataset

Download the ASL Alphabet dataset from Kaggle:
- https://www.kaggle.com/datasets/grassknoted/asl-alphabet

Extract it to `data/raw/`:
```
data/raw/
└── asl_alphabet_train/
    └── asl_alphabet_train/
        ├── A/
        ├── B/
        ├── ...
        └── Z/
```

### 3. Prepare Dataset (Extract Landmarks)

```bash
python -m data.prepare_dataset
```

This converts 87,000 images to MediaPipe landmarks. Takes ~2-3 hours.

### 4. Train Model

```bash
python -m training.train --epochs 50 --device cuda
```

Training options:
- `--epochs`: Number of epochs (default: 50)
- `--batch_size`: Batch size (default: 64)
- `--lr`: Learning rate (default: 1e-3)
- `--device`: cuda or cpu
- `--model_type`: "attention" or "lite"

### 5. Evaluate Model

```bash
python -m training.evaluate --checkpoint checkpoints/latest/best_model.pt
```

### 6. Test with Webcam

```bash
python -m inference.webcam_demo
```

Controls:
- `r`: Reset accumulated text
- `q`: Quit

### 7. Start API Server

```bash
python -m api.main --port 8000
```

API documentation available at: http://localhost:8000/docs

## API Usage

### Predict from Image

```python
import requests
import base64

# Read and encode image
with open("hand_sign.jpg", "rb") as f:
    image_b64 = base64.b64encode(f.read()).decode()

# Send request
response = requests.post(
    "http://localhost:8000/predict",
    json={"image": image_b64}
)

print(response.json())
# {"letter": "A", "confidence": 0.97, "hand_detected": true, ...}
```

### JavaScript/Frontend Example

```javascript
// Capture frame from video element
const canvas = document.createElement('canvas');
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;
canvas.getContext('2d').drawImage(video, 0, 0);
const imageData = canvas.toDataURL('image/jpeg').split(',')[1];

// Send to API
const response = await fetch('http://localhost:8000/predict', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({image: imageData})
});

const result = await response.json();
console.log(`Predicted: ${result.letter} (${result.confidence})`);
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/predict` | POST | Predict from base64 image |
| `/predict/landmarks` | POST | Predict from raw landmarks |
| `/predict/confirm` | POST | Predict and auto-accumulate |
| `/accumulator` | GET | Get accumulated text |
| `/accumulator/add/{letter}` | POST | Manually add letter |
| `/reset` | POST | Reset state |
| `/health` | GET | Health check |
| `/classes` | GET | List supported classes |

## Model Architecture

```
Input: 63 features (21 landmarks × 3 coordinates)
    ↓
Landmark Embedding: Linear(3 → 256) per landmark
    ↓
+ Positional Embeddings
    ↓
2× Attention Blocks:
    - Multi-Head Self-Attention (4 heads)
    - Feed-Forward Network (256 → 1024 → 256)
    - Layer Normalization + Residual
    ↓
Global Average Pooling
    ↓
Classification Head: Linear(256 → 128 → 29)
    ↓
Output: 29 class logits
```

**Parameters**: ~500K (lightweight for edge deployment)

## Configuration

Edit `config/config.py` to adjust:

```python
# Model settings
hidden_dim = 256
num_attention_heads = 4
num_layers = 2
dropout = 0.3

# Inference settings
confidence_threshold = 0.7
smoothing_window = 5        # Temporal smoothing
confirmation_frames = 10    # Hold to confirm

# Training settings
batch_size = 64
learning_rate = 1e-3
epochs = 50
```

## Performance

Expected results after training:
- **Accuracy**: 95-99% on test set
- **Inference**: <50ms per frame (GPU), <100ms (CPU)
- **Model size**: ~2MB

## Troubleshooting

### CUDA not available
```bash
# Check PyTorch CUDA
python -c "import torch; print(torch.cuda.is_available())"

# Install CUDA-enabled PyTorch
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

### MediaPipe import error
```bash
pip uninstall mediapipe
pip install mediapipe==0.10.9
```

### No hand detected
- Ensure good lighting
- Keep hand within frame
- Avoid cluttered backgrounds

## License

MIT License
