import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, RefreshCw } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { FolderDashboard } from "@/components/folder/FolderDashboard";
import { getFolder } from "@/lib/mock/folders";
import { getPost } from "@/lib/mock/posts";
import type { Post } from "@/lib/types";

export default async function FolderDetailPage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const { folderId } = await params;
  const folder = getFolder(folderId);
  if (!folder) return notFound();

  const posts = folder.postIds
    .map((id) => getPost(id))
    .filter((p): p is Post => p !== undefined);

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
      <FolderDashboard folder={folder} posts={posts} />
    </PageShell>
  );
}
