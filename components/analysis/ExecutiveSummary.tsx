import { Sparkles } from "lucide-react";

export function ExecutiveSummary({ text }: { text: string }) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-zinc-900">
        <span>Executive summary</span>
        <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
      </div>
      <p className="max-w-3xl text-sm leading-6 text-zinc-700">{text}</p>
    </section>
  );
}
