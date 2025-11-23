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
    return {"status": "OK", "message": "Text server running"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    from fastapi import Response
    # Return plain text first to test
    return Response(
        content=f"ECHO: {request.message}",
        media_type="text/plain"
    )

if __name__ == "__main__":
    import uvicorn
    print("🚀 Text server starting on port 8000")
    uvicorn.run("text_server:app", host="0.0.0.0", port=8000, reload=True)