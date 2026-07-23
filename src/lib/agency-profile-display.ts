import { ENGINEERING_SERVICES, type EngineeringService } from "@/data/catalog";

export type AgencyProfileRecord = {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  disciplines: string[] | null;
  service_areas: string[] | null;
  commercial_registration: string | null;
  engineering_license: string | null;
  indicative_price_from: number | null;
  approved_at: string | null;
  created_at: string;
};

export function getAgencyDisplayName(agency: AgencyProfileRecord, locale: string): string {
  if (locale === "ar" && agency.name_ar) return agency.name_ar;
  return agency.name;
}

export function getAgencyDescription(agency: AgencyProfileRecord, locale: string): string | null {
  if (locale === "ar" && agency.description_ar) return agency.description_ar;
  return agency.description;
}

export function getAgencyMemberSinceYear(agency: AgencyProfileRecord): number {
  const source = agency.approved_at ?? agency.created_at;
  return new Date(source).getFullYear();
}

/** Match catalog services to agency disciplines without inventing offerings. */
export function getSuggestedServicesForAgency(
  disciplines: string[] | null | undefined,
  limit = 6
): EngineeringService[] {
  const terms = (disciplines ?? [])
    .map((d) => d.toLowerCase().trim())
    .filter(Boolean);

  if (terms.length === 0) {
    return ENGINEERING_SERVICES.filter((s) => s.provider_type === "engineering_office").slice(0, limit);
  }

  const matched = ENGINEERING_SERVICES.filter((service) => {
    const haystack = `${service.name} ${service.category} ${service.provider}`.toLowerCase();
    return terms.some(
      (term) =>
        haystack.includes(term) ||
        term.split(/\s+/).some((part) => part.length > 3 && haystack.includes(part))
    );
  });

  const unique = matched.filter(
    (service, index, list) => list.findIndex((s) => s.id === service.id) === index
  );

  if (unique.length >= 3) return unique.slice(0, limit);

  const fallback = ENGINEERING_SERVICES.filter(
    (s) => s.provider_type === "engineering_office" && !unique.some((u) => u.id === s.id)
  );

  return [...unique, ...fallback].slice(0, limit);
}
