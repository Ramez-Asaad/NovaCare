"""
Configuration for ASL Fingerspelling Recognition System
"""
import os
from pathlib import Path
from dataclasses import dataclass, field
from typing import List

# Base paths
PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
CHECKPOINT_DIR = PROJECT_ROOT / "checkpoints"

# Ensure directories exist
for dir_path in [DATA_DIR, RAW_DATA_DIR, PROCESSED_DATA_DIR, CHECKPOINT_DIR]:
    dir_path.mkdir(parents=True, exist_ok=True)


@dataclass
class DataConfig:
    """Dataset configuration"""
    # ASL Alphabet classes (29 total: A-Z + delete, nothing, space)
    classes: List[str] = field(default_factory=lambda: [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z', 'del', 'nothing', 'space'
    ])
    num_classes: int = 29
    
    # MediaPipe landmark settings
    num_landmarks: int = 21  # 21 hand landmarks
    num_coords: int = 3  # x, y, z coordinates
    input_features: int = 63  # 21 * 3 = 63 features
    
    # Data split
    train_split: float = 0.8
    val_split: float = 0.1
    test_split: float = 0.1
    
    # Paths
    raw_dir: Path = RAW_DATA_DIR
    processed_dir: Path = PROCESSED_DATA_DIR
    
    def get_class_index(self, class_name: str) -> int:
        """Get index for a class name"""
        return self.classes.index(class_name)
    
    def get_class_name(self, index: int) -> str:
        """Get class name from index"""
        return self.classes[index]


@dataclass
class ModelConfig:
    """Model architecture configuration"""
    # Input
    input_dim: int = 63  # 21 landmarks * 3 coordinates
    
    # Architecture
    hidden_dim: int = 256
    num_attention_heads: int = 4
    num_layers: int = 2
    dropout: float = 0.3
    
    # Output
    num_classes: int = 29
    
    # Model size estimate: ~500KB


@dataclass
class TrainingConfig:
    """Training configuration"""
    # Training params
    batch_size: int = 64
    learning_rate: float = 1e-3
    weight_decay: float = 1e-4
    epochs: int = 50
    
    # Scheduler
    scheduler: str = "cosine"  # cosine or step
    warmup_epochs: int = 5
    min_lr: float = 1e-6
    
    # Early stopping
    patience: int = 10
    min_delta: float = 0.001
    
    # Label smoothing
    label_smoothing: float = 0.1
    
    # Checkpointing
    checkpoint_dir: Path = CHECKPOINT_DIR
    save_best_only: bool = True
    
    # Device
    device: str = "cuda"  # cuda or cpu
    
    # Reproducibility
    seed: int = 42


@dataclass
class InferenceConfig:
    """Inference configuration"""
    # Confidence threshold
    confidence_threshold: float = 0.7
    
    # Temporal smoothing
    smoothing_window: int = 5  # Average over N frames
    confirmation_frames: int = 10  # Hold for N frames to confirm
    
    # MediaPipe settings
    min_detection_confidence: float = 0.7
    min_tracking_confidence: float = 0.5
    max_num_hands: int = 1
    
    # Performance
    target_fps: int = 30


@dataclass 
class APIConfig:
    """API configuration"""
    host: str = "0.0.0.0"
    port: int = 8000
    
    # CORS
    allow_origins: List[str] = field(default_factory=lambda: ["*"])
    
    # Rate limiting
    rate_limit: int = 100  # requests per minute


# Default configs
data_config = DataConfig()
model_config = ModelConfig()
training_config = TrainingConfig()
inference_config = InferenceConfig()
api_config = APIConfig()
