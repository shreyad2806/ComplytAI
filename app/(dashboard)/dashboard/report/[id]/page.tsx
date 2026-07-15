"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { useComplytStore } from "@/store/useComplytStore";
import { useReportsStore } from "@/store/useReportsStore";

import { FindingConfidence } from "@/components/dashboard/FindingConfidence";
import { FindingEvidenceAccordion } from "@/components/dashboard/FindingEvidenceAccordion";
import { RiskScoreCard } from "@/components/dashboard/RiskScoreCard";
import { AgentTraceTimeline } from "@/components/report/agent-trace-timeline";
import { persistedToComplianceReport } from "@/lib/normalize-report";
import { computeMergedReportStats, isMeaningfulText } from "@/lib/report-stats";

import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Flag,
  Lightbulb,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

const severityColors = {
  critical: "bg-red-500 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-black",
  low: "bg-green-500 text-black",
} as const;

const severityIconColors = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-green-400",
} as const;

function hasRenderableText(value: unknown): value is string {
  return isMeaningfulText(value);
}

function auditFlagIcon(severity: string) {
  switch (severity.toUpperCase()) {
    case "CRITICAL":
      return AlertTriangle;
    case "HIGH":
      return ShieldAlert;
    case "MEDIUM":
      return Flag;
    default:
      return ShieldCheck;
  }
}

function complianceStatusClass(status: string): string {
  const s = status.toLowerCase().replace(/-/g, "_");

  if (s === "open") {
    return "text-red-400 bg-red-500/10 border-red-500/30";
  }

  if (s === "in_review") {
    return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
  }

  return "text-green-400 bg-green-500/10 border-green-500/30";
}

/**
 * Wait until Zustand persistence has hydrated.
 * This prevents SSR/CSR HTML mismatches.
 */
function useReportsHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persist = useReportsStore.persist;
    const markHydrated = () => {
      queueMicrotask(() => setHydrated(true));
    };

    if (!persist) {
      markHydrated();
      return;
    }

    if (persist.hasHydrated()) {
      markHydrated();
      return;
    }

    const unsub = persist.onFinishHydration(markHydrated);

    return () => {
      if (typeof unsub === "function") {
        unsub();
      }
    };
  }, []);

  return hydrated;
}

