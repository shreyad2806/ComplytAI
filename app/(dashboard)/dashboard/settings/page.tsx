"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/components/shared/motion";

export default function SettingsPage() {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="mx-auto w-full max-w-[1400px] space-y-8">
      {/* Header */}
      <motion.section variants={fadeUp}>
        <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Workspace Settings</p>
        <h1 className="mt-2 font-geist text-4xl font-semibold text-zinc-100">Settings</h1>
        <p className="mt-1 text-sm text-zinc-400">Manage your account and workspace preferences</p>
      </motion.section>

      {/* Coming Soon */}
      <motion.section variants={fadeUp}>
        <div className="rounded-lg border border-white/10 bg-zinc-900/50 p-8 text-center">
          <div className="inline-flex items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/10 p-3">
            <div className="h-8 w-8" />
          </div>
          <h2 className="mt-4 font-geist text-xl font-semibold text-zinc-100">Settings Coming Soon</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Settings and preferences will be available in a future update.
          </p>
        </div>
      </motion.section>
    </motion.div>
  );
}
