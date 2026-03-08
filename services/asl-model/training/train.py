"""
Training Pipeline for ASL Landmark Classifier

Usage:
    python -m training.train --epochs 50 --batch_size 64
"""
import os
import sys
import argparse
import json
import time
from pathlib import Path
from datetime import datetime

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.optim.lr_scheduler import CosineAnnealingWarmRestarts, ReduceLROnPlateau
from torch.utils.tensorboard import SummaryWriter
from tqdm import tqdm

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))
from config import training_config, model_config, data_config, PROCESSED_DATA_DIR, CHECKPOINT_DIR
from models import create_model, count_parameters
from training.augmentation import create_dataloaders


class EarlyStopping:
    """Early stopping handler"""
    
    def __init__(self, patience: int = 10, min_delta: float = 0.001, mode: str = "max"):
        self.patience = patience
        self.min_delta = min_delta
        self.mode = mode
        self.best_value = None
        self.counter = 0
        self.should_stop = False
    
    def __call__(self, value: float) -> bool:
        if self.best_value is None:
            self.best_value = value
            return False
        
        if self.mode == "max":
            improved = value > self.best_value + self.min_delta
        else:
            improved = value < self.best_value - self.min_delta
        
        if improved:
            self.best_value = value
            self.counter = 0
        else:
            self.counter += 1
            if self.counter >= self.patience:
                self.should_stop = True
        
        return self.should_stop


class Trainer:
    """Training manager"""
    
    def __init__(
        self,
        model: nn.Module,
        train_loader,
        val_loader,
        config: dict,
        checkpoint_dir: Path,
        device: str = "cuda"
    ):
        self.model = model.to(device)
        self.train_loader = train_loader
        self.val_loader = val_loader
        self.config = config
        self.checkpoint_dir = Path(checkpoint_dir)
        self.device = device
        
        # Loss with label smoothing
        self.criterion = nn.CrossEntropyLoss(
            label_smoothing=config.get("label_smoothing", 0.1)
        )
        
        # Optimizer
        self.optimizer = optim.AdamW(
            model.parameters(),
            lr=config["learning_rate"],
            weight_decay=config["weight_decay"]
        )
        
        # Scheduler
        self.scheduler = CosineAnnealingWarmRestarts(
            self.optimizer,
            T_0=10,
            T_mult=2,
            eta_min=config.get("min_lr", 1e-6)
        )
        
        # Early stopping
        self.early_stopping = EarlyStopping(
            patience=config.get("patience", 10),
            min_delta=config.get("min_delta", 0.001)
        )
        
        # Logging
        self.writer = SummaryWriter(self.checkpoint_dir / "logs")
        
        # Best metrics
        self.best_val_acc = 0.0
        self.history = {
            "train_loss": [],
            "train_acc": [],
            "val_loss": [],
            "val_acc": [],
            "lr": []
        }
    
    def train_epoch(self) -> tuple:
        """Train for one epoch"""
        self.model.train()
        
        total_loss = 0.0
        correct = 0
        total = 0
        
        pbar = tqdm(self.train_loader, desc="Training", leave=False)
        for batch_idx, (x, y) in enumerate(pbar):
            x, y = x.to(self.device), y.to(self.device)
            
            self.optimizer.zero_grad()
            
            logits = self.model(x)
            loss = self.criterion(logits, y)
            
            loss.backward()
            
            # Gradient clipping
            torch.nn.utils.clip_grad_norm_(self.model.parameters(), max_norm=1.0)
            
            self.optimizer.step()
            
            # Metrics
            total_loss += loss.item()
            _, predicted = logits.max(1)
            total += y.size(0)
            correct += predicted.eq(y).sum().item()
            
            pbar.set_postfix({
                "loss": f"{loss.item():.4f}",
                "acc": f"{100. * correct / total:.2f}%"
            })
        
        avg_loss = total_loss / len(self.train_loader)
        accuracy = 100. * correct / total
        
        return avg_loss, accuracy
    
    @torch.no_grad()
    def validate(self) -> tuple:
        """Validate the model"""
        self.model.eval()
        
        total_loss = 0.0
        correct = 0
        total = 0
        
        for x, y in self.val_loader:
            x, y = x.to(self.device), y.to(self.device)
            
            logits = self.model(x)
            loss = self.criterion(logits, y)
            
            total_loss += loss.item()
            _, predicted = logits.max(1)
            total += y.size(0)
            correct += predicted.eq(y).sum().item()
        
        avg_loss = total_loss / len(self.val_loader)
        accuracy = 100. * correct / total
        
        return avg_loss, accuracy
    
    def save_checkpoint(self, epoch: int, is_best: bool = False):
        """Save model checkpoint"""
        checkpoint = {
            "epoch": epoch,
            "model_state_dict": self.model.state_dict(),
            "optimizer_state_dict": self.optimizer.state_dict(),
            "scheduler_state_dict": self.scheduler.state_dict(),
            "best_val_acc": self.best_val_acc,
            "config": self.config,
            "history": self.history
        }
        
        # Save latest
        torch.save(checkpoint, self.checkpoint_dir / "latest.pt")
        
        # Save best
        if is_best:
            torch.save(checkpoint, self.checkpoint_dir / "best_model.pt")
            print(f"  💾 Saved best model (val_acc: {self.best_val_acc:.2f}%)")
    
    def train(self, epochs: int) -> dict:
        """Full training loop"""
        print(f"\n{'='*60}")
        print(f"Training ASL Landmark Classifier")
        print(f"{'='*60}")
        print(f"Model parameters: {count_parameters(self.model):,}")
        print(f"Device: {self.device}")
        print(f"Epochs: {epochs}")
        print(f"Batch size: {self.config['batch_size']}")
        print(f"Learning rate: {self.config['learning_rate']}")
        print(f"{'='*60}\n")
        
        start_time = time.time()
        
        for epoch in range(1, epochs + 1):
            print(f"Epoch {epoch}/{epochs}")
            
            # Train
            train_loss, train_acc = self.train_epoch()
            
            # Validate
            val_loss, val_acc = self.validate()
            
            # Update scheduler
            self.scheduler.step()
            current_lr = self.optimizer.param_groups[0]['lr']
            
            # Log metrics
            self.history["train_loss"].append(train_loss)
            self.history["train_acc"].append(train_acc)
            self.history["val_loss"].append(val_loss)
            self.history["val_acc"].append(val_acc)
            self.history["lr"].append(current_lr)
            
            self.writer.add_scalar("Loss/train", train_loss, epoch)
            self.writer.add_scalar("Loss/val", val_loss, epoch)
            self.writer.add_scalar("Accuracy/train", train_acc, epoch)
            self.writer.add_scalar("Accuracy/val", val_acc, epoch)
            self.writer.add_scalar("LR", current_lr, epoch)
            
            # Check for improvement
            is_best = val_acc > self.best_val_acc
            if is_best:
                self.best_val_acc = val_acc
            
            # Print metrics
            print(f"  Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}%")
            print(f"  Val Loss:   {val_loss:.4f} | Val Acc:   {val_acc:.2f}%")
            print(f"  LR: {current_lr:.6f}")
            
            # Save checkpoint
            self.save_checkpoint(epoch, is_best)
            
            # Early stopping
            if self.early_stopping(val_acc):
                print(f"\n⏹ Early stopping triggered at epoch {epoch}")
                break
            
            print()
        
        # Training complete
        elapsed = time.time() - start_time
        print(f"\n{'='*60}")
        print(f"Training Complete!")
        print(f"Best validation accuracy: {self.best_val_acc:.2f}%")
        print(f"Total time: {elapsed/60:.1f} minutes")
        print(f"{'='*60}")
        
        self.writer.close()
        
        # Save final history
        with open(self.checkpoint_dir / "history.json", "w") as f:
            json.dump(self.history, f, indent=2)
        
        return self.history


