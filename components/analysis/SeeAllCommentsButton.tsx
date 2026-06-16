"use client";

import { useState } from "react";
import { ArrowRight, MessageSquare } from "lucide-react";
import type { Comment, CommentAnalysisOutput } from "@/lib/types";
import { CommentsFlyout } from "@/components/analysis/CommentsFlyout";

export function SeeAllCommentsButton({
  title,
  subtitle,
  comments,
  analysis,
  variant = "ghost",
}: {
  title: string;
  subtitle?: string;
  comments: Comment[];
  analysis: CommentAnalysisOutput;
  variant?: "ghost" | "solid";
}) {
  const [open, setOpen] = useState(false);

  const classes =
    variant === "solid"
      ? "inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-zinc-900 px-3 text-sm font-medium text-white hover:bg-black"
      : "inline-flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[12px] text-zinc-700 hover:bg-zinc-50";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={classes}>
        <span className="inline-flex items-center gap-1.5">
          <MessageSquare className="h-3.5 w-3.5 text-zinc-500" />
          See all comments
        </span>
        <ArrowRight className="h-3 w-3 opacity-60" />
      </button>
      <CommentsFlyout
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        subtitle={subtitle}
        comments={comments}
        analysis={analysis}
      />
    </>
  );
}
