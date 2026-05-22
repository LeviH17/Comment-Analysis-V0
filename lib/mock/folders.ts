import type { Folder } from "@/lib/types";

export const folders: Folder[] = [
  {
    id: "folder-rivian-recall",
    name: "Rivian R1S Recall — May 2026",
    description:
      "Tracking the Rivian R1S battery recall narrative across creators, regulators, and owner communities.",
    createdAt: "2026-05-17T09:00:00Z",
    postIds: ["post-001", "post-007", "post-010", "post-011", "post-015"],
  },
  {
    id: "folder-back-to-school",
    name: "Back-to-School 2026 Campaign Watch",
    description:
      "Sponsored and organic back-to-school content across mom-influencer creators we partner with or are evaluating.",
    createdAt: "2026-05-08T11:30:00Z",
    postIds: ["post-005", "post-006", "post-009", "post-013"],
  },
  {
    id: "folder-air-quality-policy",
    name: "Air Quality Policy Tracker",
    description:
      "Policy and public-health framings of air quality across UK, California, and Gulf region narratives.",
    createdAt: "2026-05-09T16:00:00Z",
    postIds: ["post-002", "post-003", "post-004", "post-008", "post-012", "post-014"],
  },
  {
    id: "folder-evteardown-watch",
    name: "EV Teardown — Reputation Watch",
    description:
      "Standalone watch on EV Teardown's commentary, given their growing influence on OEM communications.",
    createdAt: "2026-05-11T14:00:00Z",
    postIds: ["post-001", "post-011"],
  },
];

export function getFolder(id: string): Folder | undefined {
  return folders.find((f) => f.id === id);
}
