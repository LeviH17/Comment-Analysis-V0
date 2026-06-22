import type {
  AgeRange,
  AudienceSignal,
  Comment,
  CommentAnalysisOutput,
  DemographicBucket,
  Demographics,
  Gender,
  NotableComment,
  Platform,
  Sentiment,
  Theme,
  TopCommenter,
  VolumePoint,
} from "@/lib/types";
import { comments as allComments } from "@/lib/mock/comments";
import { themeMeta } from "@/lib/mock/themesCatalog";
import { getPost } from "@/lib/mock/posts";

const SUMMARIES: Record<string, string> = {
  // post-level
  "post-001":
    "Audience reaction is split between engineering-credibility praise for the teardown (∼40% positive) and acute owner frustration directed at Rivian's service capacity and disclosure timeline (∼45% negative). A whistleblower-style comment claiming BMS validation gaps were known in Q4 2024 has become the most-amplified thread and is being cross-cited in regulator-adjacent accounts.",
  "post-005":
    "Engagement is high but qualitatively mixed. Brand-preference defense of Target dominates the positive tail, while a methodology critique ('you didn't shop comparable stores') is the most-amplified negative comment. A teacher-perspective thread arguing against expensive supplies is the most-engaging cross-cutting voice.",
  "post-010":
    "Sentiment is consistently grim. The dominant signal is owner attrition — multiple high-engagement comments describing cancellations or reservations dropped. A confirmed-source comment claiming the affected VIN range is broader than publicly disclosed is amplifying into adjacent EV communities.",

  // folder-level
  "folder-rivian-recall":
    "Across the 5 posts in this campaign, audience reception is overwhelmingly skeptical of Rivian's handling (negative sentiment ∼52%, mixed ∼18%). The dominant theme is advance knowledge / engineering criticism (cited in 11 of the top 20 comments), followed closely by owner frustration. Whistleblower-style claims from anonymous engineering accounts are gaining cross-platform traction and represent the most likely vector for regulator or litigation escalation.",
  "folder-back-to-school":
    "Audience reception is split along affordability-vs-aspiration lines. Sponsored content draws disproportionately negative engagement (sponsorship-disclosure critique is the most-amplified theme), while creator-trusted comparison content draws positive engagement. Teacher voices in comments are an underappreciated amplification channel — they consistently outperform on engagement when they appear.",
  "folder-air-quality-policy":
    "Sentiment varies sharply by sub-narrative. UK wood-stove framing draws rural-affordability pushback. California wildfire/AQI content draws clinical and parental urgency. Gulf-region content draws geopolitical framing critiques. The shared theme is implementation gaps — audiences across all three sub-narratives are asking specific questions about who is actually affected and at what cost.",
  "folder-evteardown-watch":
    "EV Teardown's audience treats the channel as a trusted independent voice on EV safety issues. The dominant audience signal is creator trust paired with engineering-depth appreciation. Risk to monitor: the channel's perceived independence is the asset; any sponsorship signal would likely degrade comment-section sentiment quickly.",

  // creator-level
  "creator-evteardown":
    "EV Teardown's audience is high-engagement and consistently positive on the creator personally (creator-trust theme appears in ∼60% of top comments). Negative sentiment is directed at OEMs, not at the channel. The audience composition skews technical (engineering criticism, BMS firmware references), and they reward content that goes beyond consumer reporting into actual teardown analysis.",
  "creator-maria":
    "Maria's audience is bifurcated: a policy-aligned base that amplifies her framings, and a counter-public that engages critically. Both sides are high-engagement; the channel functions less as an echo chamber than as a debate venue. UK-pollution content draws the sharpest rural-affordability pushback; international content (Gulf, Lancet study) draws more framing-critique engagement than rebuttal.",
  "creator-suburbmomtok":
    "Sponsored content is now drawing more critical engagement than organic, with sponsorship-disclosure concerns appearing in 3 of the last 4 sponsored posts' top comments. Creator integrity is the rising audience signal to monitor.",

  // run-level
  "run-ev-battery-recall":
    "Across the 5 posts currently in the top-X, sentiment is dominated by engineering criticism and OEM-trust degradation. The most-amplified comments across the set are whistleblower-style accounts of advance knowledge. Audience signals are consistent with a narrative entering its accountability phase: discussion is moving from 'what failed' to 'who knew when.'",
  "run-wildfire-cali":
    "Top-X comment set is dominated by Central Valley voices expressing clinical and parental urgency. Sentiment is negative but action-oriented (people asking what to do, not just venting). Forecast-credibility concerns are an emerging undercurrent — audiences are questioning whether briefings reflect current snowpack realities.",
  "run-back-to-school":
    "Across the top-X, the dominant audience signals are affordability concern and school-funding critique. Teacher-perspective comments consistently outperform other comment types on engagement. Sponsored content under-performs organic content in comment sentiment by a wide margin.",
};

