import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, RefreshCw, BadgeCheck } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { PlatformBadge, platformName } from "@/components/PlatformBadge";
import { ExecutiveSummary } from "@/components/analysis/ExecutiveSummary";
import { SentimentDonut } from "@/components/analysis/SentimentDonut";
import { ThemesWithFlyout } from "@/components/analysis/ThemesWithFlyout";
import { DemographicsBars, capitalize } from "@/components/analysis/DemographicsBars";
import { TopCommenters } from "@/components/analysis/TopCommenters";
import { ActivityHeatmap } from "@/components/analysis/ActivityHeatmap";
import { NotableComments } from "@/components/analysis/NotableComments";
import { VolumeSparkline } from "@/components/analysis/VolumeSparkline";
import { SeeAllCommentsButton } from "@/components/analysis/SeeAllCommentsButton";
import { MetricCard } from "@/components/MetricCard";
import { PostPreview } from "@/components/post/PostPreview";
import { getCreator } from "@/lib/mock/creators";
import { postsByCreator } from "@/lib/mock/posts";
import { commentsForPosts } from "@/lib/mock/comments";
import { deriveAnalysisOutput } from "@/lib/mock/analysisOutput";
import type { Sentiment } from "@/lib/types";

const fmt = new Intl.NumberFormat("en-US");

const SENTIMENT_DOT: Record<Sentiment, string> = {
  positive: "bg-emerald-500",
  neutral: "bg-zinc-400",
  negative: "bg-red-500",
  mixed: "bg-amber-500",
};

export default async function CreatorDetailPage({
  params,
}: {
  params: Promise<{ creatorId: string }>;
}) {
  const { creatorId } = await params;
  const creator = getCreator(creatorId);
  if (!creator) return notFound();

  const posts = postsByCreator(creator.id);
  const commentSet = commentsForPosts(posts.map((p) => p.id));
  const analysis = deriveAnalysisOutput(creator.id, commentSet, creator.name);

  const topSentimentEntries = Object.entries(analysis.sentiment) as Array<[Sentiment, number]>;
  const topSentiment = [...topSentimentEntries].sort((a, b) => b[1] - a[1])[0];
  const topRegion = analysis.demographics.country[0];

  return (
    <PageShell
      breadcrumb={
        <Link href="/comment-analysis/creator-comments" className="inline-flex items-center gap-1 hover:text-zinc-900">
          <ArrowLeft className="h-3 w-3" />
          Creator Comments
        </Link>
      }
      title={creator.name}
      subtitle={
        <span className="inline-flex flex-wrap items-center gap-1.5 text-zinc-500">
          <PlatformBadge platform={creator.platform} size="xs" />
          {platformName(creator.platform)}
          <span>·</span>
          <span className="font-mono text-zinc-700">{creator.handle}</span>
          <span>·</span>
          <span>{fmt.format(creator.followers)} followers</span>
          {creator.verified && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
              <BadgeCheck className="h-3 w-3" />
              Verified
            </span>
          )}
        </span>
      }
      actions={
        <>
          <div className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            Last 7 days
          </div>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 hover:bg-zinc-50">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Comments"
            value={fmt.format(analysis.totalComments)}
            sparkline={<VolumeSparkline points={analysis.volumeOverTime} />}
            footer={
              <SeeAllCommentsButton
                title={creator.name}
                subtitle={`${creator.handle} · Creator comment analysis`}
                comments={commentSet}
                analysis={analysis}
              />
            }
          />
          <MetricCard
            label="Posts tracked"
            value={posts.length}
            hint="Recent posts with comments analyzed"
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
          <ThemesWithFlyout
            themes={analysis.themes}
            allComments={commentSet}
            flyoutSubtitle={`Theme view · ${creator.name}`}
          />
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

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
          <TopCommenters commenters={analysis.topCommenters} />
          <ActivityHeatmap cells={analysis.activityHeatmap} />
        </div>

        <NotableComments notable={analysis.notableComments} />

        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-4 flex items-baseline justify-between">
            <div className="text-sm font-medium text-zinc-900">Tracked posts</div>
            <span className="text-[11px] text-zinc-500">{posts.length}</span>
          </div>
          {posts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-xs text-zinc-500">
              No posts ingested yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <PostPreview key={p.id} post={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}
