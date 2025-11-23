from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
    return {"status": "OK", "message": "Minimal server running"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    # Simple dictionary response
    return {
        "success": True,
        "response": f"Echo: {request.message}",
        "message": "Working!"
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Minimal server starting on port 8000")
    uvicorn.run("test_minimal:app", host="0.0.0.0", port=8000, reload=True)