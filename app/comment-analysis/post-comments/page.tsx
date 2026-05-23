import Link from "next/link";
import { Search, Folder as FolderIcon } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { NewFolderDialog } from "@/components/NewFolderDialog";
import { folders } from "@/lib/mock/folders";
import { commentsForPosts } from "@/lib/mock/comments";
import { deriveAnalysisOutput } from "@/lib/mock/analysisOutput";

const fmt = new Intl.NumberFormat("en-US");

function sentimentSummary(sentiment: { positive: number; neutral: number; negative: number; mixed: number }): string {
  const top = (Object.entries(sentiment) as Array<[keyof typeof sentiment, number]>)
    .sort((a, b) => b[1] - a[1])[0];
  return `${top[0]} ${top[1]}%`;
}

const REFRESH_LABEL = "3h ago";

export default function PostCommentsListPage() {
  return (
    <PageShell
      breadcrumb="Comment Analysis"
      title="Post Comments"
      subtitle="Comment analysis on bookmarked posts and URL-added posts, grouped into folders for campaign tracking."
      actions={
        <>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              placeholder="Search folders"
              className="h-9 w-56 rounded-md border border-zinc-200 bg-white pl-8 pr-3 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
            />
          </div>
          <NewFolderDialog />
        </>
      }
    >
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/60 text-left text-[11px] uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-2.5 font-medium">Folder</th>
              <th className="px-4 py-2.5 font-medium">Posts</th>
              <th className="px-4 py-2.5 font-medium">Comments</th>
              <th className="px-4 py-2.5 font-medium">Sentiment</th>
              <th className="px-4 py-2.5 font-medium">Top theme</th>
              <th className="px-4 py-2.5 font-medium">Last refresh</th>
            </tr>
          </thead>
          <tbody>
            {folders.map((f) => {
              const cs = commentsForPosts(f.postIds);
              const analysis = deriveAnalysisOutput(f.id, cs, f.name);
              return (
                <tr key={f.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/40">
                  <td className="px-4 py-3">
                    <Link
                      href={`/comment-analysis/post-comments/${f.id}`}
                      className="flex items-start gap-2.5"
                    >
                      <FolderIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-400" />
                      <div className="min-w-0">
                        <div className="font-medium text-zinc-900 hover:underline">{f.name}</div>
                        {f.description && (
                          <div className="line-clamp-1 text-[12px] text-zinc-500">{f.description}</div>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-700">{f.postIds.length}</td>
                  <td className="px-4 py-3 tabular-nums text-zinc-700">{fmt.format(analysis.totalComments)}</td>
                  <td className="px-4 py-3 text-zinc-700">{sentimentSummary(analysis.sentiment)}</td>
                  <td className="px-4 py-3 text-zinc-700">{analysis.themes[0]?.label ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-500">{REFRESH_LABEL}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {folders.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-zinc-500">No folders yet.</div>
        )}
      </div>
    </PageShell>
  );
}
