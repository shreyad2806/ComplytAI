"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useComplytStore } from "@/store/useComplytStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadCloud, FileText, AlertCircle, Loader2 } from "lucide-react";

import { Progress } from "@/components/ui/progress";

export function UploadPanel() {
  const { startAnalysis, isAnalyzing, error, reportId, analysisProgress } =
    useComplytStore();
  const [prompt, setPrompt] = useState("");
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (reportId && !isAnalyzing) {
      router.push(`/dashboard/report/${reportId}`);
    }
  }, [reportId, isAnalyzing, router]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) setStagedFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    disabled: isAnalyzing,
  });

  const handleRunAnalysis = async () => {
    const trimmed = prompt.trim();
    if (!stagedFile && !trimmed) {
      toast.error(
        "Please upload a document or enter an analysis request."
      );
      return;
    }

    await startAnalysis({
      file: stagedFile,
      prompt: trimmed,
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <label className="block text-sm text-slate-400 mb-2">
          Analysis request
        </label>
        <textarea
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
          rows={2}
          placeholder="e.g. Focus on GDPR gaps, SOC 2 control mapping, and financial exposure under EU DORA…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isAnalyzing}
        />
      </div>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
          ${isDragActive ? "border-cyan-500/70 bg-cyan-500/5" : "border-slate-700 hover:border-slate-500"}
          ${isAnalyzing ? "opacity-60 cursor-not-allowed pointer-events-none" : ""}
        `}
      >
        <input {...getInputProps()} />

        {stagedFile ? (
          <div className="flex flex-col items-center gap-3">
            <FileText className="w-10 h-10 text-cyan-400/90" />
            <p className="text-cyan-300/95 font-medium tracking-tight">
              {stagedFile.name}
            </p>
            <p className="text-slate-500 text-sm">
              Document staged — run the workflow below to execute analysis
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <UploadCloud className="w-12 h-12 text-slate-500" />
            <div>
              <p className="text-slate-300 font-medium mb-1">
                Drop your compliance document here
              </p>
              <p className="text-slate-500 text-sm">
                Supports PDF, DOCX, TXT · Max 10MB
              </p>
            </div>
            <span className="inline-flex items-center justify-center px-6 py-2 rounded-lg text-sm font-medium text-cyan-100 bg-slate-800/80 border border-cyan-500/20">
              Browse files
            </span>
          </div>
        )}
      </div>

      <div className="w-full max-w-xl mx-auto pt-1">
        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          className={`
            group relative w-full overflow-hidden rounded-xl px-6 py-4 text-left
            font-semibold tracking-tight text-white transition-all duration-300
            border border-cyan-500/25 bg-linear-to-b from-slate-800/90 to-slate-900/95
            shadow-[0_0_24px_rgba(34,211,238,0.18),0_0_48px_rgba(59,130,246,0.08)]
            hover:border-cyan-400/45 hover:shadow-[0_0_32px_rgba(34,211,238,0.28),0_0_56px_rgba(59,130,246,0.14)]
            hover:-translate-y-0.5 active:translate-y-0
            disabled:pointer-events-none disabled:opacity-90
            ${isAnalyzing ? "animate-cta-glow-pulse border-cyan-400/35" : ""}
          `}
        >
          <span
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(120%_80%_at_50%_-20%,rgba(34,211,238,0.15),transparent_55%)]"
            aria-hidden
          />
          <span className="relative flex items-center justify-center gap-3">
            {isAnalyzing ? (
              <>
                <Loader2
                  className="h-5 w-5 shrink-0 animate-spin text-cyan-300"
                  aria-hidden
                />
                <span className="text-[0.95rem] sm:text-base">
                  Analyzing Compliance Risks...
                </span>
              </>
            ) : (
              <span className="text-[0.95rem] sm:text-base">
                Run AI Compliance Analysis
              </span>
            )}
          </span>
        </button>
        <p className="mt-3 text-center text-[11px] uppercase tracking-[0.2em] text-slate-500">
          Enterprise workflow · Secured via Complyt orchestration
        </p>
        {isAnalyzing && analysisProgress != null && (
          <div className="mt-4 space-y-2">
            <Progress value={analysisProgress} className="h-1.5 bg-slate-800" />
            <p className="text-center text-xs text-slate-500">
              Workflow progress · {analysisProgress}%
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex flex-col gap-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
          <button
            type="button"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="self-start rounded-lg border border-red-400/40 px-4 py-2 text-sm text-red-200 hover:bg-red-500/10 disabled:opacity-50"
          >
            Retry analysis
          </button>
        </div>
      )}
    </div>
  );
}
