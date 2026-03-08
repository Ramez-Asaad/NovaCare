"""
NovaCare AI - ConversationalAI Implementation
Gemini-powered Conversational Agent for NovaBot.
Reflects the persona, safety protocols, and hardware context of the assistive rover.
"""
from google import genai
from google.genai import types
from typing import Optional
from ai.config import Config


class ConversationalAI:
    """
    Gemini-powered Conversational Agent for NovaBot.
    Reflects the persona, safety protocols, and hardware context of the assistive rover.
    """
    
    def __init__(self, api_key: str = None):
        # Use provided key or fall back to Config
        self.api_key = api_key or Config.GEMINI_API_KEY
        
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
            print("[ConversationalAI] Gemini SDK Initialized (google.genai)")
        else:
            self.client = None
            print("[ConversationalAI] WARNING: No API key found for Gemini")
        
        # ... rest of the instructions ...
        self.system_instruction = """
        You are **NovaBot**, an AI-powered assistant rover designed to support individuals with disabilities[cite: 20]. 
        
        **Your Identity & Hardware:**
        - You are a physical rover built on the Hiwonder JetAuto Kit (Mecanum wheels)[cite: 210].
        - You operate on an Edge Unit (NVIDIA Jetson / Raspberry Pi 5)[cite: 213].
        - You see via a Depth Camera/LiDAR and hear via a Microphone Array[cite: 214, 215].
        
        **Your Core Mission:**
        To provide independence, safety, and companionship[cite: 61]. You are empathetic, patient, and protective.

        **Operational Rules (Strict Adherence):**
        1.  **Conciseness for TTS:** Your responses are converted to speech (Text-to-Speech). Keep answers **short, clear, and under 2 sentences** unless reading a long text is requested.
        2.  **Safety First:** If the user indicates a fall, pain, or fear, you must simulate triggering the **Emergency Alert Sequence**. Respond with: "[ALERT] Emergency detected. Contacting Guardian now.".
        3.  **Empathy:** Adapt your tone to the user's emotion. If they are sad, be comforting. If they are happy, be enthusiastic.
        4.  **Capabilities:** You can navigate, follow the user, describe objects (YOLOv8), and read text. You *cannot* lift heavy objects or go up stairs (you have wheels).
        
        **Interaction Style:**
        - Do not act like a generic chatbot. Act like a helpful robot in the room.
        - If asked to move, confirm you are checking for obstacles first[cite: 468].
        """
        
        try:
            self.model_name = Config.MODEL_NAME
            self.chat_history = []
            print(f"[ConversationalAI] Using model: {self.model_name}")
        except Exception as e:
            print(f"[ConversationalAI] Model initialization error: {e}")
            self.client = None

    def generate_response(self, user_input: str, emotion: Optional[str] = None) -> str:
        """
        Generate a response to user input, incorporating emotional context.
        """
        if not self.client or not self.api_key:
            return "I am currently offline. Please check my connection."

        try:
            # 1. Build Context with Emotion (Injecting Perception Layer Data)
            # This aligns with FR-3.4 (Adapt response based on emotion) [cite: 296]
            prompt = user_input
            
            if emotion and emotion not in ['neutral', 'unknown']:
                # We inject the perception context as a system hint hidden from the user
                prompt = f"""
                [SYSTEM CONTEXT: The user's detected emotion is '{emotion}'. 
                Adjust your tone to be supportive and appropriate for '{emotion}'.]
                
                User: {user_input}
                """

            # 2. Build message history for context
            contents = [types.Content(
                role="user",
                parts=[types.Part(text=self.system_instruction)]
            )]
            
            # Add chat history
            for msg in self.chat_history[-6:]:  # Keep last 3 exchanges
                contents.append(msg)
            
            # Add current message
            contents.append(types.Content(
                role="user",
                parts=[types.Part(text=prompt)]
            ))

            # 3. Generate using new API
            response = self.client.models.generate_content(
                model=self.model_name,  # Already includes 'models/' prefix from Config
                contents=contents
            )
            
            clean_response = response.text.replace("*", "").strip() # Clean markdown for cleaner TTS
            
            # 4. Update history
            self.chat_history.append(types.Content(role="user", parts=[types.Part(text=user_input)]))
            self.chat_history.append(types.Content(role="model", parts=[types.Part(text=clean_response)]))
            
            # 5. Fallback check
            if not clean_response:
                return "I am listening. Could you repeat that?"
                
            return clean_response

        except Exception as e:
            print(f"[ConversationalAI] Error: {e}")
            return "I am having trouble processing that request. Please check my connection."

    def clear_history(self) -> None:
        """Clear conversation history."""
        if self.client:
            self.chat_history = []
            print("[ConversationalAI] Memory cleared")

    def train(self, dataset_path: str = None, **kwargs) -> bool:
        """
        Mock training interface.
        """
        print("[ConversationalAI] Training not applicable for API-based model")
        return True
