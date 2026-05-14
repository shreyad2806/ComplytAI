// src/app/dashboard/copilot/page.tsx
"use client";

import { UploadPanel } from "@/components/copilot/uploadPanel";

export default function CopilotPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <h1 className="text-xl font-semibold">AI Copilot</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Upload a compliance document to begin AI analysis
        </p>
      </header>

      {/* Upload Area */}
      <main className="px-6 py-12">
        <UploadPanel />
      </main>
    </div>
  );
}