"""
FastAPI Application for ASL Recognition Service

Usage:
    uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload

Or run directly:
    python -m api.main
"""
import sys
import argparse
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

sys.path.insert(0, str(Path(__file__).parent.parent))
from config import api_config, CHECKPOINT_DIR
from inference import ASLPredictor, LetterAccumulator
from api.routes import router, set_predictor


# Global predictor and accumulator
predictor = None
accumulator = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    global predictor, accumulator
    
    # Startup
    print("🚀 Starting ASL Recognition API...")
    
    try:
        predictor = ASLPredictor()
        accumulator = LetterAccumulator()
        set_predictor(predictor, accumulator)
        print("✅ Model loaded successfully")
    except FileNotFoundError as e:
        print(f"⚠️ Warning: Model not found - {e}")
        print("   API will start but predictions won't work until model is trained")
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down...")
    if predictor:
        predictor.close()


# Create FastAPI app
app = FastAPI(
    title="ASL Recognition API",
    description="""
    Real-time American Sign Language fingerspelling recognition API.
    
    ## Features
    - Predict ASL letters from images
    - Accumulate letters into words/sentences
    - Low latency inference (~20-50ms)
    
    ## Endpoints
    - `POST /predict` - Predict from base64 image
    - `POST /predict/landmarks` - Predict from raw landmarks
    - `POST /predict/confirm` - Predict with automatic text accumulation
    - `GET /accumulator` - Get accumulated text
    - `POST /reset` - Reset state
    - `GET /health` - Health check
    """,
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=api_config.allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router, tags=["ASL Recognition"])


@app.get("/")
async def root():
    """Root endpoint with API info"""
    return {
        "name": "ASL Recognition API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


def main():
    parser = argparse.ArgumentParser(description="ASL Recognition API Server")
    parser.add_argument("--host", type=str, default=api_config.host)
    parser.add_argument("--port", type=int, default=api_config.port)
    parser.add_argument("--reload", action="store_true", help="Enable hot reload")
    
    args = parser.parse_args()
    
    print(f"""
    ╔═══════════════════════════════════════════╗
    ║       ASL Recognition API Server          ║
    ╠═══════════════════════════════════════════╣
    ║  Host: {args.host:<35} ║
    ║  Port: {args.port:<35} ║
    ║  Docs: http://{args.host}:{args.port}/docs{' ' * (23 - len(str(args.port)))}║
    ╚═══════════════════════════════════════════╝
    """)
    
    uvicorn.run(
        "api.main:app",
        host=args.host,
        port=args.port,
        reload=args.reload
    )


if __name__ == "__main__":
    main()
