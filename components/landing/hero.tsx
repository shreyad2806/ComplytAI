"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/components/landing/motion";

export function Hero() {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <section className="relative overflow-hidden pt-18 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.14),transparent_45%)]" />
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        variants={staggerContainer}
        className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center sm:px-6"
      >
        <motion.span
          variants={fadeUp}
          className="mb-6 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-300"
        >
          AI-native compliance platform
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="max-w-4xl text-balance font-geist text-4xl font-semibold leading-[1.04] tracking-[-0.03em] text-zinc-100 sm:text-6xl"
        >
          AI-Powered Financial Compliance Intelligence
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-3xl text-balance text-base text-zinc-400 sm:text-lg"
        >
          Enterprise-grade compliance observability, risk analysis, audit
          intelligence, and financial monitoring - all unified by AI.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
          <Button 
            onClick={handleGoToDashboard}
            className="h-10 rounded-md bg-cyan-500 px-5 text-sm font-semibold text-cyan-950 hover:bg-cyan-400"
          >
            Go to Dashboard
            <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
