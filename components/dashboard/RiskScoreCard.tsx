"use client";

import type { ComplianceReport } from "@/types";

interface Props {
  report: ComplianceReport;
}

const riskColors = {
  Low: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
    ring: "#22c55e",
  },
  Medium: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    ring: "#eab308",
  },
  High: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-400",
    ring: "#f97316",
  },
  Critical: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    ring: "#ef4444",
  },
} as const;

export function RiskScoreCard({ report }: Props) {
  const levelRaw = report?.risk_level ?? "Medium";
  const level =
    levelRaw in riskColors
      ? (levelRaw as keyof typeof riskColors)
      : "Medium";
  const colors = riskColors[level] ?? riskColors.Medium;

  const scoreRaw = report?.risk_score;
  const scoreNum =
    typeof scoreRaw === "number"
      ? scoreRaw
      : typeof scoreRaw === "string"
        ? Number.parseFloat(scoreRaw)
        : 0;
  const score = Number.isFinite(scoreNum)
    ? Math.min(100, Math.max(0, scoreNum))
    : 0;

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  const summary =
    typeof report?.executive_summary === "string"
      ? report.executive_summary
      : "";

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-xl p-6`}>
      <p className="text-slate-400 text-sm font-medium mb-4">
        Overall Risk Score
      </p>

      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-700"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={colors.ring}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${colors.text}`}>{score}</span>
            <span className="text-slate-500 text-xs">/100</span>
          </div>
        </div>

        <div>
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text} mb-3`}
          >
            {String(levelRaw)} Risk
          </div>
          <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
            {summary || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
