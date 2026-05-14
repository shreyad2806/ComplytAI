import type {
  AnalysisResponse,
  AuditFlag,
  ComplianceIssue,
  ComplianceReport,
  Recommendation,
  RiskItem,
} from "@/types";

/** Persisted snapshot saved to localStorage (stable shape for UI + history). */
export type PersistedReport = {
  id: string;
  createdAt: string;
  fileName?: string;
  prompt: string;
  analysisType?: string;
  platform?: string;
  risk_score: number;
  risk_level: string;
  executive_summary: string;
  key_insights: unknown[];
  financial_risks: unknown[];
  compliance_issues: unknown[];
  audit_flags: unknown[];
  recommendations: unknown[];
};

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
}

function normalizeRiskLevel(input: unknown): ComplianceReport["risk_level"] {
  if (typeof input !== "string" || !input.trim()) return "Medium";
  const s = input.trim().toLowerCase();
  if (s === "low") return "Low";
  if (s === "medium") return "Medium";
  if (s === "high") return "High";
  if (s === "critical") return "Critical";
  return "Medium";
}

function clampScore(input: unknown): number {
  const n =
    typeof input === "number"
      ? input
      : typeof input === "string"
        ? Number.parseFloat(input)
        : Number.NaN;
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
}

function normalizeSeverity(input: unknown): RiskItem["severity"] {
  const s =
    typeof input === "string" ? input.trim().toLowerCase() : "medium";
  if (s === "critical" || s === "high" || s === "medium" || s === "low")
    return s;
  return "medium";
}

function normalizeFinancialRisks(input: unknown): RiskItem[] {
  if (!Array.isArray(input)) return [];
  return input.map((item) => {
    const o = asRecord(item);
    return {
      title: typeof o.title === "string" ? o.title : "Untitled risk",
      description:
        typeof o.description === "string" ? o.description : "",
      severity: normalizeSeverity(o.severity),
      financial_exposure:
        typeof o.financial_exposure === "string"
          ? o.financial_exposure
          : undefined,
    };
  });
}

function normalizeComplianceIssues(input: unknown): ComplianceIssue[] {
  if (!Array.isArray(input)) return [];
  return input.map((item) => {
    const o = asRecord(item);
    const raw =
      typeof o.status === "string" ? o.status.trim().toLowerCase() : "";
    const statusNorm = raw.replace(/-/g, "_");
    const status: ComplianceIssue["status"] =
      statusNorm === "open" ||
      statusNorm === "resolved" ||
      statusNorm === "in_review"
        ? (statusNorm as ComplianceIssue["status"])
        : "open";
    const pr =
      typeof o.priority === "string" ? o.priority.trim().toLowerCase() : "";
    const priority: ComplianceIssue["priority"] =
      pr === "low" || pr === "medium" || pr === "high" ? pr : "medium";
    return {
      issue: typeof o.issue === "string" ? o.issue : "—",
      regulation:
        typeof o.regulation === "string" ? o.regulation : undefined,
      status,
      priority,
    };
  });
}

function normalizeAuditFlags(input: unknown): AuditFlag[] {
  if (!Array.isArray(input)) return [];
  return input.map((item) => {
    const o = asRecord(item);
    return {
      flag: typeof o.flag === "string" ? o.flag : "—",
      category: typeof o.category === "string" ? o.category : "General",
      details: typeof o.details === "string" ? o.details : "",
    };
  });
}

function normalizeRecommendations(input: unknown): Recommendation[] {
  if (!Array.isArray(input)) return [];
  return input.map((item) => {
    const o = asRecord(item);
    const raw =
      typeof o.priority === "string" ? o.priority.trim().toLowerCase() : "";
    const pr = raw.replace(/-/g, "_");
    const priority: Recommendation["priority"] =
      pr === "immediate" || pr === "short_term" || pr === "long_term"
        ? pr
        : "short_term";
    return {
      action: typeof o.action === "string" ? o.action : "—",
      priority,
      impact: typeof o.impact === "string" ? o.impact : "",
    };
  });
}

function normalizeKeyInsights(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((x) => {
      if (typeof x === "string") return x;
      if (x && typeof x === "object") return JSON.stringify(x);
      if (x == null) return "";
      return String(x);
    })
    .filter((s) => s.length > 0);
}

/** Coerces arbitrary n8n / LLM `report` JSON into a safe {@link ComplianceReport}. */
export function normalizeReport(raw: unknown): ComplianceReport {
  const r = asRecord(raw);

  return {
    risk_score: clampScore(r.risk_score),
    risk_level: normalizeRiskLevel(r.risk_level),
    executive_summary:
      typeof r.executive_summary === "string"
        ? r.executive_summary
        : typeof r.summary === "string"
          ? r.summary
          : "",
    financial_risks: normalizeFinancialRisks(r.financial_risks),
    compliance_issues: normalizeComplianceIssues(r.compliance_issues),
    audit_flags: normalizeAuditFlags(r.audit_flags),
    recommendations: normalizeRecommendations(r.recommendations),
    key_insights: normalizeKeyInsights(r.key_insights),
  };
}

/** @deprecated Use {@link normalizeReport} — alias kept for existing imports. */
export const normalizeComplianceReport = normalizeReport;

/**
 * Build a persisted row after a successful `/api/analyse` call.
 */
export function buildPersistedReport(
  response: AnalysisResponse,
  meta: { id: string; prompt: string; fileName?: string }
): PersistedReport {
  const n = normalizeReport(response.report ?? {});
  return {
    id: meta.id,
    createdAt: new Date().toISOString(),
    fileName: meta.fileName,
    prompt: meta.prompt,
    analysisType: response.analysis_type,
    platform: response.platform,
    risk_score: n.risk_score,
    risk_level: n.risk_level,
    executive_summary: n.executive_summary,
    key_insights: n.key_insights,
    financial_risks: n.financial_risks,
    compliance_issues: n.compliance_issues,
    audit_flags: n.audit_flags,
    recommendations: n.recommendations,
  };
}

/** Convert persisted row to strict {@link ComplianceReport} for components. */
export function persistedToComplianceReport(p: PersistedReport): ComplianceReport {
  return normalizeReport(p);
}
