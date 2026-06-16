import { Sparkles } from "lucide-react";

export function ExecutiveSummary({ text }: { text: string }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50/60 p-6">
      <header className="mb-3 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 text-white">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            AI Summary
          </div>
          <div className="text-sm font-semibold tracking-tight text-zinc-900">
            Executive summary
          </div>
        </div>
      </header>
      <p className="text-[14px] leading-6 text-zinc-700">{text}</p>
    </section>
  );
}
