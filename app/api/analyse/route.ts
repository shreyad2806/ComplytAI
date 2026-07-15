import { NextRequest, NextResponse } from "next/server";
import { isCanonicalReport, normalizeReport, parseJsonValue } from "@/lib/normalize-report";

/** Used when only `N8N_BASE_URL` is set (e.g. http://localhost:5678) */
const DEFAULT_WEBHOOK_PATH = "/webhook-test/complyt-ai";
const ORCHESTRATION_MSG =
  "Complyt AI orchestration engine is currently unavailable.";

const LOG = "[api/analyse]";
const N8N_TIMEOUT_MS = 120_000;

function resolveWebhookUrl(): string | null {
  const explicit = process.env.N8N_WEBHOOK_URL?.trim();
  if (explicit) return explicit;

  const base = process.env.N8N_BASE_URL?.trim();
  if (base) {
    const normalized = base.replace(/\/+$/, "");
    return `${normalized}${DEFAULT_WEBHOOK_PATH}`;
  }

  return null;
}

function isNetworkOrchestrationError(err: unknown): boolean {
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

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (parseErr) {
      console.error(`${LOG} invalid multipart body`, {
        error: parseErr,
        stack: parseErr instanceof Error ? parseErr.stack : undefined,
      });
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
      console.error(`${LOG} invalid request`, { requestId, code: "MISSING_PROMPT" });
      return NextResponse.json(
        { error: "Missing or empty prompt", code: "MISSING_PROMPT" },
        { status: 400 }
      );
    }

    if (!(fileValue instanceof File) || fileValue.size === 0) {
      console.error(`${LOG} invalid request`, { requestId, code: "MISSING_FILE" });
      return NextResponse.json(
        { error: "Missing or empty document file", code: "MISSING_FILE" },
        { status: 400 }
      );
    }

    const webhookUrl = resolveWebhookUrl();
    console.info(`${LOG} request accepted`, {
      requestId,
      documentName,
      fileName: fileValue.name,
      fileSize: fileValue.size,
      fileType: fileValue.type || "application/octet-stream",
      webhookConfigured: Boolean(webhookUrl),
    });
    if (!webhookUrl) {
      console.error(
        `${LOG} missing N8N_WEBHOOK_URL / N8N_BASE_URL — example: N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/complyt-ai`
      );
      return NextResponse.json(
        {
          success: false,
          error: ORCHESTRATION_MSG,
          code: "ORCHESTRATION_UNAVAILABLE",
        },
        { status: 503 }
      );
    }

    const outbound = new FormData();
    outbound.append("file", fileValue, fileValue.name);
    outbound.append("prompt", prompt);
    outbound.append("document_name", documentName);

    let n8nResponse: Response;
    try {
      n8nResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "X-Complyt-Request-Id": requestId,
        },
        body: outbound,
        signal: AbortSignal.timeout(N8N_TIMEOUT_MS),
      });
    } catch (fetchErr) {
      console.error(`${LOG} webhook fetch failed`, {
        error: fetchErr,
        message: fetchErr instanceof Error ? fetchErr.message : String(fetchErr),
        stack: fetchErr instanceof Error ? fetchErr.stack : undefined,
        cause: fetchErr instanceof Error ? fetchErr.cause : undefined,
      });
      if (isNetworkOrchestrationError(fetchErr)) {
        return NextResponse.json(
          {
            success: false,
            error: ORCHESTRATION_MSG,
            code: "ORCHESTRATION_UNAVAILABLE",
          },
          { status: 503 }
        );
      }
      throw fetchErr;
    }

    const raw = await n8nResponse.text();
    const status = n8nResponse.status;
    console.info(`${LOG} n8n response received`, { requestId, status, responseCharacters: raw.length });

    if (!n8nResponse.ok) {
      console.error(`${LOG} n8n HTTP error`, { status, rawLength: raw.length });
      return NextResponse.json(
        {
          success: false,
          error: "AI workflow returned an error",
          code: "N8N_HTTP_ERROR",
          status,
        },
        { status: 502 }
      );
    }

    const data = parseJsonValue(raw);
    if (typeof data === "string") {
      console.error(`${LOG} invalid n8n response format`);
      return NextResponse.json(
        { success: false, error: "Invalid JSON returned from n8n", code: "INVALID_N8N_JSON" },
        { status: 502 }
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
        { status: 502 }
      );
    }

    try {
      const normalized = normalizeReport(data);
      if (!isCanonicalReport(normalized)) {
        return NextResponse.json(
          { success: false, error: "AI response did not contain a complete report", code: "INVALID_REPORT" },
          { status: 502 }
        );
      }
      console.info(`${LOG} report normalized`, {
        requestId,
        analysisType: normalized.analysis_type,
        riskScore: normalized.risk_score,
        sections: {
          keyInsights: normalized.key_insights.length,
          financialRisks: normalized.financial_risks.length,
          complianceIssues: normalized.compliance_issues.length,
          auditFlags: normalized.audit_flags.length,
          recommendations: normalized.recommendations.length,
        },
      });
      return NextResponse.json({
        success: true,
        platform: "n8n",
        analysis_type: normalized.analysis_type,
        report: normalized,
        request_id: requestId,
      });
    } catch (error) {
      console.error(`${LOG} normalization failed`, error);
      return NextResponse.json(
        { success: false, error: "Invalid report structure returned from AI", code: "INVALID_REPORT" },
        { status: 502 }
      );
    }
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      console.error(`${LOG} timeout`, {
        message: err.message,
        stack: err.stack,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Analysis timed out. Try a shorter document.",
          code: "TIMEOUT",
        },
        { status: 504 }
      );
    }

    if (isNetworkOrchestrationError(err)) {
      console.error(`${LOG} orchestration / network error`, {
        error: err,
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });
      return NextResponse.json(
        {
          success: false,
          error: ORCHESTRATION_MSG,
          code: "ORCHESTRATION_UNAVAILABLE",
        },
        { status: 503 }
      );
    }

    console.error(`${LOG} unhandled error`, {
      error: err,
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

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
