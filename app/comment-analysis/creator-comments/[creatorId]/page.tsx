import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, RefreshCw, BadgeCheck } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { PlatformBadge, platformName } from "@/components/PlatformBadge";
import { CreatorDashboard } from "@/components/creator/CreatorDashboard";
import { getCreator } from "@/lib/mock/creators";
import { postsByCreator } from "@/lib/mock/posts";
import { commentsForPosts } from "@/lib/mock/comments";

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
  const comments = commentsForPosts(posts.map((p) => p.id));

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
      <CreatorDashboard creator={creator} posts={posts} comments={comments} />
    </PageShell>
  );
}