function defaultSummary(label: string, count: number): string {
  return `Across ${count} ${count === 1 ? "comment" : "comments"} analyzed for ${label}, audience reception spans a mix of supportive, neutral, and critical responses. Dominant themes and notable comments are surfaced below; refer to the full feed for full context.`;
}

function aggregateSentiment(comments: Comment[]): CommentAnalysisOutput["sentiment"] {
  const counts = { positive: 0, neutral: 0, negative: 0, mixed: 0 };
  for (const c of comments) counts[c.sentiment]++;
  const total = comments.length || 1;
  return {
    positive: Math.round((counts.positive / total) * 100),
    neutral: Math.round((counts.neutral / total) * 100),
    negative: Math.round((counts.negative / total) * 100),
    mixed: Math.round((counts.mixed / total) * 100),
  };
}

function dominantSentiment(counts: Record<Sentiment, number>): Sentiment {
  let top: Sentiment = "neutral";
  let max = -1;
  (Object.entries(counts) as Array<[Sentiment, number]>).forEach(([s, n]) => {
    if (n > max) {
      top = s;
      max = n;
    }
  });
  return top;
}

function aggregateThemes(comments: Comment[]): Theme[] {
  type Acc = {
    count: number;
    engagement: number;
    sample: string;
    sampleLikes: number;
    sentiments: Record<Sentiment, number>;
  };
  const byLabel = new Map<string, Acc>();
  for (const c of comments) {
    for (const label of c.themes) {
      const cur = byLabel.get(label);
      if (cur) {
        cur.count += 1;
        cur.engagement += c.likes;
        cur.sentiments[c.sentiment] += 1;
        if (c.likes > cur.sampleLikes) {
          cur.sample = c.body;
          cur.sampleLikes = c.likes;
        }
      } else {
        byLabel.set(label, {
          count: 1,
          engagement: c.likes,
          sample: c.body,
          sampleLikes: c.likes,
          sentiments: { positive: 0, neutral: 0, negative: 0, mixed: 0, [c.sentiment]: 1 } as Record<Sentiment, number>,
        });
      }
    }
  }
  return Array.from(byLabel.entries())
    .map(([label, v]) => {
      const meta = themeMeta(label);
      return {
        label,
        count: v.count,
        engagement: v.engagement,
        sample: v.sample,
        sentiment: dominantSentiment(v.sentiments),
        emergence: meta.emergence,
        category: meta.category,
      };
    })
    .sort((a, b) => b.engagement - a.engagement);
}

function notableComments(comments: Comment[]): NotableComment[] {
  const sortedByLikes = [...comments].sort((a, b) => b.likes - a.likes);
  return sortedByLikes.slice(0, 4).map((c) => ({
    commentId: c.id,
    reason: notableReason(c),
  }));
}

function themeContains(themes: string[], needle: string): boolean {
  const n = needle.toLowerCase();
  return themes.some((t) => t.toLowerCase().includes(n));
}

