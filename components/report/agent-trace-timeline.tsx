import { CheckCircle2, XCircle } from "lucide-react";

import type { AgentTrace } from "@/types";

type AgentTraceTimelineProps = {
  trace: AgentTrace[];
};

function formatDuration(seconds: number): string {
  return `${seconds < 10 ? seconds.toFixed(1) : Math.round(seconds)}s`;
}

export function AgentTraceTimeline({ trace }: AgentTraceTimelineProps) {
  if (!trace.length) return null;

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-white">Agent execution</h2>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <ol className="space-y-4">
          {trace.map((entry, index) => {
            const complete = entry.status.toLowerCase() === "completed";
            const Icon = complete ? CheckCircle2 : XCircle;
            return (
              <li key={`${entry.agent}-${index}`} className="relative flex gap-3">
                {index < trace.length - 1 ? (
                  <span className="absolute left-2.5 top-6 h-[calc(100%+0.5rem)] w-px bg-slate-700" aria-hidden />
                ) : null}
                <Icon className={`relative z-10 mt-0.5 size-5 shrink-0 ${complete ? "text-cyan-400" : "text-red-400"}`} aria-hidden />
                <div className="min-w-0 pb-0.5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-sm font-medium text-slate-200">{entry.agent}</p>
                    <span className="text-xs text-slate-500">{entry.status} · {formatDuration(entry.duration)}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{entry.summary}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
