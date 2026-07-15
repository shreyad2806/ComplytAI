"use client";

import { useComplytStore } from "@/store/useComplytStore";
import type { AgentTrace, CrewMetrics } from "@/types";
import type { MergedReportStats } from "@/lib/report-stats";
import { isMeaningfulText } from "@/lib/report-stats";
import { WorkflowGraph } from "./workflow-graph";
import { Clock, Users, ShieldAlert, FileSearch } from "lucide-react";

type AgentTraceTimelineProps = {
  trace: AgentTrace[];
  metrics?: CrewMetrics | null;
  mergedStats?: MergedReportStats;
};

export function AgentTraceTimeline({ trace, metrics, mergedStats }: AgentTraceTimelineProps) {
  const { isAnalyzing } = useComplytStore();

  if (!trace.length && !isAnalyzing) return null;

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-white">Agent Execution Pipeline</h2>
      
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Runtime</p>
            </div>
            <p className="text-xl font-semibold text-white">{metrics.crew_total_duration_seconds}s</p>
            <p className="text-xs text-slate-500 mt-1">Avg {metrics.average_agent_duration_seconds}s per agent</p>
          </div>
          
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Agent Speeds</p>
            </div>
            <p className="text-[13px] text-slate-300">Fastest: <span className="font-medium text-white">{isMeaningfulText(metrics.fastest_agent) ? metrics.fastest_agent : "—"}</span></p>
            <p className="text-[13px] text-slate-300 mt-1">Slowest: <span className="font-medium text-white">{isMeaningfulText(metrics.slowest_agent) ? metrics.slowest_agent : "—"}</span></p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Findings</p>
            </div>
            <p className="text-xl font-semibold text-white">{metrics.total_findings}</p>
            <p className="text-xs text-slate-500 mt-1">Across all specializations</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileSearch className="w-4 h-4 text-blue-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Evidence Collected</p>
            </div>
            <p className="text-xl font-semibold text-white">{metrics.total_evidence}</p>
            <p className="text-xs text-slate-500 mt-1">Grounded excerpts</p>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-2 sm:p-6 overflow-x-auto flex justify-center">
        <div className="min-w-[600px] w-full">
           <WorkflowGraph trace={trace} isAnalyzing={isAnalyzing} mergedStats={mergedStats} />
        </div>
      </div>
    </section>
  );
}
