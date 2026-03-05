@echo off
echo ========================================
echo  NovaCare Fall Detection System
echo  Starting Flask Development Server...
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install requirements
echo Installing dependencies...
pip install -r requirements.txt
echo.

REM Run Flask app
echo Starting Flask application...
echo Open your browser and navigate to: http://localhost:5000
echo.
python run.py

