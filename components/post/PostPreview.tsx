import type { Post, Platform } from "@/lib/types";
import { getCreator } from "@/lib/mock/creators";
import { PlatformBadge } from "@/components/PlatformBadge";
import {
  Eye,
  Heart,
  MessageSquare,
  Repeat2,
  Play,
  Music,
  MessageCircle,
  ImageIcon,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

const fmt = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

const PLATFORM_THUMB: Record<
  Platform,
  { gradient: string; icon: LucideIcon; iconClass: string; corner?: LucideIcon }
> = {
  youtube: {
    gradient: "from-red-50 via-red-100/70 to-red-50",
    icon: Play,
    iconClass: "text-red-500/70",
    corner: Play,
  },
  x: {
    gradient: "from-zinc-100 via-zinc-200/70 to-zinc-100",
    icon: MessageSquare,
    iconClass: "text-zinc-600/70",
  },
  tiktok: {
    gradient: "from-pink-50 via-violet-100/70 to-pink-50",
    icon: Music,
    iconClass: "text-pink-500/70",
    corner: Play,
  },
  reddit: {
    gradient: "from-orange-50 via-amber-100/70 to-orange-50",
    icon: MessageCircle,
    iconClass: "text-orange-500/70",
  },
  instagram: {
    gradient: "from-pink-50 via-amber-50 to-purple-100/70",
    icon: ImageIcon,
    iconClass: "text-pink-500/70",
  },
};

export function PostPreview({
  post,
  href,
  trailing,
}: {
  post: Post;
  href?: string;
  trailing?: React.ReactNode;
}) {
  const creator = getCreator(post.creatorId);
  const thumb = PLATFORM_THUMB[post.platform];
  const Icon = thumb.icon;
  const CornerIcon = thumb.corner;

  const dt = new Date(post.publishedAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const body = (
    <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white transition-colors hover:border-zinc-300">
      {/* Media preview area */}
      <div
        className={`relative aspect-video bg-gradient-to-br ${thumb.gradient} flex items-center justify-center`}
      >
        {post.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.thumbnailUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <Icon className={`h-10 w-10 ${thumb.iconClass}`} />
        )}

        {/* Title overlay on media (mimics YouTube-style thumbnail title) */}
        {post.title && !post.thumbnailUrl && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/40 to-transparent px-3 pt-6 pb-2.5">
            <p className="line-clamp-2 text-[12px] font-semibold leading-snug text-white">
              {post.title}
            </p>
          </div>
        )}

        {/* Platform corner chip */}
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-white/85 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700 backdrop-blur-sm">
          <PlatformBadge platform={post.platform} size="xs" />
          {CornerIcon && <CornerIcon className="h-2.5 w-2.5 text-zinc-500" />}
        </div>

        {/* Trailing slot (badges like New / Dropped) */}
        {trailing && (
          <div className="absolute right-2 top-2 z-[1]">{trailing}</div>
        )}
      </div>

      {/* Caption / body */}
      <div className="px-3.5 pt-3 pb-3.5">
        {post.title && (
          <div className="mb-1 line-clamp-2 text-[13px] font-medium leading-snug text-zinc-900">
            {post.title}
          </div>
        )}
        <p className="line-clamp-3 text-[13px] leading-5 text-zinc-700">{post.body}</p>

        {/* Creator row */}
        <div className="mt-3 flex items-center gap-2 min-w-0">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[9px] font-semibold text-zinc-700">
            {creator?.name.slice(0, 2).toUpperCase() ?? "?"}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 truncate text-[12px] font-medium text-zinc-900">
              <span className="truncate">{creator?.name ?? "Unknown"}</span>
              {creator?.verified && <BadgeCheck className="h-3 w-3 flex-shrink-0 text-blue-500" />}
            </div>
            <div className="truncate text-[11px] text-zinc-500">
              {creator?.handle} · {dt}
            </div>
          </div>
          {href && (
            <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-zinc-300" />
          )}
        </div>

        {/* Engagement strip */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-zinc-100 pt-2.5 text-[11px] text-zinc-500">
          {post.engagement.views !== undefined && (
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {fmt.format(post.engagement.views)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {fmt.format(post.engagement.likes)}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {fmt.format(post.engagement.comments)}
          </span>
          <span className="flex items-center gap-1">
            <Repeat2 className="h-3 w-3" />
            {fmt.format(post.engagement.shares)}
          </span>
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {body}
      </Link>
    );
  }
  return body;
}
