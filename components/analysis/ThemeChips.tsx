import type { Theme } from "@/lib/types";

export function ThemeChips({ themes }: { themes: Theme[] }) {
  if (themes.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="text-sm font-medium text-zinc-900">Themes</div>
        <div className="mt-3 text-xs text-zinc-500">No themes surfaced.</div>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="text-sm font-medium text-zinc-900">Themes</div>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {themes.map((t) => (
          <li
            key={t.label}
            title={t.sample}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-700"
          >
            <span>{t.label}</span>
            <span className="rounded-full bg-zinc-200 px-1.5 text-[10px] font-medium text-zinc-700">
              {t.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
