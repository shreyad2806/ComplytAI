import { NextRequest, NextResponse } from "next/server";
import type { AnalysisRequest } from "@/types";

/** Used when only `N8N_BASE_URL` is set (e.g. http://localhost:5678) */
const DEFAULT_WEBHOOK_PATH = "/webhook-test/complyt-ai";
const ORCHESTRATION_MSG =
  "Complyt AI orchestration engine is currently unavailable.";

const LOG = "[api/analyse]";
const N8N_TIMEOUT_MS = 120_000;
/** Max characters of raw body to print in one log line (avoid flooding terminal) */
const RAW_LOG_MAX = 100_000;

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

function logIncomingBody(body: Partial<AnalysisRequest>) {
  const doc = body.document_text;
  const preview =
    typeof doc === "string"
      ? doc.length > 400
        ? `${doc.slice(0, 400)}… (${doc.length} chars)`
        : doc
      : doc;
  console.info(`${LOG} incoming request body`, {
    prompt: body.prompt,
    document_name: body.document_name,
    document_text: preview,
  });
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

function logRawResponseForTerminal(raw: string, status: number) {
  console.info(`${LOG} response status`, status);
  console.info(`${LOG} raw response length (chars)`, raw.length);
  if (raw.length <= RAW_LOG_MAX) {
    console.info(`${LOG} raw response text`, raw);
  } else {
    console.info(
      `${LOG} raw response text (head ${RAW_LOG_MAX / 2} chars)`,
      raw.slice(0, RAW_LOG_MAX / 2)
    );
    console.info(
      `${LOG} raw response text (tail ${RAW_LOG_MAX / 2} chars)`,
      raw.slice(-RAW_LOG_MAX / 2)
    );
    console.info(
      `${LOG} raw response text [middle omitted; total ${raw.length} chars]`
    );
  }
}

function logParsedJson(data: unknown) {
  try {
    const serialized = JSON.stringify(data);
    const max = 50_000;
    if (serialized.length <= max) {
      console.info(`${LOG} parsed JSON`, data);
    } else {
      console.info(`${LOG} parsed JSON (stringified length)`, serialized.length);
      console.info(`${LOG} parsed JSON (preview)`, serialized.slice(0, max) + "…");
    }
  } catch (e) {
    console.info(`${LOG} parsed JSON (could not stringify for log)`, data);
    console.error(`${LOG} stringify for log failed`, e);
  }
}

export async function POST(request: NextRequest) {
  try {
    let parsedBody: unknown;
    try {
      parsedBody = await request.json();
    } catch (parseErr) {
      console.error(`${LOG} invalid JSON from client`, {
        error: parseErr,
        stack: parseErr instanceof Error ? parseErr.stack : undefined,
      });
      return NextResponse.json(
        { error: "Invalid JSON body", code: "INVALID_JSON" },
        { status: 400 }
      );
    }

    const body = parsedBody as Partial<AnalysisRequest>;
    logIncomingBody(body);

    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const document_text =
      typeof body.document_text === "string" ? body.document_text : "";
    if (!prompt) {
      return NextResponse.json(
        { error: "Missing or empty prompt", code: "MISSING_PROMPT" },
        { status: 400 }
      );
    }

    const webhookUrl = resolveWebhookUrl();
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

    console.info(`${LOG} webhook URL`, webhookUrl);

    const outbound = {
      prompt,
      document_text,
      document_name: body.document_name ?? "compliance-request",
    };

    let n8nResponse: Response;
    try {
      n8nResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        body: JSON.stringify(outbound),
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

    // Read body exactly once — never call .json() on this Response
    const raw = await n8nResponse.text();
    const status = n8nResponse.status;

    logRawResponseForTerminal(raw, status);

    if (!n8nResponse.ok) {
      console.error(`${LOG} n8n HTTP error`, { status, rawLength: raw.length });
      return NextResponse.json(
        {
          success: false,
          error: "AI workflow returned an error",
          code: "N8N_HTTP_ERROR",
          status,
          rawResponse: raw,
        },
        { status: 502 }
      );
    }

    let data: unknown;
    try {
      data = raw.length ? JSON.parse(raw) : null;
    } catch (parseErr) {
      console.error(`${LOG} JSON.parse failed on n8n body`, {
        error: parseErr,
        stack: parseErr instanceof Error ? parseErr.stack : undefined,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON returned from n8n",
          rawResponse: raw,
        },
        { status: 502 }
      );
    }

    if (data === null && raw.trim().length === 0) {
      console.error(`${LOG} empty response body from n8n (200)`);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON returned from n8n",
          rawResponse: raw,
        },
        { status: 502 }
      );
    }

    logParsedJson(data);

    console.info(`${LOG} returning parsed payload to client`);
    return NextResponse.json(data);
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
