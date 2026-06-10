import type { ThemeCategory, ThemeEmergence } from "@/lib/types";

export type ThemeMeta = {
  category: ThemeCategory;
  emergence: ThemeEmergence;
};

/**
 * Curated catalog of narrative-style themes. The key is the canonical label
 * (used directly in comments' themes arrays). The metadata fills in the
 * category and emergence signals that the analysis widget surfaces.
 *
 * Emergence is mocked here. In a real ingestion, it would be derived from
 * the theme's mention velocity over the analysis window.
 */
export const themesCatalog: Record<string, ThemeMeta> = {
  // EV battery recall narrative
  "Rivian R1S BMS Validation Failures": { category: "Engineering", emergence: "rising" },
  "Pre-Production Engineering Warnings Ignored": { category: "Engineering", emergence: "rising" },
  "Anonymous Engineer Whistleblower Claims": { category: "Engineering", emergence: "rising" },
  "Cross-Brand Validation Compression Concerns": { category: "Engineering", emergence: "rising" },
  "NHTSA VIN Range Data Discrepancy": { category: "Engineering", emergence: "rising" },
  "Rivian Recall Scope Underdisclosure": { category: "Engineering", emergence: "rising" },
  "SOC Estimation Drift Engineering Discussion": { category: "Engineering", emergence: "stable" },
  "Dealership Network Forewarning": { category: "Engineering", emergence: "stable" },
  "Rivian Owner Service Capacity Gap": { category: "Social", emergence: "rising" },
  "Rivian PR Communication Failures": { category: "Media", emergence: "rising" },
  "EV Teardown Channel Credibility Boost": { category: "Media", emergence: "stable" },
  "RecallReporter Source Credibility": { category: "Media", emergence: "stable" },
  "Mass Reservation Cancellations": { category: "Economic", emergence: "rising" },
  "Pending Rivian Litigation Risk": { category: "Governance", emergence: "rising" },
  "NHTSA Federal Mandate Pressure": { category: "Governance", emergence: "rising" },
  "Whistleblower Claim Evidence Standards": { category: "Media", emergence: "stable" },
  "Anti-EV Cultural Pushback": { category: "Social", emergence: "stable" },

  // Air quality / public-health narratives
  "Rural Stove Ban Resistance": { category: "Social", emergence: "stable" },
  "Heating Cost Affordability Crisis": { category: "Economic", emergence: "stable" },
  "PM2.5 Public Health Education Need": { category: "Health", emergence: "stable" },
  "Policy Implementation Gaps for Vulnerable Renters": { category: "Social", emergence: "stable" },
  "Cross-Border Air Pollution Policy": { category: "Governance", emergence: "stable" },
  "Selective Air Pollution Framing Critique": { category: "Media", emergence: "stable" },
  "Central Valley Sensor Coverage Gaps": { category: "Governance", emergence: "rising" },
  "Wildfire Forecast Drought Model Concerns": { category: "Engineering", emergence: "rising" },
  "Air Quality Data Transparency Push": { category: "Governance", emergence: "stable" },
  "Pregnant Mothers' Wildfire Smoke Concerns": { category: "Health", emergence: "rising" },
  "Asthma Clinic Surge Reports": { category: "Health", emergence: "rising" },
  "N95 Mask Permanent Adoption": { category: "Social", emergence: "stable" },
  "School Closure AQI Trigger Policy Gap": { category: "Governance", emergence: "rising" },
  "Wildfire Smoke As Routine Concern": { category: "Social", emergence: "stable" },
  "Air Quality Industry Coalition Pushback": { category: "Governance", emergence: "rising" },
  "Independent AHAM CADR Validation": { category: "Media", emergence: "stable" },

  // Back-to-school marketing narrative
  "Target Brand App Convenience Preference": { category: "Economic", emergence: "stable" },
  "BTS Haul Methodology Critique": { category: "Media", emergence: "stable" },
  "Teacher Voice on School Supply Lists": { category: "Social", emergence: "rising" },
  "School Supply List Affordability Crisis": { category: "Economic", emergence: "rising" },
  "Influencer Sponsorship Disclosure Concerns": { category: "Media", emergence: "rising" },
  "Mom-Influencer Purchase Recommendations": { category: "Economic", emergence: "stable" },
  "SuburbMomTok Sponsorship Volume Critique": { category: "Media", emergence: "rising" },
  "IEP Auditory Accommodation Need": { category: "Social", emergence: "stable" },
  "Generational Headphone Necessity Debate": { category: "Social", emergence: "stable" },
  "Property Tax / Classroom Supply Gap": { category: "Governance", emergence: "stable" },
};

export function themeMeta(label: string): ThemeMeta {
  return themesCatalog[label] ?? { category: "Generic", emergence: "stable" };
}
