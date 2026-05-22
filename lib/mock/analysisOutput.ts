import type {
  AudienceSignal,
  Comment,
  CommentAnalysisOutput,
  NotableComment,
  Theme,
  VolumePoint,
} from "@/lib/types";
import { comments as allComments } from "@/lib/mock/comments";

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

function aggregateThemes(comments: Comment[]): Theme[] {
  const byLabel = new Map<string, { count: number; sample: string }>();
  for (const c of comments) {
    for (const label of c.themes) {
      const cur = byLabel.get(label);
      if (cur) {
        cur.count += 1;
      } else {
        byLabel.set(label, { count: 1, sample: c.body });
      }
    }
  }
  return Array.from(byLabel.entries())
    .map(([label, v]) => ({ label, count: v.count, sample: v.sample }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

function notableComments(comments: Comment[]): NotableComment[] {
  const sortedByLikes = [...comments].sort((a, b) => b.likes - a.likes);
  return sortedByLikes.slice(0, 4).map((c) => ({
    commentId: c.id,
    reason: notableReason(c),
  }));
}

function notableReason(c: Comment): string {
  if (c.themes.includes("whistleblower")) return "Whistleblower-style claim with high amplification";
  if (c.themes.includes("teacher perspective")) return "Teacher-voice amplifier in this audience";
  if (c.themes.includes("creator trust")) return "Strongest expression of audience trust";
  if (c.themes.includes("sponsorship disclosure")) return "Sponsorship critique with broad agreement";
  if (c.themes.includes("clinical impact")) return "Clinical voice raising urgency";
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
      match: (t) => t.includes("trust") || t.includes("creator"),
      label: "Creator trust",
      note: (n) => `Surfaced in ${n} top comments — audience treats this creator as a credible voice`,
    },
    {
      match: (t) => t.includes("whistleblower") || t.includes("advance knowledge"),
      label: "Accountability pressure",
      note: (n) => `Whistleblower / advance-knowledge claims in ${n} comments — narrative moving to accountability`,
    },
    {
      match: (t) => t.includes("sponsorship") || t.includes("integrity"),
      label: "Sponsorship fatigue",
      note: (n) => `Sponsorship disclosure / integrity concerns in ${n} comments`,
    },
    {
      match: (t) => t.includes("affordability") || t.includes("funding"),
      label: "Affordability concern",
      note: (n) => `Cost / affordability surfaced in ${n} comments`,
    },
    {
      match: (t) => t.includes("teacher") || t.includes("school"),
      label: "Teacher / institution voices",
      note: (n) => `Teacher / school-staff perspectives in ${n} comments — high engagement multiplier`,
    },
    {
      match: (t) => t.includes("personal stakes") || t.includes("clinical"),
      label: "Direct personal impact",
      note: (n) => `Personal-impact framing in ${n} comments — urgency rising`,
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
    totalComments: comments.length,
    lastRefreshedAt: "2026-05-22T15:00:00Z",
  };
}

export function emptyAnalysisOutput(): CommentAnalysisOutput {
  return deriveAnalysisOutput("__empty__", [], "no comments");
}

// Exposed for components that want raw comment lists alongside the analysis.
export { allComments };
