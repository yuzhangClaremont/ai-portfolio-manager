# Python AI Chat Service with LangChain LangGraph

## 🤖 Features
- **LangChain LangGraph**: State-based conversation management
- **DeepSeek LLM**: Advanced AI model integration
- **FastAPI**: High-performance async web framework
- **WeChat Mini-program**: Optimized API endpoints
- **Conversation History**: Context-aware responses

## 🚀 Quick Start

### 1. Setup Environment
```bash
cd server-python

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure DeepSeek API
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your DeepSeek API key
DEEPSEEK_API_KEY=your_deepseek_api_key_here
PORT=8000
```

### 3. Start the Service
```bash
# Development with auto-reload
python main.py

# Or use uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 📱 API Endpoints

### Health Check
```
GET http://localhost:8000/health
```

### Chat Endpoint
```
POST http://localhost:8000/api/chat
Content-Type: application/json

{
  "message": "Hello, how can you help me?",
  "messageHistory": [
    {"type": "user", "content": "Previous message"},
    {"type": "ai", "content": "Previous response"}
  ]
}
```

### Interactive API Docs
Visit http://localhost:8000/docs for interactive API documentation.

## 🧠 LangChain LangGraph Architecture

### State Management
```python
class AgentState(TypedDict):
    messages: List[BaseMessage]
    question: str
    context: str
```

### Agent Workflow
1. **Input**: User question + message history
2. **Processing**: DeepSeek LLM generates response
3. **State Update**: Adds conversation to context
4. **Output**: AI response with full history

### DeepSeek Integration
```python
llm = ChatOpenAI(
    openai_api_key=os.getenv("DEEPSEEK_API_KEY"),
    model_name="deepseek-chat",
    openai_api_base="https://api.deepseek.com/v1",
    temperature=0.7,
    max_tokens=2000
)
```

## 🔧 Configuration

### Environment Variables
- `DEEPSEEK_API_KEY`: Required - Your DeepSeek API key
- `PORT`: Optional - Server port (default: 8000)

### DeepSeek Model Settings
- **Model**: `deepseek-chat`
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 2000 (adequate for responses)
- **Context Window**: Last 10 messages

## 📊 Features Explained

### ✅ Conversation Context
- Maintains message history
- Provides context to DeepSeek LLM
- Enables coherent multi-turn conversations

### ✅ Error Handling
- API key validation
- Network error handling
- Graceful fallback responses

### ✅ CORS Support
- Configured for WeChat mini-programs
- Secure cross-origin requests
- Production-ready headers

### ✅ Async Processing
- FastAPI async/await support
- Non-blocking request handling
- High concurrency support

## 🧪 Testing

### Test the Agent Directly
```python
from langchain_agent import chat_with_agent

result = chat_with_agent("你好，请介绍一下自己")
print(result)
```

### Test API with curl
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, AI assistant!"}'
```

## 🌟 Production Deployment

### Docker (Recommended)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Setup
1. Set `DEEPSEEK_API_KEY` in production environment
2. Update CORS origins for your WeChat domain
3. Configure proper logging and monitoring

## 📚 Dependencies

- **FastAPI**: Modern web framework
- **LangChain**: AI framework
- **LangGraph**: State graph management
- **OpenAI**: DeepSeek API compatibility
- **Pydantic**: Data validation
- **uvicorn**: ASGI server

## 🔍 Troubleshooting

### Common Issues
1. **API Key Not Found**: Check `.env` file setup
2. **CORS Errors**: Verify WeChat domain configuration
3. **Connection Refused**: Ensure server is running on port 8000
4. **DeepSeek API Errors**: Validate API key and model availability

### Debug Mode
Enable detailed logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📞 Support

For issues with:
- **DeepSeek API**: Check DeepSeek documentation
- **LangChain**: Review LangChain docs
- **WeChat Mini-program**: Refer to WeChat developer docs
- **This Service**: Check logs and error messages

**Ready to power intelligent conversations! 🚀**