"use client";

import { useMemo, useState } from "react";
import { ExecutiveSummary } from "@/components/analysis/ExecutiveSummary";
import { SentimentDonut } from "@/components/analysis/SentimentDonut";
import { ThemesWithFlyout } from "@/components/analysis/ThemesWithFlyout";
import { VolumeSparkline } from "@/components/analysis/VolumeSparkline";
import { DemographicsBars, capitalize } from "@/components/analysis/DemographicsBars";
import { TopCommenters } from "@/components/analysis/TopCommenters";
import { SeeAllCommentsButton } from "@/components/analysis/SeeAllCommentsButton";
import { MetricCard } from "@/components/MetricCard";
import { PostFilterBar } from "@/components/folder/PostFilterBar";
import { commentsForPosts } from "@/lib/mock/comments";
import { deriveAnalysisOutput } from "@/lib/mock/analysisOutput";
import type { Folder, Post, Sentiment } from "@/lib/types";

const fmt = new Intl.NumberFormat("en-US");

const SENTIMENT_DOT: Record<Sentiment, string> = {
  positive: "bg-emerald-500",
  neutral: "bg-zinc-400",
  negative: "bg-red-500",
  mixed: "bg-amber-500",
};

export function FolderDashboard({ folder, posts }: { folder: Folder; posts: Post[] }) {
  const [selectedPostIds, setSelectedPostIds] = useState<Set<string>>(new Set());

  const filteredPostIds = useMemo(() => {
    if (selectedPostIds.size === 0) return folder.postIds;
    return folder.postIds.filter((id) => selectedPostIds.has(id));
  }, [selectedPostIds, folder.postIds]);

  const commentSet = useMemo(() => commentsForPosts(filteredPostIds), [filteredPostIds]);

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

  const topSentiment = useMemo(() => {
    const entries = Object.entries(analysis.sentiment) as Array<[Sentiment, number]>;
    return entries.sort((a, b) => b[1] - a[1])[0];
  }, [analysis.sentiment]);

  const topRegion = analysis.demographics.country[0];

  return (
    <div className="space-y-6">
      <PostFilterBar
        posts={posts}
        selectedIds={selectedPostIds}
        onChange={setSelectedPostIds}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Comments"
          value={fmt.format(analysis.totalComments)}
          sparkline={<VolumeSparkline points={analysis.volumeOverTime} />}
          footer={
            <SeeAllCommentsButton
              title={folder.name}
              subtitle={
                filterActive
                  ? `${folder.description ?? ""}${folder.description ? " · " : ""}Filtered to ${filteredPostIds.length} of ${folder.postIds.length} posts`
                  : folder.description
              }
              comments={commentSet}
              analysis={analysis}
            />
          }
        />
        <MetricCard
          label={filterActive ? "Posts in filter" : "Posts in folder"}
          value={
            filterActive
              ? `${filteredPostIds.length} / ${folder.postIds.length}`
              : posts.length
          }
        />
        <MetricCard
          label="Top sentiment"
          value={
            <span className="inline-flex items-baseline gap-2">
              <span
                className={`inline-block h-2.5 w-2.5 translate-y-[-2px] rounded-full ${SENTIMENT_DOT[topSentiment[0]]}`}
              />
              <span>{capitalize(topSentiment[0])}</span>
              <span className="text-base font-normal text-zinc-500">{topSentiment[1]}%</span>
            </span>
          }
        />
        <MetricCard
          label="Top location"
          value={
            topRegion ? (
              <span className="inline-flex items-baseline gap-2">
                <span className="truncate">{topRegion.label}</span>
                <span className="text-base font-normal text-zinc-500">{topRegion.pct}%</span>
              </span>
            ) : (
              "—"
            )
          }
        />
      </div>

      <ExecutiveSummary text={analysis.executiveSummary} />

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <SentimentDonut sentiment={analysis.sentiment} total={analysis.totalComments} />
        <TopCommenters commenters={analysis.topCommenters} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

      <ThemesWithFlyout
        themes={analysis.themes}
        allComments={commentSet}
        flyoutSubtitle={`Theme view · ${folder.name}`}
      />
    </div>
  );
}
