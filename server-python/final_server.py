from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "OK", "message": "Final server running"}

@app.post("/api/chat")
async def chat_endpoint(request: dict):
    # Manual response building to avoid JSON issues
    import json
    
    response_data = {
        "success": True,
        "response": f"Echo: {request.get('message', 'no message')}",
        "timestamp": "2024-01-01T00:00:00Z",
        "error": None
    }
    
    # Return raw string to avoid JSON serialization issues
    return json.dumps(response_data)

if __name__ == "__main__":
    import uvicorn
    print("🚀 Final server starting on port 8000")
    uvicorn.run("final_server:app", host="0.0.0.0", port=8000, reload=False)