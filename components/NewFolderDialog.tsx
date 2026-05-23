"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, X } from "lucide-react";

const SAMPLE_FOLDER_FOR_DEMO = "folder-rivian-recall";
const URL_LIMIT = 100;

export function NewFolderDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [urls, setUrls] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const urlList = urls
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  const tooMany = urlList.length > URL_LIMIT;

  const canSubmit = name.trim().length > 0 && !tooMany && !submitting;

  const onSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitting(false);
      setName("");
      setDescription("");
      setUrls("");
      router.push(`/comment-analysis/post-comments/${SAMPLE_FOLDER_FOR_DEMO}`);
    }, 1600);
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
          <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold tracking-tight text-zinc-900">New folder</div>
              <button
                aria-label="Close"
                onClick={() => !submitting && setOpen(false)}
                disabled={submitting}
                className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Folders group bookmarked or URL-added posts into campaigns. Pendulum runs an aggregate comment analysis across all posts in the folder.
            </p>

            <div className="mt-4 space-y-3">
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
              <div>
                <label className="text-xs font-medium text-zinc-700">
                  Populate with URLs (optional, up to {URL_LIMIT})
                </label>
                <textarea
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  placeholder={`Paste post URLs, one per line.\nhttps://www.youtube.com/watch?v=…\nhttps://x.com/…`}
                  rows={4}
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

            <div className="mt-5 flex items-center justify-end gap-2">
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
            {submitting && (
              <div className="mt-3 text-[11px] text-zinc-500">
                Simulated ingestion (∼1.6s). V0 routes to a sample folder.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
