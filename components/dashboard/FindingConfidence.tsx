type FindingConfidenceProps = {
  value?: number;
};

export function FindingConfidence({ value }: FindingConfidenceProps) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;

  const confidence = Math.min(100, Math.max(0, Math.round(value)));
  const interpretation =
    confidence >= 90
      ? "High confidence"
      : confidence >= 70
        ? "Medium confidence"
        : "Needs review";
  const barColor =
    confidence >= 90
      ? "bg-green-400"
      : confidence >= 70
        ? "bg-yellow-400"
        : "bg-orange-400";

  return (
    <div className="mt-3 border-t border-slate-800 pt-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">Confidence</span>
        <span className="font-medium text-slate-200">{confidence}% · {interpretation}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${confidence}%` }} />
      </div>
    </div>
  );
}
