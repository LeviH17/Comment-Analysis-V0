"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import type { Post } from "@/lib/types";
import { getCreator } from "@/lib/mock/creators";
import { PlatformBadge } from "@/components/PlatformBadge";

export function PostFilterBar({
  posts,
  selectedIds,
  onChange,
}: {
  posts: Post[];
  selectedIds: Set<string>;
  onChange: (next: Set<string>) => void;
}) {
  const [open, setOpen] = useState(false);
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
        >
          <Filter className="h-3.5 w-3.5" />
          Filter posts
          {filterActive && (
            <span className="ml-1 inline-flex h-5 items-center rounded-full bg-white/15 px-1.5 text-[10px] font-medium tabular-nums">
              {selectedCount}
            </span>
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

      {filterActive && (
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
        <div className="mt-3 overflow-hidden rounded-md border border-zinc-200 bg-white">
          <button
            type="button"
            onClick={toggleAll}
            className="flex w-full items-center gap-2 border-b border-zinc-100 px-3 py-1.5 text-left text-[12px] text-zinc-600 hover:bg-zinc-50"
          >
            <input
              type="checkbox"
              readOnly
              checked={allSelected}
              className="h-3 w-3 rounded accent-zinc-900"
            />
            <span>{allSelected ? "Deselect all" : "Select all"}</span>
            <span className="ml-auto text-[11px] text-zinc-400 tabular-nums">
              {selectedCount}/{total}
            </span>
          </button>
          <ul className="max-h-72 overflow-y-auto py-1">
            {posts.map((p) => {
              const creator = getCreator(p.creatorId);
              const checked = selectedIds.has(p.id);
              const dt = new Date(p.publishedAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
              });
              const label = p.title ?? p.body.slice(0, 100);
              return (
                <li key={p.id}>
                  <label
                    className={`flex cursor-pointer items-start gap-2 px-3 py-1.5 hover:bg-zinc-50 ${
                      checked ? "bg-zinc-50" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePost(p.id)}
                      className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 rounded accent-zinc-900"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <PlatformBadge platform={p.platform} size="xs" />
                        <span className="truncate text-[12px] font-medium text-zinc-900">
                          {label}
                        </span>
                      </div>
                      <div className="mt-0.5 truncate text-[11px] text-zinc-500">
                        {creator?.name ?? "Unknown"} · {dt}
                      </div>
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
