import type { PersistedReport } from "@/lib/normalize-report";
import type { RiskItem } from "@/types";

export type MetricCardData = {
  title: string;
  value: string;
  delta: string;
  tone: "cyan" | "amber" | "emerald" | "rose";
};

function avgRiskScore(reports: PersistedReport[]): number {
  if (!reports.length) return 0;
  const sum = reports.reduce((a, r) => a + (Number(r.risk_score) || 0), 0);
  return Math.round((sum / reports.length) * 10) / 10;
}

function totalOpenIssues(reports: PersistedReport[]): number {
  return reports.reduce((acc, r) => {
    const issues = Array.isArray(r.compliance_issues) ? r.compliance_issues : [];
    const open = issues.filter((it: unknown) => {
      const s = String(
        (it as { status?: string })?.status ?? "open"
      ).toLowerCase();
      return s === "open" || s.includes("pending");
    });
    return acc + open.length;
  }, 0);
}

function totalAuditFlags(reports: PersistedReport[]): number {
  return reports.reduce((acc, r) => {
    const f = Array.isArray(r.audit_flags) ? r.audit_flags : [];
    return acc + f.length;
  }, 0);
}

function totalFinancialRisks(reports: PersistedReport[]): number {
  return reports.reduce((acc, r) => {
    const x = Array.isArray(r.financial_risks) ? r.financial_risks : [];
    return acc + x.length;
  }, 0);
}

/** Top KPI row for dashboard metric cards. */
export function selectDashboardMetrics(reports: PersistedReport[]): MetricCardData[] {
  if (!reports.length) {
    return [
      { title: "Compliance Score", value: "—", delta: "No analyses yet", tone: "cyan" },
      { title: "Risk Exposure", value: "—", delta: "Run AI Copilot", tone: "amber" },
      { title: "Audit Readiness", value: "—", delta: "No data", tone: "emerald" },
      { title: "Active Flags", value: "0", delta: "Across all reports", tone: "rose" },
      { title: "AI Confidence", value: "—", delta: "After first run", tone: "cyan" },
    ];
  }

  const latest = reports[0];
  const score = Number(latest.risk_score) || 0;
  const complianceScore = Math.max(0, Math.min(100, 100 - score));
  const avg = avgRiskScore(reports);
  const flags = totalAuditFlags(reports);
  const risks = totalFinancialRisks(reports);
  const open = totalOpenIssues(reports);
  const readiness = Math.max(
    0,
    Math.min(100, Math.round(100 - open * 3 - risks * 1.5))
  );
  const confidence = Math.max(
    70,
    Math.min(99, Math.round(100 - Math.abs(score - avg) / 2))
  );

  return [
    {
      title: "Compliance Score",
      value: `${complianceScore}`,
      delta: `Avg risk score ${avg} · ${reports.length} report(s)`,
      tone: "cyan",
    },
    {
      title: "Risk Exposure",
      value: `${score}`,
      delta: `Latest: ${latest.risk_level ?? "—"} · ${risks} financial risk(s)`,
      tone: "amber",
    },
    {
      title: "Audit Readiness",
      value: `${readiness}%`,
      delta: `${open} open issue(s) · ${flags} flag(s)`,
      tone: "emerald",
    },
    {
      title: "Active Flags",
      value: `${flags}`,
      delta: `${reports.length} saved report(s)`,
      tone: "rose",
    },
    {
      title: "AI Confidence",
      value: `${confidence}%`,
      delta: "Derived from score stability vs history",
      tone: "cyan",
    },
  ];
}

export type PieDatum = { name: string; value: number; color: string };

