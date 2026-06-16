import type { HeatmapCell } from "@/lib/types";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOUR_TICKS = [0, 6, 12, 18];

function intensityClass(count: number, max: number): string {
  if (count === 0) return "bg-zinc-100";
  const ratio = count / Math.max(1, max);
  if (ratio < 0.25) return "bg-zinc-300";
  if (ratio < 0.5) return "bg-zinc-500";
  if (ratio < 0.75) return "bg-zinc-700";
  return "bg-zinc-900";
}

const LEGEND_LEVELS = [
  "bg-zinc-100",
  "bg-zinc-300",
  "bg-zinc-500",
  "bg-zinc-700",
  "bg-zinc-900",
];

export function ActivityHeatmap({ cells }: { cells: HeatmapCell[] }) {
  const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  for (const cell of cells) {
    if (cell.day >= 0 && cell.day <= 6 && cell.hour >= 0 && cell.hour <= 23) {
      grid[cell.day][cell.hour] = cell.count;
    }
  }

  const max = cells.reduce((m, c) => Math.max(m, c.count), 0);
  const total = cells.reduce((s, c) => s + c.count, 0);

  // Find peak day/hour for the "Most active" callout
  let peakDay = 0;
  let peakHour = 0;
  let peakCount = 0;
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      if (grid[d][h] > peakCount) {
        peakCount = grid[d][h];
        peakDay = d;
        peakHour = h;
      }
    }
  }

  const peakLabel =
    peakCount > 0
      ? `${DAY_LABELS[peakDay]} · ${String(peakHour).padStart(2, "0")}:00 UTC`
      : null;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <div>
          <div className="text-sm font-medium text-zinc-900">Activity heatmap</div>
          <div className="text-[11px] text-zinc-500">When commenters posted (UTC)</div>
        </div>
        <span className="text-[11px] text-zinc-500">
          {total} {total === 1 ? "comment" : "comments"}
        </span>
      </div>

      {total === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-xs text-zinc-500">
          No activity recorded.
        </div>
      ) : (
        <>
          <div className="space-y-[3px]">
            {/* Hour tick row */}
            <div className="flex items-end gap-1.5">
              <span className="w-8" aria-hidden />
              <div className="grid flex-1 grid-cols-[repeat(24,minmax(0,1fr))]">
                {Array.from({ length: 24 }, (_, h) => (
                  <div key={h} className="text-center text-[9px] text-zinc-400">
                    {HOUR_TICKS.includes(h) ? String(h).padStart(2, "0") : ""}
                  </div>
                ))}
              </div>
            </div>

            {DAY_LABELS.map((dayLabel, dayIdx) => (
              <div key={dayIdx} className="flex items-center gap-1.5">
                <span className="w-8 text-right text-[10px] text-zinc-500">{dayLabel}</span>
                <div className="grid flex-1 grid-cols-[repeat(24,minmax(0,1fr))] gap-[2px]">
                  {grid[dayIdx].map((count, h) => (
                    <div
                      key={h}
                      className={`h-5 rounded-[3px] ${intensityClass(count, max)}`}
                      title={`${dayLabel} ${String(h).padStart(2, "0")}:00 UTC — ${count} comment${count === 1 ? "" : "s"}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500">
            {peakLabel ? (
              <span>
                Most active: <span className="text-zinc-900">{peakLabel}</span>{" "}
                <span className="text-zinc-400">({peakCount})</span>
              </span>
            ) : (
              <span />
            )}
            <span className="inline-flex items-center gap-1">
              <span className="text-zinc-400">Less</span>
              {LEGEND_LEVELS.map((cls, i) => (
                <span key={i} className={`inline-block h-2.5 w-2.5 rounded-sm ${cls}`} />
              ))}
              <span className="text-zinc-400">More</span>
            </span>
          </div>
        </>
      )}
    </div>
  );
}
