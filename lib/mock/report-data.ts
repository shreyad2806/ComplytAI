export type ReportSeverity = "critical" | "high" | "medium" | "low";

export type ReportMeta = {
  reportId: string;
  title: string;
  subtitle: string;
  generatedAt: string;
  documentsScanned: number;
  pagesScanned: number;
  engineVersion: string;
  corpusVersion: string;
  aiConfidence: number;
  clientName: string;
};

export const defaultReportMeta: ReportMeta = {
  reportId: "RPT-2025-0847",
  title: "AI Compliance Intelligence Analysis Report",
  subtitle: "Prepared for Meridian FinTech Holdings, Inc. • Fiscal Q4 2025",
  generatedAt: "Nov 13, 2025 • 09:42 UTC",
  documentsScanned: 14,
  pagesScanned: 2847,
  engineVersion: "Complyt v4.2",
  corpusVersion: "Nov 2025",
  aiConfidence: 96.4,
  clientName: "Meridian FinTech Holdings, Inc.",
};

export const executiveSummaryBody =
  "Analysis of **14 compliance documents** indicates **significant compliance exposure** with aggregate **$4.2M in regulatory exposure** across AML, KYC, and SOX control domains. Immediate escalation recommended for SAR-threshold activity and OFAC screening gaps.";

export const executiveFindingCards = [
  {
    variant: "critical" as const,
    title: "Critical Finding",
    description:
      "3 SAR-threshold transactions identified without timely SAR filing — FinCEN exposure within 72-hour window.",
    icon: "siren" as const,
  },
  {
    variant: "high" as const,
    title: "High Priority",
    description: "KYC documentation incomplete for 12 high-risk accounts; beneficial ownership gaps across two entities.",
    icon: "triangle" as const,
  },
  {
    variant: "regulatory" as const,
    title: "Regulatory Action",
    description: "SOX Section 404 deficiency in IT access controls — material weakness remediation required before Q4 close.",
    icon: "document" as const,
  },
];

export const complianceScoreGauge = {
  score: 74.8,
  label: "OVERALL COMPLIANCE SCORE",
  categories: [
    { name: "AML", value: 62, tone: "rose" as const },
    { name: "KYC/CDD", value: 71, tone: "amber" as const },
    { name: "SOX", value: 74, tone: "yellow" as const },
    { name: "OFAC", value: 91, tone: "cyan" as const },
    { name: "Basel III", value: 88, tone: "emerald" as const },
  ],
};

export const complianceKeyMetrics = [
  {
    title: "Risk Exposure",
    value: "$4.2M",
    sublabel: "Estimated regulatory exposure",
    badge: "CRITICAL",
    severity: "critical" as ReportSeverity,
    valueTone: "text-rose-300",
  },
  {
    title: "Audit Readiness",
    value: "67%",
    sublabel: "FFIEC exam preparedness",
    badge: "MEDIUM",
    severity: "medium" as ReportSeverity,
    valueTone: "text-amber-300",
  },
  {
    title: "Active Flags",
    value: "17",
    sublabel: "Open compliance flags",
    badge: "HIGH",
    severity: "high" as ReportSeverity,
    valueTone: "text-amber-300",
  },
  {
    title: "Controls Passing",
    value: "83%",
    sublabel: "84 of 101 controls verified",
    badge: "PASS",
    severity: "low" as ReportSeverity,
    valueTone: "text-emerald-300",
  },
];

