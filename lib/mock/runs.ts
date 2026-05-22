import type { AnalysisRun } from "@/lib/types";

export const analysisRuns: AnalysisRun[] = [
  {
    id: "run-ev-battery-recall",
    name: "EV battery recall sentiment",
    query: '("battery recall" OR "thermal runaway" OR "BMS firmware") AND (Rivian OR Tesla OR Ford OR GM)',
    topX: 50,
    timeWindow: "7d",
    createdAt: "2026-05-15T10:00:00Z",
    lastRefreshedAt: "2026-05-22T10:00:00Z",
    currentPostIds: ["post-001", "post-010", "post-011", "post-015", "post-007"],
    droppedPostIds: [],
  },
  {
    id: "run-wildfire-cali",
    name: "Wildfire response — California",
    query: '("wildfire" OR "air quality" OR "AQI") AND (California OR Fresno OR Modesto OR "Central Valley") NOT campfire',
    topX: 30,
    timeWindow: "30d",
    createdAt: "2026-05-10T08:00:00Z",
    lastRefreshedAt: "2026-05-22T08:00:00Z",
    currentPostIds: ["post-004", "post-008", "post-014"],
    droppedPostIds: ["post-012"],
  },
  {
    id: "run-back-to-school",
    name: "Back-to-school spending 2026",
    query: '("back to school" OR "school supplies" OR "BTS haul") AND (Target OR Walmart OR Amazon)',
    topX: 50,
    timeWindow: "7d",
    createdAt: "2026-05-12T14:30:00Z",
    lastRefreshedAt: "2026-05-22T14:30:00Z",
    currentPostIds: ["post-005", "post-006", "post-009", "post-013"],
    droppedPostIds: [],
  },
];

export function getAnalysisRun(id: string): AnalysisRun | undefined {
  return analysisRuns.find((r) => r.id === id);
}
