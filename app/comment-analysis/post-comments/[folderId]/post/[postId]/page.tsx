import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PageShell } from "@/components/PageShell";
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
import { PostCard } from "@/components/post/PostCard";
import { getFolder } from "@/lib/mock/folders";
import { getPost } from "@/lib/mock/posts";
import { commentsForPost } from "@/lib/mock/comments";
import { deriveAnalysisOutput } from "@/lib/mock/analysisOutput";
import type { Sentiment } from "@/lib/types";

const fmt = new Intl.NumberFormat("en-US");

const SENTIMENT_DOT: Record<Sentiment, string> = {
  positive: "bg-emerald-500",
  neutral: "bg-zinc-400",
  negative: "bg-red-500",
  mixed: "bg-amber-500",
};

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ folderId: string; postId: string }>;
}) {
  const { folderId, postId } = await params;
  const folder = getFolder(folderId);
  const post = getPost(postId);
  if (!folder || !post) return notFound();

  const commentSet = commentsForPost(post.id);
  const analysis = deriveAnalysisOutput(post.id, commentSet, post.title ?? post.body.slice(0, 60));

  const topSentimentEntries = Object.entries(analysis.sentiment) as Array<[Sentiment, number]>;
  const topSentiment = [...topSentimentEntries].sort((a, b) => b[1] - a[1])[0];
  const topRegion = analysis.demographics.country[0];

  return (
    <PageShell
      breadcrumb={
        <span className="inline-flex items-center gap-2">
          <Link href="/comment-analysis/post-comments" className="hover:text-zinc-900">
            Post Comments
          </Link>
          <span>/</span>
          <Link href={`/comment-analysis/post-comments/${folder.id}`} className="inline-flex items-center gap-1 hover:text-zinc-900">
            <ArrowLeft className="h-3 w-3" />
            {folder.name}
          </Link>
        </span>
      }
      title={post.title ?? "Post comment analysis"}
      subtitle="Per-post comment analysis scoped to this single post."
      actions={
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 hover:bg-zinc-50"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open post
        </a>
      }
    >
      <div className="space-y-6">
        <PostCard post={post} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Comments"
            value={fmt.format(analysis.totalComments)}
            sparkline={<VolumeSparkline points={analysis.volumeOverTime} />}
            footer={
              <SeeAllCommentsButton
                title={post.title ?? "Post comment analysis"}
                subtitle={`${folder.name} · Per-post comment analysis`}
                comments={commentSet}
                analysis={analysis}
              />
            }
          />
          <MetricCard
            label="Post engagement"
            value={fmt.format(post.engagement.likes + post.engagement.comments + post.engagement.shares)}
            hint="Likes + comments + shares"
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
            label={post.engagement.views !== undefined ? "Views" : "Top location"}
            value={
              post.engagement.views !== undefined ? (
                fmt.format(post.engagement.views)
              ) : topRegion ? (
                <span className="inline-flex items-baseline gap-2">
                  <span className="truncate">{topRegion.label}</span>
                  <span className="text-base font-normal text-zinc-500">{topRegion.pct}%</span>
                </span>
              ) : (
                "—"
              )
            }
            hint={post.engagement.views !== undefined ? "Platform-native view count" : undefined}
          />
        </div>

        <ExecutiveSummary text={analysis.executiveSummary} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SentimentDonut sentiment={analysis.sentiment} total={analysis.totalComments} />
          <ThemesWithFlyout
            themes={analysis.themes}
            allComments={commentSet}
            flyoutSubtitle={`Theme view · ${post.title ?? "this post"} · ${folder.name}`}
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
      </div>
    </PageShell>
  );
}