function notableReason(c: Comment): string {
  if (themeContains(c.themes, "Whistleblower")) return "Whistleblower-style claim with high amplification";
  if (themeContains(c.themes, "Teacher Voice")) return "Teacher-voice amplifier in this audience";
  if (themeContains(c.themes, "Credibility")) return "Strongest expression of audience trust";
  if (themeContains(c.themes, "Sponsorship Disclosure")) return "Sponsorship critique with broad agreement";
  if (themeContains(c.themes, "Asthma") || themeContains(c.themes, "Pregnant"))
    return "Clinical / personal voice raising urgency";
  if (themeContains(c.themes, "Reservation Cancellations")) return "Concrete consumer attrition signal";
  if (themeContains(c.themes, "VIN Range")) return "Scope-disclosure concern with sourcing";
  if (c.likes > 5000) return "Top-engagement comment in this set";
  return "Representative high-engagement comment";
}

function audienceSignals(comments: Comment[]): AudienceSignal[] {
  const themeCounts = new Map<string, number>();
  for (const c of comments) for (const t of c.themes) themeCounts.set(t, (themeCounts.get(t) || 0) + 1);

  const themeToSignal: Array<{
    match: (t: string) => boolean;
    label: string;
    note: (count: number) => string;
  }> = [
    {
      match: (t) => /credibility|credible/i.test(t),
      label: "Creator trust",
      note: (n) => `Surfaced in ${n} themed comments — audience treats this creator as a credible voice`,
    },
    {
      match: (t) => /whistleblower|warnings ignored|vin range|underdisclosure|compression/i.test(t),
      label: "Accountability pressure",
      note: (n) => `Whistleblower / scope-disclosure claims in ${n} comments — narrative moving to accountability`,
    },
    {
      match: (t) => /sponsorship/i.test(t),
      label: "Sponsorship fatigue",
      note: (n) => `Sponsorship disclosure / volume concerns in ${n} comments`,
    },
    {
      match: (t) => /affordability|supply.*gap|heating cost/i.test(t),
      label: "Affordability concern",
      note: (n) => `Cost / affordability surfaced in ${n} comments`,
    },
    {
      match: (t) => /teacher|iep|school/i.test(t),
      label: "Teacher / institution voices",
      note: (n) => `Teacher / school-staff perspectives in ${n} comments — high engagement multiplier`,
    },
    {
      match: (t) => /asthma|pregnant|smoke|n95|public health/i.test(t),
      label: "Direct personal impact",
      note: (n) => `Personal / clinical impact in ${n} comments — urgency rising`,
    },
    {
      match: (t) => /cancellation|service capacity|pr communication/i.test(t),
      label: "Consumer attrition",
      note: (n) => `Owner / buyer attrition signals in ${n} comments`,
    },
  ];

  const out: AudienceSignal[] = [];
  for (const sig of themeToSignal) {
    const total = Array.from(themeCounts.entries())
      .filter(([t]) => sig.match(t))
      .reduce((sum, [, count]) => sum + count, 0);
    if (total === 0) continue;
    const intensity = Math.min(5, Math.max(1, Math.ceil(total / 2))) as AudienceSignal["intensity"];
    out.push({ label: sig.label, intensity, note: sig.note(total) });
  }
  return out.slice(0, 5);
}

