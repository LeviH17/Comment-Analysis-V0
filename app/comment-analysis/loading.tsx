export default function Loading() {
  return (
    <div className="px-8 pt-6 pb-12">
      <div className="mb-3 h-3 w-32 animate-pulse rounded bg-zinc-100" />
      <div className="h-7 w-72 animate-pulse rounded bg-zinc-100" />
      <div className="mt-2 h-4 w-96 animate-pulse rounded bg-zinc-100" />
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-xl bg-zinc-100" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-44 animate-pulse rounded-xl bg-zinc-100" />
            <div className="h-44 animate-pulse rounded-xl bg-zinc-100" />
          </div>
          <div className="h-72 animate-pulse rounded-xl bg-zinc-100" />
        </div>
        <div className="space-y-4">
          <div className="h-24 animate-pulse rounded-xl bg-zinc-100" />
          <div className="h-24 animate-pulse rounded-xl bg-zinc-100" />
          <div className="h-44 animate-pulse rounded-xl bg-zinc-100" />
        </div>
      </div>
    </div>
  );
}
