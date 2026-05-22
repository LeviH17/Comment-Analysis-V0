import type { AudienceSignal } from "@/lib/types";

export function AudienceSignals({ signals }: { signals: AudienceSignal[] }) {
  if (signals.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="text-sm font-medium text-zinc-900">Audience signals</div>
        <div className="mt-3 text-xs text-zinc-500">No audience signals surfaced.</div>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="text-sm font-medium text-zinc-900">Audience signals</div>
      <ul className="mt-3 space-y-3">
        {signals.map((s) => (
          <li key={s.label}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-800">{s.label}</span>
              <IntensityMeter level={s.intensity} />
            </div>
            <p className="mt-0.5 text-[11px] leading-4 text-zinc-500">{s.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IntensityMeter({ level }: { level: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Intensity ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`block h-1.5 w-1.5 rounded-full ${
            i <= level ? "bg-zinc-900" : "bg-zinc-200"
          }`}
        />
      ))}
    </span>
  );
}
