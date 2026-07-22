import { ENGINEERING_SERVICES, SERVICE_PACKAGES, type EngineeringService } from "@/data/catalog";

export function getServicesForPackage(packageName: string): EngineeringService[] {
  return ENGINEERING_SERVICES.filter((service) => service.packages.includes(packageName));
}

export function getPackageServiceCount(packageName: string): number {
  return getServicesForPackage(packageName).length;
}

export const TOTAL_CATALOG_SERVICES = ENGINEERING_SERVICES.length;
export const TOTAL_CATALOG_CATEGORIES = 10;

export function getPackageBySlug(slug: string) {
  return SERVICE_PACKAGES.find((pkg) => pkg.slug === slug);
}
