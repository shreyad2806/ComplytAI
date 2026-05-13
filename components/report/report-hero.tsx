"use client";

import { motion } from "framer-motion";

import { ConfidenceBar } from "@/components/report/confidence-bar";
import { Button } from "@/components/ui/button";
import { fadeUp, stagger } from "@/components/shared/motion";
import type { ReportMeta } from "@/lib/mock/report-data";
import { Download, Share2, Sparkles } from "lucide-react";

export function ReportHero({ meta }: { meta: ReportMeta }) {
  const parts = meta.title.includes("Intelligence")
    ? meta.title.split("Intelligence")
    : [meta.title, ""];
  const [before, after] = parts;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="border-b border-zinc-800/80 bg-[#09090b]/60"
    >
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10">
        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
          <Sparkles className="size-3.5 text-cyan-400" />
          <span>ComplytAI — Intelligence Report</span>
        </motion.div>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <motion.h1
              variants={fadeUp}
              className="font-geist text-3xl font-semibold leading-tight tracking-tight text-zinc-100 sm:text-4xl lg:text-[2.75rem]"
            >
              {before}
              {after !== "" ? (
                <>
                  <span className="font-serif italic text-zinc-100">Intelligence</span>
                  {after}
                </>
              ) : null}
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-3 text-sm text-zinc-400 sm:text-base">
              Prepared for <strong className="font-semibold text-zinc-200">{meta.clientName}</strong> • Fiscal Q4 2025
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-zinc-500 sm:text-xs"
            >
              <span>Analysis complete</span>
              <span aria-hidden className="text-zinc-700">
                •
              </span>
              <span>Generated {meta.generatedAt}</span>
              <span aria-hidden className="text-zinc-700">
                •
              </span>
              <span>
                Documents scanned: {meta.documentsScanned} files • {meta.pagesScanned.toLocaleString()} pages
              </span>
              <span aria-hidden className="text-zinc-700">
                •
              </span>
              <span>Engine: {meta.engineVersion}</span>
              <span aria-hidden className="text-zinc-700">
                •
              </span>
              <span>Corpus: {meta.corpusVersion}</span>
              <span aria-hidden className="text-zinc-700">
                •
              </span>
              <span>Report ID: {meta.reportId}</span>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-2">
              <Button variant="outline" className="border-zinc-700/80 bg-zinc-950/50 text-zinc-300 hover:border-cyan-500/30">
                <Share2 className="size-3.5" />
                Share report
              </Button>
              <Button variant="outline" className="border-zinc-700/80 bg-zinc-950/50 text-zinc-300 hover:border-cyan-500/30">
                Copy link
              </Button>
              <Button className="bg-cyan-600 text-cyan-950 shadow-[0_0_18px_rgba(6,182,212,0.2)] hover:bg-cyan-500">
                <Download className="size-3.5" />
                Export PDF
              </Button>
            </motion.div>
          </div>

          <motion.aside
            variants={fadeUp}
            className="w-full max-w-sm rounded-xl border border-cyan-500/30 bg-zinc-950/60 p-5 shadow-[0_0_24px_rgba(6,182,212,0.12)] backdrop-blur-md"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">AI confidence</p>
            <p className="mt-2 font-geist text-4xl font-semibold tabular-nums text-cyan-300">{meta.aiConfidence.toFixed(1)}%</p>
            <ConfidenceBar value={meta.aiConfidence} label="Model calibration" className="mt-4" />
          </motion.aside>
        </div>
      </div>
    </motion.div>
  );
}
