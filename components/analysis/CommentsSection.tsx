"use client";

import { useState } from "react";
import { CommentFeed } from "@/components/analysis/CommentFeed";
import { CommentsFlyout } from "@/components/analysis/CommentsFlyout";
import type { Comment, CommentAnalysisOutput } from "@/lib/types";

export function CommentsSection({
  title,
  subtitle,
  comments,
  analysis,
  previewLimit = 5,
}: {
  title: string;
  subtitle?: string;
  comments: Comment[];
  analysis: CommentAnalysisOutput;
  previewLimit?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CommentFeed
        comments={comments}
        preview
        previewLimit={previewLimit}
        onShowAll={() => setOpen(true)}
      />
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
