import { PageShell } from "@/components/PageShell";

export default function PostCommentsPage() {
  return (
    <PageShell
      breadcrumb="Comment Analysis"
      title="Post Comments"
      subtitle="Comment analysis on bookmarked posts, URL-added posts, and folders that group them into campaigns."
    >
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center text-sm text-zinc-500">
        Folders, URL upload, and per-post comment analysis land here in milestone 5.
      </div>
    </PageShell>
  );
}
