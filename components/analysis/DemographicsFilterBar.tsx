"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import type { AgeRange, Comment, Gender } from "@/lib/types";
import {
  buildDemographicsOptions,
  isDemographicsFilterActive,
  type DemographicsFilter,
} from "@/lib/demographicsFilter";
import { capitalize } from "@/lib/format";

const COUNTRY_CHIP_LIMIT = 10;

export function DemographicsFilterBar({
  comments,
  filter,
  onChange,
}: {
  comments: Comment[];
  filter: DemographicsFilter;
  onChange: (next: DemographicsFilter) => void;
}) {
  const [open, setOpen] = useState(true);
  const [countriesExpanded, setCountriesExpanded] = useState(false);

  const options = useMemo(() => buildDemographicsOptions(comments), [comments]);
  const active = isDemographicsFilterActive(filter);
  const totalSelected = filter.ages.size + filter.genders.size + filter.countries.size;

  const toggleAge = (v: AgeRange) => {
    const next = new Set(filter.ages);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    onChange({ ...filter, ages: next });
  };
  const toggleGender = (v: Gender) => {
    const next = new Set(filter.genders);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    onChange({ ...filter, genders: next });
  };
  const toggleCountry = (v: string) => {
    const next = new Set(filter.countries);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    onChange({ ...filter, countries: next });
  };

  const clearAll = () =>
    onChange({ ages: new Set(), genders: new Set(), countries: new Set() });

  const visibleCountries = countriesExpanded
    ? options.countries
    : options.countries.slice(0, COUNTRY_CHIP_LIMIT);
  const hiddenCountryCount = Math.max(0, options.countries.length - COUNTRY_CHIP_LIMIT);

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm transition-colors ${
            active
              ? "border-zinc-900 bg-zinc-900 text-white hover:bg-black"
              : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
          }`}
          aria-expanded={open}
        >
          <Filter className="h-3.5 w-3.5" />
          <span>
            Demographics
            {active && (
              <span className="ml-1 tabular-nums opacity-80">({totalSelected})</span>
            )}
          </span>
          {open ? (
            <ChevronUp className="h-3.5 w-3.5 opacity-70" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          )}
        </button>

        <span className="text-xs text-zinc-500">
          {active ? (
            <>Analysis scoped to selected demographics</>
          ) : (
            <>Analysis covers all commenter demographics</>
          )}
        </span>

        {active && (
          <button
            type="button"
            onClick={clearAll}
            className="ml-auto inline-flex h-7 items-center gap-1 rounded-md px-2 text-[12px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <X className="h-3 w-3" />
            Clear filter
          </button>
        )}
      </div>

      {open && (
        <div className="mt-3 space-y-3 border-t border-zinc-100 pt-3">
          <ChipRow label="Age">
            {options.ages.length === 0 && <EmptyHint />}
            {options.ages.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.value}
                count={opt.count}
                selected={filter.ages.has(opt.value)}
                onClick={() => toggleAge(opt.value)}
              />
            ))}
          </ChipRow>

          <ChipRow label="Gender">
            {options.genders.length === 0 && <EmptyHint />}
            {options.genders.map((opt) => (
              <Chip
                key={opt.value}
                label={capitalize(opt.value)}
                count={opt.count}
                selected={filter.genders.has(opt.value)}
                onClick={() => toggleGender(opt.value)}
              />
            ))}
          </ChipRow>

          <ChipRow label="Location">
            {options.countries.length === 0 && <EmptyHint />}
            {visibleCountries.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.value}
                count={opt.count}
                selected={filter.countries.has(opt.value)}
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
        </div>
      )}
    </section>
  );
}

function ChipRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 w-[60px] flex-shrink-0 text-[11px] uppercase tracking-wider text-zinc-400">
        {label}
      </span>
      {children}
    </div>
  );
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
