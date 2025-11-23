import json

# Test JSON formatting
response_data = {
    "success": True,
    "response": "Echo: test",
    "message": "Working!"
}

# Convert to JSON string
json_string = json.dumps(response_data)
print("JSON string:", json_string)

# Print character by character to see if there are hidden characters
for i, char in enumerate(json_string):
    print(f"{i}: '{char}' (ord: {ord(char)})")