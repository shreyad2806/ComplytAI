"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/components/landing/motion";

export function Cta() {
  return (
    <section className="mx-auto mt-24 w-full max-w-6xl px-4 sm:px-6">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={staggerContainer}
        className="rounded-2xl border border-cyan-300/20 bg-gradient-to-b from-cyan-500/10 to-zinc-950 p-8 text-center sm:p-12"
      >
        <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.16em] text-cyan-300">
          Enterprise ready
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mx-auto mt-3 max-w-3xl font-geist text-3xl font-semibold text-zinc-100 sm:text-4xl"
        >
          Transform compliance operations with AI
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-3xl text-zinc-400">
          Join leading financial institutions using Complyt AI to reduce compliance risk,
          accelerate audits, and surface intelligence that matters.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-3">
          <Button className="h-10 rounded-md bg-cyan-500 px-5 text-sm font-semibold text-cyan-950 hover:bg-cyan-400">
            Request Enterprise Demo
          </Button>
          <Button
            variant="outline"
            className="h-10 rounded-md border-white/20 bg-white/5 px-5 text-sm text-zinc-100 hover:bg-white/10"
          >
            Talk to Sales
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
