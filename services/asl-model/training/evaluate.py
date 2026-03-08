"""
Model Evaluation for ASL Landmark Classifier

Usage:
    python -m training.evaluate --checkpoint checkpoints/best_model.pt
"""
import sys
import argparse
import json
from pathlib import Path

import numpy as np
import torch
import torch.nn.functional as F
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
    precision_recall_fscore_support
)
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm import tqdm

sys.path.insert(0, str(Path(__file__).parent.parent))
from config import data_config, PROCESSED_DATA_DIR, CHECKPOINT_DIR
from models import create_model


def load_model(checkpoint_path: str, device: str = "cuda") -> tuple:
    """Load model from checkpoint"""
    checkpoint = torch.load(checkpoint_path, map_location=device)
    
    model_type = checkpoint.get("config", {}).get("model_type", "attention")
    model = create_model(model_type)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.to(device)
    model.eval()
    
    return model, checkpoint


def evaluate(
    model,
    X: np.ndarray,
    y: np.ndarray,
    device: str = "cuda",
    batch_size: int = 64
) -> dict:
    """
    Evaluate model on test data
    
    Returns:
        Dictionary with predictions, probabilities, and metrics
    """
    model.eval()
    
    all_preds = []
    all_probs = []
    
    with torch.no_grad():
        for i in tqdm(range(0, len(X), batch_size), desc="Evaluating"):
            batch_x = torch.FloatTensor(X[i:i+batch_size]).to(device)
            
            logits = model(batch_x)
            probs = F.softmax(logits, dim=-1)
            
            all_preds.append(logits.argmax(dim=-1).cpu().numpy())
            all_probs.append(probs.cpu().numpy())
    
    predictions = np.concatenate(all_preds)
    probabilities = np.concatenate(all_probs)
    
    # Calculate metrics
    accuracy = accuracy_score(y, predictions)
    precision, recall, f1, _ = precision_recall_fscore_support(
        y, predictions, average="weighted"
    )
    
    # Per-class metrics (include all classes even if not in test set)
    class_report = classification_report(
        y, predictions,
        labels=list(range(data_config.num_classes)),
        target_names=data_config.classes,
        output_dict=True,
        zero_division=0
    )
    
    # Confusion matrix
    conf_matrix = confusion_matrix(y, predictions)
    
    return {
        "predictions": predictions,
        "probabilities": probabilities,
        "labels": y,
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1_score": f1,
        "classification_report": class_report,
        "confusion_matrix": conf_matrix
    }


def plot_confusion_matrix(
    conf_matrix: np.ndarray,
    class_names: list,
    save_path: Path = None,
    figsize: tuple = (14, 12)
):
    """Plot confusion matrix heatmap"""
    plt.figure(figsize=figsize)
    
    # Normalize
    conf_matrix_norm = conf_matrix.astype('float') / conf_matrix.sum(axis=1)[:, np.newaxis]
    
    sns.heatmap(
        conf_matrix_norm,
        annot=True,
        fmt='.2f',
        cmap='Blues',
        xticklabels=class_names,
        yticklabels=class_names,
        vmin=0,
        vmax=1
    )
    
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.title('Confusion Matrix (Normalized)')
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=150)
        print(f"Saved confusion matrix to {save_path}")
    
    plt.show()


def plot_per_class_accuracy(
    classification_report: dict,
    class_names: list,
    save_path: Path = None
):
    """Plot per-class accuracy bar chart"""
    accuracies = [classification_report[cls]["precision"] for cls in class_names]
    
    plt.figure(figsize=(12, 6))
    bars = plt.bar(class_names, accuracies, color='steelblue')
    
    # Color bars below threshold in red
    threshold = 0.9
    for bar, acc in zip(bars, accuracies):
        if acc < threshold:
            bar.set_color('salmon')
    
    plt.axhline(y=threshold, color='r', linestyle='--', label=f'{threshold*100:.0f}% threshold')
    plt.xlabel('Class')
    plt.ylabel('Precision')
    plt.title('Per-Class Precision')
    plt.xticks(rotation=45)
    plt.ylim(0, 1.05)
    plt.legend()
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=150)
        print(f"Saved per-class accuracy to {save_path}")
    
    plt.show()


