"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RefreshCw, ArrowLeft, Sparkles } from "lucide-react";
import { PageShell } from "@/components/PageShell";

const EXAMPLE_BOOLEANS: Record<string, string> = {
  ev: '("battery recall" OR "thermal runaway" OR "BMS firmware") AND (Rivian OR Tesla OR Ford OR GM)',
  wildfire:
    '("wildfire" OR "air quality" OR "AQI") AND (California OR Fresno OR Modesto OR "Central Valley") NOT campfire',
  school: '("back to school" OR "school supplies" OR "BTS haul") AND (Target OR Walmart OR Amazon)',
};

function nlToBoolean(nl: string): string {
  const lower = nl.toLowerCase();
  if (lower.includes("battery") || lower.includes("recall") || lower.includes("ev")) return EXAMPLE_BOOLEANS.ev;
  if (lower.includes("wildfire") || lower.includes("air quality") || lower.includes("smoke")) return EXAMPLE_BOOLEANS.wildfire;
  if (lower.includes("back to school") || lower.includes("school supplies")) return EXAMPLE_BOOLEANS.school;
  // generic fallback: tokenize and AND
  const tokens = nl
    .split(/[\s,]+/)
    .filter((t) => t.length > 2)
    .slice(0, 4)
    .map((t) => `"${t}"`);
  return tokens.length > 0 ? tokens.join(" AND ") : "";
}

export default function NewAnalysisRunPage() {
  const router = useRouter();
  const [nl, setNl] = useState("");
  const [boolean, setBoolean] = useState("");
  const [topX, setTopX] = useState(50);
  const [timeWindow, setTimeWindow] = useState<"24h" | "7d" | "30d" | "all">("7d");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canConvert = nl.trim().length > 0;
  const canSubmit = boolean.trim().length > 0 && !submitting;

  const onConvert = () => {
    setBoolean(nlToBoolean(nl));
  };

  const onSubmit = () => {
    setSubmitting(true);
    // V0 prototype: simulate brief ingestion, then navigate to a sample run.
    setTimeout(() => {
      router.push("/comment-analysis/search-comments/run-ev-battery-recall");
    }, 1400);
  };

  return (
    <PageShell
      breadcrumb={
        <Link href="/comment-analysis/search-comments" className="inline-flex items-center gap-1 hover:text-zinc-900">
          <ArrowLeft className="h-3 w-3" />
          Search Comments
        </Link>
      }
      title="New analysis run"
      subtitle="Define a boolean query and a top-X cap. Pendulum ingests comments for the top matching posts across all comment-supported platforms and refreshes every 24 hours."
    >
      <div className="max-w-3xl space-y-8">
        <section>
          <label className="text-sm font-medium text-zinc-900">Describe your search</label>
          <p className="mt-1 text-xs text-zinc-500">Natural language. Pendulum converts it to a boolean you can edit.</p>
          <textarea
            value={nl}
            onChange={(e) => setNl(e.target.value)}
            placeholder="Describe your search in natural language..."
            maxLength={280}
            rows={3}
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white p-3 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
          />
          <div className="mt-1 flex items-center justify-between">
            <button
              onClick={onConvert}
              disabled={!canConvert}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-zinc-100 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Convert to boolean
            </button>
            <span className="text-[11px] text-zinc-400">{nl.length}/280 characters</span>
          </div>
        </section>

        <section>
          <label className="text-sm font-medium text-zinc-900">Your boolean</label>
          <p className="mt-1 text-xs text-zinc-500">Edit the boolean directly if you want a different shape.</p>
          <textarea
            value={boolean}
            onChange={(e) => setBoolean(e.target.value)}
            placeholder="Add your boolean here..."
            rows={4}
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white p-3 font-mono text-[13px] placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
          />
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-zinc-900">Top-X cap</label>
            <p className="mt-1 text-xs text-zinc-500">10–500 posts.</p>
            <input
              type="number"
              min={10}
              max={500}
              value={topX}
              onChange={(e) => setTopX(Math.max(10, Math.min(500, Number(e.target.value) || 50)))}
              className="mt-2 h-9 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-sm focus:border-zinc-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-900">Time window</label>
            <p className="mt-1 text-xs text-zinc-500">Lookback range.</p>
            <select
              value={timeWindow}
              onChange={(e) => setTimeWindow(e.target.value as typeof timeWindow)}
              className="mt-2 h-9 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-sm focus:border-zinc-400 focus:outline-none"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="all">All-time</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-900">Name (optional)</label>
            <p className="mt-1 text-xs text-zinc-500">Auto-generated if blank.</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. EV battery recall sentiment"
              className="mt-2 h-9 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
            />
          </div>
        </section>

        <section className="flex items-center gap-3 border-t border-zinc-100 pt-6">
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                Ingesting comments…
              </>
            ) : (
              <>Create analysis run</>
            )}
          </button>
          <Link href="/comment-analysis/search-comments" className="text-sm text-zinc-500 hover:text-zinc-900">
            Cancel
          </Link>
          {submitting && (
            <span className="text-xs text-zinc-500">
              Simulated ingestion (∼1.5s). V0 routes to a sample run after creation.
            </span>
          )}
        </section>
      </div>
    </PageShell>
  );
}
