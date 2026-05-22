import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { PlatformBadge } from "@/components/PlatformBadge";
import { analysisRuns } from "@/lib/mock/runs";
import { commentsForPosts } from "@/lib/mock/comments";
import { posts as allPosts } from "@/lib/mock/posts";
import { deriveAnalysisOutput } from "@/lib/mock/analysisOutput";
import type { Platform } from "@/lib/types";

const fmt = new Intl.NumberFormat("en-US");
const TIME_WINDOW_LABEL: Record<string, string> = {
  "24h": "Last 24h",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  all: "All-time",
};

function platformsForRun(currentPostIds: string[]): Platform[] {
  const set = new Set<Platform>();
  for (const id of currentPostIds) {
    const p = allPosts.find((x) => x.id === id);
    if (p) set.add(p.platform);
  }
  return Array.from(set);
}

function sentimentSummary(sentiment: { positive: number; neutral: number; negative: number; mixed: number }): string {
  const top = (Object.entries(sentiment) as Array<[keyof typeof sentiment, number]>)
    .sort((a, b) => b[1] - a[1])[0];
  return `${top[0]} ${top[1]}%`;
}

function relTime(iso: string): string {
  const now = new Date("2026-05-22T15:00:00Z").getTime();
  const then = new Date(iso).getTime();
  const hrs = Math.round((now - then) / 36e5);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export default function SearchCommentsListPage() {
  return (
    <PageShell
      breadcrumb="Comment Analysis"
      title="Search Comments"
      subtitle="Analysis runs defined by a boolean query and a top-X cap, refreshed every 24 hours."
      actions={
        <>
          <SearchInput />
          <Link
            href="/comment-analysis/search-comments/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-zinc-900 px-3 text-sm font-medium text-white hover:bg-black"
          >
            <Plus className="h-4 w-4" />
            New analysis run
          </Link>
        </>
      }
    >
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/60 text-left text-[11px] uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-2.5 font-medium">Name</th>
              <th className="px-4 py-2.5 font-medium">Query</th>
              <th className="px-4 py-2.5 font-medium">Top-X</th>
              <th className="px-4 py-2.5 font-medium">Platforms</th>
              <th className="px-4 py-2.5 font-medium">Posts</th>
              <th className="px-4 py-2.5 font-medium">Comments</th>
              <th className="px-4 py-2.5 font-medium">Sentiment</th>
              <th className="px-4 py-2.5 font-medium">Time window</th>
              <th className="px-4 py-2.5 font-medium">Last refresh</th>
            </tr>
          </thead>
          <tbody>
            {analysisRuns.map((run) => {
              const cs = commentsForPosts(run.currentPostIds);
              const analysis = deriveAnalysisOutput(run.id, cs, run.name);
              const platforms = platformsForRun(run.currentPostIds);
              return (
                <tr key={run.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/40">
                  <td className="px-4 py-3">
                    <Link
                      href={`/comment-analysis/search-comments/${run.id}`}
                      className="font-medium text-zinc-900 hover:underline"
                    >
                      {run.name}
                    </Link>
                  </td>
                  <td className="max-w-[280px] truncate px-4 py-3 font-mono text-[12px] text-zinc-600" title={run.query}>
                    {run.query}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-700">{run.topX}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1">
                      {platforms.map((p) => (
                        <PlatformBadge key={p} platform={p} size="xs" />
                      ))}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-700">{run.currentPostIds.length}</td>
                  <td className="px-4 py-3 tabular-nums text-zinc-700">{fmt.format(analysis.totalComments)}</td>
                  <td className="px-4 py-3 text-zinc-700">{sentimentSummary(analysis.sentiment)}</td>
                  <td className="px-4 py-3 text-zinc-700">{TIME_WINDOW_LABEL[run.timeWindow]}</td>
                  <td className="px-4 py-3 text-zinc-500">{relTime(run.lastRefreshedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {analysisRuns.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-zinc-500">
            No analysis runs yet.{" "}
            <Link href="/comment-analysis/search-comments/new" className="text-zinc-900 underline">
              Create one
            </Link>
            .
          </div>
        )}
      </div>
    </PageShell>
  );
}

function SearchInput() {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
      <input
        placeholder="Search runs"
        className="h-9 w-56 rounded-md border border-zinc-200 bg-white pl-8 pr-3 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
      />
    </div>
  );
}
