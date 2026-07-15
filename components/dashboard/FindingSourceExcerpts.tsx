import type { SourceExcerpt } from "@/types";

type FindingSourceExcerptsProps = {
  excerpts: SourceExcerpt[];
};

function hasExcerptText(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 && !["not found", "unknown", "n/a", "—"].includes(normalized);
}

export function FindingSourceExcerpts({ excerpts }: FindingSourceExcerptsProps) {
  const sourceExcerpts = excerpts.filter((excerpt) => hasExcerptText(excerpt.text));

  if (!sourceExcerpts.length) return null;

  return (
    <div className="mt-3 space-y-2">
      {sourceExcerpts.map((excerpt, index) => (
        <blockquote key={`${excerpt.text.slice(0, 40)}-${index}`} className="border-l-2 border-yellow-400/70 bg-yellow-400/10 px-3 py-2 text-sm text-yellow-100">
          <p className="whitespace-pre-wrap">{excerpt.text}</p>
          {excerpt.page_number && (
            <footer className="mt-1 text-xs text-yellow-300/80">Page {excerpt.page_number}</footer>
          )}
        </blockquote>
      ))}
    </div>
  );
}