export default function ReportPage() {
  const router = useRouter();
  const params = useParams();

  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : undefined;

  const hydrated = useReportsHydrated();

  // Only access persisted store AFTER hydration
  const persisted = useReportsStore((state) => {
    if (!hydrated || !id) return undefined;
    return state.getReport(id);
  });

  const { clearReport } = useComplytStore();

  const normalizedReport = useMemo(() => {
    if (!persisted) return null;
    return persistedToComplianceReport(persisted);
  }, [persisted]);

  const mergedStats = useMemo(() => {
    if (!normalizedReport) return undefined;
    return computeMergedReportStats(normalizedReport, persisted?.agent_trace ?? []);
  }, [normalizedReport, persisted?.agent_trace]);

  // First render is identical on server/client
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading report...
      </div>
    );
  }

  if (!id || !persisted || !normalizedReport) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <p className="text-slate-400 mb-4">
            Report not found.
          </p>

          <p className="text-slate-500 text-sm mb-6">
            This analysis may have been removed or never saved in this browser.
          </p>

          <button
            type="button"
            onClick={() => router.push("/dashboard/copilot")}
            className="px-4 py-2 bg-blue-600 rounded-lg text-white text-sm"
          >
            Go to AI Copilot
          </button>
        </div>
      </div>
    );
  }

  const r = normalizedReport;
  const financialRisks = r.financial_risks.filter(
    (risk) => hasRenderableText(risk.title) || hasRenderableText(risk.description)
  );
  const complianceIssues = r.compliance_issues.filter(
    (issue) => hasRenderableText(issue.title) || hasRenderableText(issue.description)
  );
  const auditFlags = r.audit_flags.filter(
    (flag) => hasRenderableText(flag.title) || hasRenderableText(flag.description)
  );
  const recommendations = r.recommendations.filter(
    (recommendation) =>
      hasRenderableText(recommendation.title) ||
      hasRenderableText(recommendation.description)
  );
  const keyInsights = r.key_insights.filter(
    (insight) =>
      hasRenderableText(insight.title) || hasRenderableText(insight.description)
  );
  const reportSource = hasRenderableText(persisted.fileName)
    ? persisted.fileName
    : hasRenderableText(persisted.prompt)
      ? persisted.prompt.slice(0, 80)
      : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              clearReport();
              router.push("/dashboard");
            }}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
          <div className="w-px h-4 bg-slate-700" />
          <div>
            <h1 className="font-semibold text-white">Compliance Report</h1>
            {reportSource && (
              <p className="text-slate-500 text-xs">{reportSource}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 border border-slate-700 hover:border-slate-500 text-slate-300 rounded-lg text-sm transition-colors"
        >
          Export PDF
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Debug output removed — never display raw JSON in the UI. */}

        <RiskScoreCard report={r} />

        <AgentTraceTimeline 
          trace={persisted.agent_trace ?? []} 
          metrics={persisted.crew_metrics} 
          mergedStats={mergedStats}
        />

        {hasRenderableText(r.executive_summary) && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Executive Summary
            </h2>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <p className="text-slate-300 leading-relaxed">{r.executive_summary}</p>
            </div>
          </section>
        )}

        {keyInsights.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Key Insights
            </h2>
            <div className="grid gap-3">
              {keyInsights.map((insight, i) => (
                <div key={`${insight.title.slice(0, 40)}-${i}`} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex-1 pr-4">
                      {hasRenderableText(insight.title) && (
                        <h3 className="font-medium text-white">{insight.title}</h3>
                      )}
                      {hasRenderableText(insight.description) && (
                        <p className="mt-1 text-sm text-slate-400">{insight.description}</p>
                      )}
                    </div>
                    {hasRenderableText(insight.severity) && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${complianceStatusClass(insight.severity)}`}>
                        {insight.severity}
                      </span>
                    )}
                  </div>
                  <FindingEvidenceAccordion
                    matchedDocumentText={insight.matched_document_text}
                    matchedRegulation={insight.matched_regulation}
                    selectionReason={insight.selection_reason}
                    retrievedContext={insight.retrieved_context}
                    excerpts={insight.source_excerpts}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {financialRisks.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Financial Risks ({financialRisks.length})
            </h2>
            <div className="grid gap-3">
              {financialRisks.map((risk, i) => {
                const sevClass = severityColors[risk.severity.toLowerCase() as keyof typeof severityColors] ?? "bg-yellow-500 text-black";
                const estimatedImpact = hasRenderableText(risk.financial_exposure)
                  ? risk.financial_exposure
                  : risk.business_impact;

                return (
                  <div key={`${risk.title.slice(0, 40)}-${i}`} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      {hasRenderableText(risk.title) && (
                        <h3 className="font-medium text-white">{risk.title}</h3>
                      )}
                      {hasRenderableText(risk.severity) && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${sevClass}`}>
                          {risk.severity.toUpperCase()}
                        </span>
                      )}
                    </div>
                    {hasRenderableText(risk.description) && (
                      <p className="text-slate-400 text-sm">{risk.description}</p>
                    )}
                    {hasRenderableText(estimatedImpact) && (
                      <p className="text-orange-400 text-sm mt-2 font-medium">Estimated Impact: {estimatedImpact}</p>
                    )}
                    {hasRenderableText(risk.regulation) && (
                      <p className="text-blue-400 text-xs mt-2">{risk.regulation}</p>
                    )}
                    <FindingConfidence value={risk.confidence_score} />
                    <FindingEvidenceAccordion
                      matchedDocumentText={risk.matched_document_text}
                      matchedRegulation={risk.matched_regulation}
                      selectionReason={risk.selection_reason}
                      retrievedContext={risk.retrieved_context}
                      excerpts={risk.source_excerpts}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {complianceIssues.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-400" />
              Compliance Issues ({complianceIssues.length})
            </h2>
            <div className="space-y-3">
              {complianceIssues.map((issue, i) => (
                <div key={`${issue.title.slice(0, 40)}-${i}`} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex-1 pr-4">
                      {hasRenderableText(issue.title) && (
                        <h3 className="font-medium text-white">{issue.title}</h3>
                      )}
                      {hasRenderableText(issue.description) && (
                        <p className="mt-1 text-sm text-slate-400">{issue.description}</p>
                      )}
                    </div>
                    {hasRenderableText(issue.severity) && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${complianceStatusClass(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    )}
                  </div>
                  {hasRenderableText(issue.regulation) && (
                    <p className="text-blue-400 text-xs">{issue.regulation}</p>
                  )}
                  <FindingConfidence value={issue.confidence_score} />
                  <FindingEvidenceAccordion
                    matchedDocumentText={issue.matched_document_text}
                    matchedRegulation={issue.matched_regulation}
                    selectionReason={issue.selection_reason}
                    retrievedContext={issue.retrieved_context}
                    excerpts={issue.source_excerpts}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {auditFlags.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Flag className="w-5 h-5 text-purple-400" />
              Audit Flags ({auditFlags.length})
            </h2>
            <div className="space-y-3">
              {auditFlags.map((flag, i) => {
                const severityKey = flag.severity.toLowerCase() as keyof typeof severityColors;
                const AuditIcon = auditFlagIcon(flag.severity);
                const severityClass = severityColors[severityKey] ?? severityColors.low;
                const iconClass = severityIconColors[severityKey] ?? severityIconColors.low;

                return (
                  <div key={`${flag.title.slice(0, 40)}-${i}`} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <AuditIcon className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          {hasRenderableText(flag.title) && (
                            <h3 className="font-medium text-white">{flag.title}</h3>
                          )}
                          {hasRenderableText(flag.severity) && (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${severityClass}`}>
                              {flag.severity}
                            </span>
                          )}
                        </div>
                        {hasRenderableText(flag.description) && (
                          <p className="mt-1 text-slate-400 text-sm">{flag.description}</p>
                        )}
                        {hasRenderableText(flag.control) && (
                          <p className="mt-2 text-blue-400 text-xs">Relevant Control: {flag.control}</p>
                        )}
                      </div>
                    </div>
                    <FindingConfidence value={flag.confidence_score} />
                    <FindingEvidenceAccordion
                      matchedDocumentText={flag.matched_document_text}
                      matchedRegulation={flag.matched_regulation}
                      selectionReason={flag.selection_reason}
                      retrievedContext={flag.retrieved_context}
                      excerpts={flag.source_excerpts}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {recommendations.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-green-400" />
              Recommendations ({recommendations.length})
            </h2>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={`${rec.title.slice(0, 40)}-${i}`} className="border rounded-xl p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {hasRenderableText(rec.title) && (
                        <h3 className="font-medium text-sm">{rec.title}</h3>
                      )}
                      {hasRenderableText(rec.description) && (
                        <p className="mt-1 text-sm text-slate-400">{rec.description}</p>
                      )}
                    </div>
                    {hasRenderableText(rec.priority) && (
                      <span className="text-xs text-slate-400">{rec.priority}</span>
                    )}
                  </div>
                  {hasRenderableText(rec.timeline) && (
                    <p className="mt-2 text-xs text-cyan-400">{rec.timeline}</p>
                  )}
                  <FindingEvidenceAccordion
                    matchedDocumentText={rec.matched_document_text}
                    matchedRegulation={rec.matched_regulation}
                    selectionReason={rec.selection_reason}
                    retrievedContext={rec.retrieved_context}
                    excerpts={rec.source_excerpts}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
