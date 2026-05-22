import { PageShell } from "@/components/PageShell";

export default function CreatorCommentsPage() {
  return (
    <PageShell
      breadcrumb="Comment Analysis"
      title="Creator Comments"
      subtitle="Comment analysis on every post by creators on your influencer lists, with historical backfill and ongoing ingestion."
    >
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center text-sm text-zinc-500">
        Tracked-creator list and per-creator comment analysis land here in milestone 4.
      </div>
    </PageShell>
  );
}
