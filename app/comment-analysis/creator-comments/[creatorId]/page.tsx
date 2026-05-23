import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, RefreshCw, BadgeCheck } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { PlatformBadge, platformName } from "@/components/PlatformBadge";
import { ExecutiveSummary } from "@/components/analysis/ExecutiveSummary";
import { SentimentDonut } from "@/components/analysis/SentimentDonut";
import { ThemeChips } from "@/components/analysis/ThemeChips";
import { NotableComments } from "@/components/analysis/NotableComments";
import { AudienceSignals } from "@/components/analysis/AudienceSignals";
import { VolumeSparkline } from "@/components/analysis/VolumeSparkline";
import { CommentFeed } from "@/components/analysis/CommentFeed";
import { MetricCard } from "@/components/MetricCard";
import { PostCard } from "@/components/post/PostCard";
import { getCreator } from "@/lib/mock/creators";
import { postsByCreator } from "@/lib/mock/posts";
import { commentsForPosts } from "@/lib/mock/comments";
import { deriveAnalysisOutput } from "@/lib/mock/analysisOutput";

const fmt = new Intl.NumberFormat("en-US");

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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <ExecutiveSummary text={analysis.executiveSummary} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SentimentDonut sentiment={analysis.sentiment} total={analysis.totalComments} />
            <ThemeChips themes={analysis.themes} />
          </div>

          <NotableComments notable={analysis.notableComments} />

          <CommentFeed comments={commentSet} />
        </div>

        <div className="space-y-4">
          <MetricCard
            label="Comments analyzed"
            value={fmt.format(analysis.totalComments)}
            sparkline={<VolumeSparkline points={analysis.volumeOverTime} />}
            hint="Across all tracked posts by this creator"
          />
          <MetricCard
            label="Posts tracked"
            value={posts.length}
            hint="Recent posts with comments analyzed"
          />
          <MetricCard
            label="Followers"
            value={fmt.format(creator.followers)}
            hint="Platform-native follower count"
          />

          <AudienceSignals signals={analysis.audienceSignals} />

          <section className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-zinc-900">Tracked posts</div>
              <span className="text-[11px] text-zinc-500">{posts.length}</span>
            </div>
            <ul className="mt-3 space-y-2.5">
              {posts.map((p) => (
                <li key={p.id}>
                  <PostCard post={p} />
                </li>
              ))}
              {posts.length === 0 && (
                <li className="rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-xs text-zinc-500">
                  No posts ingested yet.
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
