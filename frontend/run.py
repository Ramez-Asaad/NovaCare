"""
NovaCare - Application Entry Point (SOLID Refactored)
Simplified entry point that uses the app factory pattern.
"""
import os
from dotenv import load_dotenv

# Load environment variables FIRST before importing any modules
load_dotenv()

from app import create_app

# Create the application
app = create_app()


if __name__ == '__main__':
    # use_reloader=False prevents ERR_CONNECTION_RESET during AI inference
    port = int(os.environ.get('PORT', 5001))  # Default to 5001 to avoid AirPlay conflict
    app.run(debug=True, host='0.0.0.0', port=port, use_reloader=False, threaded=True)

