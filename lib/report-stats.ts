import type { AgentTrace, ComplianceReport } from "@/types";

const PLACEHOLDER_VALUES = new Set(["not found", "unknown", "n/a", "—", ""]);

export function isMeaningfulText(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return !PLACEHOLDER_VALUES.has(value.trim().toLowerCase());
}

function countValidExcerpts(items: { source_excerpts?: { text: string }[] }[]): number {
  return items.reduce((total, item) => {
    const excerpts = item.source_excerpts ?? [];
    return total + excerpts.filter((excerpt) => isMeaningfulText(excerpt.text)).length;
  }, 0);
}

export type MergedReportStats = {
  complianceIssues: number;
  amlFindings: number;
  auditFlags: number;
  supportingEvidence: number;
};

export function computeMergedReportStats(
  report: ComplianceReport,
  trace: AgentTrace[] = []
): MergedReportStats {
  const amlTrace = trace.find((entry) => entry.agent.includes("AML Investigation"));
  const managerTrace = trace.find((entry) => entry.agent.includes("Compliance Review"));

  const allFindingItems = [
    ...report.key_insights,
    ...report.financial_risks,
    ...report.compliance_issues,
    ...report.audit_flags,
    ...report.recommendations,
  ];

  const excerptCount = countValidExcerpts(allFindingItems);

  return {
    complianceIssues: report.compliance_issues.filter(
      (issue) => isMeaningfulText(issue.title) || isMeaningfulText(issue.description)
    ).length,
    amlFindings: amlTrace?.findings_count ?? 0,
    auditFlags: report.audit_flags.filter(
      (flag) => isMeaningfulText(flag.title) || isMeaningfulText(flag.description)
    ).length,
    supportingEvidence: managerTrace?.evidence_count ?? excerptCount,
  };
}
