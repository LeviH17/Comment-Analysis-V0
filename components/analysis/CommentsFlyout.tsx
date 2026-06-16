"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
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
  useEffect(() => {
    if (!open) return;
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
          <aside className="hidden w-[320px] flex-shrink-0 overflow-y-auto border-r border-zinc-100 bg-zinc-50/40 px-5 py-5 md:block">
            <div className="space-y-5">
              <ExecutiveSummary text={analysis.executiveSummary} />
              <ThemeChips themes={analysis.themes} showCount={6} />
            </div>
          </aside>
          <main className="flex-1 overflow-y-auto bg-zinc-50/30 px-5 py-5">
            <CommentFeed comments={comments} />
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