const AGE_ORDER: AgeRange[] = ["13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
const GENDER_ORDER: Gender[] = ["female", "male", "non-binary", "unknown"];

function aggregateDemographics(comments: Comment[]): Demographics {
  const total = comments.length || 1;

  const ageCounts = new Map<AgeRange, number>();
  const genderCounts = new Map<Gender, number>();
  const countryCounts = new Map<string, number>();

  for (const c of comments) {
    ageCounts.set(c.authorAge, (ageCounts.get(c.authorAge) || 0) + 1);
    genderCounts.set(c.authorGender, (genderCounts.get(c.authorGender) || 0) + 1);
    countryCounts.set(c.authorCountry, (countryCounts.get(c.authorCountry) || 0) + 1);
  }

  const age: DemographicBucket<AgeRange>[] = AGE_ORDER
    .filter((a) => (ageCounts.get(a) ?? 0) > 0)
    .map((label) => {
      const count = ageCounts.get(label) ?? 0;
      return { label, count, pct: Math.round((count / total) * 100) };
    });

  const gender: DemographicBucket<Gender>[] = GENDER_ORDER
    .filter((g) => (genderCounts.get(g) ?? 0) > 0)
    .map((label) => {
      const count = genderCounts.get(label) ?? 0;
      return { label, count, pct: Math.round((count / total) * 100) };
    });

  const country: DemographicBucket<string>[] = Array.from(countryCounts.entries())
    .map(([label, count]) => ({ label, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);

  return { age, gender, country };
}

function aggregateTopCommenters(comments: Comment[], limit = 5): TopCommenter[] {
  type Acc = {
    handle: string;
    commentCount: number;
    totalEngagement: number;
    sentiments: Record<Sentiment, number>;
    themes: Map<string, number>;
    representativeBody: string;
    representativeLikes: number;
    platforms: Set<Platform>;
  };
  const byHandle = new Map<string, Acc>();

  for (const c of comments) {
    const post = getPost(c.postId);
    let acc = byHandle.get(c.authorHandle);
    if (!acc) {
      acc = {
        handle: c.authorHandle,
        commentCount: 0,
        totalEngagement: 0,
        sentiments: { positive: 0, neutral: 0, negative: 0, mixed: 0 },
        themes: new Map(),
        representativeBody: c.body,
        representativeLikes: -1,
        platforms: new Set(),
      };
      byHandle.set(c.authorHandle, acc);
    }
    acc.commentCount += 1;
    acc.totalEngagement += c.likes;
    acc.sentiments[c.sentiment] += 1;
    for (const t of c.themes) acc.themes.set(t, (acc.themes.get(t) ?? 0) + 1);
    if (c.likes > acc.representativeLikes) {
      acc.representativeBody = c.body;
      acc.representativeLikes = c.likes;
    }
    if (post) acc.platforms.add(post.platform);
  }

  return Array.from(byHandle.values())
    .map((acc) => {
      const topThemeEntry = Array.from(acc.themes.entries()).sort((a, b) => b[1] - a[1])[0];
      return {
        handle: acc.handle,
        commentCount: acc.commentCount,
        totalEngagement: acc.totalEngagement,
        dominantSentiment: dominantSentiment(acc.sentiments),
        topTheme: topThemeEntry?.[0],
        representativeComment: acc.representativeBody,
        platforms: Array.from(acc.platforms),
      };
    })
    .sort((a, b) => b.totalEngagement - a.totalEngagement)
    .slice(0, limit);
}

function volumeOverTime(comments: Comment[]): VolumePoint[] {
  const byDay = new Map<string, number>();
  for (const c of comments) {
    const day = c.postedAt.slice(0, 10);
    byDay.set(day, (byDay.get(day) || 0) + 1);
  }
  const days = Array.from(byDay.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
  return days;
}

export function deriveAnalysisOutput(
  scopeKey: string,
  comments: Comment[],
  scopeLabel: string,
): CommentAnalysisOutput {
  const summary = SUMMARIES[scopeKey] ?? defaultSummary(scopeLabel, comments.length);
  return {
    executiveSummary: summary,
    sentiment: aggregateSentiment(comments),
    themes: aggregateThemes(comments),
    audienceSignals: audienceSignals(comments),
    notableComments: notableComments(comments),
    volumeOverTime: volumeOverTime(comments),
    demographics: aggregateDemographics(comments),
    topCommenters: aggregateTopCommenters(comments),
    totalComments: comments.length,
    lastRefreshedAt: "2026-05-22T15:00:00Z",
  };
}

export function emptyAnalysisOutput(): CommentAnalysisOutput {
  return deriveAnalysisOutput("__empty__", [], "no comments");
}

// Exposed for components that want raw comment lists alongside the analysis.
export { allComments };
