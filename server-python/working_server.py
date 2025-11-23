from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

app = FastAPI(title="Working AI Chat")

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

@app.get("/health")
async def health_check():
    return {"status": "OK", "message": "Working server running"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    from fastapi import Response
    
    # Create response data
    response_data = {
        "success": True,
        "response": f"Echo: {request.message}",
        "timestamp": "2024-01-01T00:00:00Z",
        "error": None
    }
    
    # Convert to JSON properly
    json_response = json.dumps(response_data, separators=(',', ': '))
    
    return Response(
        content=json_response,
        media_type="application/json"
    )

if __name__ == "__main__":
    import uvicorn
    print("🚀 Working server starting on port 8000")
    uvicorn.run("working_server:app", host="0.0.0.0", port=8000, reload=False)