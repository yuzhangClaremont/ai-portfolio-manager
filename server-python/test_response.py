import json
from datetime import datetime

# Test the response format
response = {
    "success": True,
    "response": "Echo: test",
    "timestamp": datetime.utcnow().isoformat() + "Z"
}

print("Response:", response)
print("JSON:", json.dumps(response, indent=2))