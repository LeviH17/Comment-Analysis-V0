"use client";

import { useMemo, useState } from "react";
import { ExecutiveSummary } from "@/components/analysis/ExecutiveSummary";
import { SentimentDonut } from "@/components/analysis/SentimentDonut";
import { ThemesWithFlyout } from "@/components/analysis/ThemesWithFlyout";
import { TopCommenters } from "@/components/analysis/TopCommenters";
import { FilterButton } from "@/components/analysis/FilterFlyout";
import { VolumeSparkline } from "@/components/analysis/VolumeSparkline";
import { SeeAllCommentsButton } from "@/components/analysis/SeeAllCommentsButton";
import { MetricCard } from "@/components/MetricCard";
import { PostCard } from "@/components/post/PostCard";
import { deriveAnalysisOutput } from "@/lib/mock/analysisOutput";
import {
  applyDemographicsFilter,
  emptyDemographicsFilter,
  isDemographicsFilterActive,
} from "@/lib/demographicsFilter";
import { capitalize } from "@/lib/format";
import type { Comment, Folder, Post, Sentiment } from "@/lib/types";

const fmt = new Intl.NumberFormat("en-US");

const SENTIMENT_DOT: Record<Sentiment, string> = {
  positive: "bg-emerald-500",
  neutral: "bg-zinc-400",
  negative: "bg-red-500",
  mixed: "bg-amber-500",
};

export function PostDetailDashboard({
  folder,
  post,
  comments,
}: {
  folder: Folder;
  post: Post;
  comments: Comment[];
}) {
  const [demoFilter, setDemoFilter] = useState(emptyDemographicsFilter);

  const commentSet = useMemo(
    () => applyDemographicsFilter(comments, demoFilter),
    [comments, demoFilter],
  );

  const demoActive = isDemographicsFilterActive(demoFilter);
  const summaryKey = demoActive ? `${post.id}::filtered` : post.id;
  const summaryLabel = post.title ?? post.body.slice(0, 60);

  const analysis = useMemo(
    () => deriveAnalysisOutput(summaryKey, commentSet, summaryLabel),
    [summaryKey, commentSet, summaryLabel],
  );

  const topSentimentEntries = Object.entries(analysis.sentiment) as Array<[Sentiment, number]>;
  const topSentiment = [...topSentimentEntries].sort((a, b) => b[1] - a[1])[0];
  const topRegion = analysis.demographics.country[0];

  return (
    <div className="space-y-6">
      <PostCard post={post} />

      <div className="flex justify-end">
        <FilterButton
          comments={comments}
          filter={demoFilter}
          onChange={setDemoFilter}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Comments"
          value={fmt.format(analysis.totalComments)}
          sparkline={<VolumeSparkline points={analysis.volumeOverTime} />}
          footer={
            <SeeAllCommentsButton
              title={post.title ?? "Post comment analysis"}
              subtitle={`${folder.name} · Per-post comment analysis`}
              comments={commentSet}
              analysis={analysis}
            />
          }
        />
        <MetricCard
          label="Post engagement"
          value={fmt.format(post.engagement.likes + post.engagement.comments + post.engagement.shares)}
          hint="Likes + comments + shares"
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
          label={post.engagement.views !== undefined ? "Views" : "Top location"}
          value={
            post.engagement.views !== undefined ? (
              fmt.format(post.engagement.views)
            ) : topRegion ? (
              <span className="inline-flex items-baseline gap-2">
                <span className="truncate">{topRegion.label}</span>
                <span className="text-base font-normal text-zinc-500">{topRegion.pct}%</span>
              </span>
            ) : (
              "—"
            )
          }
          hint={post.engagement.views !== undefined ? "Platform-native view count" : undefined}
        />
      </div>

      <ExecutiveSummary text={analysis.executiveSummary} />

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <SentimentDonut sentiment={analysis.sentiment} total={analysis.totalComments} />
        <TopCommenters commenters={analysis.topCommenters} />
      </div>

      <ThemesWithFlyout
        themes={analysis.themes}
        allComments={commentSet}
        flyoutSubtitle={`Theme view · ${post.title ?? "this post"} · ${folder.name}`}
      />
    </div>
  );
}
