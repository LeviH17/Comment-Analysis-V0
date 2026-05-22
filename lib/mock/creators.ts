import type { Creator } from "@/lib/types";

export const creators: Creator[] = [
  {
    id: "creator-maria",
    name: "Maria Chen",
    handle: "@maria_air",
    platform: "x",
    followers: 124_300,
    verified: true,
  },
  {
    id: "creator-evteardown",
    name: "EV Teardown",
    handle: "@evteardown",
    platform: "youtube",
    followers: 892_000,
    verified: true,
  },
  {
    id: "creator-carb",
    name: "California Air Resources",
    handle: "@CARB_News",
    platform: "youtube",
    followers: 45_700,
  },
  {
    id: "creator-suburbmomtok",
    name: "SuburbMomTok",
    handle: "@suburbmomtok",
    platform: "tiktok",
    followers: 318_400,
    verified: true,
  },
  {
    id: "creator-policywatch",
    name: "Policy Watch US",
    handle: "@policywatchus",
    platform: "x",
    followers: 78_200,
  },
  {
    id: "creator-airqualitynow",
    name: "Air Quality Now",
    handle: "@airqualitynow",
    platform: "instagram",
    followers: 56_900,
  },
  {
    id: "creator-parenttrending",
    name: "Parent Trending",
    handle: "@parenttrending",
    platform: "instagram",
    followers: 210_500,
    verified: true,
  },
  {
    id: "creator-recallreporter",
    name: "RecallReporter",
    handle: "u/RecallReporter",
    platform: "reddit",
    followers: 32_100,
  },
];

export function getCreator(id: string): Creator | undefined {
  return creators.find((c) => c.id === id);
}
