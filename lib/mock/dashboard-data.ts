import { FileText, Scale, SearchCheck, ShieldAlert, Siren, TriangleAlert } from "lucide-react";

export const metricCards = [
  { title: "Compliance Score", value: "84.7", delta: "+2.1 vs last quarter", tone: "cyan" as const },
  { title: "Risk Exposure", value: "$2.4M", delta: "$0.3M 30d change", tone: "amber" as const },
  { title: "Audit Readiness", value: "91%", delta: "+5.0 since last audit", tone: "emerald" as const },
  { title: "Active Flags", value: "12", delta: "3 new since yesterday", tone: "rose" as const },
  { title: "AI Confidence", value: "96.2%", delta: "stable", tone: "cyan" as const },
];

export const auditFlags = [
  { title: "Suspicious Transaction Pattern - Account #8821", subtitle: "Multiple outbound transfers to offshore entities", ago: "2h ago", severity: "critical" as const },
  { title: "KYC Documentation Gap - 3 Accounts", subtitle: "Incomplete beneficial ownership verification", ago: "5h ago", severity: "high" as const },
  { title: "SOX Control Deficiency - Internal Audit", subtitle: "Segregation of duties conflict in reporting workflow", ago: "5h ago", severity: "high" as const },
  { title: "Regulatory Filing Deadline - FinCEN SAR", subtitle: "Suspicious Activity Report due in 72 hours", ago: "9h ago", severity: "med" as const },
  { title: "OFAC Sanction Match - Transaction #TXN-2284", subtitle: "Potential match against SDN list", ago: "1d ago", severity: "critical" as const },
];

export const analysisCards = [
  {
    title: "Overall Assessment",
    level: "high risk",
    bullets: [
      "Document exhibits elevated AML risk indicators across 3 transaction clusters requiring immediate escalation.",
      "SOX compliance posture at 74% - below organization threshold of 85%. Control remediation advised.",
      "4 regulatory deadlines identified in next 30-day window with 2 in critical status.",
    ],
    score: "94.8",
  },
  {
    title: "Transaction Anomalies",
    level: "critical",
    bullets: [
      "Round-number transactions ($50K, $100K, $200K) flagged as structuring indicators per 31 CFR 1010.314.",
      "Offshore wire transfers to 2 FATF grey-list jurisdictions totaling $1.8M without documented business purpose.",
      "Velocity anomaly: 3x normal transaction frequency detected in 48-hour window.",
    ],
    score: "97.2",
  },
  {
    title: "Action Items",
    level: "7 items",
    bullets: [
      "File FinCEN SAR within 72-hour window for transaction cluster TXN-2281 through TXN-2288.",
      "Initiate enhanced due diligence on 3 high-risk accounts with incomplete beneficial ownership data.",
      "Schedule internal SOX control review for financial reporting workflow by Q4 close.",
      "Update OFAC screening procedures to include latest SDN list.",
    ],
    score: "89.4",
  },
];

export const historyRows = [
  ["Q3 AML Compliance Report", "AML / FinCEN", "74.2", "High", "5", "Flagged", "14 min ago"],
  ["Internal Audit Memo - Oct 2025", "SOX / Internal", "91.5", "Low", "2", "Review", "1 hour ago"],
  ["KYC Verification Batch - 142 accounts", "KYC / CDD", "68.0", "Critical", "14", "Pending", "5 hours ago"],
  ["Risk Assessment Framework v2.4", "Enterprise Risk", "88.7", "Med", "4", "Clear", "Yesterday"],
  ["OFAC Screening Report - Nov 2025", "OFAC / Sanctions", "95.1", "Low", "1", "Clear", "2 days ago"],
];

export const quickIntelligence = [
  { title: "AML Compliance Requirements", subtitle: "Bank Secrecy Act, FinCEN, CTR/SAR triggers", icon: FileText },
  { title: "SOX Risk Analysis", subtitle: "Internal controls and financial reporting checks", icon: Scale },
  { title: "KYC Validation Checks", subtitle: "CDD standards and beneficial ownership rules", icon: SearchCheck },
  { title: "Fraud Indicators", subtitle: "Pattern detection and anomaly thresholds", icon: Siren },
  { title: "Regulatory Policy Analysis", subtitle: "Cross-reference rules to policy implementation", icon: ShieldAlert },
  { title: "Audit Readiness Checklist", subtitle: "Remediation priorities and control coverage", icon: TriangleAlert },
];

export const regulations = [
  "Bank Secrecy Act (BSA)",
  "FinCEN AML Rule 2024",
  "SOX Section 302/404",
  "OFAC SDN Compliance",
  "Basel III Capital Rules",
  "Dodd-Frank §1B",
];
