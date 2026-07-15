# Complyt CrewAI backend

This service exposes `POST /analyse`. Its primary JSON input is `document_text`, `prompt`, and an optional `document_name`; it preserves the existing compliance-report response envelope and adds an outer `agent_trace` list. Each trace has `agent`, `status`, `duration` (seconds), and `summary`. The nested report schema is unchanged. It also preserves the multipart fields already forwarded by the frontend to n8n: `file`, `prompt`, and `document_name`.

Run it from the repository root after populating `OPENAI_API_KEY` in `.env.local`:

```powershell
.\.venv\Scripts\uvicorn.exe backend.app.main:app --reload --port 8000
```

Point the existing n8n workflow at `http://localhost:8000/analyse`. The Next.js UI and its n8n webhook proxy are intentionally unchanged.

## Report memory

Set `PINECONE_API_KEY` and `PINECONE_INDEX_HOST` in `.env.local` for report memory. Before CrewAI runs, the backend embeds the current document and retrieves the most related report summaries from the configured Pinecone namespace. Those summaries are provided only to the Manager agent. After a successful run, the completed report is embedded and upserted for future retrieval. The analysis API contract is unchanged.
