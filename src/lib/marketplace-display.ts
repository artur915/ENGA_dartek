import { SERVICE_PACKAGES } from "@/data/catalog";

/** Marketing display counts shown on marketplace package cards. */
export const PACKAGE_DISPLAY_COUNTS: Record<string, { included: number; total: number }> = {
  "build-my-villa": { included: 67, total: 67 },
  "design-to-permit": { included: 23, total: 23 },
  "fast-permit": { included: 5, total: 5 },
  "renovate-&-expand": { included: 14, total: 14 },
  "legalize-my-building": { included: 23, total: 23 },
  "design-studio": { included: 36, total: 36 },
};

export function getPackageDisplayCounts(slug: string, actualCount: number) {
  return PACKAGE_DISPLAY_COUNTS[slug] ?? { included: actualCount, total: actualCount };
}

export function getPackageSlugByName(name: string): string | undefined {
  return SERVICE_PACKAGES.find((pkg) => pkg.name === name)?.slug;
}
