import type {
  AnalysisResponse,
  AgentTrace,
  AuditFlag,
  ComplianceIssue,
  ComplianceReport,
  FinancialRisk,
  KeyInsight,
  Recommendation,
  Severity,
  SourceExcerpt,
} from "@/types";

export type PersistedReport = ComplianceReport & {
  id: string;
  createdAt: string;
  fileName?: string;
  prompt: string;
  platform: string;
  agent_trace?: AgentTrace[];
  crew_metrics?: any;
};

type UnknownRecord = Record<string, unknown>;

const NOT_FOUND = "Not Found";
const SEVERITIES: readonly Severity[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

function asRecord(value: unknown): UnknownRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function firstValue(record: UnknownRecord, keys: string[]): unknown {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null) return value;
  }

  const aliases = new Set(keys.map(normalizeKey));
  for (const [key, value] of Object.entries(record)) {
    if (aliases.has(normalizeKey(key)) && value !== undefined && value !== null) {
      return value;
    }
  }

  return undefined;
}

function readString(value: unknown, fallback = NOT_FOUND): string {
  if (typeof value !== "string") return fallback;
  const text = value.trim();
  return text ? text : fallback;
}

function readScore(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value).replace(/%/g, ""));
  return Number.isFinite(parsed) ? Math.min(100, Math.max(0, Math.round(parsed))) : 0;
}

function readOptionalScore(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value).replace(/%/g, ""));
  return Number.isFinite(parsed) ? Math.min(100, Math.max(0, Math.round(parsed))) : undefined;
}

function readSeverity(value: unknown, fallback: Severity = "MEDIUM"): Severity {
  const normalized = String(value ?? "").trim().toUpperCase().replace(/[\s-]+/g, "_");
  if (SEVERITIES.includes(normalized as Severity)) return normalized as Severity;
  if (normalized.includes("CRIT")) return "CRITICAL";
  if (normalized.includes("HIGH")) return "HIGH";
  if (normalized.includes("LOW")) return "LOW";
  if (normalized.includes("MED")) return "MEDIUM";
  return fallback;
}

function readArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];
  const parsed = parseJsonValue(value);
  return Array.isArray(parsed) ? parsed : [];
}

function stripMarkdown(text: string): string {
  const fenced = text.trim().match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return (fenced?.[1] ?? text).trim();
}

function repairJson(text: string): string {
  return stripMarkdown(text)
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/,\s*([}\]])/g, "$1");
}

export function parseJsonValue(raw: unknown): unknown {
  if (typeof raw !== "string") return raw;

  let value = repairJson(raw);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const parsed: unknown = JSON.parse(value);
      if (typeof parsed !== "string") return parsed;
      value = repairJson(parsed);
    } catch {
      const objectStart = value.indexOf("{");
      const objectEnd = value.lastIndexOf("}");
      const arrayStart = value.indexOf("[");
      const arrayEnd = value.lastIndexOf("]");
      const hasObject = objectStart >= 0 && objectEnd > objectStart;
      const hasArray = arrayStart >= 0 && arrayEnd > arrayStart;
      if (!hasObject && !hasArray) return raw;
      value = repairJson(
        hasObject && (!hasArray || objectStart < arrayStart)
          ? value.slice(objectStart, objectEnd + 1)
          : value.slice(arrayStart, arrayEnd + 1)
      );
    }
  }
  return raw;
}

function unwrapReport(raw: unknown): UnknownRecord {
  const parsed = parseJsonValue(raw);
  const first = Array.isArray(parsed) ? parsed[0] : parsed;
  const root = asRecord(first);
  const nested = firstValue(root, ["report", "data", "result", "output", "body", "json"]);
  const parsedNested = parseJsonValue(nested);
  const report = asRecord(Array.isArray(parsedNested) ? parsedNested[0] : parsedNested);
  const source = Object.keys(report).length > 0 ? report : root;
  const embedded = asRecord(parseJsonValue(firstValue(source, ["executive_summary", "summary"])));

  if (Object.keys(embedded).length > 0) {
    return {
      ...embedded,
      ...source,
      executive_summary: firstValue(embedded, ["executive_summary", "summary"]),
    };
  }

  return source;
}

function normalizeSourceExcerpts(record: UnknownRecord): SourceExcerpt[] {
  const excerpts = readArray(firstValue(record, ["source_excerpts", "sourceExcerpts", "document_excerpts", "documentExcerpts", "matched_excerpts", "matchedExcerpts"]));
  const normalized = excerpts
    .map((excerpt) => {
      const source = typeof excerpt === "string" ? { text: excerpt } : asRecord(excerpt);
      const text = readString(firstValue(source, ["text", "excerpt", "content", "matched_document_text", "matchedText"]));
      if (text === NOT_FOUND) return null;
      const pageNumber = firstValue(source, ["page_number", "pageNumber", "page"]);
      return {
        text,
        ...(pageNumber === undefined || pageNumber === null || pageNumber === ""
          ? {}
          : { page_number: String(pageNumber) }),
      };
    })
    .filter((excerpt): excerpt is SourceExcerpt => excerpt !== null);

  if (normalized.length) return normalized;

  const matchedDocumentText = readString(firstValue(record, ["matched_document_text", "matchedDocumentText", "evidence", "matched_text", "matchedText"]));
  return matchedDocumentText === NOT_FOUND ? [] : [{ text: matchedDocumentText }];
}

