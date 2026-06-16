"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import type { Post } from "@/lib/types";
import { getCreator } from "@/lib/mock/creators";
import { PlatformBadge } from "@/components/PlatformBadge";
import { SelectablePostPreview } from "@/components/folder/SelectablePostPreview";

export function PostFilterBar({
  posts,
  selectedIds,
  onChange,
}: {
  posts: Post[];
  selectedIds: Set<string>;
  onChange: (next: Set<string>) => void;
}) {
  const [open, setOpen] = useState(true);
  const total = posts.length;
  const selectedCount = selectedIds.size;
  const filterActive = selectedCount > 0 && selectedCount < total;
  const allSelected = total > 0 && selectedCount === total;

  const togglePost = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(next);
  };

  const toggleAll = () => {
    if (allSelected) onChange(new Set());
    else onChange(new Set(posts.map((p) => p.id)));
  };

  const clear = () => onChange(new Set());

  const selectedPosts = posts.filter((p) => selectedIds.has(p.id));

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm transition-colors ${
            filterActive
              ? "border-zinc-900 bg-zinc-900 text-white hover:bg-black"
              : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
          }`}
          aria-expanded={open}
        >
          <Filter className="h-3.5 w-3.5" />
          <span>
            Posts{" "}
            <span className="tabular-nums opacity-80">
              ({filterActive ? `${selectedCount} of ${total}` : total})
            </span>
          </span>
          {open ? (
            <ChevronUp className="h-3.5 w-3.5 opacity-70" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          )}
        </button>

        <span className="text-xs text-zinc-500">
          {filterActive ? (
            <>
              Analysis scoped to{" "}
              <span className="font-medium text-zinc-900 tabular-nums">{selectedCount}</span> of{" "}
              <span className="tabular-nums">{total}</span> post{total === 1 ? "" : "s"}
            </>
          ) : (
            <>
              Analysis covers all <span className="tabular-nums">{total}</span> post
              {total === 1 ? "" : "s"} in this folder
            </>
          )}
        </span>

        {filterActive && (
          <button
            type="button"
            onClick={clear}
            className="ml-auto inline-flex h-7 items-center gap-1 rounded-md px-2 text-[12px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <X className="h-3 w-3" />
            Clear filter
          </button>
        )}
      </div>

      {!open && filterActive && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selectedPosts.map((p) => {
            const creator = getCreator(p.creatorId);
            const label = p.title ?? p.body;
            return (
              <span
                key={p.id}
                className="inline-flex max-w-[260px] items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 py-1 pl-1.5 pr-1 text-[11px] text-zinc-700"
                title={label}
              >
                <PlatformBadge platform={p.platform} size="xs" />
                <span className="truncate">
                  {creator?.name ? `${creator.name} — ` : ""}
                  {label}
                </span>
                <button
                  type="button"
                  onClick={() => togglePost(p.id)}
                  aria-label="Remove from filter"
                  className="rounded-full p-0.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-900"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {open && (
        <div className="mt-3 border-t border-zinc-100 pt-3">
          <div className="mb-2.5 flex items-center justify-between">
            <button
              type="button"
              onClick={toggleAll}
              className="inline-flex items-center gap-2 rounded-md px-1.5 py-1 text-[12px] text-zinc-600 hover:bg-zinc-50"
            >
              <input
                type="checkbox"
                readOnly
                checked={allSelected}
                className="h-3 w-3 rounded accent-zinc-900"
              />
              <span>{allSelected ? "Deselect all" : "Select all"}</span>
              <span className="text-[11px] text-zinc-400 tabular-nums">
                {selectedCount}/{total}
              </span>
            </button>
            <span className="text-[11px] text-zinc-400">
              Click a post to {filterActive ? "toggle" : "filter the analysis"}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {posts.map((p) => (
              <SelectablePostPreview
                key={p.id}
                post={p}
                selected={selectedIds.has(p.id)}
                onToggle={() => togglePost(p.id)}
              />
            ))}
            {posts.length === 0 && (
              <div className="col-span-full rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-xs text-zinc-500">
                No posts in this folder yet.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
