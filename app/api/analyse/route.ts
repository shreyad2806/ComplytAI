import { NextRequest, NextResponse } from "next/server";
import { isCanonicalReport, normalizeReport, parseJsonValue } from "@/lib/normalize-report";
import type { AgentTrace, CrewMetrics } from "@/types";

const BACKEND_MSG =
  "Complyt FastAPI backend is currently unavailable.";

const LOG = "[api/analyse]";

const FASTAPI_URL =
  process.env.FASTAPI_URL ??
  "http://127.0.0.1:8000/analyse";

function isBackendNetworkError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  const name = err.name;

  if (name === "AbortError" || name === "TimeoutError") return true;
  if (msg.includes("fetch failed")) return true;
  if (msg.includes("econnrefused")) return true;
  if (msg.includes("enotfound")) return true;
  if (msg.includes("network")) return true;

  const cause = err.cause as { code?: string } | undefined;
  const code = cause?.code?.toLowerCase();
  if (code === "econnrefused" || code === "enotfound" || code === "eai_again")
    return true;

  return false;
}

function readAgentTrace(value: unknown): AgentTrace[] {
  const root = Array.isArray(value) ? value[0] : value;
  if (!root || typeof root !== "object") return [];

  const record = root as Record<string, unknown>;
  const nested = record.report && typeof record.report === "object" ? record.report as Record<string, unknown> : null;
  const trace = record.agent_trace ?? nested?.agent_trace;
  if (!Array.isArray(trace)) return [];

  return trace.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const entry = item as Record<string, unknown>;
    const agent = typeof entry.agent === "string" ? entry.agent.trim() : "";
    const status = typeof entry.status === "string" ? entry.status.trim() : "";
    const duration = typeof entry.duration === "number" ? entry.duration : Number(entry.duration);
    const summary = typeof entry.summary === "string" ? entry.summary.trim() : "";
    if (!agent || !status || !Number.isFinite(duration) || !summary) return [];
    
    return [{ 
      agent, 
      status, 
      duration: Math.max(0, duration), 
      summary,
      task: typeof entry.task === "string" ? entry.task : undefined,
      started_at: typeof entry.started_at === "string" ? entry.started_at : undefined,
      finished_at: typeof entry.finished_at === "string" ? entry.finished_at : undefined,
      duration_seconds: typeof entry.duration_seconds === "number" ? entry.duration_seconds : undefined,
      evidence_count: typeof entry.evidence_count === "number" ? entry.evidence_count : undefined,
      findings_count: typeof entry.findings_count === "number" ? entry.findings_count : undefined,
    }];
  });
}

