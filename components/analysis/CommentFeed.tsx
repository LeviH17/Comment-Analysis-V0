"use client";

import { useMemo, useState } from "react";
import type { Comment, Sentiment } from "@/lib/types";
import { getPost } from "@/lib/mock/posts";
import { PlatformBadge } from "@/components/PlatformBadge";
import { Heart, MessageSquare, Search, ArrowUpDown, Filter, ArrowRight } from "lucide-react";

const fmt = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

const SENTIMENT_DOT: Record<Sentiment, string> = {
  positive: "bg-emerald-500",
  neutral: "bg-zinc-400",
  negative: "bg-red-500",
  mixed: "bg-amber-500",
};

const SENTIMENT_LABEL: Record<Sentiment, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
  mixed: "Mixed",
};

type Sort = "engagement" | "recent";

export function CommentFeed({
  comments,
  preview = false,
  previewLimit = 5,
  onShowAll,
}: {
  comments: Comment[];
  preview?: boolean;
  previewLimit?: number;
  onShowAll?: () => void;
}) {
  const [sentiment, setSentiment] = useState<"all" | Sentiment>("all");
  const [theme, setTheme] = useState<"all" | string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("engagement");

  const themes = useMemo(() => {
    const set = new Set<string>();
    comments.forEach((c) => c.themes.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [comments]);

  const filtered = useMemo(() => {
    if (preview) {
      return [...comments].sort((a, b) => b.likes - a.likes).slice(0, previewLimit);
    }
    let arr = comments.slice();
    if (sentiment !== "all") arr = arr.filter((c) => c.sentiment === sentiment);
    if (theme !== "all") arr = arr.filter((c) => c.themes.includes(theme));
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter((c) => c.body.toLowerCase().includes(q) || c.authorHandle.toLowerCase().includes(q));
    }
    if (sort === "engagement") arr.sort((a, b) => b.likes - a.likes);
    else arr.sort((a, b) => b.postedAt.localeCompare(a.postedAt));
    return arr;
  }, [comments, preview, previewLimit, sentiment, theme, query, sort]);

  return (
    <section className="rounded-xl border border-zinc-200 bg-white">
      <header className="flex flex-wrap items-center gap-2 border-b border-zinc-100 px-4 py-3">
        <div className="text-sm font-medium text-zinc-900">
          Comments <span className="text-zinc-500">({comments.length})</span>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {preview ? (
            onShowAll && (
              <button
                type="button"
                onClick={onShowAll}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
              >
                See all comments
                <ArrowRight className="h-3 w-3" />
              </button>
            )
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search comments"
                  className="h-8 w-44 rounded-md border border-zinc-200 bg-white pl-7 pr-2 text-xs placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
                />
              </div>
              <SelectChip
                icon={<Filter className="h-3 w-3" />}
                value={sentiment}
                onChange={(v) => setSentiment(v as typeof sentiment)}
                options={[
                  { value: "all", label: "All sentiment" },
                  { value: "positive", label: "Positive" },
                  { value: "neutral", label: "Neutral" },
                  { value: "negative", label: "Negative" },
                  { value: "mixed", label: "Mixed" },
                ]}
              />
              <SelectChip
                value={theme}
                onChange={(v) => setTheme(v as typeof theme)}
                options={[{ value: "all", label: "All themes" }, ...themes.map((t) => ({ value: t, label: t }))]}
              />
              <SelectChip
                icon={<ArrowUpDown className="h-3 w-3" />}
                value={sort}
                onChange={(v) => setSort(v as Sort)}
                options={[
                  { value: "engagement", label: "Top engagement" },
                  { value: "recent", label: "Most recent" },
                ]}
              />
            </>
          )}
        </div>
      </header>
      <ul className="divide-y divide-zinc-100">
        {filtered.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-zinc-500">
            No comments match these filters.
          </li>
        )}
        {filtered.map((c) => {
          const post = getPost(c.postId);
          const dt = new Date(c.postedAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          return (
            <li key={c.id} className="px-4 py-3">
              <div className="flex items-start gap-2.5">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-semibold text-zinc-700">
                  {c.authorHandle.replace(/^[@u/]+/, "").slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-zinc-500">
                    <span className="font-medium text-zinc-900">{c.authorHandle}</span>
                    {post && <PlatformBadge platform={post.platform} size="xs" />}
                    <span>·</span>
                    <span>{dt}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <span className={`inline-block h-2 w-2 rounded-full ${SENTIMENT_DOT[c.sentiment]}`} />
                      {SENTIMENT_LABEL[c.sentiment]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-zinc-800">{c.body}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {fmt.format(c.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {fmt.format(c.replies)}
                    </span>
                    {c.themes.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] text-zinc-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SelectChip<T extends string>({
  value,
  onChange,
  options,
  icon,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
  icon?: React.ReactNode;
}) {
  return (
    <label className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700">
      {icon}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="bg-transparent pr-1 text-xs text-zinc-700 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