def analyze_errors(
    results: dict,
    top_k: int = 5
) -> dict:
    """Analyze common errors"""
    predictions = results["predictions"]
    labels = results["labels"]
    probabilities = results["probabilities"]
    
    # Find misclassifications
    errors = predictions != labels
    error_indices = np.where(errors)[0]
    
    # Get error pairs
    error_pairs = {}
    for idx in error_indices:
        true_label = data_config.classes[labels[idx]]
        pred_label = data_config.classes[predictions[idx]]
        pair = (true_label, pred_label)
        error_pairs[pair] = error_pairs.get(pair, 0) + 1
    
    # Sort by frequency
    sorted_errors = sorted(error_pairs.items(), key=lambda x: x[1], reverse=True)
    
    print("\n📊 Top Misclassification Pairs:")
    print("-" * 40)
    for (true, pred), count in sorted_errors[:top_k]:
        print(f"  {true} → {pred}: {count} times")
    
    # Confidence analysis on errors
    error_confidences = probabilities[error_indices].max(axis=1)
    print(f"\n📉 Error Confidence Statistics:")
    print(f"  Mean confidence on errors: {error_confidences.mean():.3f}")
    print(f"  Median confidence on errors: {np.median(error_confidences):.3f}")
    print(f"  High-confidence errors (>0.9): {(error_confidences > 0.9).sum()}")
    
    return {
        "error_pairs": sorted_errors,
        "error_confidences": error_confidences
    }


def main():
    parser = argparse.ArgumentParser(description="Evaluate ASL Landmark Classifier")
    parser.add_argument(
        "--checkpoint",
        type=str,
        default=str(CHECKPOINT_DIR / "latest" / "best_model.pt"),
        help="Path to model checkpoint"
    )
    parser.add_argument("--device", type=str, default="cuda")
    parser.add_argument("--split", type=str, default="test", choices=["val", "test"])
    parser.add_argument("--save_plots", action="store_true")
    
    args = parser.parse_args()
    
    # Device
    if args.device == "cuda" and not torch.cuda.is_available():
        args.device = "cpu"
    
    print(f"Using device: {args.device}")
    
    # Load model
    print(f"\nLoading model from {args.checkpoint}")
    model, checkpoint = load_model(args.checkpoint, args.device)
    
    print(f"  Training epochs: {checkpoint.get('epoch', 'N/A')}")
    print(f"  Best validation accuracy: {checkpoint.get('best_val_acc', 'N/A'):.2f}%")
    
    # Load test data
    print(f"\nLoading {args.split} data...")
    X_test = np.load(PROCESSED_DATA_DIR / f"X_{args.split}.npy")
    y_test = np.load(PROCESSED_DATA_DIR / f"y_{args.split}.npy")
    print(f"  Samples: {len(X_test)}")
    
    # Evaluate
    results = evaluate(model, X_test, y_test, args.device)
    
    # Print results
    print("\n" + "=" * 60)
    print("EVALUATION RESULTS")
    print("=" * 60)
    print(f"Accuracy:  {results['accuracy']*100:.2f}%")
    print(f"Precision: {results['precision']*100:.2f}%")
    print(f"Recall:    {results['recall']*100:.2f}%")
    print(f"F1 Score:  {results['f1_score']*100:.2f}%")
    print("=" * 60)
    
    # Detailed report
    print("\n📋 Classification Report:")
    print(classification_report(
        y_test, results["predictions"],
        labels=list(range(data_config.num_classes)),
        target_names=data_config.classes,
        zero_division=0
    ))
    
    # Error analysis
    analyze_errors(results)
    
    # Plots
    checkpoint_dir = Path(args.checkpoint).parent
    
    if args.save_plots:
        plot_confusion_matrix(
            results["confusion_matrix"],
            data_config.classes,
            save_path=checkpoint_dir / "confusion_matrix.png"
        )
        
        plot_per_class_accuracy(
            results["classification_report"],
            data_config.classes,
            save_path=checkpoint_dir / "per_class_accuracy.png"
        )
    
    # Save results
    save_results = {
        "accuracy": results["accuracy"],
        "precision": results["precision"],
        "recall": results["recall"],
        "f1_score": results["f1_score"],
        "classification_report": results["classification_report"]
    }
    
    with open(checkpoint_dir / "evaluation_results.json", "w") as f:
        json.dump(save_results, f, indent=2)
    
    print(f"\n✅ Results saved to {checkpoint_dir}")


if __name__ == "__main__":
    main()
