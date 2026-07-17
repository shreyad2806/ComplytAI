from crewai import Agent, Task, Crew, Process, LLM

llm = LLM(
    model="ollama/qwen2.5:3b",
)

agent = Agent(
    role="Tester",
    goal="Answer briefly",
    backstory="Simple test",
    llm=llm,
)

task = Task(
    description="Say hello.",
    expected_output="A greeting.",
    agent=agent,
)

crew = Crew(
    agents=[agent],
    tasks=[task],
    process=Process.sequential,
    verbose=True,
)

print("Before kickoff")
result = crew.kickoff()
print("After kickoff")
print(result)