function readCrewMetrics(value: unknown): CrewMetrics | null {
  const root = Array.isArray(value) ? value[0] : value;
  if (!root || typeof root !== "object") return null;

  const record = root as Record<string, unknown>;
  const nested = record.report && typeof record.report === "object" ? record.report as Record<string, unknown> : null;
  const metrics = record.crew_metrics ?? nested?.crew_metrics;
  
  if (!metrics || typeof metrics !== "object") return null;
  return metrics as CrewMetrics;
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (parseErr) {
      console.error(`${LOG} invalid multipart body error=${parseErr instanceof Error ? parseErr.message : String(parseErr)}`);
      return NextResponse.json(
        { error: "Invalid multipart body", code: "INVALID_MULTIPART" },
        { status: 400 }
      );
    }

    const promptValue = formData.get("prompt");
    const documentNameValue = formData.get("document_name");
    const fileValue = formData.get("file");
    const prompt = typeof promptValue === "string" ? promptValue.trim() : "";
    const documentName =
      typeof documentNameValue === "string" && documentNameValue.trim()
        ? documentNameValue.trim()
        : "compliance-request";

    if (!prompt) {
      console.error(`${LOG} invalid request requestId=${requestId} code=MISSING_PROMPT`);
      return NextResponse.json(
        { error: "Missing or empty prompt", code: "MISSING_PROMPT" },
        { status: 400 }
      );
    }

    if (!(fileValue instanceof File) || fileValue.size === 0) {
      console.error(`${LOG} invalid request requestId=${requestId} code=MISSING_FILE`);
      return NextResponse.json(
        { error: "Missing or empty document file", code: "MISSING_FILE" },
        { status: 400 }
      );
    }

    const backendUrl =
    process.env.FASTAPI_URL ??
    "http://127.0.0.1:8000/analyse";
    
    console.info(`${LOG} request accepted requestId=${requestId} documentName=${documentName} fileName=${fileValue.name} fileSize=${fileValue.size} fileType=${fileValue.type || "application/octet-stream"} backendUrl=${backendUrl}`);

    const outbound = new FormData();
    outbound.append("file", fileValue, fileValue.name);
    outbound.append("prompt", prompt);
    outbound.append("document_name", documentName);

    let backendResponse: Response;
    try {
      backendResponse = await fetch(backendUrl, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "X-Complyt-Request-Id": requestId,
        },
        body: outbound,
      });
    } catch (fetchErr) {
      console.error(`${LOG} webhook fetch failed message=${fetchErr instanceof Error ? fetchErr.message : String(fetchErr)} cause=${fetchErr instanceof Error && fetchErr.cause ? String(fetchErr.cause) : "none"}`);
      if (isBackendNetworkError(fetchErr)) {
        return NextResponse.json(
          {
            success: false,
            error: BACKEND_MSG,
            code: "ORCHESTRATION_UNAVAILABLE",
          },
          { status: 503 }
        );
      }
      throw fetchErr;
    }
    console.log("STATUS:", backendResponse.status);
    console.log("OK:", backendResponse.ok);

    const raw = await backendResponse.text();
    console.log(raw.substring(0, 500)); 

    const status = backendResponse.status;
    console.info(`${LOG} n8n response received requestId=${requestId} status=${status} responseCharacters=${raw.length}`);

    if (!backendResponse.ok) {
      console.error(`${LOG} n8n HTTP error status=${status} rawLength=${raw.length}`);
      return NextResponse.json(
        {
          success: false,
          error: "AI workflow returned an error",
          code: "N8N_HTTP_ERROR",
          status,
        },
        { status: backendResponse.status }
      );
    }

      const data = parseJsonValue(raw);
    if (typeof data === "string") {
      console.error(`${LOG} invalid n8n response format`);
      return NextResponse.json(
        { success: false, error: "Invalid JSON returned from n8n", code: "INVALID_N8N_JSON" },
        { status: backendResponse.status }
      );
    }

    if (data === null && raw.trim().length === 0) {
      console.error(`${LOG} empty response body from n8n (200)`);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON returned from n8n",
          code: "INVALID_N8N_JSON",
        },
        { status: backendResponse.status }
      );
    }

    try {
      console.log("[TEMP] 1. Object.keys(data):", data && typeof data === "object" ? Object.keys(data) : "data is not an object");
      console.log("[TEMP] 2. data:", JSON.stringify(data, null, 2));
      const normalized = normalizeReport(data);
      console.log("[TEMP] 5. normalized:", JSON.stringify(normalized, null, 2));
      console.log("[TEMP] 6. isCanonicalReport(normalized):", isCanonicalReport(normalized));
      const agentTrace = readAgentTrace(data);
      const crewMetrics = readCrewMetrics(data);
      if (!isCanonicalReport(normalized)) {
        return NextResponse.json(
          { success: false, error: "AI response did not contain a complete report", code: "INVALID_REPORT" },
          { status: backendResponse.status }
        );
      }
      console.info(`${LOG} report normalized requestId=${requestId} analysisType=${normalized.analysis_type} riskScore=${normalized.risk_score} keyInsights=${normalized.key_insights.length} financialRisks=${normalized.financial_risks.length} complianceIssues=${normalized.compliance_issues.length} auditFlags=${normalized.audit_flags.length} recommendations=${normalized.recommendations.length}`);
      return NextResponse.json({
        success: true,
        platform: "n8n",
        analysis_type: normalized.analysis_type,
        report: normalized,
        request_id: requestId,
        ...(agentTrace.length ? { agent_trace: agentTrace } : {}),
        ...(crewMetrics ? { crew_metrics: crewMetrics } : {}),
      });
    } catch (error) {
      console.error(`${LOG} normalization failed error=${error instanceof Error ? error.message : String(error)}`);
      return NextResponse.json(
        { success: false, error: "Invalid report structure returned from AI", code: "INVALID_REPORT" },
        { status: backendResponse.status }
      );
    }
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      console.error(`${LOG} timeout message=${err.message}`);
      return NextResponse.json(
        {
          success: false,
          error: "Analysis timed out. Try a shorter document.",
          code: "TIMEOUT",
        },
        { status: 504 }
      );
    }

    if (isBackendNetworkError(err)) {
      console.error(`${LOG} orchestration / network error message=${err instanceof Error ? err.message : String(err)}`);
      return NextResponse.json(
        {
          success: false,
          error: BACKEND_MSG,
          code: "ORCHESTRATION_UNAVAILABLE",
        },
        { status: 503 }
      );
    }

    console.error(`${LOG} unhandled error message=${err instanceof Error ? err.message : String(err)}`);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        code: "INTERNAL",
      },
      { status: 500 }
    );
  }
}
