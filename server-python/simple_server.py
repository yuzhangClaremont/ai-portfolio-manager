from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class ChatRequest(BaseModel):
    message: str
    messageHistory: list = []

@app.get("/health")
async def health():
    return {"status": "OK", "message": "Simple server running"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    response_data = {
        "success": True,
        "response": f"Echo: {request.message}",
        "message": "Working!"
    }
    
    # Manually create JSON string with proper formatting
    json_str = '{"success": true, "response": "' + f"Echo: {request.message}" + '", "message": "Working!"}'
    
    # Return as Response with proper content-type
    from fastapi import Response
    return Response(
        content=json_str,
        media_type="application/json"
    )

if __name__ == "__main__":
    import uvicorn
    print("🚀 Simple server starting on port 8000")
    uvicorn.run("simple_server:app", host="0.0.0.0", port=8000, reload=True)