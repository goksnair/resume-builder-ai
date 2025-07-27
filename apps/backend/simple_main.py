from fastapi import FastAPI

app = FastAPI(title="Resume Builder AI - Minimal")

@app.get("/")
async def root():
    return {"message": "Resume Builder AI Backend is running"}

@app.get("/ping")
async def ping():
    return {"message": "pong", "status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)