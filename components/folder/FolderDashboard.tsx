"use client";

import { useMemo, useState } from "react";
import { ExecutiveSummary } from "@/components/analysis/ExecutiveSummary";
import { SentimentDonut } from "@/components/analysis/SentimentDonut";
import { ThemeChips } from "@/components/analysis/ThemeChips";
import { NotableComments } from "@/components/analysis/NotableComments";
import { AudienceSignals } from "@/components/analysis/AudienceSignals";
import { VolumeSparkline } from "@/components/analysis/VolumeSparkline";
import { CommentFeed } from "@/components/analysis/CommentFeed";
import { DemographicsBars, capitalize } from "@/components/analysis/DemographicsBars";
import { MetricCard } from "@/components/MetricCard";
import { PostPreview } from "@/components/post/PostPreview";
import { PostFilterBar } from "@/components/folder/PostFilterBar";
import { commentsForPosts } from "@/lib/mock/comments";
import { deriveAnalysisOutput } from "@/lib/mock/analysisOutput";
import type { Folder, Post } from "@/lib/types";

const fmt = new Intl.NumberFormat("en-US");

export function FolderDashboard({ folder, posts }: { folder: Folder; posts: Post[] }) {
  const [selectedPostIds, setSelectedPostIds] = useState<Set<string>>(new Set());

  const filteredPostIds = useMemo(() => {
    if (selectedPostIds.size === 0) return folder.postIds;
    return folder.postIds.filter((id) => selectedPostIds.has(id));
  }, [selectedPostIds, folder.postIds]);

  const commentSet = useMemo(() => commentsForPosts(filteredPostIds), [filteredPostIds]);

  // Only use the curated summary when the analysis covers the full folder.
  // Filtered subsets fall back to the auto-generated summary so the prose
  // doesn't misrepresent the scope.
  const filterActive =
    selectedPostIds.size > 0 && selectedPostIds.size < folder.postIds.length;
  const summaryKey = filterActive ? `${folder.id}::filtered` : folder.id;
  const summaryLabel = filterActive
    ? `${folder.name} (${filteredPostIds.length} of ${folder.postIds.length} posts)`
    : folder.name;

  const analysis = useMemo(
    () => deriveAnalysisOutput(summaryKey, commentSet, summaryLabel),
    [summaryKey, commentSet, summaryLabel],
  );

  return (
    <div className="space-y-6">
      <PostFilterBar
        posts={posts}
        selectedIds={selectedPostIds}
        onChange={setSelectedPostIds}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <ExecutiveSummary text={analysis.executiveSummary} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-4">
              <SentimentDonut sentiment={analysis.sentiment} total={analysis.totalComments} />
              <DemographicsBars title="Commenter age" buckets={analysis.demographics.age} />
              <DemographicsBars
                title="Commenter gender"
                buckets={analysis.demographics.gender}
                formatLabel={capitalize}
              />
              <DemographicsBars
                title="Commenter location"
                buckets={analysis.demographics.country}
                limit={5}
              />
            </div>
            <ThemeChips themes={analysis.themes} />
          </div>

          <NotableComments notable={analysis.notableComments} />

          <CommentFeed comments={commentSet} />
        </div>

        <div className="space-y-4">
          <MetricCard
            label="Comments analyzed"
            value={fmt.format(analysis.totalComments)}
            sparkline={<VolumeSparkline points={analysis.volumeOverTime} />}
            hint={
              filterActive
                ? "Aggregate across the filtered subset"
                : "Aggregate across all posts in this folder"
            }
          />
          <MetricCard
            label={filterActive ? "Posts in filter" : "Posts in folder"}
            value={
              filterActive
                ? `${filteredPostIds.length} / ${folder.postIds.length}`
                : posts.length
            }
            hint="URL-added or bookmarked posts"
          />

          <AudienceSignals signals={analysis.audienceSignals} />

          <section className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-zinc-900">Posts in folder</div>
              <span className="text-[11px] text-zinc-500">
                {filterActive ? (
                  <>
                    <span className="text-zinc-900 tabular-nums">{filteredPostIds.length}</span> /{" "}
                    {posts.length} in analysis
                  </>
                ) : (
                  posts.length
                )}
              </span>
            </div>
            <ul className="mt-3 space-y-2.5">
              {posts.map((p) => {
                const inFilter =
                  !filterActive || selectedPostIds.has(p.id);
                return (
                  <li key={p.id} className={inFilter ? "" : "opacity-40"}>
                    <PostPreview
                      post={p}
                      href={`/comment-analysis/post-comments/${folder.id}/post/${p.id}`}
                      trailing={
                        filterActive && selectedPostIds.has(p.id) ? (
                          <span className="rounded-full bg-zinc-900 px-1.5 py-0.5 text-[10px] font-medium text-white">
                            In filter
                          </span>
                        ) : undefined
                      }
                    />
                  </li>
                );
              })}
              {posts.length === 0 && (
                <li className="rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-xs text-zinc-500">
                  No posts in this folder yet.
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
