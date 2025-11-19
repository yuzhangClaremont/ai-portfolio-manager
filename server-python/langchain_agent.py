import os
from typing import List, Dict, Any, TypedDict
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langgraph.graph import StateGraph, END
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Define the state type
class AgentState(TypedDict):
    messages: List[BaseMessage]
    question: str
    context: str

# Initialize DeepSeek LLM
llm = ChatOpenAI(
    openai_api_key=os.getenv("DEEPSEEK_API_KEY"),
    model_name="deepseek-chat",
    openai_api_base="https://api.deepseek.com/v1",
    temperature=0.7,
    max_tokens=2000
)

def agent_node(state: AgentState) -> AgentState:
    """Process the user's question and generate AI response."""
    try:
        messages = state["messages"]
        question = state["question"]
        
        # Add the current question to messages
        current_messages = messages + [HumanMessage(content=question)]
        
        # Get response from DeepSeek
        response = llm.invoke(current_messages)
        
        return {
            "messages": current_messages + [response],
            "question": question,
            "context": response.content
        }
    except Exception as e:
        print(f"DeepSeek API Error: {e}")
        return {
            "messages": state["messages"] + [HumanMessage(content=state["question"])],
            "question": state["question"],
            "context": "抱歉，我现在无法回应。请稍后再试。"
        }

def create_langgraph_agent():
    """Create and compile the LangGraph agent."""
    
    # Create the workflow graph
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("agent", agent_node)
    
    # Add edges
    workflow.set_entry_point("agent")
    workflow.add_edge("agent", END)
    
    # Compile the graph
    return workflow.compile()

# Initialize the agent
app = create_langgraph_agent()

def chat_with_agent(question: str, message_history: List[Dict[str, str]] = []) -> Dict[str, Any]:
    """
    Chat with the LangChain LangGraph agent.
    
    Args:
        question: User's current question
        message_history: List of previous messages with 'type' and 'content' fields
        
    Returns:
        Dictionary with success status and response
    """
    try:
        # Convert message history to LangChain messages
        messages = []
        for msg in message_history[-10:]:  # Keep last 10 messages for context
            if msg.get("type") == "user":
                messages.append(HumanMessage(content=msg.get("content", "")))
            elif msg.get("type") == "ai":
                messages.append(AIMessage(content=msg.get("content", "")))
        
        # Run the agent
        result = app.invoke({
            "messages": messages,
            "question": question,
            "context": ""
        })
        
        return {
            "success": True,
            "response": result["context"],
            "messages": [msg.content for msg in result["messages"]],
            "timestamp": "2024-01-01T00:00:00Z"
        }
        
    except Exception as e:
        print(f"Agent Error: {e}")
        return {
            "success": False,
            "response": "抱歉，我遇到了技术问题。请稍后再试。",
            "error": str(e),
            "timestamp": "2024-01-01T00:00:00Z"
        }

if __name__ == "__main__":
    # Test the agent
    test_result = chat_with_agent("你好，请介绍一下自己")
    print("Test Result:", test_result)