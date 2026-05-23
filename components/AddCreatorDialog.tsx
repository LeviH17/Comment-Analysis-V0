"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, X } from "lucide-react";
import type { Platform } from "@/lib/types";

const PLATFORMS: Array<{ value: Platform; label: string }> = [
  { value: "youtube", label: "YouTube" },
  { value: "x", label: "X" },
  { value: "tiktok", label: "TikTok" },
  { value: "reddit", label: "Reddit" },
  { value: "instagram", label: "Instagram" },
];

const SAMPLE_CREATOR_FOR_DEMO = "creator-evteardown";

export function AddCreatorDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState<Platform>("youtube");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitting(false);
      setHandle("");
      router.push(`/comment-analysis/creator-comments/${SAMPLE_CREATOR_FOR_DEMO}`);
    }, 1500);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-zinc-900 px-3 text-sm font-medium text-white hover:bg-black"
      >
        <Plus className="h-4 w-4" />
        Add creator
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/30 p-4">
          <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold tracking-tight text-zinc-900">Add creator</div>
              <button
                aria-label="Close"
                onClick={() => !submitting && setOpen(false)}
                className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50"
                disabled={submitting}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              On add, Pendulum backfills the creator's recent post history and ingests comments on every new post going forward.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-zinc-700">Handle</label>
                <input
                  autoFocus
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@creator_handle"
                  disabled={submitting}
                  className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-700">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  disabled={submitting}
                  className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-sm focus:border-zinc-400 focus:outline-none disabled:opacity-50"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
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
                disabled={!handle.trim() || submitting}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-zinc-900 px-3 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    Backfilling…
                  </>
                ) : (
                  <>Add</>
                )}
              </button>
            </div>
            {submitting && (
              <div className="mt-3 text-[11px] text-zinc-500">
                Simulated historical backfill (∼1.5s). V0 routes to a sample creator.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
