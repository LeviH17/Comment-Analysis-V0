"use client";

import type { Sentiment, Theme, ThemeCategory, ThemeEmergence } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";

const fmt = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

const CATEGORY_STYLE: Record<ThemeCategory, { bg: string; fg: string }> = {
  Economic: { bg: "bg-amber-50", fg: "text-amber-700" },
  Social: { bg: "bg-blue-50", fg: "text-blue-700" },
  Governance: { bg: "bg-violet-50", fg: "text-violet-700" },
  Media: { bg: "bg-pink-50", fg: "text-pink-700" },
  Health: { bg: "bg-emerald-50", fg: "text-emerald-700" },
  Engineering: { bg: "bg-zinc-100", fg: "text-zinc-700" },
  Generic: { bg: "bg-zinc-50", fg: "text-zinc-500" },
};

const SENTIMENT_DOT: Record<Sentiment, string> = {
  positive: "bg-emerald-500",
  neutral: "bg-zinc-400",
  negative: "bg-red-500",
  mixed: "bg-amber-500",
};

const SENTIMENT_LABEL: Record<Sentiment, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
  mixed: "Mixed",
};

function EmergenceIcon({ value }: { value: ThemeEmergence }) {
  if (value === "rising")
    return <TrendingUp className="h-3 w-3 text-emerald-600" aria-label="Rising" />;
  if (value === "declining")
    return <TrendingDown className="h-3 w-3 text-red-600" aria-label="Declining" />;
  return <Minus className="h-3 w-3 text-zinc-400" aria-label="Stable" />;
}

function emergenceLabel(value: ThemeEmergence): string {
  return value === "rising" ? "Rising" : value === "declining" ? "Declining" : "Stable";
}

export function ThemeChips({
  themes,
  showCount = 8,
  onThemeClick,
  activeLabel,
}: {
  themes: Theme[];
  showCount?: number;
  onThemeClick?: (label: string) => void;
  activeLabel?: string | null;
}) {
  const total = themes.length;
  const shown = themes.slice(0, showCount);
  const clickable = !!onThemeClick;

  if (total === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="text-sm font-medium text-zinc-900">Themes</div>
        <div className="mt-3 text-xs text-zinc-500">No themes surfaced.</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-baseline justify-between">
        <div className="text-sm font-medium text-zinc-900">
          Themes <span className="text-zinc-500">({total})</span>
        </div>
        {total > showCount && (
          <span className="text-[11px] text-zinc-400">Top {showCount} by engagement</span>
        )}
      </div>
      <ul className="mt-1 divide-y divide-zinc-100">
        {shown.map((t) => {
          const cat = CATEGORY_STYLE[t.category];
          const isActive = activeLabel === t.label;

          const rowBody = (
            <>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-zinc-500">
                <span className={`rounded px-1.5 py-0.5 font-medium ${cat.bg} ${cat.fg}`}>
                  {t.category}
                </span>
                <span className="inline-flex items-center gap-1">
                  <EmergenceIcon value={t.emergence} />
                  <span className="font-medium tracking-normal normal-case text-zinc-500">
                    {emergenceLabel(t.emergence)}
                  </span>
                </span>
                {clickable && (
                  <ChevronRight className="ml-auto h-3 w-3 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-500" />
                )}
              </div>
              <div className="mt-1 text-[13px] font-medium leading-snug text-zinc-900">
                {t.label}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-zinc-500">
                <span className="inline-flex items-center gap-1">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${SENTIMENT_DOT[t.sentiment]}`}
                  />
                  {SENTIMENT_LABEL[t.sentiment]}
                </span>
                <span>·</span>
                <span>
                  <span className="tabular-nums text-zinc-700">{t.count}</span>{" "}
                  {t.count === 1 ? "mention" : "mentions"}
                </span>
                <span>·</span>
                <span>
                  <span className="tabular-nums text-zinc-700">{fmt.format(t.engagement)}</span>{" "}
                  engagement
                </span>
              </div>
            </>
          );

          const baseClasses = `block w-full text-left py-2.5 px-2 -mx-2 rounded-md transition-colors ${
            isActive ? "bg-zinc-100 ring-1 ring-inset ring-zinc-900/10" : ""
          }`;

          return (
            <li key={t.label} title={t.sample}>
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onThemeClick(t.label)}
                  className={`group ${baseClasses} hover:bg-zinc-50 ${isActive ? "hover:bg-zinc-100" : ""}`}
                  aria-pressed={isActive}
                >
                  {rowBody}
                </button>
              ) : (
                <div className={baseClasses}>{rowBody}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
