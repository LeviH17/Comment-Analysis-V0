import type { Post } from "@/lib/types";
import { getCreator } from "@/lib/mock/creators";
import { PlatformBadge } from "@/components/PlatformBadge";
import { Eye, Heart, MessageSquare, Repeat2 } from "lucide-react";
import Link from "next/link";

const fmt = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export function PostCard({
  post,
  href,
  trailing,
}: {
  post: Post;
  href?: string;
  trailing?: React.ReactNode;
}) {
  const creator = getCreator(post.creatorId);
  const dt = new Date(post.publishedAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const body = (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-semibold text-zinc-700">
            {creator?.name.slice(0, 2).toUpperCase() ?? "?"}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-900">
              <span className="truncate">{creator?.name ?? "Unknown"}</span>
              <PlatformBadge platform={post.platform} size="xs" />
            </div>
            <div className="truncate text-[11px] text-zinc-500">
              {creator?.handle} · {dt}
            </div>
          </div>
        </div>
        {trailing}
      </header>
      {post.title && (
        <div className="mt-3 text-sm font-medium text-zinc-900">{post.title}</div>
      )}
      <p className="mt-1.5 line-clamp-4 text-sm leading-5 text-zinc-700">{post.body}</p>
      <footer className="mt-3 flex items-center gap-4 text-[11px] text-zinc-500">
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
      </footer>
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
