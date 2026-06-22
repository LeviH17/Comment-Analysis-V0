"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, X } from "lucide-react";
import type { AgeRange, Comment, Gender } from "@/lib/types";
import {
  buildDemographicsOptions,
  emptyDemographicsFilter,
  isDemographicsFilterActive,
  type DemographicsFilter,
} from "@/lib/demographicsFilter";
import { capitalize } from "@/lib/format";

const COUNTRY_CHIP_LIMIT = 10;

export function FilterButton({
  comments,
  filter,
  onChange,
}: {
  comments: Comment[];
  filter: DemographicsFilter;
  onChange: (next: DemographicsFilter) => void;
}) {
  const [open, setOpen] = useState(false);
  const active = isDemographicsFilterActive(filter);
  const count = filter.ages.size + filter.genders.size + filter.countries.size;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm transition-colors ${
          active
            ? "border-zinc-900 bg-zinc-900 text-white hover:bg-black"
            : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
        }`}
      >
        <Filter className="h-3.5 w-3.5" />
        <span>Filters</span>
        {active && (
          <span className="ml-0.5 tabular-nums opacity-90">({count})</span>
        )}
      </button>

      {open && (
        <FilterPanel
          comments={comments}
          initialFilter={filter}
          onApply={(next) => {
            onChange(next);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function FilterPanel({
  comments,
  initialFilter,
  onApply,
  onClose,
}: {
  comments: Comment[];
  initialFilter: DemographicsFilter;
  onApply: (next: DemographicsFilter) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<DemographicsFilter>(initialFilter);
  const [countriesExpanded, setCountriesExpanded] = useState(false);

  const options = useMemo(() => buildDemographicsOptions(comments), [comments]);
  const draftActive = isDemographicsFilterActive(draft);
  const draftCount = draft.ages.size + draft.genders.size + draft.countries.size;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const toggleAge = (v: AgeRange) =>
    setDraft((d) => {
      const next = new Set(d.ages);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return { ...d, ages: next };
    });
  const toggleGender = (v: Gender) =>
    setDraft((d) => {
      const next = new Set(d.genders);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return { ...d, genders: next };
    });
  const toggleCountry = (v: string) =>
    setDraft((d) => {
      const next = new Set(d.countries);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return { ...d, countries: next };
    });

  const reset = () => setDraft(emptyDemographicsFilter());

  const visibleCountries = countriesExpanded
    ? options.countries
    : options.countries.slice(0, COUNTRY_CHIP_LIMIT);
  const hiddenCountryCount = Math.max(0, options.countries.length - COUNTRY_CHIP_LIMIT);

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-zinc-900/30"
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-label="Filters"
        aria-modal="true"
        className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-white shadow-xl"
      >
        <header className="flex items-center justify-between px-6 py-5">
          <h2 className="text-xl font-semibold text-zinc-900">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-4">
          <Section label="Age">
            {options.ages.length === 0 && <EmptyHint />}
            <ChipRow>
              {options.ages.map((opt) => (
                <Chip
                  key={opt.value}
                  label={opt.value}
                  count={opt.count}
                  selected={draft.ages.has(opt.value)}
                  onClick={() => toggleAge(opt.value)}
                />
              ))}
            </ChipRow>
          </Section>

          <Section label="Gender">
            {options.genders.length === 0 && <EmptyHint />}
            <ChipRow>
              {options.genders.map((opt) => (
                <Chip
                  key={opt.value}
                  label={capitalize(opt.value)}
                  count={opt.count}
                  selected={draft.genders.has(opt.value)}
                  onClick={() => toggleGender(opt.value)}
                />
              ))}
            </ChipRow>
          </Section>

          <Section label="Location">
            {options.countries.length === 0 && <EmptyHint />}
            <ChipRow>
              {visibleCountries.map((opt) => (
                <Chip
                  key={opt.value}
                  label={opt.value}
                  count={opt.count}
                  selected={draft.countries.has(opt.value)}
                  onClick={() => toggleCountry(opt.value)}
                />
              ))}
              {hiddenCountryCount > 0 && (
                <button
                  type="button"
                  onClick={() => setCountriesExpanded((v) => !v)}
                  className="inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[11px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                >
                  {countriesExpanded ? "Show fewer" : `+${hiddenCountryCount} more`}
                </button>
              )}
            </ChipRow>
          </Section>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-zinc-100 px-6 py-4">
          <button
            type="button"
            onClick={reset}
            disabled={!draftActive}
            className="inline-flex h-9 items-center rounded-md px-3 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:text-zinc-300 disabled:hover:bg-transparent"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => onApply(draft)}
            className="inline-flex h-10 items-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-black"
          >
            Apply filters
            {draftActive && (
              <span className="ml-2 tabular-nums opacity-80">({draftCount})</span>
            )}
          </button>
        </footer>
      </aside>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
        {label}
      </div>
      {children}
    </div>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-1.5">{children}</div>;
}

function Chip({
  label,
  count,
  selected,
  onClick,
}: {
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[11px] transition-colors ${
        selected
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
      }`}
    >
      <span>{label}</span>
      <span className={`tabular-nums ${selected ? "text-zinc-300" : "text-zinc-400"}`}>
        {count}
      </span>
    </button>
  );
}

function EmptyHint() {
  return <span className="text-[11px] italic text-zinc-400">No data in this scope.</span>;
}
