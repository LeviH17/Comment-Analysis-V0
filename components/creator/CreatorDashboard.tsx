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
import { PostPreview } from "@/components/post/PostPreview";
import { deriveAnalysisOutput } from "@/lib/mock/analysisOutput";
import {
  applyDemographicsFilter,
  emptyDemographicsFilter,
  isDemographicsFilterActive,
} from "@/lib/demographicsFilter";
import { capitalize } from "@/lib/format";
import type { Comment, Creator, Post, Sentiment } from "@/lib/types";

const fmt = new Intl.NumberFormat("en-US");

const SENTIMENT_DOT: Record<Sentiment, string> = {
  positive: "bg-emerald-500",
  neutral: "bg-zinc-400",
  negative: "bg-red-500",
  mixed: "bg-amber-500",
};

export function CreatorDashboard({
  creator,
  posts,
  comments,
}: {
  creator: Creator;
  posts: Post[];
  comments: Comment[];
}) {
  const [demoFilter, setDemoFilter] = useState(emptyDemographicsFilter);

  const commentSet = useMemo(
    () => applyDemographicsFilter(comments, demoFilter),
    [comments, demoFilter],
  );

  const demoActive = isDemographicsFilterActive(demoFilter);
  const summaryKey = demoActive ? `${creator.id}::filtered` : creator.id;

  const analysis = useMemo(
    () => deriveAnalysisOutput(summaryKey, commentSet, creator.name),
    [summaryKey, commentSet, creator.name],
  );

  const topSentimentEntries = Object.entries(analysis.sentiment) as Array<[Sentiment, number]>;
  const topSentiment = [...topSentimentEntries].sort((a, b) => b[1] - a[1])[0];
  const topRegion = analysis.demographics.country[0];

  return (
    <div className="space-y-6">
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
              title={creator.name}
              subtitle={`${creator.handle} · Creator comment analysis`}
              comments={commentSet}
              analysis={analysis}
            />
          }
        />
        <MetricCard
          label="Posts tracked"
          value={posts.length}
          hint="Recent posts with comments analyzed"
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

      <ThemesWithFlyout
        themes={analysis.themes}
        allComments={commentSet}
        flyoutSubtitle={`Theme view · ${creator.name}`}
      />

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <div className="text-sm font-medium text-zinc-900">Tracked posts</div>
          <span className="text-[11px] text-zinc-500">{posts.length}</span>
        </div>
        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-xs text-zinc-500">
            No posts ingested yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostPreview key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
