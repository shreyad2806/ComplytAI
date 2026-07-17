from litellm import completion

response = completion(
    model="ollama/qwen2.5:3b",
    messages=[
        {
            "role":"user",
            "content":"Say hello"
        }
    ]
)

print(response)