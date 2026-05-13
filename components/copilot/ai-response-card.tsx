type AIResponseCardProps = {
  title: string;
  body: string[];
  references?: string[];
};

export function AIResponseCard({ title, body, references }: AIResponseCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#081326] p-4">
      <h4 className="font-geist text-base text-zinc-100">{title}</h4>
      <ol className="mt-3 space-y-2">
        {body.map((item, index) => (
          <li key={item} className="text-sm text-zinc-300">
            <span className="mr-2 text-cyan-300">{String(index + 1).padStart(2, "0")}</span>
            {item}
          </li>
        ))}
      </ol>
      {references?.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {references.map((ref) => (
            <span key={ref} className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-400">
              {ref}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
