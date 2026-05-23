import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, RefreshCw } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { ExecutiveSummary } from "@/components/analysis/ExecutiveSummary";
import { SentimentDonut } from "@/components/analysis/SentimentDonut";
import { ThemeChips } from "@/components/analysis/ThemeChips";
import { NotableComments } from "@/components/analysis/NotableComments";
import { AudienceSignals } from "@/components/analysis/AudienceSignals";
import { VolumeSparkline } from "@/components/analysis/VolumeSparkline";
import { CommentFeed } from "@/components/analysis/CommentFeed";
import { MetricCard } from "@/components/MetricCard";
import { PostCard } from "@/components/post/PostCard";
import { getFolder } from "@/lib/mock/folders";
import { getPost } from "@/lib/mock/posts";
import { commentsForPosts } from "@/lib/mock/comments";
import { deriveAnalysisOutput } from "@/lib/mock/analysisOutput";

const fmt = new Intl.NumberFormat("en-US");

export default async function FolderDetailPage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const { folderId } = await params;
  const folder = getFolder(folderId);
  if (!folder) return notFound();

  const posts = folder.postIds.map((id) => getPost(id)).filter((p) => p !== undefined);
  const commentSet = commentsForPosts(folder.postIds);
  const analysis = deriveAnalysisOutput(folder.id, commentSet, folder.name);

  return (
    <PageShell
      breadcrumb={
        <Link href="/comment-analysis/post-comments" className="inline-flex items-center gap-1 hover:text-zinc-900">
          <ArrowLeft className="h-3 w-3" />
          Post Comments
        </Link>
      }
      title={folder.name}
      subtitle={folder.description}
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
            hint="Aggregate across all posts in this folder"
          />
          <MetricCard
            label="Posts in folder"
            value={posts.length}
            hint="URL-added or bookmarked posts"
          />

          <AudienceSignals signals={analysis.audienceSignals} />

          <section className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-zinc-900">Posts in folder</div>
              <span className="text-[11px] text-zinc-500">{posts.length}</span>
            </div>
            <ul className="mt-3 space-y-2.5">
              {posts.map((p) => (
                <li key={p.id}>
                  <PostCard
                    post={p}
                    href={`/comment-analysis/post-comments/${folder.id}/post/${p.id}`}
                  />
                </li>
              ))}
              {posts.length === 0 && (
                <li className="rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-xs text-zinc-500">
                  No posts in this folder yet.
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
