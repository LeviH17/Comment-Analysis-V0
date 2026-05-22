import type { Platform } from "@/lib/types";

const STYLES: Record<Platform, { label: string; bg: string; fg: string }> = {
  youtube: { label: "Y", bg: "bg-red-100", fg: "text-red-700" },
  x: { label: "𝕏", bg: "bg-zinc-900", fg: "text-white" },
  tiktok: { label: "T", bg: "bg-zinc-900", fg: "text-white" },
  reddit: { label: "R", bg: "bg-orange-100", fg: "text-orange-700" },
  instagram: { label: "I", bg: "bg-pink-100", fg: "text-pink-700" },
};

const NAMES: Record<Platform, string> = {
  youtube: "YouTube",
  x: "X",
  tiktok: "TikTok",
  reddit: "Reddit",
  instagram: "Instagram",
};

export function PlatformBadge({
  platform,
  size = "sm",
}: {
  platform: Platform;
  size?: "xs" | "sm" | "md";
}) {
  const s = STYLES[platform];
  const sizeClass = size === "xs" ? "h-4 w-4 text-[9px]" : size === "md" ? "h-6 w-6 text-xs" : "h-5 w-5 text-[10px]";
  return (
    <span
      title={NAMES[platform]}
      className={`inline-flex flex-shrink-0 items-center justify-center rounded ${sizeClass} ${s.bg} ${s.fg} font-semibold`}
    >
      {s.label}
    </span>
  );
}

export function platformName(platform: Platform): string {
  return NAMES[platform];
}
