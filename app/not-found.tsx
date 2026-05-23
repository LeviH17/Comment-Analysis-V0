import Link from "next/link";
import { FileSearch } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-20">
      <div className="max-w-md rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
        <FileSearch className="mx-auto h-8 w-8 text-zinc-400" />
        <h1 className="mt-4 text-lg font-semibold tracking-tight text-zinc-900">
          We couldn't find that.
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          The folder, creator, or analysis run you were looking for doesn't exist or was removed.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/comment-analysis/post-comments"
            className="inline-flex h-9 items-center rounded-md bg-zinc-900 px-3 text-sm font-medium text-white hover:bg-black"
          >
            Go to Post Comments
          </Link>
          <Link
            href="/comment-analysis/creator-comments"
            className="inline-flex h-9 items-center rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            Creator Comments
          </Link>
          <Link
            href="/comment-analysis/search-comments"
            className="inline-flex h-9 items-center rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            Search Comments
          </Link>
        </div>
      </div>
    </div>
  );
}
