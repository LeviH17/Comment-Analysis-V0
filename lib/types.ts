export type Platform = "youtube" | "x" | "tiktok" | "reddit" | "instagram";

export type IngestionPathway = "post" | "creator" | "search";

export type Sentiment = "positive" | "neutral" | "negative" | "mixed";

export type Creator = {
  id: string;
  name: string;
  handle: string;
  platform: Platform;
  avatarUrl?: string;
  followers: number;
  verified?: boolean;
};

export type Post = {
  id: string;
  url: string;
  platform: Platform;
  creatorId: string;
  title?: string;
  body: string;
  thumbnailUrl?: string;
  publishedAt: string;
  engagement: {
    views?: number;
    likes: number;
    comments: number;
    shares: number;
  };
};

export type Comment = {
  id: string;
  postId: string;
  authorHandle: string;
  authorAvatarUrl?: string;
  body: string;
  postedAt: string;
  likes: number;
  replies: number;
  sentiment: Sentiment;
  themes: string[];
  pathways: IngestionPathway[];
};

export type Folder = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  postIds: string[];
};

export type AnalysisRun = {
  id: string;
  name: string;
  query: string;
  topX: number;
  timeWindow: "24h" | "7d" | "30d" | "all";
  createdAt: string;
  lastRefreshedAt: string;
  currentPostIds: string[];
  droppedPostIds: string[];
};

export type ThemeCategory =
  | "Economic"
  | "Social"
  | "Governance"
  | "Media"
  | "Health"
  | "Engineering"
  | "Generic";

export type ThemeEmergence = "rising" | "stable" | "declining";

export type Theme = {
  label: string;
  count: number;
  engagement: number;
  sentiment: Sentiment;
  emergence: ThemeEmergence;
  category: ThemeCategory;
  sample: string;
};

export type AudienceSignal = {
  label: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  note: string;
};

export type NotableComment = {
  commentId: string;
  reason: string;
};

export type VolumePoint = {
  date: string;
  count: number;
};

export type CommentAnalysisOutput = {
  executiveSummary: string;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
    mixed: number;
  };
  themes: Theme[];
  audienceSignals: AudienceSignal[];
  notableComments: NotableComment[];
  volumeOverTime: VolumePoint[];
  totalComments: number;
  lastRefreshedAt: string;
};
