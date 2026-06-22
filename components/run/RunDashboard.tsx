"use client";

import { useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import { ExecutiveSummary } from "@/components/analysis/ExecutiveSummary";
import { SentimentDonut } from "@/components/analysis/SentimentDonut";
import { ThemesWithFlyout } from "@/components/analysis/ThemesWithFlyout";
import { TopCommenters } from "@/components/analysis/TopCommenters";
import { DemographicsFilterBar } from "@/components/analysis/DemographicsFilterBar";
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
import type { AnalysisRun, Comment, Post, Sentiment } from "@/lib/types";

const fmt = new Intl.NumberFormat("en-US");

const SENTIMENT_DOT: Record<Sentiment, string> = {
  positive: "bg-emerald-500",
  neutral: "bg-zinc-400",
  negative: "bg-red-500",
  mixed: "bg-amber-500",
};

export function RunDashboard({
  run,
  currentPosts,
  droppedPosts,
  comments,
  lastRefresh,
}: {
  run: AnalysisRun;
  currentPosts: Post[];
  droppedPosts: Post[];
  comments: Comment[];
  lastRefresh: string;
}) {
  const [demoFilter, setDemoFilter] = useState(emptyDemographicsFilter);

  const commentSet = useMemo(
    () => applyDemographicsFilter(comments, demoFilter),
    [comments, demoFilter],
  );

  const demoActive = isDemographicsFilterActive(demoFilter);
  const summaryKey = demoActive ? `${run.id}::filtered` : run.id;

  const analysis = useMemo(
    () => deriveAnalysisOutput(summaryKey, commentSet, run.name),
    [summaryKey, commentSet, run.name],
  );

  const topSentimentEntries = Object.entries(analysis.sentiment) as Array<[Sentiment, number]>;
  const topSentiment = [...topSentimentEntries].sort((a, b) => b[1] - a[1])[0];
  const topRegion = analysis.demographics.country[0];

  return (
    <div className="space-y-6">
      <div className="-mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-zinc-500">
        <span className="inline-flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          Top-X cap: <span className="tabular-nums text-zinc-700">{run.topX}</span>
        </span>
        <span>·</span>
        <span>Refreshes every 24h · last refresh {lastRefresh}</span>
      </div>

      <DemographicsFilterBar
        comments={comments}
        filter={demoFilter}
        onChange={setDemoFilter}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Comments"
          value={fmt.format(analysis.totalComments)}
          sparkline={<VolumeSparkline points={analysis.volumeOverTime} />}
          footer={
            <SeeAllCommentsButton
              title={run.name}
              subtitle={run.query}
              comments={commentSet}
              analysis={analysis}
            />
          }
        />
        <MetricCard
          label="Posts in top-X"
          value={`${currentPosts.length} / ${run.topX}`}
          hint="Top posts by engagement currently in the analysis window"
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
        flyoutSubtitle={`Theme view · ${run.name}`}
      />

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <div className="text-sm font-medium text-zinc-900">Top-X posts</div>
          <span className="text-[11px] text-zinc-500">
            {currentPosts.length} active
            {droppedPosts.length > 0 ? ` · ${droppedPosts.length} dropped` : ""}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {currentPosts.map((p) => (
            <PostPreview
              key={p.id}
              post={p}
              trailing={
                <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                  New
                </span>
              }
            />
          ))}
          {droppedPosts.map((p) => (
            <PostPreview
              key={p.id}
              post={p}
              trailing={
                <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                  Dropped
                </span>
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
