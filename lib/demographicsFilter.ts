import type { AgeRange, Comment, Gender } from "@/lib/types";

export type DemographicsFilter = {
  ages: Set<AgeRange>;
  genders: Set<Gender>;
  countries: Set<string>;
};

export function emptyDemographicsFilter(): DemographicsFilter {
  return { ages: new Set(), genders: new Set(), countries: new Set() };
}

export function isDemographicsFilterActive(f: DemographicsFilter): boolean {
  return f.ages.size > 0 || f.genders.size > 0 || f.countries.size > 0;
}

export function applyDemographicsFilter(
  comments: Comment[],
  filter: DemographicsFilter,
): Comment[] {
  if (!isDemographicsFilterActive(filter)) return comments;
  return comments.filter((c) => {
    if (filter.ages.size > 0 && !filter.ages.has(c.authorAge)) return false;
    if (filter.genders.size > 0 && !filter.genders.has(c.authorGender)) return false;
    if (filter.countries.size > 0 && !filter.countries.has(c.authorCountry)) return false;
    return true;
  });
}

export type DemographicsOption<T extends string> = {
  value: T;
  count: number;
};

const AGE_ORDER: AgeRange[] = ["13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
const GENDER_ORDER: Gender[] = ["female", "male", "non-binary", "unknown"];

export function buildDemographicsOptions(comments: Comment[]): {
  ages: DemographicsOption<AgeRange>[];
  genders: DemographicsOption<Gender>[];
  countries: DemographicsOption<string>[];
} {
  const ageCounts = new Map<AgeRange, number>();
  const genderCounts = new Map<Gender, number>();
  const countryCounts = new Map<string, number>();

  for (const c of comments) {
    ageCounts.set(c.authorAge, (ageCounts.get(c.authorAge) ?? 0) + 1);
    genderCounts.set(c.authorGender, (genderCounts.get(c.authorGender) ?? 0) + 1);
    countryCounts.set(c.authorCountry, (countryCounts.get(c.authorCountry) ?? 0) + 1);
  }

  return {
    ages: AGE_ORDER.filter((a) => (ageCounts.get(a) ?? 0) > 0).map((value) => ({
      value,
      count: ageCounts.get(value) ?? 0,
    })),
    genders: GENDER_ORDER.filter((g) => (genderCounts.get(g) ?? 0) > 0).map((value) => ({
      value,
      count: genderCounts.get(value) ?? 0,
    })),
    countries: Array.from(countryCounts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count),
  };
}
