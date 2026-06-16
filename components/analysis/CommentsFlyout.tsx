"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, X } from "lucide-react";
import type { Comment, CommentAnalysisOutput } from "@/lib/types";
import { CommentFeed } from "@/components/analysis/CommentFeed";
import { ExecutiveSummary } from "@/components/analysis/ExecutiveSummary";
import { ThemeChips } from "@/components/analysis/ThemeChips";

export function CommentsFlyout({
  open,
  onClose,
  title,
  subtitle,
  comments,
  analysis,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  comments: Comment[];
  analysis: CommentAnalysisOutput;
}) {
  const [themeFilter, setThemeFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setThemeFilter(null);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const filteredComments = useMemo(() => {
    if (!themeFilter) return comments;
    return comments.filter((c) => c.themes.includes(themeFilter));
  }, [comments, themeFilter]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-zinc-900/30"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="relative flex h-full w-full max-w-6xl flex-col bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={`All comments for ${title}`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-zinc-100 px-6 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold tracking-tight text-zinc-900">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 truncate text-xs text-zinc-500">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden w-[340px] flex-shrink-0 overflow-y-auto border-r border-zinc-100 bg-zinc-50/40 px-5 py-5 md:block">
            <div className="space-y-5">
              <ExecutiveSummary text={analysis.executiveSummary} />
              <ThemeChips
                themes={analysis.themes}
                showCount={8}
                onThemeClick={(label) =>
                  setThemeFilter((current) => (current === label ? null : label))
                }
                activeLabel={themeFilter}
              />
              {analysis.themes.length > 0 && (
                <p className="text-[11px] leading-4 text-zinc-400">
                  Click a theme to filter the comments feed to only comments tagged
                  with it.
                </p>
              )}
            </div>
          </aside>
          <main className="flex flex-1 flex-col overflow-y-auto bg-zinc-50/30 px-5 py-5">
            {themeFilter && (
              <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md border border-zinc-900 bg-zinc-900 px-3 py-2 text-xs text-white">
                <Filter className="h-3 w-3 flex-shrink-0" />
                <span className="min-w-0 truncate">
                  Filtered to theme:{" "}
                  <span className="font-medium">{themeFilter}</span>
                </span>
                <span className="ml-auto inline-flex items-center gap-2 tabular-nums opacity-80">
                  {filteredComments.length} of {comments.length} comments
                  <button
                    type="button"
                    onClick={() => setThemeFilter(null)}
                    aria-label="Clear theme filter"
                    className="rounded-full p-0.5 transition-colors hover:bg-white/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </div>
            )}
            <CommentFeed comments={filteredComments} />
          </main>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-zinc-100 px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            Close
          </button>
        </footer>
      </aside>
    </div>
  );
}
