// src/app/dashboard/copilot/page.tsx
"use client";

import { motion } from "framer-motion";
import { UploadPanel } from "@/components/copilot/uploadPanel";
import { fadeUp, stagger } from "@/components/shared/motion";

export default function CopilotPage() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="mx-auto w-full max-w-[1400px] space-y-8"
    >
      {/* Header */}
      <motion.section variants={fadeUp}>
        <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">AI Analysis Workspace</p>
        <h1 className="mt-2 font-geist text-4xl font-semibold text-zinc-100">AI Copilot</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Upload compliance documents to generate comprehensive AI-powered analysis, risk assessments, and recommendations
        </p>
      </motion.section>

      {/* Upload Panel */}
      <motion.section variants={fadeUp}>
        <UploadPanel />
      </motion.section>
    </motion.div>
  );
}