"""
Data Augmentation for Hand Landmarks

Augmentations that work directly on normalized landmark coordinates.
"""
import numpy as np
import torch
from typing import Optional
import random


class LandmarkAugmentor:
    """Apply augmentations to hand landmarks"""
    
    def __init__(
        self,
        rotation_range: float = 15.0,
        scale_range: tuple = (0.9, 1.1),
        translation_range: float = 0.05,
        noise_std: float = 0.02,
        flip_prob: float = 0.0,  # Don't flip by default (changes left/right hand)
        p: float = 0.5  # Probability of applying augmentation
    ):
        self.rotation_range = rotation_range
        self.scale_range = scale_range
        self.translation_range = translation_range
        self.noise_std = noise_std
        self.flip_prob = flip_prob
        self.p = p
    
    def __call__(self, landmarks: np.ndarray) -> np.ndarray:
        """
        Apply random augmentations to landmarks
        
        Args:
            landmarks: Flattened array of 63 values (21 landmarks * 3 coords)
            
        Returns:
            Augmented landmarks
        """
        if random.random() > self.p:
            return landmarks
        
        # Reshape to (21, 3)
        landmarks = landmarks.reshape(21, 3).copy()
        
        # Random rotation around z-axis (in the image plane)
        if random.random() < 0.5:
            landmarks = self._rotate(landmarks)
        
        # Random scaling
        if random.random() < 0.5:
            landmarks = self._scale(landmarks)
        
        # Random translation
        if random.random() < 0.5:
            landmarks = self._translate(landmarks)
        
        # Add noise
        if random.random() < 0.5:
            landmarks = self._add_noise(landmarks)
        
        # Horizontal flip (mirror)
        if random.random() < self.flip_prob:
            landmarks = self._flip(landmarks)
        
        return landmarks.flatten()
    
    def _rotate(self, landmarks: np.ndarray) -> np.ndarray:
        """Rotate landmarks around z-axis"""
        angle = np.radians(random.uniform(-self.rotation_range, self.rotation_range))
        cos_a, sin_a = np.cos(angle), np.sin(angle)
        
        rotation_matrix = np.array([
            [cos_a, -sin_a, 0],
            [sin_a, cos_a, 0],
            [0, 0, 1]
        ])
        
        return landmarks @ rotation_matrix.T
    
    def _scale(self, landmarks: np.ndarray) -> np.ndarray:
        """Scale landmarks"""
        scale = random.uniform(*self.scale_range)
        return landmarks * scale
    
    def _translate(self, landmarks: np.ndarray) -> np.ndarray:
        """Translate landmarks"""
        translation = np.random.uniform(
            -self.translation_range,
            self.translation_range,
            size=3
        )
        return landmarks + translation
    
    def _add_noise(self, landmarks: np.ndarray) -> np.ndarray:
        """Add Gaussian noise"""
        noise = np.random.normal(0, self.noise_std, landmarks.shape)
        return landmarks + noise
    
    def _flip(self, landmarks: np.ndarray) -> np.ndarray:
        """Horizontal flip (mirror x-axis)"""
        landmarks[:, 0] = -landmarks[:, 0]
        return landmarks


class LandmarkDataset(torch.utils.data.Dataset):
    """PyTorch Dataset for landmark data"""
    
    def __init__(
        self,
        X: np.ndarray,
        y: np.ndarray,
        augmentor: Optional[LandmarkAugmentor] = None
    ):
        self.X = torch.FloatTensor(X)
        self.y = torch.LongTensor(y)
        self.augmentor = augmentor
    
    def __len__(self):
        return len(self.X)
    
    def __getitem__(self, idx):
        x = self.X[idx].numpy()
        y = self.y[idx]
        
        if self.augmentor is not None:
            x = self.augmentor(x)
            x = torch.FloatTensor(x)
        else:
            x = self.X[idx]
        
        return x, y


def create_dataloaders(
    X_train: np.ndarray,
    y_train: np.ndarray,
    X_val: np.ndarray,
    y_val: np.ndarray,
    batch_size: int = 64,
    num_workers: int = 0,
    augment: bool = True
) -> tuple:
    """
    Create training and validation dataloaders
    
    Args:
        X_train, y_train: Training data
        X_val, y_val: Validation data  
        batch_size: Batch size
        num_workers: Number of data loading workers
        augment: Whether to apply augmentation to training data
        
    Returns:
        (train_loader, val_loader)
    """
    augmentor = LandmarkAugmentor(p=0.5) if augment else None
    
    train_dataset = LandmarkDataset(X_train, y_train, augmentor)
    val_dataset = LandmarkDataset(X_val, y_val, None)
    
    train_loader = torch.utils.data.DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
        pin_memory=True
    )
    
    val_loader = torch.utils.data.DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=True
    )
    
    return train_loader, val_loader


if __name__ == "__main__":
    # Test augmentation
    print("Testing LandmarkAugmentor...")
    
    augmentor = LandmarkAugmentor(p=1.0)  # Always augment for testing
    
    # Create dummy landmarks
    landmarks = np.random.randn(63).astype(np.float32)
    
    print(f"Original landmarks (first 6): {landmarks[:6]}")
    
    augmented = augmentor(landmarks)
    print(f"Augmented landmarks (first 6): {augmented[:6]}")
    
    # Verify shape preserved
    assert augmented.shape == landmarks.shape, "Shape mismatch!"
    
    print("\n✅ Augmentation test passed!")
