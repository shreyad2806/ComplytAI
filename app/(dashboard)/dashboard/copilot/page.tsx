"use client";

import { motion } from "framer-motion";

import { AIWorkspace } from "@/components/copilot/ai-workspace";
import { ContextInsights } from "@/components/copilot/context-insights";
import { QuickIntelligence } from "@/components/copilot/quick-intelligence";
import { fadeUp, stagger } from "@/components/shared/motion";

export default function CopilotPage() {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="mx-auto w-full max-w-[1400px]">
      <motion.section variants={fadeUp} className="mb-5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Public Intelligence System</p>
        <h1 className="font-geist text-3xl text-zinc-100">Complyt AI Workspace</h1>
        <p className="text-sm text-zinc-400">AI-powered risk intelligence and compliance analysis</p>
      </motion.section>

      <motion.section variants={fadeUp} className="grid gap-3 xl:grid-cols-[260px_1fr_280px]">
        <QuickIntelligence />
        <AIWorkspace />
        <ContextInsights />
      </motion.section>
    </motion.div>
  );
}
