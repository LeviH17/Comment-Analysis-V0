import Link from "next/link";
import { Search } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { PlatformBadge } from "@/components/PlatformBadge";
import { AddCreatorDialog } from "@/components/AddCreatorDialog";
import { creators } from "@/lib/mock/creators";
import { postsByCreator } from "@/lib/mock/posts";
import { commentsForPosts } from "@/lib/mock/comments";
import { deriveAnalysisOutput } from "@/lib/mock/analysisOutput";

const fmt = new Intl.NumberFormat("en-US");

function topThemeLabel(themes: Array<{ label: string; count: number }>): string {
  return themes[0]?.label ?? "—";
}

function sentimentSummary(sentiment: { positive: number; neutral: number; negative: number; mixed: number }): string {
  const top = (Object.entries(sentiment) as Array<[keyof typeof sentiment, number]>)
    .sort((a, b) => b[1] - a[1])[0];
  return `${top[0]} ${top[1]}%`;
}

const REFRESH_LABEL = "5h ago";

export default function CreatorCommentsListPage() {
  return (
    <PageShell
      breadcrumb="Comment Analysis"
      title="Creator Comments"
      subtitle="Comment analysis on every post by creators you're tracking. Historical backfill on add, then ongoing ingestion as new posts publish."
      actions={
        <>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              placeholder="Search creators"
              className="h-9 w-56 rounded-md border border-zinc-200 bg-white pl-8 pr-3 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
            />
          </div>
          <AddCreatorDialog />
        </>
      }
    >
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/60 text-left text-[11px] uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-2.5 font-medium">Creator</th>
              <th className="px-4 py-2.5 font-medium">Posts</th>
              <th className="px-4 py-2.5 font-medium">Comments</th>
              <th className="px-4 py-2.5 font-medium">Sentiment</th>
              <th className="px-4 py-2.5 font-medium">Top theme</th>
              <th className="px-4 py-2.5 font-medium">Last refresh</th>
            </tr>
          </thead>
          <tbody>
            {creators.map((c) => {
              const posts = postsByCreator(c.id);
              const cs = commentsForPosts(posts.map((p) => p.id));
              const analysis = deriveAnalysisOutput(c.id, cs, c.name);
              return (
                <tr key={c.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/40">
                  <td className="px-4 py-3">
                    <Link
                      href={`/comment-analysis/creator-comments/${c.id}`}
                      className="flex items-center gap-2.5"
                    >
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-semibold text-zinc-700">
                        {c.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-zinc-900 hover:underline">{c.name}</span>
                          <PlatformBadge platform={c.platform} size="xs" />
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {c.handle} · {fmt.format(c.followers)} followers
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-700">{posts.length}</td>
                  <td className="px-4 py-3 tabular-nums text-zinc-700">{fmt.format(analysis.totalComments)}</td>
                  <td className="px-4 py-3 text-zinc-700">{sentimentSummary(analysis.sentiment)}</td>
                  <td className="px-4 py-3 text-zinc-700">{topThemeLabel(analysis.themes)}</td>
                  <td className="px-4 py-3 text-zinc-500">{REFRESH_LABEL}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
