from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from datetime import datetime

# Initialize FastAPI app
app = FastAPI(title="Simple AI Chat Test")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    messageHistory: list = []

class ChatResponse(BaseModel):
    success: bool
    response: str
    timestamp: str

# Health check
@app.get("/health")
async def health_check():
    return {"status": "OK", "message": "Simple test server running"}

# Simple echo endpoint (no AI yet)
@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    return ChatResponse(
        success=True,
        response=f"Echo: {request.message} (LangChain will be added after pip works)",
        timestamp=datetime.utcnow().isoformat() + "Z"
    )

if __name__ == "__main__":
    import uvicorn
    print("🚀 Simple test server starting on port 8000")
    uvicorn.run("simple_test:app", host="0.0.0.0", port=8000, reload=True)