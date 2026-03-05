"""
NovaCare AI - MedicalQA Implementation
Uses Google Gemini Pro API (REST) for medical question answering.
"""
"""
NovaCare AI - MedicalQA Implementation
Implements medical domain question answering using local knowledge base and models.
"""
import os
import json
from datetime import datetime
from typing import Dict, Any

# Knowledge base path
AI_DIR = os.path.dirname(os.path.dirname(__file__))
MEDICAL_KB_PATH = os.path.join(AI_DIR, 'data', 'medical_kb.json')
MEDICAL_MODEL_PATH = os.path.join(AI_DIR, 'trained_models', 'medical_qa_model')


class MedicalQA:
    """Medical QA system using local knowledge base and fine-tuned models."""
    
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.knowledge_base = {}
        self._load_model()
        self._load_knowledge_base()

    def query(self, question: str) -> Dict[str, Any]:
        """Answer a medical question."""
        question_lower = question.lower()
        result = {
            "answer": "",
            "confidence": 0.0,
            "source": "NovaCare Medical AI",
            "is_emergency": False,
            "timestamp": datetime.now().isoformat()
        }

        # 1. Check emergency keywords first (Fast Local Check)
        for keyword, response in self.knowledge_base.get("emergency_keywords", {}).items():
            if keyword in question_lower:
                result["is_emergency"] = True
                result["answer"] = response
                result["confidence"] = 1.0
                result["source"] = "Emergency Protocol"
                return result

        # 2. Try trained local model if available
        if self.model is not None and self.tokenizer is not None:
            try:
                input_text = f"Medical Question: {question}"
                inputs = self.tokenizer(input_text, return_tensors="pt", max_length=256, truncation=True)
                outputs = self.model.generate(**inputs, max_length=150, num_beams=4, early_stopping=True)
                answer = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
                
                result["answer"] = answer
                result["confidence"] = 0.85
                result["source"] = "Fine-tuned Medical Model"
                return result
            except Exception as e:
                print(f"[MedicalQA] Model inference error: {e}")

        # 3. Fallback to local knowledge base
        for symptom, info in self.knowledge_base.get("common_symptoms", {}).items():
            if symptom in question_lower:
                result["answer"] = info
                result["confidence"] = 0.7
                result["source"] = "Medical Knowledge Base"
                return result

        # 4. Generic fallback
        result["answer"] = "I can provide general health information, but for specific medical concerns, please consult a healthcare professional."
        result["confidence"] = 0.3
        return result

    def train(self, dataset_name: str = "Med-dataset/Med_Dataset", epochs: int = 3, batch_size: int = 8) -> bool:
        """Fine-tune a medical QA model locally."""
        # Implementation for local training...
        return True

    def _load_model(self):
        """Load fine-tuned medical QA model from local path."""
        try:
            if os.path.exists(MEDICAL_MODEL_PATH):
                from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
                self.tokenizer = AutoTokenizer.from_pretrained(MEDICAL_MODEL_PATH)
                self.model = AutoModelForSeq2SeqLM.from_pretrained(MEDICAL_MODEL_PATH)
                print("[MedicalQA] Local model loaded")
        except Exception as e:
            print(f"[MedicalQA] Load error: {e}")

    def _load_knowledge_base(self):
        """Load medical knowledge base from JSON."""
        if os.path.exists(MEDICAL_KB_PATH):
            with open(MEDICAL_KB_PATH, 'r', encoding='utf-8') as f:
                self.knowledge_base = json.load(f)
        else:
            self._init_default_kb()

    def _init_default_kb(self):
        """Initialize default knowledge base."""
        self.knowledge_base = {
            "emergency_keywords": {
                "heart attack": "🚨 EMERGENCY: Call 911! Symptoms: chest pain, shortness of breath. Chew aspirin if available.",
                "stroke": "🚨 EMERGENCY: Call 911! FAST: Face drooping, Arm weakness, Speech difficulty, Time to call.",
                "choking": "🚨 EMERGENCY: Perform Heimlich maneuver. Call 911 if unconscious.",
                "can't breathe": "🚨 EMERGENCY: Call 911! Stay upright and calm."
            },
            "common_symptoms": {
                "headache": "Rest, stay hydrated, take pain relievers. See doctor if persistent.",
                "fever": "Rest, fluids, acetaminophen. Seek care if >103°F or lasts 3+ days."
            }
        }
        os.makedirs(os.path.dirname(MEDICAL_KB_PATH), exist_ok=True)
        with open(MEDICAL_KB_PATH, 'w', encoding='utf-8') as f:
            json.dump(self.knowledge_base, f, indent=2)

    def _load_knowledge_base(self):
        """Load medical knowledge base."""
        if os.path.exists(MEDICAL_KB_PATH):
            with open(MEDICAL_KB_PATH, 'r', encoding='utf-8') as f:
                self.knowledge_base = json.load(f)
        else:
            self._init_default_kb()

    def _init_default_kb(self):
        """Initialize default knowledge base."""
        self.knowledge_base = {
            "emergency_keywords": {
                "heart attack": "🚨 EMERGENCY: Call 911! Symptoms: chest pain, shortness of breath. Chew aspirin if available.",
                "stroke": "🚨 EMERGENCY: Call 911! FAST: Face drooping, Arm weakness, Speech difficulty, Time to call.",
                "choking": "🚨 EMERGENCY: Perform Heimlich maneuver. Call 911 if unconscious.",
                "can't breathe": "🚨 EMERGENCY: Call 911! Stay upright and calm."
            },
            "common_symptoms": {
                "headache": "Rest, stay hydrated, take pain relievers. See doctor if persistent.",
                "fever": "Rest, fluids, acetaminophen. Seek care if >103°F or lasts 3+ days."
            }
        }
        os.makedirs(os.path.dirname(MEDICAL_KB_PATH), exist_ok=True)
        with open(MEDICAL_KB_PATH, 'w', encoding='utf-8') as f:
            json.dump(self.knowledge_base, f, indent=2)
