import type { NotableComment } from "@/lib/types";
import { getComment } from "@/lib/mock/comments";
import { Quote } from "lucide-react";

export function NotableComments({ notable }: { notable: NotableComment[] }) {
  if (notable.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="text-sm font-medium text-zinc-900">Notable comments</div>
        <div className="mt-3 text-xs text-zinc-500">No notable comments to surface yet.</div>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="text-sm font-medium text-zinc-900">Notable comments</div>
      <ul className="mt-3 space-y-3">
        {notable.map((n) => {
          const c = getComment(n.commentId);
          if (!c) return null;
          return (
            <li key={n.commentId} className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-3">
              <div className="flex items-start gap-2">
                <Quote className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-zinc-300" />
                <div className="min-w-0">
                  <p className="text-sm leading-5 text-zinc-800">{c.body}</p>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-zinc-500">
                    <span className="font-medium text-zinc-700">{c.authorHandle}</span>
                    <span>·</span>
                    <span>{c.likes.toLocaleString()} likes</span>
                  </div>
                  <div className="mt-1.5 text-[11px] italic text-zinc-500">{n.reason}</div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