export const riskAnalysisCards = [
  {
    category: "FINANCIAL RISK",
    title: "AML Transaction Anomalies",
    severity: "critical" as ReportSeverity,
    bullets: [
      "Structured wire transfers and round-dollar patterns consistent with layering activity across 3 beneficiary corridors.",
      "Outbound volume to 2 FATF grey-list jurisdictions totaling $1.8M without documented business rationale.",
      "Velocity anomaly: 3× baseline transaction frequency within 48-hour observation window.",
    ],
    confidence: 97.2,
  },
  {
    category: "CUSTOMER DUE DILIGENCE",
    title: "KYC/CDD Gaps",
    severity: "high" as ReportSeverity,
    bullets: [
      "Beneficial ownership documentation stale or missing for 12 legal entity accounts above risk threshold.",
      "EDD reviews overdue for 4 PEP-adjacent relationships; ID documents expired on 7 retail profiles.",
      "CDD refresh cycle misaligned with policy (annual vs. risk-based) across wholesale segment.",
    ],
    confidence: 92.5,
  },
  {
    category: "INTERNAL CONTROLS",
    title: "SOX Control Deficiencies",
    severity: "medium" as ReportSeverity,
    bullets: [
      "Segregation of duties violation in financial reporting workflow; single user holds incompatible roles.",
      "ITGC access reviews incomplete for ERP and data warehouse environments.",
      "Change management evidence gaps for 2 material system releases in Q3.",
    ],
    confidence: 89.1,
  },
  {
    category: "POLICY & PROCEDURE",
    title: "Policy Inconsistencies",
    severity: "medium" as ReportSeverity,
    bullets: [
      "AML procedures partially superseded; FinCEN advisory language from 2024 not incorporated into policy library.",
      "OFAC screening threshold misaligned with BSA/AML Examination Manual guidance.",
      "Retention schedules for SAR support documentation conflict between legal and compliance policies.",
    ],
    confidence: 86.4,
  },
];

export const auditFlagCards = [
  {
    id: "F-001",
    severity: "critical" as ReportSeverity,
    title: "SAR Filing Obligation — Immediate",
    body: "Transaction cluster TXN-2281–2284 exceeds structuring indicators; FinCEN filing window closing.",
    meta: ["Exposure: $287K", "48h deadline", "12 accounts", "Pending review"],
    icon: "alert" as const,
  },
  {
    id: "F-002",
    severity: "critical" as ReportSeverity,
    title: "OFAC Potential SDN Match",
    body: "Beneficiary name similarity ≥92% to SDN entry; wire halted pending escalation.",
    meta: ["$4.1M volume", "Hold status", "Legal review", "72h SLA"],
    icon: "globe" as const,
  },
  {
    id: "F-003",
    severity: "high" as ReportSeverity,
    title: "Beneficial Ownership Incomplete",
    body: "UBO chain breaks at intermediate holding company; no certified registry extract on file.",
    meta: ["12 accounts", "EDD queue", "Regulatory", "High risk"],
    icon: "search" as const,
  },
  {
    id: "F-004",
    severity: "high" as ReportSeverity,
    title: "SOX Material Weakness — IT Controls",
    body: "Privileged access to GL without periodic recertification; deficiency disclosed to audit committee.",
    meta: ["ITGC", "SOX 404", "Remediation", "Q4 target"],
    icon: "shield" as const,
  },
  {
    id: "F-005",
    severity: "medium" as ReportSeverity,
    title: "Transaction Velocity Anomaly",
    body: "Automated monitoring failed to score 14 related wires within 24h — calibration review required.",
    meta: ["Monitoring", "AML ops", "5 days", "Medium"],
    icon: "activity" as const,
  },
  {
    id: "F-006",
    severity: "medium" as ReportSeverity,
    title: "Offshore Entity Concentration",
    body: "Counterparty concentration in two offshore shells correlates with prior typology alerts.",
    meta: ["Geo risk", "Typology", "Review", "Exposure"],
    icon: "anchor" as const,
  },
];

export const aiRecommendations = [
  {
    index: "01",
    priority: "PRIORITY 1 • IMMEDIATE ACTION REQUIRED",
    title: "File FinCEN Suspicious Activity Reports for Transaction Clusters TXN-2281–2289",
    description:
      "Executive remediation: initiate SAR workflow within 48 hours; preserve records per 31 CFR 1020.320; notify AML committee and legal for parallel review.",
    tags: ["FinCEN", "BSA § 5318(g)", "SAR Filing", "AML"],
    deadline: "48 hours",
    effortBadge: "Critical",
    effortTone: "critical" as ReportSeverity,
    dot: "critical" as ReportSeverity,
  },
  {
    index: "02",
    priority: "PRIORITY 2 • HIGH EFFORT",
    title: "Initiate Enhanced Due Diligence on 12 High-Risk Accounts with Incomplete BO Documentation",
    description:
      "Collect certified registry extracts, refresh CDD questionnaires, and escalate PEP/sanctions hits to second-line before relationship expansion.",
    tags: ["KYC", "EDD", "Beneficial Ownership", "Regulatory"],
    deadline: "5 days",
    effortBadge: "High Effort",
    effortTone: "high" as ReportSeverity,
    dot: "high" as ReportSeverity,
  },
  {
    index: "03",
    priority: "PRIORITY 3 • MEDIUM EFFORT",
    title: "Remediate SOX Segregation of Duties Violation and Revoke Terminated Employee Access",
    description:
      "Reprovision ERP roles, complete emergency access review, and document compensating controls for quarter-end close.",
    tags: ["SOX", "ITGC", "Access", "Internal Audit"],
    deadline: "14 days",
    effortBadge: "Medium Effort",
    effortTone: "medium" as ReportSeverity,
    dot: "medium" as ReportSeverity,
  },
  {
    index: "04",
    priority: "PRIORITY 4 • STANDARD",
    title: "Update AML Policy to 2024 BSA/AML Examination Manual Standards and Calibrate Screening Thresholds",
    description:
      "Align OFAC and AML thresholds with FFIEC expectations; publish policy attestation to board risk committee.",
    tags: ["Policy", "FFIEC", "OFAC", "AML Program"],
    deadline: "30 days",
    effortBadge: "Standard",
    effortTone: "low" as ReportSeverity,
    dot: "low" as ReportSeverity,
  },
];

