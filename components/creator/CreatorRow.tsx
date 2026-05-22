import type { Creator } from "@/lib/types";
import { PlatformBadge } from "@/components/PlatformBadge";
import Link from "next/link";

const fmt = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export function CreatorRow({
  creator,
  trailing,
  href,
  compact = false,
}: {
  creator: Creator;
  trailing?: React.ReactNode;
  href?: string;
  compact?: boolean;
}) {
  const body = (
    <div className={`flex items-center gap-2.5 ${compact ? "py-1.5" : "py-2"}`}>
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-semibold text-zinc-700">
        {creator.name.slice(0, 2).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-sm text-zinc-900">
          <span className="truncate">{creator.name}</span>
          <PlatformBadge platform={creator.platform} size="xs" />
        </div>
        {!compact && (
          <div className="truncate text-[11px] text-zinc-500">
            {creator.handle} · {fmt.format(creator.followers)} followers
          </div>
        )}
      </div>
      {trailing}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block rounded-md px-1.5 hover:bg-zinc-50">
        {body}
      </Link>
    );
  }
  return <div className="px-1.5">{body}</div>;
}
