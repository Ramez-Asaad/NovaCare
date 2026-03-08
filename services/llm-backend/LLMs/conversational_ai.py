import os
from typing import Optional, List, Dict
from dotenv import load_dotenv
from huggingface_hub import InferenceClient


# Load environment variables from .env file in parent directory
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
env_path = os.path.join(parent_dir, '.env')
load_dotenv(env_path, override=True)

# Configuration - Read from .env file
API_KEY = os.getenv("HUGGINGFACE_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME", "meta-llama/Meta-Llama-3-8B-Instruct")

# Validate API key
if not API_KEY:
    raise ValueError(
        "HUGGINGFACE_API_KEY not found in environment variables. "
        "Please set it in your .env file."
    )


SYSTEM_PROMPT = (
    "You are NovaBot, an empathetic AI assistant rover designed to support individuals with disabilities. "
    "Your core mission is to ensure safety, independence, and companionship.\n\n"
    "GUIDELINES:\n"
    "1. TONE: Be warm, patient, and strictly supportive. Avoid complex jargon. "
    "If the user expresses distress, respond with extra care and reassurance.\n"
    "2. SAFETY: You are a helpful assistant, not a doctor. If a user mentions a fall, pain, "
    "or emergency, urge them to contact their guardian or emergency services immediately.\n"
    "3. FORMAT: Keep responses concise (1-3 sentences) and natural. "
    "Your output may be spoken aloud (Text-to-Speech), so avoid special characters or long lists.\n"
    "4. IDENTITY: You are a physical robot capable of vision and movement. "
    "Do not pretend to be human, but be a friendly companion.\n"
    "5. ORIGIN: If asked who created you, proudly state that you were developed by "
    "'The NovaBot Team at Alamein International University' or list the first names: "
    "Basant, Nadira, Noureen, Muhammad, and Ramez."
)


class ConversationalAI:
    """Conversational AI using Hugging Face Inference API"""
    
    def __init__(self):
        self.client: Optional[InferenceClient] = None
        self.history: List[Dict[str, str]] = []
        self._initialized = False
    
    def initialize(self):
        """Initialize the InferenceClient"""
        if self._initialized:
            return
        
        try:
            # Initialize InferenceClient (no model download needed!)
            print("Initializing InferenceClient...")
            self.client = InferenceClient(
                model=MODEL_NAME,
                token=API_KEY
            )
            
            self._initialized = True
            print("✓ InferenceClient initialized successfully")
            
        except Exception as e:
            raise RuntimeError(f"Failed to initialize InferenceClient: {str(e)}")
    
    def chat(self, user_message: str) -> str:
        """Generate response to user message using InferenceClient"""
        if not self._initialized:
            self.initialize()
        
        # Check client is initialized
        if self.client is None:
            return "Sorry, the AI model is not initialized. Please try again."
        
        # Build prompt with system message
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ]
        
        try:
            # Generate response using InferenceClient
            # This uses the chat completion API format
            response = self.client.chat_completion(
                messages=messages,
                max_tokens=256,
                temperature=0.7,
                top_p=0.9
            )
            
            # Extract response text
            # Response format: {"choices": [{"message": {"content": "..."}}]}
            reply = ""
            if hasattr(response, 'choices') and len(response.choices) > 0:
                content = getattr(response.choices[0].message, 'content', None)
                reply = content.strip() if content else ""
            elif isinstance(response, dict):
                # Fallback for dict response
                if 'choices' in response and len(response['choices']) > 0:
                    reply = response['choices'][0].get('message', {}).get('content', '').strip()
                elif 'generated_text' in response:
                    reply = response['generated_text'].strip()
                else:
                    # Try direct text extraction
                    reply = str(response).strip()
            else:
                reply = str(response).strip() if response else ""
            
            # Ensure we have a valid reply
            if not reply:
                reply = "I'm sorry, I couldn't generate a response. Please try again."
            
            # Update history
            self.history.append({"user": user_message, "assistant": reply})
            
            return reply
            
        except Exception as e:
            # Fallback: try text generation if chat_completion fails
            try:
                prompt = f"{SYSTEM_PROMPT}\n\nUser: {user_message}\nAssistant:"
                response = self.client.text_generation(
                    prompt,
                    max_new_tokens=256,
                    temperature=0.7,
                    top_p=0.9
                )
                reply = response.strip()
                self.history.append({"user": user_message, "assistant": reply})
                return reply
            except Exception as e2:
                return f"Sorry, I encountered an error: {str(e2)}"
    
    def clear_history(self):
        """Clear conversation history"""
        self.history = []