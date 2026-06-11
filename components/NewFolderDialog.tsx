"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, FolderClosed, Plus, Sparkles, X } from "lucide-react";
import { bookmarkLists } from "@/lib/mock/bookmarkLists";
import { getPost } from "@/lib/mock/posts";
import { PlatformBadge } from "@/components/PlatformBadge";

const SAMPLE_FOLDER_FOR_DEMO = "folder-rivian-recall";
const URL_LIMIT = 100;

export function NewFolderDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [urls, setUrls] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expandedListIds, setExpandedListIds] = useState<Set<string>>(new Set());
  const [selectedPostIds, setSelectedPostIds] = useState<Set<string>>(new Set());

  const urlList = useMemo(
    () =>
      urls
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean),
    [urls],
  );

  const tooMany = urlList.length > URL_LIMIT;
  const totalSelectedBookmarks = selectedPostIds.size;
  const totalPosts = totalSelectedBookmarks + urlList.length;
  const canSubmit = name.trim().length > 0 && !tooMany && !submitting;

  const reset = () => {
    setName("");
    setDescription("");
    setUrls("");
    setExpandedListIds(new Set());
    setSelectedPostIds(new Set());
  };

  const onSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitting(false);
      reset();
      router.push(`/comment-analysis/post-comments/${SAMPLE_FOLDER_FOR_DEMO}`);
    }, 1600);
  };

  const toggleListExpanded = (id: string) => {
    setExpandedListIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePost = (id: string) => {
    setSelectedPostIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedInList = (postIds: string[]) =>
    postIds.filter((id) => selectedPostIds.has(id)).length;

  const toggleSelectAllInList = (postIds: string[]) => {
    const allSelected = postIds.every((id) => selectedPostIds.has(id));
    setSelectedPostIds((prev) => {
      const next = new Set(prev);
      if (allSelected) postIds.forEach((id) => next.delete(id));
      else postIds.forEach((id) => next.add(id));
      return next;
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-zinc-900 px-3 text-sm font-medium text-white hover:bg-black"
      >
        <Plus className="h-4 w-4" />
        New folder
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/30 p-4">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-xl border border-zinc-200 bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-zinc-100 px-5 pt-5 pb-4">
              <div>
                <div className="text-base font-semibold tracking-tight text-zinc-900">
                  New folder
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  Folders group bookmarked or URL-added posts into campaigns. Pendulum runs an aggregate comment analysis across all posts in the folder.
                </p>
              </div>
              <button
                aria-label="Close"
                onClick={() => !submitting && setOpen(false)}
                disabled={submitting}
                className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-zinc-700">Name</label>
                    <input
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rivian R1S Recall — May 2026"
                      disabled={submitting}
                      className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-700">Description (optional)</label>
                    <input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What this folder tracks"
                      disabled={submitting}
                      className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <label className="text-xs font-medium text-zinc-700">
                      Pick posts from your bookmark lists (optional)
                    </label>
                    {totalSelectedBookmarks > 0 && (
                      <span className="text-[11px] text-zinc-500">
                        {totalSelectedBookmarks} selected
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 overflow-hidden rounded-md border border-zinc-200">
                    {bookmarkLists.map((list, idx) => {
                      const expanded = expandedListIds.has(list.id);
                      const selectedHere = selectedInList(list.postIds);
                      const allSelected =
                        list.postIds.length > 0 &&
                        list.postIds.every((id) => selectedPostIds.has(id));
                      return (
                        <div
                          key={list.id}
                          className={idx === 0 ? "" : "border-t border-zinc-100"}
                        >
                          <button
                            type="button"
                            onClick={() => toggleListExpanded(list.id)}
                            disabled={submitting}
                            className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-zinc-50 disabled:opacity-50"
                          >
                            {expanded ? (
                              <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                            )}
                            <FolderClosed className="h-3.5 w-3.5 text-zinc-400" />
                            <span className="flex-1 truncate text-sm text-zinc-900">
                              {list.name}
                            </span>
                            <span className="text-[11px] text-zinc-500">
                              {list.postIds.length} post{list.postIds.length === 1 ? "" : "s"}
                            </span>
                            {selectedHere > 0 && (
                              <span className="ml-1 inline-flex h-5 items-center rounded-full bg-zinc-900 px-2 text-[10px] font-medium text-white tabular-nums">
                                {selectedHere}
                              </span>
                            )}
                          </button>
                          {expanded && (
                            <div className="border-t border-zinc-100 bg-zinc-50/40">
                              <button
                                type="button"
                                onClick={() => toggleSelectAllInList(list.postIds)}
                                disabled={submitting}
                                className="flex items-center gap-2 border-b border-zinc-100 px-4 py-1.5 text-[11px] text-zinc-600 hover:bg-zinc-100/60 disabled:opacity-50"
                              >
                                <input
                                  type="checkbox"
                                  readOnly
                                  checked={allSelected}
                                  className="h-3 w-3 rounded accent-zinc-900"
                                />
                                <span>{allSelected ? "Deselect all" : "Select all"}</span>
                              </button>
                              <ul className="px-2 py-1.5">
                                {list.postIds.map((pid) => {
                                  const post = getPost(pid);
                                  if (!post) return null;
                                  const checked = selectedPostIds.has(pid);
                                  const dt = new Date(post.publishedAt).toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  });
                                  return (
                                    <li key={pid}>
                                      <label
                                        className={`flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 hover:bg-white ${
                                          checked ? "bg-white" : ""
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={checked}
                                          onChange={() => togglePost(pid)}
                                          disabled={submitting}
                                          className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 rounded accent-zinc-900"
                                        />
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-1.5">
                                            <PlatformBadge platform={post.platform} size="xs" />
                                            <span className="truncate text-[12px] font-medium text-zinc-900">
                                              {post.title ?? post.body.slice(0, 80)}
                                            </span>
                                          </div>
                                          {post.title && (
                                            <p className="mt-0.5 line-clamp-1 text-[11px] text-zinc-500">
                                              {post.body}
                                            </p>
                                          )}
                                          <div className="mt-0.5 text-[10px] text-zinc-400">{dt}</div>
                                        </div>
                                      </label>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-700">
                    Or paste URLs (optional, up to {URL_LIMIT})
                  </label>
                  <textarea
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                    placeholder={`Paste post URLs, one per line.\nhttps://www.youtube.com/watch?v=…\nhttps://x.com/…`}
                    rows={3}
                    disabled={submitting}
                    className="mt-1 w-full rounded-md border border-zinc-200 bg-white p-2.5 text-[13px] placeholder-zinc-400 focus:border-zinc-400 focus:outline-none disabled:opacity-50"
                  />
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className={tooMany ? "text-red-600" : "text-zinc-500"}>
                      {urlList.length} URL{urlList.length === 1 ? "" : "s"}
                      {tooMany && ` — exceeds ${URL_LIMIT} limit`}
                    </span>
                    <span className="text-zinc-400">Or bookmark posts into this folder later.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-zinc-100 px-5 py-3">
              <div className="text-[12px] text-zinc-600">
                {totalPosts === 0 ? (
                  <span className="text-zinc-400">No posts selected yet</span>
                ) : (
                  <span>
                    <span className="font-medium text-zinc-900 tabular-nums">{totalPosts}</span>{" "}
                    {totalPosts === 1 ? "post" : "posts"} in folder
                    {totalSelectedBookmarks > 0 && urlList.length > 0 && (
                      <span className="text-zinc-400">
                        {" "}
                        ({totalSelectedBookmarks} from bookmarks · {urlList.length} from URLs)
                      </span>
                    )}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpen(false)}
                  disabled={submitting}
                  className="h-9 rounded-md px-3 text-sm text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onSubmit}
                  disabled={!canSubmit}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md bg-zinc-900 px-3 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                      Ingesting…
                    </>
                  ) : (
                    <>Create folder</>
                  )}
                </button>
              </div>
            </div>
            {submitting && (
              <div className="border-t border-zinc-100 px-5 py-2 text-[11px] text-zinc-500">
                Simulated ingestion (∼1.6s). V0 routes to a sample folder.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
