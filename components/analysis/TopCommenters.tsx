import type { Sentiment, TopCommenter } from "@/lib/types";
import { PlatformBadge } from "@/components/PlatformBadge";

const fmt = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

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

function initials(handle: string): string {
  return handle.replace(/^[@u/]+/, "").slice(0, 2).toUpperCase();
}

export function TopCommenters({ commenters }: { commenters: TopCommenter[] }) {
  if (commenters.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="text-sm font-medium text-zinc-900">Top commenters</div>
        <div className="mt-3 text-xs text-zinc-500">
          No commenters surfaced yet.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <div className="text-sm font-medium text-zinc-900">Top commenters</div>
          <div className="text-[11px] text-zinc-500">Voices driving the most engagement</div>
        </div>
        <span className="text-[11px] text-zinc-500">
          {commenters.length} {commenters.length === 1 ? "amplifier" : "amplifiers"}
        </span>
      </div>
      <ul className="divide-y divide-zinc-100">
        {commenters.map((c) => (
          <li key={c.handle} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-start gap-2.5">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-semibold text-zinc-700">
                {initials(c.handle)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-medium text-zinc-900">{c.handle}</span>
                  {c.platforms.map((p) => (
                    <PlatformBadge key={p} platform={p} size="xs" />
                  ))}
                  <span className="ml-auto whitespace-nowrap text-[11px] tabular-nums text-zinc-700">
                    {fmt.format(c.totalEngagement)}{" "}
                    <span className="text-zinc-400">eng</span>
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-zinc-700">
                  &ldquo;{c.representativeComment}&rdquo;
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-zinc-500">
                  <span className="inline-flex items-center gap-1">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${SENTIMENT_DOT[c.dominantSentiment]}`}
                    />
                    {SENTIMENT_LABEL[c.dominantSentiment]}
                  </span>
                  <span>·</span>
                  <span>
                    <span className="tabular-nums text-zinc-700">{c.commentCount}</span>{" "}
                    {c.commentCount === 1 ? "comment" : "comments"}
                  </span>
                  {c.topTheme && (
                    <>
                      <span>·</span>
                      <span className="truncate" title={c.topTheme}>
                        {c.topTheme}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