export const riskDistributionBars = [
  { name: "AML", value: 82, fill: "#f43f5e" },
  { name: "KYC", value: 71, fill: "#f97316" },
  { name: "SOX", value: 65, fill: "#eab308" },
  { name: "OFAC", value: 22, fill: "#22d3ee" },
  { name: "Basel", value: 18, fill: "#34d399" },
  { name: "Fraud", value: 74, fill: "#f43f5e" },
];

export const severityBreakdown = [
  { name: "Critical", value: 4, color: "#f43f5e" },
  { name: "High", value: 6, color: "#f97316" },
  { name: "Medium", value: 5, color: "#eab308" },
  { name: "Low", value: 2, color: "#34d399" },
];

export const complianceTrendPoints = [
  { label: "Q1 2025", score: 68.2 },
  { label: "Q2 2025", score: 70.1 },
  { label: "Q3 2025", score: 72.4 },
  { label: "Now", score: 74.8 },
];

export const operationalExposureBars = [
  { name: "FinCEN SAR", pct: 92, label: "72h", tone: "bg-rose-500" },
  { name: "FFIEC Prep", pct: 64, label: "18 days", tone: "bg-amber-500" },
  { name: "SOX Audit", pct: 38, label: "47 days", tone: "bg-emerald-500" },
  { name: "PCI-DSS", pct: 31, label: "63 days", tone: "bg-teal-400" },
];

export const strategicIntelligenceCards = [
  {
    kicker: "◆ COMPLYT AI • STRATEGIC ASSESSMENT",
    title: "The Path to Regulatory Resilience",
    body: `The institution is on a **measurable compliance improvement trajectory**, yet residual risk remains **structurally solvable** with **60–90 days of focused remediation** across AML monitoring, FFIEC readiness, and SOX ITGC. Prioritizing SAR workflow, EDD backlog clearance, and policy attestation will materially reduce regulatory exposure before the next examination cycle.`,
    footerLeft: "Business Impact: **High • Immediate**",
    footerBadge: "Strategic",
  },
  {
    kicker: "RISK INTELLIGENCE",
    title: "AML Monitoring Gap Creates Systemic Exposure",
    body: `A **transaction velocity anomaly** surfaced outside calibrated thresholds indicates **calibration failure** in **automated monitoring systems**. **Recalibrating thresholds** and replaying typology scenarios will reduce false negatives and align alerts with FinCEN expectations.`,
    footerLeft: "Impact: **AML Controls**",
    footerBadge: "Operational",
    icon: "shield" as const,
  },
  {
    kicker: "REGULATORY INTELLIGENCE",
    title: "FFIEC Examination Readiness: 67% — Key Gaps Identified",
    body: `Upcoming supervisory review will scrutinize **BSA/AML governance** and **beneficial ownership documentation**. Closing identified gaps improves exam narrative and supports management’s certification posture.`,
    footerLeft: "Impact: **Exam Risk**",
    footerBadge: "Regulatory",
    icon: "file" as const,
  },
];

export function getReportMeta(id: string): ReportMeta {
  const normalized = id.startsWith("RPT-") ? id : `RPT-${id}`;
  return {
    ...defaultReportMeta,
    reportId: normalized,
  };
}
