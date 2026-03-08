"""
Landmark-based ASL Classifier with Attention

A lightweight MLP with self-attention layers for classifying hand landmarks
into ASL alphabet letters.
"""
import torch
import torch.nn as nn
import torch.nn.functional as F
import math
from typing import Optional
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from config import model_config


class MultiHeadAttention(nn.Module):
    """Multi-head self-attention layer"""
    
    def __init__(
        self,
        embed_dim: int,
        num_heads: int,
        dropout: float = 0.1
    ):
        super().__init__()
        self.embed_dim = embed_dim
        self.num_heads = num_heads
        self.head_dim = embed_dim // num_heads
        
        assert embed_dim % num_heads == 0, "embed_dim must be divisible by num_heads"
        
        self.q_proj = nn.Linear(embed_dim, embed_dim)
        self.k_proj = nn.Linear(embed_dim, embed_dim)
        self.v_proj = nn.Linear(embed_dim, embed_dim)
        self.out_proj = nn.Linear(embed_dim, embed_dim)
        
        self.dropout = nn.Dropout(dropout)
        self.scale = math.sqrt(self.head_dim)
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Args:
            x: Input tensor of shape (batch, embed_dim)
            
        Returns:
            Output tensor of shape (batch, embed_dim)
        """
        batch_size = x.size(0)
        
        # Project to Q, K, V - treat each landmark as a "token"
        # Reshape to (batch, num_landmarks, 3) = (batch, 21, 3) conceptually
        # But we're working with flat features, so we use linear projection
        
        q = self.q_proj(x)
        k = self.k_proj(x)
        v = self.v_proj(x)
        
        # Reshape for multi-head attention
        # (batch, embed_dim) -> (batch, num_heads, head_dim)
        q = q.view(batch_size, self.num_heads, self.head_dim)
        k = k.view(batch_size, self.num_heads, self.head_dim)
        v = v.view(batch_size, self.num_heads, self.head_dim)
        
        # Scaled dot-product attention
        # (batch, num_heads, head_dim) @ (batch, num_heads, head_dim).T
        attn_weights = torch.bmm(
            q.view(batch_size * self.num_heads, 1, self.head_dim),
            k.view(batch_size * self.num_heads, self.head_dim, 1)
        ).view(batch_size, self.num_heads) / self.scale
        
        attn_weights = F.softmax(attn_weights, dim=-1)
        attn_weights = self.dropout(attn_weights)
        
        # Apply attention to values
        # For 1D feature case, we just scale the values
        attn_output = v * attn_weights.unsqueeze(-1)
        
        # Combine heads
        attn_output = attn_output.view(batch_size, self.embed_dim)
        
        return self.out_proj(attn_output)


class LandmarkAttentionBlock(nn.Module):
    """Attention block treating landmarks as tokens"""
    
    def __init__(
        self,
        embed_dim: int,
        num_heads: int,
        dropout: float = 0.1,
        mlp_ratio: float = 4.0
    ):
        super().__init__()
        
        self.norm1 = nn.LayerNorm(embed_dim)
        self.attn = nn.MultiheadAttention(
            embed_dim=embed_dim,
            num_heads=num_heads,
            dropout=dropout,
            batch_first=True
        )
        
        self.norm2 = nn.LayerNorm(embed_dim)
        mlp_hidden = int(embed_dim * mlp_ratio)
        self.mlp = nn.Sequential(
            nn.Linear(embed_dim, mlp_hidden),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(mlp_hidden, embed_dim),
            nn.Dropout(dropout)
        )
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Args:
            x: (batch, num_landmarks, embed_dim)
        Returns:
            (batch, num_landmarks, embed_dim)
        """
        # Self-attention with residual
        normed = self.norm1(x)
        attn_out, _ = self.attn(normed, normed, normed)
        x = x + attn_out
        
        # MLP with residual
        x = x + self.mlp(self.norm2(x))
        
        return x


