"use client";

import { motion } from "framer-motion";

import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { Features } from "@/components/landing/features";
import { Workflow } from "@/components/landing/workflow";
import { DashboardShowcase } from "@/components/landing/dashboard-showcase";
import { Cta } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { staggerContainer } from "@/components/landing/motion";

export default function HomePage() {
  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={staggerContainer}
      className="relative min-h-screen overflow-x-clip bg-black text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(8,145,178,0.12),transparent_35%),radial-gradient(circle_at_88%_30%,rgba(37,99,235,0.08),transparent_42%)]" />
      <div className="relative">
        <Navbar />
        <Hero />
        <DashboardPreview />
        <DashboardShowcase />
        <Features />
        <Workflow />
        <Cta />
        <Footer />
      </div>
    </motion.main>
  );
}