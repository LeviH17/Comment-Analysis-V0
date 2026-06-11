import type { DemographicBucket } from "@/lib/types";

export function DemographicsBars({
  title,
  buckets,
  formatLabel,
  limit,
  emptyMessage = "No data.",
}: {
  title: string;
  buckets: DemographicBucket<string>[];
  formatLabel?: (label: string) => string;
  limit?: number;
  emptyMessage?: string;
}) {
  const total = buckets.length;
  const shown = limit ? buckets.slice(0, limit) : buckets;
  const max = Math.max(...shown.map((b) => b.pct), 1);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-baseline justify-between">
        <div className="text-sm font-medium text-zinc-900">{title}</div>
        {limit && total > limit && (
          <span className="text-[11px] text-zinc-400">
            Top {limit} of {total}
          </span>
        )}
      </div>
      {shown.length === 0 ? (
        <div className="mt-3 text-xs text-zinc-500">{emptyMessage}</div>
      ) : (
        <ul className="mt-3 space-y-2">
          {shown.map((b) => (
            <li key={b.label} className="grid grid-cols-[68px_1fr_56px] items-center gap-2">
              <span className="truncate text-[12px] text-zinc-700" title={formatLabel?.(b.label) ?? b.label}>
                {formatLabel ? formatLabel(b.label) : b.label}
              </span>
              <div className="relative h-1.5 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-zinc-900"
                  style={{ width: `${(b.pct / max) * 100}%` }}
                />
              </div>
              <span className="text-right text-[11px] tabular-nums text-zinc-500">
                <span className="text-zinc-700">{b.count}</span>
                <span className="ml-1">· {b.pct}%</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function capitalize(s: string): string {
  if (!s) return s;
  if (s === "non-binary") return "Non-binary";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
