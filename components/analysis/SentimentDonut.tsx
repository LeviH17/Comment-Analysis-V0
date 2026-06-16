import type { CommentAnalysisOutput } from "@/lib/types";

const SEG_COLOR: Record<keyof CommentAnalysisOutput["sentiment"], string> = {
  positive: "#10b981", // emerald-500
  neutral: "#a1a1aa", // zinc-400
  negative: "#ef4444", // red-500
  mixed: "#f59e0b", // amber-500
};

const SEG_LABEL: Record<keyof CommentAnalysisOutput["sentiment"], string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
  mixed: "Mixed",
};

export function SentimentDonut({
  sentiment,
  total,
  size = 180,
  stroke = 20,
}: {
  sentiment: CommentAnalysisOutput["sentiment"];
  total: number;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = (Object.keys(sentiment) as Array<keyof typeof sentiment>).map((k) => ({
    key: k,
    pct: sentiment[k],
    color: SEG_COLOR[k],
    label: SEG_LABEL[k],
  }));

  let offsetAccum = 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="mb-4 text-sm font-medium text-zinc-900">Sentiment</div>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            {segments.map((seg) => {
              const length = (seg.pct / 100) * circumference;
              const el = (
                <circle
                  key={seg.key}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${length} ${circumference - length}`}
                  strokeDashoffset={-offsetAccum}
                />
              );
              offsetAccum += length;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-2xl font-semibold tracking-tight text-zinc-900">{total}</div>
            <div className="text-[11px] text-zinc-500">comments</div>
          </div>
        </div>
        <ul className="w-full flex-1 space-y-2">
          {segments.map((seg) => (
            <li key={seg.key}>
              <div className="flex items-center justify-between text-xs text-zinc-700">
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: seg.color }}
                  />
                  {seg.label}
                </span>
                <span className="tabular-nums font-medium text-zinc-900">{seg.pct}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${seg.pct}%`, backgroundColor: seg.color }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
