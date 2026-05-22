import { PageShell } from "@/components/PageShell";

export default function SearchCommentsPage() {
  return (
    <PageShell
      breadcrumb="Comment Analysis"
      title="Search Comments"
      subtitle="Comment analysis runs defined by a boolean query and a top-X cap, refreshed every 24 hours."
    >
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center text-sm text-zinc-500">
        Analysis run composer and run-detail surfaces land here in milestone 3.
      </div>
    </PageShell>
  );
}
