// src/lib/api.ts
import { AnalysisRequest, AnalysisResponse } from "@/types";

const API_BASE = "/api";

function parseApiErrorPayload(text: string): {
  error?: string;
  code?: string;
  details?: string;
} | null {
  try {
    const j = JSON.parse(text) as Record<string, unknown>;
    if (j && typeof j === "object" && typeof j.error === "string") {
      return {
        error: j.error,
        code: typeof j.code === "string" ? j.code : undefined,
        details: typeof j.details === "string" ? j.details : undefined,
      };
    }
  } catch {
    /* not JSON */
  }
  return null;
}

export async function analyzeDocument(
  request: AnalysisRequest
): Promise<AnalysisResponse> {
  const response = await fetch(`${API_BASE}/analyse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(request),
  });

  const errorText = await response.text();

  if (!response.ok) {
    const parsed = parseApiErrorPayload(errorText);
    const message =
      parsed?.error ??
      (errorText ? `API Error ${response.status}: ${errorText}` : `API Error ${response.status}`);
    throw new Error(message);
  }

  let data: AnalysisResponse;
  try {
    data = JSON.parse(errorText) as AnalysisResponse;
  } catch {
    throw new Error("Invalid response from analysis service.");
  }

  if (!data || typeof data !== "object" || !data.report) {
    throw new Error("Analysis service returned an unexpected payload.");
  }

  return data;
}