class LandmarkClassifier(nn.Module):
    """
    ASL Landmark Classifier with Attention
    
    Treats each of the 21 hand landmarks as a token and applies
    self-attention to model finger relationships.
    """
    
    def __init__(
        self,
        input_dim: int = 63,
        hidden_dim: int = 256,
        num_heads: int = 4,
        num_layers: int = 2,
        num_classes: int = 29,
        dropout: float = 0.3
    ):
        super().__init__()
        
        self.num_landmarks = 21
        self.coords_per_landmark = 3
        
        # Project each landmark's coordinates to hidden dimension
        self.landmark_embed = nn.Linear(self.coords_per_landmark, hidden_dim)
        
        # Learnable position embeddings for each landmark
        self.pos_embed = nn.Parameter(torch.randn(1, self.num_landmarks, hidden_dim) * 0.02)
        
        # Attention layers
        self.layers = nn.ModuleList([
            LandmarkAttentionBlock(
                embed_dim=hidden_dim,
                num_heads=num_heads,
                dropout=dropout
            )
            for _ in range(num_layers)
        ])
        
        # Final normalization
        self.norm = nn.LayerNorm(hidden_dim)
        
        # Classification head
        self.classifier = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim // 2, num_classes)
        )
        
        # Initialize weights
        self._init_weights()
    
    def _init_weights(self):
        """Initialize weights using Xavier/Kaiming initialization"""
        for module in self.modules():
            if isinstance(module, nn.Linear):
                nn.init.xavier_uniform_(module.weight)
                if module.bias is not None:
                    nn.init.zeros_(module.bias)
            elif isinstance(module, nn.LayerNorm):
                nn.init.ones_(module.weight)
                nn.init.zeros_(module.bias)
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass
        
        Args:
            x: Flattened landmarks (batch, 63)
            
        Returns:
            Class logits (batch, num_classes)
        """
        batch_size = x.size(0)
        
        # Reshape to (batch, 21, 3)
        x = x.view(batch_size, self.num_landmarks, self.coords_per_landmark)
        
        # Project to hidden dimension: (batch, 21, hidden_dim)
        x = self.landmark_embed(x)
        
        # Add positional embeddings
        x = x + self.pos_embed
        
        # Apply attention layers
        for layer in self.layers:
            x = layer(x)
        
        # Global average pooling over landmarks
        x = self.norm(x)
        x = x.mean(dim=1)  # (batch, hidden_dim)
        
        # Classification
        logits = self.classifier(x)
        
        return logits
    
    def predict(self, x: torch.Tensor) -> tuple:
        """
        Get predictions with confidence scores
        
        Args:
            x: Flattened landmarks (batch, 63)
            
        Returns:
            (predicted_classes, confidence_scores)
        """
        self.eval()
        with torch.no_grad():
            logits = self.forward(x)
            probs = F.softmax(logits, dim=-1)
            confidence, predicted = probs.max(dim=-1)
        return predicted, confidence


class LandmarkClassifierLite(nn.Module):
    """
    Lightweight version without attention for faster inference.
    Use this for edge deployment if attention is too slow.
    """
    
    def __init__(
        self,
        input_dim: int = 63,
        hidden_dims: list = [256, 128, 64],
        num_classes: int = 29,
        dropout: float = 0.3
    ):
        super().__init__()
        
        layers = []
        prev_dim = input_dim
        
        for hidden_dim in hidden_dims:
            layers.extend([
                nn.Linear(prev_dim, hidden_dim),
                nn.BatchNorm1d(hidden_dim),
                nn.GELU(),
                nn.Dropout(dropout)
            ])
            prev_dim = hidden_dim
        
        layers.append(nn.Linear(prev_dim, num_classes))
        
        self.network = nn.Sequential(*layers)
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.network(x)
    
    def predict(self, x: torch.Tensor) -> tuple:
        self.eval()
        with torch.no_grad():
            logits = self.forward(x)
            probs = F.softmax(logits, dim=-1)
            confidence, predicted = probs.max(dim=-1)
        return predicted, confidence


def create_model(model_type: str = "attention", config: Optional[dict] = None) -> nn.Module:
    """
    Factory function to create model
    
    Args:
        model_type: "attention" or "lite"
        config: Optional config override
        
    Returns:
        Model instance
    """
    if config is None:
        config = {
            "input_dim": model_config.input_dim,
            "hidden_dim": model_config.hidden_dim,
            "num_heads": model_config.num_attention_heads,
            "num_layers": model_config.num_layers,
            "num_classes": model_config.num_classes,
            "dropout": model_config.dropout
        }
    
    if model_type == "attention":
        return LandmarkClassifier(**config)
    elif model_type == "lite":
        lite_config = {
            "input_dim": config["input_dim"],
            "hidden_dims": [config["hidden_dim"], config["hidden_dim"] // 2, config["hidden_dim"] // 4],
            "num_classes": config["num_classes"],
            "dropout": config["dropout"]
        }
        return LandmarkClassifierLite(**lite_config)
    else:
        raise ValueError(f"Unknown model type: {model_type}")


def count_parameters(model: nn.Module) -> int:
    """Count trainable parameters"""
    return sum(p.numel() for p in model.parameters() if p.requires_grad)


if __name__ == "__main__":
    # Test model creation
    print("Testing LandmarkClassifier (Attention)...")
    model = create_model("attention")
    print(f"  Parameters: {count_parameters(model):,}")
    
    # Test forward pass
    x = torch.randn(8, 63)  # batch of 8, 63 features
    out = model(x)
    print(f"  Input shape: {x.shape}")
    print(f"  Output shape: {out.shape}")
    
    # Test prediction
    pred, conf = model.predict(x)
    print(f"  Predictions: {pred}")
    print(f"  Confidence: {conf}")
    
    print("\nTesting LandmarkClassifierLite...")
    model_lite = create_model("lite")
    print(f"  Parameters: {count_parameters(model_lite):,}")
    
    out_lite = model_lite(x)
    print(f"  Output shape: {out_lite.shape}")
    
    print("\n✅ All tests passed!")
