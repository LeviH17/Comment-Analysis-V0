"use client";

import { Check } from "lucide-react";
import type { KeyboardEvent } from "react";
import type { Post } from "@/lib/types";
import { PostPreview } from "@/components/post/PostPreview";

export function SelectablePostPreview({
  post,
  selected,
  onToggle,
}: {
  post: Post;
  selected: boolean;
  onToggle: () => void;
}) {
  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={handleKey}
      className={`cursor-pointer rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 ${
        selected ? "ring-2 ring-zinc-900 ring-offset-2" : "hover:ring-1 hover:ring-zinc-300"
      }`}
    >
      <PostPreview
        post={post}
        trailing={
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-md shadow-sm transition-colors ${
              selected
                ? "bg-zinc-900 text-white"
                : "border border-zinc-300 bg-white/90 text-transparent"
            }`}
          >
            <Check className="h-3 w-3" />
          </span>
        }
      />
    </div>
  );
}
