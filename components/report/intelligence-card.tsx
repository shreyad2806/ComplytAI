"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { fadeUp } from "@/components/shared/motion";

function RichBody({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <p className={cn("text-sm leading-relaxed text-zinc-400", className)}>
      {parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="font-semibold text-zinc-200">{part}</strong> : part))}
    </p>
  );
}

type IntelligenceCardProps = {
  kicker?: string;
  kickerAdornment?: ReactNode;
  title: string;
  body: string;
  footerLeft?: string;
  footerBadge?: string;
  className?: string;
  children?: ReactNode;
};

export function IntelligenceCard({
  kicker,
  kickerAdornment,
  title,
  body,
  footerLeft,
  footerBadge,
  className,
  children,
}: IntelligenceCardProps) {
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      whileHover={{ borderColor: "rgba(34, 211, 238, 0.2)" }}
      className={cn(
        "rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition-shadow hover:shadow-[0_0_24px_rgba(6,182,212,0.06)]",
        className
      )}
    >
      {kicker ? (
        <div className="mb-3 flex items-center gap-2">
          {kickerAdornment}
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400/90">{kicker}</p>
        </div>
      ) : null}
      <h3 className="font-geist text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">{title}</h3>
      <div className="mt-4">
        <RichBody text={body} />
      </div>
      {children}
      {(footerLeft || footerBadge) && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80 pt-4">
          {footerLeft ? <RichBody text={footerLeft} className="text-xs text-zinc-500" /> : <span />}
          {footerBadge ? (
            <span className="rounded-md border border-zinc-700/80 bg-zinc-900/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
              {footerBadge}
            </span>
          ) : null}
        </div>
      )}
    </motion.article>
  );
}
