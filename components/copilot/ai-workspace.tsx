"use client";

import { Send } from "lucide-react";

import { AIResponseCard } from "@/components/copilot/ai-response-card";

export function AIWorkspace() {
  return (
    <section className="rounded-xl border border-white/10 bg-[#071225] p-4">
      <div className="grid min-h-[180px] place-content-center rounded-lg border border-white/10 bg-[#081326] p-6 text-center">
        <div className="mx-auto mb-3 grid size-9 place-content-center rounded-lg border border-cyan-400/30 bg-cyan-500/10 text-cyan-300">
          ⚡
        </div>
        <p className="font-medium text-zinc-200">Complyt AI Intelligence Engine</p>
        <p className="mt-1 max-w-lg text-sm text-zinc-500">
          Ask about compliance requirements, risk analysis, audit procedures, and regulatory policy.
        </p>
      </div>

      <div className="mt-4 rounded-md border border-white/10 bg-[#081326] p-3 text-sm text-zinc-300">
        What are the current FinCEN AML requirements for fintech companies processing over $1M in monthly wire transfers?
      </div>

      <div className="mt-4 space-y-3">
        <AIResponseCard
          title="FinCEN AML Compliance Requirements - Wire Transfer Operations"
          body={[
            "SAR Filing Obligation: File suspicious activity reports within 30 days when transaction patterns indicate structuring.",
            "CTR Requirements: Currency transaction reports are mandatory for cash transactions exceeding $10,000 in a single business day.",
            "Travel Rule: Retain and transfer originator and beneficiary information for wire transfers of $3,000 or more.",
            "Customer Due Diligence: Verify beneficial ownership for legal entity customers and maintain risk profiles.",
            "OFAC Screening: Real-time sanctions list screening is required before transaction execution.",
          ]}
          references={["31 CFR 1010.410", "FinCEN SAR Rule", "BSA §5318(g)", "CDD Rule 2018"]}
        />
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-md border border-white/10 bg-[#081326] p-2">
        <input
          className="h-10 w-full bg-transparent px-2 text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
          placeholder="Ask Complyt AI about compliance, risk intelligence, audits, regulations..."
        />
        <button className="grid size-10 place-content-center rounded-md bg-cyan-600 text-cyan-950 hover:bg-cyan-500">
          <Send className="size-4" />
        </button>
      </div>
    </section>
  );
}
