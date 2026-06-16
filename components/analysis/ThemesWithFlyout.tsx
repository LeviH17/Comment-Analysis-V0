"use client";

import { useMemo, useState } from "react";
import { ThemeChips } from "@/components/analysis/ThemeChips";
import { CommentsFlyout } from "@/components/analysis/CommentsFlyout";
import { deriveAnalysisOutput } from "@/lib/mock/analysisOutput";
import type { Comment, Theme } from "@/lib/types";

export function ThemesWithFlyout({
  themes,
  allComments,
  flyoutSubtitle,
  showCount = 8,
}: {
  themes: Theme[];
  allComments: Comment[];
  flyoutSubtitle?: string;
  showCount?: number;
}) {
  const [openTheme, setOpenTheme] = useState<string | null>(null);

  const themeComments = useMemo(() => {
    if (!openTheme) return [];
    return allComments.filter((c) => c.themes.includes(openTheme));
  }, [openTheme, allComments]);

  const themeAnalysis = useMemo(() => {
    if (!openTheme) return null;
    return deriveAnalysisOutput(`theme::${openTheme}`, themeComments, openTheme);
  }, [openTheme, themeComments]);

  return (
    <>
      <ThemeChips
        themes={themes}
        showCount={showCount}
        onThemeClick={(label) => setOpenTheme(label)}
        activeLabel={openTheme}
      />
      {openTheme && themeAnalysis && (
        <CommentsFlyout
          open
          onClose={() => setOpenTheme(null)}
          title={openTheme}
          subtitle={flyoutSubtitle ?? "Theme view"}
          comments={themeComments}
          analysis={themeAnalysis}
        />
      )}
    </>
  );
}
