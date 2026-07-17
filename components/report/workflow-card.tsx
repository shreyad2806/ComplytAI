import type { AgentTrace } from "@/types";
import type { MergedReportStats } from "@/lib/report-stats";
import { isMeaningfulText } from "@/lib/report-stats";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const getAgentColor = (agent: string) => {
  if (agent.includes("Document Intelligence")) return "text-blue-400 bg-blue-500/10 border-blue-500/30";
  if (agent.includes("AML Investigation")) return "text-red-400 bg-red-500/10 border-red-500/30";
  if (agent.includes("Regulatory Compliance")) return "text-green-400 bg-green-500/10 border-green-500/30";
  if (agent.includes("Financial Risk")) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
  if (agent.includes("Compliance Review")) return "text-purple-400 bg-purple-500/10 border-purple-500/30";
  return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
};

const getAgentIconColor = (agent: string) => {
  if (agent.includes("Document Intelligence")) return "text-blue-400";
  if (agent.includes("AML Investigation")) return "text-red-400";
  if (agent.includes("Regulatory Compliance")) return "text-green-400";
  if (agent.includes("Financial Risk")) return "text-yellow-400";
  if (agent.includes("Compliance Review")) return "text-purple-400";
  return "text-cyan-400";
};

function ManagerSummary({ stats }: { stats: MergedReportStats }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-slate-300">
      <div>
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Merged</p>
        <ul className="space-y-1">
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-purple-400" />
            <span>
              <span className="font-semibold text-white">{stats.complianceIssues}</span> Compliance Issues
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-purple-400" />
            <span>
              <span className="font-semibold text-white">{stats.amlFindings}</span> AML Findings
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-purple-400" />
            <span>
              <span className="font-semibold text-white">{stats.auditFlags}</span> Audit Flags
            </span>
          </li>
        </ul>
      </div>
      <div>
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Evidence Coverage
        </p>
        <p>
          <span className="font-semibold text-white">{stats.supportingEvidence}</span> Supporting Evidence
        </p>
      </div>
    </div>
  );
}

function AgentSummary({ trace }: { trace: AgentTrace }) {
  if (!isMeaningfulText(trace.summary)) return null;

  if (trace.agent.includes("Manager")) {
    return null;
  }

  return <p className="text-sm leading-relaxed text-slate-300 opacity-90">{trace.summary}</p>;
}

export function WorkflowCard({
  trace,
  isAnalyzing,
  agentName,
  mergedStats,
}: {
  trace?: AgentTrace;
  isAnalyzing?: boolean;
  agentName?: string;
  mergedStats?: MergedReportStats;
}) {
  if (!trace) {
    return (
      <div className="flex h-full min-h-[160px] flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <Loader2 className="mb-3 h-6 w-6 animate-spin text-cyan-500/50" />
        <p className="text-sm font-medium text-slate-400">{isAnalyzing ? "Running..." : "Waiting"}</p>
        {agentName && <p className="mt-1 text-xs text-slate-600">{agentName}</p>}
      </div>
    );
  }

  const complete = trace.status.toLowerCase() === "completed";
  const Icon = complete ? CheckCircle2 : XCircle;
  const colorClass = getAgentColor(trace.agent);
  const iconColor = getAgentIconColor(trace.agent);
  const isManager = trace.agent.includes("Manager");

  const formatTime = (isoString?: string | null) => {
    if (!isoString) return "--:--:--";
    const d = new Date(isoString);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const evidenceCount = trace.evidence_count ?? 0;
  const findingsCount = trace.findings_count ?? 0;
  const showSummary =
    (isManager && mergedStats) || (!isManager && isMeaningfulText(trace.summary));

  return (
    <div className={`relative flex h-full flex-col rounded-xl border p-5 ${colorClass}`}>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 shrink-0 ${iconColor}`} />
          <h3 className="font-semibold text-white">{trace.agent}</h3>
        </div>
        <span className="rounded-full border border-current px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest opacity-80">
          {trace.status}
        </span>
      </div>

      {isMeaningfulText(trace.task) && (
        <div className="mb-5">
          <p className="mb-1 text-[10px] uppercase tracking-widest opacity-60">Task</p>
          <p className="text-sm font-medium text-slate-200">{trace.task}</p>
        </div>
      )}

      <div className="mb-5 grid grid-cols-2 gap-3 border-t border-current/10 pt-3">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-widest opacity-60">Started</p>
          <p className="text-sm font-medium text-slate-200">{formatTime(trace.started_at)}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-widest opacity-60">Finished</p>
          <p className="text-sm font-medium text-slate-200">{formatTime(trace.finished_at)}</p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-widest opacity-60">Duration</p>
          <p className="text-sm font-medium text-slate-200">
            {trace.duration_seconds ?? trace.duration}s
          </p>
        </div>
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-widest opacity-60">Evidence</p>
          <p className="text-sm font-medium text-slate-200">{evidenceCount}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-widest opacity-60">Findings</p>
          <p className="text-sm font-medium text-slate-200">{findingsCount}</p>
        </div>
      </div>

      {showSummary && (
        <div className="mt-auto border-t border-current/20 pt-4">
          <p className="mb-1 text-[10px] uppercase tracking-widest opacity-60">Summary</p>
          {isManager && mergedStats ? (
            <ManagerSummary stats={mergedStats} />
          ) : (
            <AgentSummary trace={trace} />
          )}
        </div>
      )}
    </div>
  );
}