def load_data():
    """Load processed landmark data"""
    print("Loading processed data...")
    
    X_train = np.load(PROCESSED_DATA_DIR / "X_train.npy")
    y_train = np.load(PROCESSED_DATA_DIR / "y_train.npy")
    X_val = np.load(PROCESSED_DATA_DIR / "X_val.npy")
    y_val = np.load(PROCESSED_DATA_DIR / "y_val.npy")
    
    print(f"  Train: {len(X_train)} samples")
    print(f"  Val:   {len(X_val)} samples")
    
    return X_train, y_train, X_val, y_val


def main():
    parser = argparse.ArgumentParser(description="Train ASL Landmark Classifier")
    parser.add_argument("--epochs", type=int, default=training_config.epochs)
    parser.add_argument("--batch_size", type=int, default=training_config.batch_size)
    parser.add_argument("--lr", type=float, default=training_config.learning_rate)
    parser.add_argument("--model_type", type=str, default="attention", choices=["attention", "lite"])
    parser.add_argument("--device", type=str, default=training_config.device)
    parser.add_argument("--no_augment", action="store_true", help="Disable augmentation")
    
    args = parser.parse_args()
    
    # Set device
    if args.device == "cuda" and not torch.cuda.is_available():
        print("CUDA not available, using CPU")
        args.device = "cpu"
    
    if args.device == "cuda":
        print(f"Using GPU: {torch.cuda.get_device_name(0)}")
    
    # Set seed for reproducibility
    torch.manual_seed(training_config.seed)
    np.random.seed(training_config.seed)
    
    # Load data
    X_train, y_train, X_val, y_val = load_data()
    
    # Create dataloaders
    train_loader, val_loader = create_dataloaders(
        X_train, y_train,
        X_val, y_val,
        batch_size=args.batch_size,
        augment=not args.no_augment
    )
    
    # Create model
    model = create_model(args.model_type)
    
    # Training config
    config = {
        "epochs": args.epochs,
        "batch_size": args.batch_size,
        "learning_rate": args.lr,
        "weight_decay": training_config.weight_decay,
        "label_smoothing": training_config.label_smoothing,
        "patience": training_config.patience,
        "min_delta": training_config.min_delta,
        "min_lr": training_config.min_lr,
        "model_type": args.model_type
    }
    
    # Create checkpoint directory with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    checkpoint_dir = CHECKPOINT_DIR / f"run_{timestamp}"
    checkpoint_dir.mkdir(parents=True, exist_ok=True)
    
    # Create symlink to latest run
    latest_link = CHECKPOINT_DIR / "latest"
    if latest_link.exists():
        latest_link.unlink()
    try:
        latest_link.symlink_to(checkpoint_dir.name)
    except OSError:
        # Symlinks may not work on Windows without admin
        pass
    
    # Train
    trainer = Trainer(
        model=model,
        train_loader=train_loader,
        val_loader=val_loader,
        config=config,
        checkpoint_dir=checkpoint_dir,
        device=args.device
    )
    
    trainer.train(args.epochs)


if __name__ == "__main__":
    main()
