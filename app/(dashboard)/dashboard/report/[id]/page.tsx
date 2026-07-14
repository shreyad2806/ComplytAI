"use client";

import { useComplytStore } from "@/store/useComplytStore";
import { useReportsStore } from "@/store/useReportsStore";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { RiskScoreCard } from "@/components/dashboard/RiskScoreCard";
import { persistedToComplianceReport } from "@/lib/normalize-report";
import {
  AlertTriangle,
  ShieldCheck,
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

function complianceStatusClass(status: string): string {
  const s = status.toLowerCase().replace(/-/g, "_");
  if (s === "open")
    return "text-red-400 bg-red-500/10 border-red-500/30";
  if (s === "in_review")
    return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
  return "text-green-400 bg-green-500/10 border-green-500/30";
}

function useReportsHydrated(): boolean {
  const [ok, setOk] = useState(() => useReportsStore.persist?.hasHydrated?.() ?? true);
  useEffect(() => {
    const unsub = useReportsStore.persist?.onFinishHydration?.(() => {
      setOk(true);
    });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);
  return ok;
}

export default function ReportPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : params?.id?.[0];
  const hydrated = useReportsHydrated();
  const persisted = useReportsStore((s) => (id ? s.getReport(id) : undefined));
  const { clearReport } = useComplytStore();
  const router = useRouter();

  const normalizedReport = useMemo(
    () => (persisted ? persistedToComplianceReport(persisted) : null),
    [persisted]
  );


  if (!hydrated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading report…
      </div>
    );
  }

  if (!id || !persisted || !normalizedReport) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <p className="text-slate-400 mb-4">Report not found.</p>
          <p className="text-slate-500 text-sm mb-6">
            This analysis may have been removed or never saved in this browser.
          </p>
          <button
            type="button"
            onClick={() => router.push("/dashboard/copilot")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            Go to AI Copilot
          </button>
        </div>
      </div>
    );
  }

  const r = normalizedReport;
  const financialRisks = r?.financial_risks ?? [];
  const complianceIssues = r?.compliance_issues ?? [];
  const auditFlags = r?.audit_flags ?? [];
  const recommendations = r?.recommendations ?? [];
  const keyInsights = r?.key_insights ?? [];

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
            <p className="text-slate-500 text-xs">
              {persisted.fileName ?? persisted.prompt?.slice(0, 80) ?? "—"}
            </p>
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

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">AI Confidence</p>
          <p className="mt-1 text-2xl font-semibold text-cyan-300">{r.confidence_score}%</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Executive Summary
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-slate-300 leading-relaxed">
              {r?.executive_summary ?? "—"}
            </p>
          </div>
        </section>

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
                      <h3 className="font-medium text-white">{insight.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{insight.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${complianceStatusClass(insight.severity)}`}>
                      {insight.severity}
                    </span>
                  </div>
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
                const sevClass = severityColors[String(risk?.severity ?? "").toLowerCase() as keyof typeof severityColors] ?? "bg-yellow-500 text-black";
                return (
                  <div key={`${String(risk?.title ?? "untitled").slice(0, 40)}-${i}`} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className="font-medium text-white">{risk?.title ?? "—"}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${sevClass}`}>
                        {String(risk?.severity ?? "unknown").toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{risk?.description ?? "—"}</p>
                    {risk?.financial_exposure != null && String(risk.financial_exposure).length > 0 && (
                      <p className="text-orange-400 text-sm mt-2 font-medium">Exposure: {String(risk.financial_exposure)}</p>
                    )}
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
                      <h3 className="font-medium text-white">{issue.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{issue.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${complianceStatusClass(issue.severity)}`}>
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-blue-400 text-xs">{issue.regulation}</p>
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
              {auditFlags.map((flag, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white">{flag?.title ?? "—"}</h3>
                    <span className="text-xs uppercase font-semibold opacity-70">{String(flag?.severity ?? "").replace(/_/g, " ")}</span>
                  </div>
                </div>
              ))}
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
                      <h3 className="font-medium text-sm">{rec.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{rec.description}</p>
                    </div>
                    <span className="text-xs text-slate-400">{rec.priority}</span>
                  </div>
                  <p className="mt-2 text-xs text-cyan-400">{rec.timeline}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
