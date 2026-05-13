"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { fadeUp } from "@/components/landing/motion";

const columns = [
  { title: "Platform", links: ["Compliance Engine", "Risk Analytics", "Audit Intelligence", "AI Analysis"] },
  { title: "Solutions", links: ["Banking & Finance", "Asset Management", "Insurance", "Audit Firms"] },
  { title: "Company", links: ["About", "Security", "Blog", "Contact"] },
];

export function Footer() {
  return (
    <motion.footer variants={fadeUp} className="mt-24 border-t border-white/10 bg-zinc-950/70">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid size-7 place-content-center rounded-md border border-cyan-400/60 bg-cyan-400/10 text-xs font-semibold text-cyan-300">
              C
            </div>
            <p className="font-geist text-sm font-semibold text-zinc-100">Complyt AI</p>
          </div>
          <p className="mt-3 text-sm text-zinc-500">
            AI-powered compliance intelligence for modern financial enterprises.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">{col.title}</p>
            <div className="mt-3 space-y-2">
              {col.links.map((link) => (
                <Link key={link} href="#" className="block text-sm text-zinc-400 transition hover:text-zinc-200">
                  {link}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-zinc-500 sm:px-6">
          <p>© 2026 Complyt AI Inc. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-zinc-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-zinc-300">Terms of Service</Link>
            <Link href="#" className="hover:text-zinc-300">Security</Link>
            <Link href="#" className="hover:text-zinc-300">Status</Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