function normalizeEvidence(record: UnknownRecord) {
  return {
    matched_document_text: readString(firstValue(record, ["matched_document_text", "matchedDocumentText", "evidence", "matched_text", "matchedText"])),
    matched_regulation: readString(firstValue(record, ["matched_regulation", "matchedRegulation", "regulation", "framework", "requirement"])),
    selection_reason: readString(firstValue(record, ["selection_reason", "selectionReason", "reason", "rationale", "ai_reason"])),
    retrieved_context: readString(firstValue(record, ["retrieved_context", "retrievedContext", "context", "rag_context", "source_context"])),
    source_excerpts: normalizeSourceExcerpts(record),
  };
}

function normalizeInsight(item: unknown): KeyInsight | null {
  const record = typeof item === "string" ? { title: item } : asRecord(item);
  const title = readString(firstValue(record, ["title", "insight", "name", "text", "issue", "flag"]));
  if (title === NOT_FOUND) return null;
  return {
    title,
    description: readString(firstValue(record, ["description", "details", "detail", "text", "summary"])),
    severity: readSeverity(firstValue(record, ["severity", "level", "priority", "status"])),
    confidence_score: readOptionalScore(firstValue(record, ["confidence_score", "confidenceScore", "confidence", "model_confidence"])),
    ...normalizeEvidence(record),
  };
}

function normalizeAuditFlag(item: unknown): AuditFlag | null {
  const insight = normalizeInsight(item);
  if (!insight) return null;
  const record = asRecord(item);
  return {
    ...insight,
    control: readString(firstValue(record, ["control", "relevant_control", "relevantControl", "framework", "requirement"])),
  };
}

function normalizeFinancialRisk(item: unknown): FinancialRisk | null {
  const insight = normalizeInsight(item);
  if (!insight) return null;
  const record = asRecord(item);
  return {
    ...insight,
    business_impact: readString(firstValue(record, ["business_impact", "businessImpact", "impact"])),
    financial_exposure: readString(firstValue(record, ["financial_exposure", "financialExposure", "exposure"])),
    regulation: readString(firstValue(record, ["regulation", "framework", "requirement", "standard"])),
  };
}

function normalizeComplianceIssue(item: unknown): ComplianceIssue | null {
  const insight = normalizeInsight(item);
  if (!insight) return null;
  const record = asRecord(item);
  return {
    ...insight,
    regulation: readString(firstValue(record, ["regulation", "framework", "requirement", "standard"])),
  };
}

function normalizeRecommendation(item: unknown): Recommendation | null {
  const record = typeof item === "string" ? { title: item } : asRecord(item);
  const title = readString(firstValue(record, ["title", "action", "recommendation", "name"]));
  if (title === NOT_FOUND) return null;
  return {
    title,
    description: readString(firstValue(record, ["description", "details", "detail"])),
    priority: readSeverity(firstValue(record, ["priority", "severity", "level"])),
    timeline: readString(firstValue(record, ["timeline", "due_date", "dueDate", "timeframe"])),
    ...normalizeEvidence(record),
  };
}

function normalizeItems<T>(value: unknown, normalizeItem: (item: unknown) => T | null): T[] {
  return readArray(value)
    .map(normalizeItem)
    .filter((item): item is T => item !== null);
}

export function normalizeReport(raw: unknown): ComplianceReport {
  const source = unwrapReport(raw);

  return {
    document_title: readString(firstValue(source, ["document_title", "document_name", "title", "name"])),
    analysis_type: readString(firstValue(source, ["analysis_type", "analysisType", "type"]), "Compliance Analysis"),
    risk_score: readScore(firstValue(source, ["risk_score", "overall_risk_score", "riskScore", "score", "score_value"])),
    risk_level: readSeverity(firstValue(source, ["risk_level", "riskLevel", "level"])),
    confidence_score: readScore(firstValue(source, ["confidence_score", "confidenceScore", "confidence"])),
    executive_summary: readString(firstValue(source, ["executive_summary", "executiveSummary", "summary"])),
    key_insights: normalizeItems(firstValue(source, ["key_insights", "keyInsights", "insights"]), normalizeInsight),
    financial_risks: normalizeItems(firstValue(source, ["financial_risks", "financialRisks", "financial_risk_items", "risks"]), normalizeFinancialRisk),
    compliance_issues: normalizeItems(firstValue(source, ["compliance_issues", "complianceIssues", "issues"]), normalizeComplianceIssue),
    audit_flags: normalizeItems(firstValue(source, ["audit_flags", "auditFlags", "flags"]), normalizeAuditFlag),
    recommendations: normalizeItems(firstValue(source, ["recommendations", "recommendation", "recs"]), normalizeRecommendation),
  };
}

export function isCanonicalReport(report: ComplianceReport): boolean {
  return report.document_title !== NOT_FOUND && report.executive_summary !== NOT_FOUND;
}

export function buildPersistedReport(
  response: AnalysisResponse,
  meta: { id: string; prompt: string; fileName?: string }
): PersistedReport {
  return {
    ...normalizeReport(response.report),
    id: meta.id,
    createdAt: new Date().toISOString(),
    fileName: meta.fileName,
    prompt: meta.prompt,
    platform: response.platform,
    ...(response.agent_trace?.length ? { agent_trace: response.agent_trace } : {}),
    ...(response.crew_metrics ? { crew_metrics: response.crew_metrics } : {}),
  };
}

export function persistedToComplianceReport(report: PersistedReport): ComplianceReport {
  return normalizeReport(report);
}
