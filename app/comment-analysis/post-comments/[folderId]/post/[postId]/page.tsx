import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { ExecutiveSummary } from "@/components/analysis/ExecutiveSummary";
import { SentimentDonut } from "@/components/analysis/SentimentDonut";
import { ThemeChips } from "@/components/analysis/ThemeChips";
import { DemographicsBars, capitalize } from "@/components/analysis/DemographicsBars";
import { NotableComments } from "@/components/analysis/NotableComments";
import { AudienceSignals } from "@/components/analysis/AudienceSignals";
import { VolumeSparkline } from "@/components/analysis/VolumeSparkline";
import { CommentFeed } from "@/components/analysis/CommentFeed";
import { MetricCard } from "@/components/MetricCard";
import { PostCard } from "@/components/post/PostCard";
import { getFolder } from "@/lib/mock/folders";
import { getPost } from "@/lib/mock/posts";
import { commentsForPost } from "@/lib/mock/comments";
import { deriveAnalysisOutput } from "@/lib/mock/analysisOutput";

const fmt = new Intl.NumberFormat("en-US");

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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <PostCard post={post} />

          <ExecutiveSummary text={analysis.executiveSummary} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-4">
              <SentimentDonut sentiment={analysis.sentiment} total={analysis.totalComments} />
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
            hint="Comments ingested for this post"
          />
          <MetricCard
            label="Post engagement"
            value={fmt.format(post.engagement.likes + post.engagement.comments + post.engagement.shares)}
            hint="Likes + comments + shares"
          />
          {post.engagement.views !== undefined && (
            <MetricCard
              label="Views"
              value={fmt.format(post.engagement.views)}
              hint="Platform-native view count"
            />
          )}

          <AudienceSignals signals={analysis.audienceSignals} />
        </div>
      </div>
    </PageShell>
  );
}
