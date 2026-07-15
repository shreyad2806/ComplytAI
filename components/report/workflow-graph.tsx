import type { AgentTrace } from "@/types";
import type { MergedReportStats } from "@/lib/report-stats";
import { WorkflowCard } from "./workflow-card";
import { FileText } from "lucide-react";

type WorkflowGraphProps = {
  trace: AgentTrace[];
  isAnalyzing: boolean;
  mergedStats?: MergedReportStats;
};

export function WorkflowGraph({ trace, isAnalyzing, mergedStats }: WorkflowGraphProps) {
  const getAgentTrace = (name: string) => trace.find(t => t.agent.includes(name));
  
  const analyst = getAgentTrace("Document Intelligence");
  const aml = getAgentTrace("AML Investigation");
  const compliance = getAgentTrace("Regulatory Compliance");
  const auditor = getAgentTrace("Financial Risk");
  const manager = getAgentTrace("Compliance Review");

  return (
    <div className="flex flex-col items-center w-full my-8">
      {/* Document Node */}
      <div className="flex flex-col items-center">
         <div className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-200 shadow-sm">
           <FileText className="w-5 h-5 text-cyan-400" />
           <span className="font-medium text-sm">Source Document</span>
         </div>
         <div className="h-8 w-px bg-slate-700 relative" />
      </div>

      {/* Analyst Node */}
      <div className="w-full max-w-md">
        <WorkflowCard trace={analyst} isAnalyzing={isAnalyzing && !analyst} agentName="Document Intelligence Analyst" />
      </div>

      <div className="h-8 w-px bg-slate-700 relative my-0" />
      
      {/* Fork */}
      <div className="w-full max-w-4xl flex justify-center relative">
         {/* Horizontal line connecting the parallel nodes */}
         <div className="absolute top-0 w-[50%] border-t border-slate-700" />
         
         <div className="w-1/2 flex flex-col items-center pr-4">
           <div className="h-8 w-px bg-slate-700 relative" />
           <div className="w-full">
             <WorkflowCard trace={aml} isAnalyzing={isAnalyzing && !!analyst && !aml} agentName="AML Investigation Specialist" />
           </div>
         </div>

         <div className="w-1/2 flex flex-col items-center pl-4">
           <div className="h-8 w-px bg-slate-700 relative" />
           <div className="w-full">
             <WorkflowCard trace={compliance} isAnalyzing={isAnalyzing && !!analyst && !compliance} agentName="Regulatory Compliance Officer" />
           </div>
         </div>
      </div>

      {/* Join */}
      <div className="w-full max-w-4xl flex justify-center relative">
         <div className="w-1/2 flex flex-col items-center pr-4">
           <div className="h-8 w-px bg-slate-700" />
         </div>
         <div className="w-1/2 flex flex-col items-center pl-4">
           <div className="h-8 w-px bg-slate-700" />
         </div>
         <div className="absolute bottom-0 w-[50%] border-b border-slate-700" />
      </div>
      
      <div className="h-8 w-px bg-slate-700 relative my-0" />

      {/* Auditor Node */}
      <div className="w-full max-w-md">
        <WorkflowCard trace={auditor} isAnalyzing={isAnalyzing && (!!aml || !!compliance) && !auditor} agentName="Financial Risk Auditor" />
      </div>

      <div className="h-8 w-px bg-slate-700 relative my-0" />

      {/* Manager Node */}
      <div className="w-full max-w-md">
        <WorkflowCard trace={manager} isAnalyzing={isAnalyzing && !!auditor && !manager} agentName="Compliance Review Manager" mergedStats={mergedStats} />
      </div>
    </div>
  );
}
