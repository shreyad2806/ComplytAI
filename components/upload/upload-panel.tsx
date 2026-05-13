"use client";

import { useCallback } from "react";
import { FileText, Sparkles } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export function UploadPanel() {
  const onDrop = useCallback(() => {}, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/csv": [".csv"],
    },
  });

  return (
    <section className="rounded-xl border border-white/10 bg-[#071225] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-geist text-lg text-zinc-100">Document Upload</h3>
        <span className="rounded border border-cyan-300/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-cyan-300">
          AI-ready
        </span>
      </div>

      <div
        {...getRootProps()}
        className="grid min-h-56 cursor-pointer place-content-center rounded-lg border border-dashed border-white/15 bg-[#081326] p-4 text-center"
      >
        <input {...getInputProps()} />
        <div className="mx-auto grid size-11 place-content-center rounded-lg border border-cyan-300/30 bg-cyan-500/10 text-cyan-200">
          <FileText className="size-5" />
        </div>
        <p className="mt-4 font-medium text-zinc-200">
          {isDragActive ? "Drop compliance documents here" : "Drop compliance documents here"}
        </p>
        <p className="mt-1 text-sm text-zinc-500">Drag & drop or click to browse your files</p>
        <div className="mt-3 flex justify-center gap-2 text-[10px] text-zinc-500">
          <span className="rounded border border-white/10 px-2 py-0.5">PDF</span>
          <span className="rounded border border-white/10 px-2 py-0.5">DOCX</span>
          <span className="rounded border border-white/10 px-2 py-0.5">CSV</span>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-white/10 bg-[#081326] p-3">
        <div className="flex items-center justify-between text-sm text-zinc-300">
          <p>Q3_AML_Compliance_Report.pdf</p>
          <p className="text-cyan-300">73%</p>
        </div>
        <Progress className="mt-2 h-1.5 bg-zinc-800" value={73} />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[10px] uppercase tracking-[0.15em] text-zinc-500">Analysis instructions</p>
        <Textarea
          className="min-h-20 border-white/10 bg-[#081326] text-zinc-200 placeholder:text-zinc-600"
          placeholder="Focus on AML risks, audit anomalies, suspicious transactions, operational gaps, or compliance violations."
        />
      </div>

      <Button className="mt-4 h-11 w-full rounded-md bg-cyan-600 text-cyan-950 hover:bg-cyan-500">
        <Sparkles className="size-4" />
        Run AI Compliance Analysis
      </Button>
    </section>
  );
}