/** Aggregate financial risk severities across all reports (pie counts). */
export function selectRiskDistribution(reports: PersistedReport[]): PieDatum[] {
  const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  for (const r of reports) {
    const list = (Array.isArray(r.financial_risks) ? r.financial_risks : []) as RiskItem[];
    for (const item of list) {
      const sev = String(item?.severity ?? "medium").toLowerCase();
      if (sev === "critical") counts.Critical += 1;
      else if (sev === "high") counts.High += 1;
      else if (sev === "low") counts.Low += 1;
      else counts.Medium += 1;
    }
  }
  const total = counts.Critical + counts.High + counts.Medium + counts.Low;
  if (!total) {
    return [
      { name: "Critical", value: 0, color: "#f43f5e" },
      { name: "High", value: 0, color: "#f59e0b" },
      { name: "Medium", value: 0, color: "#eab308" },
      { name: "Low", value: 0, color: "#14b8a6" },
    ];
  }
  return [
    { name: "Critical", value: counts.Critical, color: "#f43f5e" },
    { name: "High", value: counts.High, color: "#f59e0b" },
    { name: "Medium", value: counts.Medium, color: "#eab308" },
    { name: "Low", value: counts.Low, color: "#14b8a6" },
  ];
}

export type TrendDatum = { month: string; score: number };

/** Risk score over time (newest last for left-to-right trend). */
export function selectRiskTrend(reports: PersistedReport[]): TrendDatum[] {
  const sorted = [...reports].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  if (!sorted.length) {
    return [{ month: "—", score: 0 }];
  }
  return sorted.map((r) => {
    const d = new Date(r.createdAt);
    const month = `${d.getMonth() + 1}/${d.getDate()}`;
    return { month, score: Number(r.risk_score) || 0 };
  });
}

const CATEGORY_KEYS = ["AML", "KYC", "SOX", "OFAC", "Fraud", "Basel", "Dodd"] as const;

/** Count keyword hits in compliance + risk text (bar chart). */
export function selectCategoryCounts(reports: PersistedReport[]): { name: string; v: number }[] {
  const counts: Record<string, number> = Object.fromEntries(
    CATEGORY_KEYS.map((k) => [k, 0])
  );
  const haystack = (txt: string) => txt.toUpperCase();
  for (const r of reports) {
    const issues = Array.isArray(r.compliance_issues) ? r.compliance_issues : [];
    const risks = Array.isArray(r.financial_risks) ? r.financial_risks : [];
    for (const it of issues) {
      const o = it as { issue?: string; regulation?: string };
      const t = haystack(`${o?.issue ?? ""} ${o?.regulation ?? ""}`);
      for (const k of CATEGORY_KEYS) {
        if (t.includes(k)) counts[k] += 1;
      }
    }
    for (const it of risks) {
      const o = it as { title?: string; description?: string };
      const t = haystack(`${o?.title ?? ""} ${o?.description ?? ""}`);
      for (const k of CATEGORY_KEYS) {
        if (t.includes(k)) counts[k] += 1;
      }
    }
  }
  const max = Math.max(1, ...Object.values(counts));
  return CATEGORY_KEYS.map((name) => ({
    name,
    v: Math.min(100, Math.round((counts[name] / max) * 100)),
  }));
}

export type AuditBar = { label: string; value: string; width: string; color: string };

/** Synthetic “timeline” bars from recommendation urgency + open issues. */
export function selectAuditExposureBars(reports: PersistedReport[]): AuditBar[] {
  if (!reports.length) {
    return [
      { label: "No analyses yet", value: "—", width: "8%", color: "bg-zinc-600" },
    ];
  }
  const latest = reports[0];
  const recs = Array.isArray(latest.recommendations) ? latest.recommendations : [];
  const immediate = recs.filter(
    (x: unknown) =>
      String((x as { priority?: string })?.priority ?? "")
        .toLowerCase()
        .includes("immediate")
  ).length;
  const issues = Array.isArray(latest.compliance_issues)
    ? latest.compliance_issues.length
    : 0;
  const flags = Array.isArray(latest.audit_flags) ? latest.audit_flags.length : 0;
  const score = Number(latest.risk_score) || 0;

  return [
    {
      label: "Immediate actions",
      value: `${immediate} item(s)`,
      width: `${Math.min(100, immediate * 20 + 20)}%`,
      color: "bg-rose-400",
    },
    {
      label: "Open compliance issues",
      value: `${issues}`,
      width: `${Math.min(100, issues * 12 + 15)}%`,
      color: "bg-amber-400",
    },
    {
      label: "Audit flags (latest)",
      value: `${flags}`,
      width: `${Math.min(100, flags * 10 + 10)}%`,
      color: "bg-emerald-400",
    },
    {
      label: "Latest risk score",
      value: `${score}`,
      width: `${Math.min(100, score)}%`,
      color: "bg-teal-400",
    },
  ];
}

