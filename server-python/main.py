from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from datetime import datetime
from langchain_agent import chat_with_agent

# Initialize FastAPI app
app = FastAPI(
    title="AI Chat Backend",
    description="Python service with LangChain LangGraph and DeepSeek LLM",
    version="1.0.0"
)

# CORS middleware for WeChat mini-program
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your WeChat mini-program domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class Message(BaseModel):
    type: str
    content: str
    time: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    messageHistory: List[Message] = []

class ChatResponse(BaseModel):
    success: bool
    response: str
    timestamp: str
    error: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    message: str
    timestamp: str

class AuthRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    success: bool
    message: str
    timestamp: str
    error: Optional[str] = None

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Check if the API is running."""
    return HealthResponse(
        status="OK",
        message="Python AI Chat Backend is running with LangChain LangGraph",
        timestamp=datetime.utcnow().isoformat() + "Z"
    )

# Chat endpoint for WeChat mini-program
@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Process chat messages using LangChain LangGraph agent with DeepSeek LLM.
    """
    try:
        # Validate input
        if not request.message or not request.message.strip():
            raise HTTPException(
                status_code=400,
                detail="Message is required and cannot be empty"
            )
        
        print(f"Received message: {request.message}")
        
        # Convert message history to dict format
        message_history = [
            {"type": msg.type, "content": msg.content}
            for msg in request.messageHistory
        ]
        
        # Call LangChain agent
        result = chat_with_agent(
            question=request.message.strip(),
            message_history=message_history
        )
        
        print(f"AI Response: {result.get('response', 'No response')}")
        
        return ChatResponse(
            success=result["success"],
            response=result["response"],
            timestamp=result.get("timestamp", datetime.utcnow().isoformat() + "Z"),
            error=result.get("error")
        )
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Chat API Error: {e}")
        return ChatResponse(
            success=False,
            response="抱歉，服务器出错了。请稍后再试。",
            timestamp=datetime.utcnow().isoformat() + "Z",
            error=str(e)
        )

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "AI Chat Backend with LangChain LangGraph",
        "docs": "/docs",
        "health": "/health",
        "chat": "/api/chat"
    }

# Simple in-memory user store and helpers
USERS: Dict[str, str] = {}

def hash_password(email: str, password: str) -> str:
    import hashlib
    return hashlib.sha256((email + "::" + password).encode("utf-8")).hexdigest()

def validate_email(email: str) -> bool:
    return "@" in email and "." in email

@app.post("/api/auth/register", response_model=AuthResponse)
async def register(request: AuthRequest):
    try:
        if not validate_email(request.email):
            raise HTTPException(status_code=400, detail="邮箱格式不正确")
        if not request.password or len(request.password) < 6:
            raise HTTPException(status_code=400, detail="密码至少6位")
        if request.email in USERS:
            raise HTTPException(status_code=400, detail="邮箱已注册")
        USERS[request.email] = hash_password(request.email, request.password)
        return AuthResponse(
            success=True,
            message="注册成功",
            timestamp=datetime.utcnow().isoformat() + "Z",
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        return AuthResponse(
            success=False,
            message="注册失败",
            timestamp=datetime.utcnow().isoformat() + "Z",
            error=str(e)
        )

@app.post("/api/auth/login", response_model=AuthResponse)
async def login(request: AuthRequest):
    try:
        if not validate_email(request.email):
            raise HTTPException(status_code=400, detail="邮箱格式不正确")
        if request.email not in USERS:
            raise HTTPException(status_code=400, detail="账号不存在")
        if USERS.get(request.email) != hash_password(request.email, request.password):
            raise HTTPException(status_code=400, detail="邮箱或密码错误")
        return AuthResponse(
            success=True,
            message="登录成功",
            timestamp=datetime.utcnow().isoformat() + "Z",
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        return AuthResponse(
            success=False,
            message="登录失败",
            timestamp=datetime.utcnow().isoformat() + "Z",
            error=str(e)
        )

# Run the app
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    
    print(f"🚀 Python AI Chat Backend starting on port {port}")
    print(f"📱 Health check: http://localhost:{port}/health")
    print(f"💬 Chat endpoint: http://localhost:{port}/api/chat")
    print(f"📚 API docs: http://localhost:{port}/docs")
    print(f"🔑 DeepSeek API Key configured: {'YES' if os.getenv('DEEPSEEK_API_KEY') else 'NO'}")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )