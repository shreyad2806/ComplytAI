"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

export type FindingEvidenceProps = {
  matchedDocumentText: string;
  matchedRegulation: string;
  selectionReason: string;
  retrievedContext: string;
};

function hasEvidence(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 && !["not found", "unknown", "n/a", "—"].includes(normalized);
}

export function FindingEvidenceAccordion({
  matchedDocumentText,
  matchedRegulation,
  selectionReason,
  retrievedContext,
}: FindingEvidenceProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();
  const hasSupportingEvidence = [
    matchedDocumentText,
    matchedRegulation,
    selectionReason,
    retrievedContext,
  ].some(hasEvidence);

  if (!hasSupportingEvidence) return null;

  return (
    <div className="mt-3 border-t border-slate-800 pt-3">
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onClick={() => setIsExpanded((expanded) => !expanded)}
        className="flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300"
      >
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        View Evidence
      </button>
      {isExpanded && (
        <div id={contentId} className="mt-3 space-y-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-xs">
          {hasEvidence(matchedDocumentText) && (
            <div>
              <p className="font-medium text-slate-300">Matched document text</p>
              <p className="mt-1 whitespace-pre-wrap text-slate-400">{matchedDocumentText}</p>
            </div>
          )}
          {hasEvidence(matchedRegulation) && (
            <div>
              <p className="font-medium text-slate-300">Matched regulation</p>
              <p className="mt-1 text-slate-400">{matchedRegulation}</p>
            </div>
          )}
          {hasEvidence(selectionReason) && (
            <div>
              <p className="font-medium text-slate-300">Reason AI selected this finding</p>
              <p className="mt-1 text-slate-400">{selectionReason}</p>
            </div>
          )}
          {hasEvidence(retrievedContext) && (
            <div>
              <p className="font-medium text-slate-300">Retrieved context</p>
              <p className="mt-1 whitespace-pre-wrap text-slate-400">{retrievedContext}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
