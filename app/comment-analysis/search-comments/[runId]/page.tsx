import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, RefreshCw, Calendar } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { RunDashboard } from "@/components/run/RunDashboard";
import { getAnalysisRun } from "@/lib/mock/runs";
import { commentsForPosts } from "@/lib/mock/comments";
import { getPost } from "@/lib/mock/posts";

const TIME_WINDOW_LABEL: Record<string, string> = {
  "24h": "Last 24 hours",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  all: "All-time",
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
  const comments = commentsForPosts(run.currentPostIds);

  const lastRefresh = new Date(run.lastRefreshedAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
      <RunDashboard
        run={run}
        currentPosts={currentPosts}
        droppedPosts={droppedPosts}
        comments={comments}
        lastRefresh={lastRefresh}
      />
    </PageShell>
  );
}
