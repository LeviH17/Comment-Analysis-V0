import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { PostDetailDashboard } from "@/components/post/PostDetailDashboard";
import { getFolder } from "@/lib/mock/folders";
import { getPost } from "@/lib/mock/posts";
import { commentsForPost } from "@/lib/mock/comments";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ folderId: string; postId: string }>;
}) {
  const { folderId, postId } = await params;
  const folder = getFolder(folderId);
  const post = getPost(postId);
  if (!folder || !post) return notFound();

  const comments = commentsForPost(post.id);

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
      <PostDetailDashboard folder={folder} post={post} comments={comments} />
    </PageShell>
  );
}
