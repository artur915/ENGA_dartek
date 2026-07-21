import { SAUDI_REGIONS } from "@/data/regions";

const REGION_AR: Record<string, string> = {
  "Riyadh Region": "منطقة الرياض",
  "Makkah Region": "منطقة مكة المكرمة",
  "Eastern Province": "المنطقة الشرقية",
  "Madinah Region": "منطقة المدينة المنورة",
  "Asir Region": "منطقة عسير",
  "Tabuk Region": "منطقة تبوك",
  "Hail Region": "منطقة حائل",
  "Northern Borders Region": "منطقة الحدود الشمالية",
  "Jazan Region": "منطقة جازان",
  "Najran Region": "منطقة نجران",
  "Al Bahah Region": "منطقة الباحة",
  "Al Jawf Region": "منطقة الجوف",
  "Qassim Region": "منطقة القصيم",
};

export function getRegionLabel(region: string, locale: string): string {
  if (locale === "ar") return REGION_AR[region] ?? region;
  return region;
}

export function getLocalizedRegions(locale: string): string[] {
  return SAUDI_REGIONS.map((region) => getRegionLabel(region, locale));
}

/** Resolve a stored region value back to the canonical English key. */
export function resolveRegionKey(value: string): string {
  if ((SAUDI_REGIONS as readonly string[]).includes(value)) return value;
  const match = Object.entries(REGION_AR).find(([, ar]) => ar === value);
  return match?.[0] ?? value;
}
