"""
NovaCare AI - Configuration
Central configuration for all AI modules.
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Config:
    """
    Central configuration for NovaCare AI modules.
    """
    
    # API Token - Priority: Environment Variable
    # DO NOT HARDCODE API KEYS HERE. Set the GEMINI_API_KEY environment variable.
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    
    # Model configuration - Full model name including 'models/' prefix
    MODEL_NAME = "models/gemini-2.5-flash"
    
    @classmethod
    def is_configured(cls) -> bool:
        """Check if API token is configured."""
        return bool(cls.GEMINI_API_KEY) and cls.GEMINI_API_KEY.startswith("AIza")
