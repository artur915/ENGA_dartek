export const SAUDI_REGIONS = [
  "Riyadh Region",
  "Makkah Region",
  "Eastern Province",
  "Madinah Region",
  "Asir Region",
  "Tabuk Region",
  "Hail Region",
  "Northern Borders Region",
  "Jazan Region",
  "Najran Region",
  "Al Bahah Region",
  "Al Jawf Region",
  "Qassim Region",
] as const;

/** Map UI region labels to agency service_areas values used in registration. */
export const REGION_TO_SERVICE_AREAS: Record<string, string[]> = {
  "Riyadh Region": ["Riyadh"],
  "Makkah Region": ["Jeddah", "Makkah"],
  "Eastern Province": ["Dammam", "Khobar", "Eastern Province"],
  "Madinah Region": ["Madinah"],
  "Asir Region": ["Abha"],
  "Tabuk Region": ["Tabuk"],
};

export function regionMatchesServiceAreas(region: string, serviceAreas: string[] | null): boolean {
  if (!serviceAreas?.length) return false;
  const mapped = REGION_TO_SERVICE_AREAS[region];
  if (mapped) return mapped.some((area) => serviceAreas.includes(area));
  const normalized = region.replace(/ Region$/, "");
  return serviceAreas.some(
    (area) => area === normalized || area.includes(normalized) || normalized.includes(area)
  );
}
