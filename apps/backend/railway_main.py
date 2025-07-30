"""
Minimal Railway-specific main.py for debugging deployment issues
"""
import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Simple FastAPI app for Railway debugging
app = FastAPI(
    title="Resume Builder AI - Railway Debug",
    description="Minimal FastAPI app for Railway deployment debugging",
    version="1.0.0"
)

# Basic CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint to verify Railway deployment"""
    return {
        "message": "Resume Builder AI is running on Railway!",
        "status": "healthy",
        "environment": os.getenv("ENV", "unknown"),
        "port": os.getenv("PORT", "8000"),
        "python_version": os.getenv("PYTHON_VERSION", "unknown")
    }

@app.get("/health")
async def health_check():
    """Simple health check endpoint"""
    return {
        "status": "healthy",
        "message": "Service is running",
        "database": "not configured in debug mode"
    }

@app.get("/ping")
async def ping():
    """Basic ping endpoint"""
    return {"message": "pong"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "railway_main:app", 
        host="0.0.0.0", 
        port=port, 
        reload=False
    )