export type AnalysisCardVM = {
  title: string;
  level: string;
  bullets: string[];
  score: string;
};

/** Three summary cards from latest report (fallback empty). */
export function selectAnalysisCards(reports: PersistedReport[]): AnalysisCardVM[] {
  if (!reports.length) {
    return [
      { title: "Overall Assessment", level: "no data", bullets: ["Run an analysis from AI Copilot to populate this workspace."], score: "—" },
      { title: "Risk signals", level: "—", bullets: ["No financial risks recorded yet."], score: "—" },
      { title: "Action items", level: "—", bullets: ["No recommendations yet."], score: "—" },
    ];
  }
  const latest = reports[0];
  const summary = latest.executive_summary || "—";
  const summaryBullets = summary
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);
  const risks = (Array.isArray(latest.financial_risks) ? latest.financial_risks : []) as {
    title?: string;
  }[];
  const riskBullets = risks
    .map((x) => x?.title)
    .filter(Boolean)
    .slice(0, 4) as string[];
  const recs = (Array.isArray(latest.recommendations) ? latest.recommendations : []) as {
    action?: string;
  }[];
  const recBullets = recs
    .map((x) => x?.action)
    .filter(Boolean)
    .slice(0, 4) as string[];

  return [
    {
      title: "Overall Assessment",
      level: `${latest.risk_level ?? "Unknown"} risk`.toLowerCase(),
      bullets: summaryBullets.length ? summaryBullets : [summary],
      score: String(latest.risk_score ?? "—"),
    },
    {
      title: "Financial / operational signals",
      level: `${risks.length} risk(s)`,
      bullets: riskBullets.length ? riskBullets : ["No structured financial risks in the latest report."],
      score: String(latest.risk_score ?? "—"),
    },
    {
      title: "Action items",
      level: `${recs.length} recommendation(s)`,
      bullets: recBullets.length ? recBullets : ["No recommendations in the latest report."],
      score: String(Math.min(99, 70 + (recs.length || 0) * 3)),
    },
  ];
}

export type AuditFlagVM = {
  title: string;
  subtitle: string;
  ago: string;
  severity: "critical" | "high" | "med" | "low";
};

function ago(iso: string): string {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "—";
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function flagSeverity(details: string, category: string): AuditFlagVM["severity"] {
  const t = `${details} ${category}`.toLowerCase();
  if (t.includes("critical") || t.includes("urgent")) return "critical";
  if (t.includes("high") || t.includes("sanction")) return "high";
  if (t.includes("low") || t.includes("clear")) return "low";
  return "med";
}

/** Latest audit flags across recent reports (max 5). */
export function selectAuditFlagsPanel(reports: PersistedReport[]): AuditFlagVM[] {
  const out: AuditFlagVM[] = [];
  for (const r of reports) {
    const flags = Array.isArray(r.audit_flags) ? r.audit_flags : [];
    for (const f of flags) {
      const o = f as { flag?: string; details?: string; category?: string };
      const title = o?.flag ?? "Flag";
      const subtitle = o?.details ?? "";
      const category = o?.category ?? "";
      out.push({
        title,
        subtitle: subtitle || category || "—",
        ago: ago(r.createdAt),
        severity: flagSeverity(subtitle, category),
      });
      if (out.length >= 5) return out;
    }
  }
  if (!out.length) {
    return [
      {
        title: "No audit flags yet",
        subtitle: "Run an analysis to populate active audit signals.",
        ago: "—",
        severity: "low",
      },
    ];
  }
  return out;
}
