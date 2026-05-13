"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { fadeUp } from "@/components/landing/motion";

const navItems = ["Platform", "Solutions", "Compliance", "Pricing", "Docs"];

export function Navbar() {
  return (
    <motion.header
      variants={fadeUp}
      className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid size-7 place-content-center rounded-md border border-cyan-400/60 bg-cyan-400/10 text-xs font-semibold text-cyan-300">
            C
          </div>
          <span className="font-geist text-sm font-semibold tracking-tight text-white">
            Complyt AI
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item}
              href="#"
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-200"
            >
              {item}
            </Link>
          ))}
        </nav>

        <Button
          className="h-9 rounded-md border border-cyan-400/40 bg-cyan-500/10 px-4 text-xs font-semibold text-cyan-200 hover:bg-cyan-400/20"
          variant="outline"
        >
          Request Demo
        </Button>
      </div>
    </motion.header>
  );
}
