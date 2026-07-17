import asyncio
from crewai import Agent, Task, Crew, Process, LLM

llm = LLM(
    model="ollama/qwen2.5:3b",
    base_url="http://127.0.0.1:11434",
)

agent = Agent(
    role="Assistant",
    goal="Answer questions",
    backstory="Helpful AI",
    llm=llm,
)

task = Task(
    description="Say hello.",
    expected_output="Hello",
    agent=agent,
)

crew = Crew(
    agents=[agent],
    tasks=[task],
    process=Process.sequential,
)

async def main():
    print("Starting...")
    result = await crew.kickoff_async()
    print(result)

asyncio.run(main())