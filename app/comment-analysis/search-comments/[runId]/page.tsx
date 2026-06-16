import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, RefreshCw, Calendar, MessageSquare } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { ExecutiveSummary } from "@/components/analysis/ExecutiveSummary";
import { SentimentDonut } from "@/components/analysis/SentimentDonut";
import { ThemeChips } from "@/components/analysis/ThemeChips";
import { DemographicsBars, capitalize } from "@/components/analysis/DemographicsBars";
import { NotableComments } from "@/components/analysis/NotableComments";
import { VolumeSparkline } from "@/components/analysis/VolumeSparkline";
import { SeeAllCommentsButton } from "@/components/analysis/SeeAllCommentsButton";
import { MetricCard } from "@/components/MetricCard";
import { PostPreview } from "@/components/post/PostPreview";
import { getAnalysisRun } from "@/lib/mock/runs";
import { commentsForPosts } from "@/lib/mock/comments";
import { getPost } from "@/lib/mock/posts";
import { deriveAnalysisOutput } from "@/lib/mock/analysisOutput";
import type { Sentiment } from "@/lib/types";

const TIME_WINDOW_LABEL: Record<string, string> = {
  "24h": "Last 24 hours",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  all: "All-time",
};

const fmt = new Intl.NumberFormat("en-US");

const SENTIMENT_DOT: Record<Sentiment, string> = {
  positive: "bg-emerald-500",
  neutral: "bg-zinc-400",
  negative: "bg-red-500",
  mixed: "bg-amber-500",
};

export default async function AnalysisRunDetailPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  const run = getAnalysisRun(runId);
  if (!run) return notFound();

  const currentPosts = run.currentPostIds.map((id) => getPost(id)).filter((p) => p !== undefined);
  const droppedPosts = run.droppedPostIds.map((id) => getPost(id)).filter((p) => p !== undefined);
  const commentSet = commentsForPosts(run.currentPostIds);
  const analysis = deriveAnalysisOutput(run.id, commentSet, run.name);

  const lastRefresh = new Date(run.lastRefreshedAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const topSentimentEntries = Object.entries(analysis.sentiment) as Array<[Sentiment, number]>;
  const topSentiment = [...topSentimentEntries].sort((a, b) => b[1] - a[1])[0];
  const topRegion = analysis.demographics.country[0];

  return (
    <PageShell
      breadcrumb={
        <Link href="/comment-analysis/search-comments" className="inline-flex items-center gap-1 hover:text-zinc-900">
          <ArrowLeft className="h-3 w-3" />
          Search Comments
        </Link>
      }
      title={run.name}
      subtitle={<span className="font-mono text-[12px] text-zinc-600">{run.query}</span>}
      actions={
        <>
          <div className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            {TIME_WINDOW_LABEL[run.timeWindow]}
          </div>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 hover:bg-zinc-50">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <RunMeta run={run} lastRefresh={lastRefresh} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Comments"
            value={fmt.format(analysis.totalComments)}
            sparkline={<VolumeSparkline points={analysis.volumeOverTime} />}
            footer={
              <SeeAllCommentsButton
                title={run.name}
                subtitle={run.query}
                comments={commentSet}
                analysis={analysis}
              />
            }
          />
          <MetricCard
            label="Posts in top-X"
            value={`${currentPosts.length} / ${run.topX}`}
            hint="Top posts by engagement currently in the analysis window"
          />
          <MetricCard
            label="Top sentiment"
            value={
              <span className="inline-flex items-baseline gap-2">
                <span
                  className={`inline-block h-2.5 w-2.5 translate-y-[-2px] rounded-full ${SENTIMENT_DOT[topSentiment[0]]}`}
                />
                <span>{capitalize(topSentiment[0])}</span>
                <span className="text-base font-normal text-zinc-500">{topSentiment[1]}%</span>
              </span>
            }
          />
          <MetricCard
            label="Top location"
            value={
              topRegion ? (
                <span className="inline-flex items-baseline gap-2">
                  <span className="truncate">{topRegion.label}</span>
                  <span className="text-base font-normal text-zinc-500">{topRegion.pct}%</span>
                </span>
              ) : (
                "—"
              )
            }
          />
        </div>

        <ExecutiveSummary text={analysis.executiveSummary} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SentimentDonut sentiment={analysis.sentiment} total={analysis.totalComments} />
          <ThemeChips themes={analysis.themes} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <DemographicsBars title="Commenter age" buckets={analysis.demographics.age} />
          <DemographicsBars
            title="Commenter gender"
            buckets={analysis.demographics.gender}
            formatLabel={capitalize}
          />
          <DemographicsBars
            title="Commenter location"
            buckets={analysis.demographics.country}
            limit={5}
          />
        </div>

        <NotableComments notable={analysis.notableComments} />

        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-4 flex items-baseline justify-between">
            <div className="text-sm font-medium text-zinc-900">Top-X posts</div>
            <span className="text-[11px] text-zinc-500">
              {currentPosts.length} active
              {droppedPosts.length > 0 ? ` · ${droppedPosts.length} dropped` : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {currentPosts.map((p) => (
              <PostPreview
                key={p.id}
                post={p}
                trailing={
                  <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                    New
                  </span>
                }
              />
            ))}
            {droppedPosts.map((p) => (
              <PostPreview
                key={p.id}
                post={p}
                trailing={
                  <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                    Dropped
                  </span>
                }
              />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function RunMeta({
  run,
  lastRefresh,
}: {
  run: { topX: number; timeWindow: string };
  lastRefresh: string;
}) {
  return (
    <div className="-mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-zinc-500">
      <span className="inline-flex items-center gap-1">
        <MessageSquare className="h-3 w-3" />
        Top-X cap: <span className="tabular-nums text-zinc-700">{run.topX}</span>
      </span>
      <span>·</span>
      <span>Refreshes every 24h · last refresh {lastRefresh}</span>
    </div>
  );
}
