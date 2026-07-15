"use client";

import { useId, useState } from "react";
import { ChevronDown, FileText, User } from "lucide-react";
import type { SourceExcerpt } from "@/types";
import { isMeaningfulText } from "@/lib/report-stats";

export type FindingEvidenceProps = {
  matchedDocumentText?: string;
  matchedRegulation?: string;
  selectionReason?: string;
  retrievedContext?: string;
  excerpts?: SourceExcerpt[];
  sourceAgent?: string;
};

function hasEvidence(value?: string | null): boolean {
  return isMeaningfulText(value);
}

function hasPageNumber(value?: string | null): boolean {
  return isMeaningfulText(value);
}

export function FindingEvidenceAccordion({
  matchedDocumentText,
  matchedRegulation,
  selectionReason,
  retrievedContext,
  excerpts = [],
  sourceAgent,
}: FindingEvidenceProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();

  const validExcerpts = excerpts.filter((excerpt) => hasEvidence(excerpt.text));
  const hasTextEvidence = hasEvidence(matchedDocumentText) || validExcerpts.length > 0;
  const hasSupportingEvidence =
    hasTextEvidence ||
    [matchedRegulation, selectionReason, retrievedContext, sourceAgent].some(hasEvidence);

  if (!hasSupportingEvidence) return null;

  return (
    <div className="mt-4 border-t border-slate-800 pt-3">
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onClick={() => setIsExpanded((expanded) => !expanded)}
        className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 tracking-wide uppercase transition-colors"
      >
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
        />
        View Evidence
      </button>
      {isExpanded && (
        <div
          id={contentId}
          className="mt-4 space-y-4 rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs shadow-inner"
        >
          {validExcerpts.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Evidence</p>
              {validExcerpts.map((excerpt, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-700/80 bg-slate-900/60 p-4 shadow-sm"
                >
                  {hasPageNumber(excerpt.page_number) && (
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-cyan-300/90">
                      <FileText className="w-3.5 h-3.5" />
                      Page {excerpt.page_number}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                    &ldquo;{excerpt.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}

          {!validExcerpts.length && hasEvidence(matchedDocumentText) && (
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Evidence</p>
              <div className="rounded-lg border border-slate-700/80 bg-slate-900/60 p-4 shadow-sm">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                  &ldquo;{matchedDocumentText}&rdquo;
                </p>
              </div>
            </div>
          )}

          {(hasEvidence(sourceAgent) ||
            hasEvidence(matchedRegulation) ||
            hasEvidence(selectionReason) ||
            hasEvidence(retrievedContext)) && (
            <div className="flex flex-col gap-3 border-t border-slate-800/60 pt-3">
              {hasEvidence(sourceAgent) && (
                <div className="flex w-fit items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-slate-300">
                  <User className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-xs text-slate-400">Source Agent</span>
                  <span className="text-xs font-medium">{sourceAgent}</span>
                </div>
              )}

              {hasEvidence(matchedRegulation) && (
                <div>
                  <p className="mb-1 font-medium text-slate-400">Matched Regulation</p>
                  <p className="text-slate-300">{matchedRegulation}</p>
                </div>
              )}
              {hasEvidence(selectionReason) && (
                <div>
                  <p className="mb-1 font-medium text-slate-400">AI Reasoning</p>
                  <p className="text-slate-300">{selectionReason}</p>
                </div>
              )}
              {hasEvidence(retrievedContext) && (
                <div>
                  <p className="mb-1 font-medium text-slate-400">Retrieved Context</p>
                  <p className="text-slate-300">{retrievedContext}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
