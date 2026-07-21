import type { EngineeringService, ServiceCategory, ServicePackage } from "@/data/catalog";

const CATEGORY_AR: Record<string, string> = {
  Design: "التصميم",
  "Permits & Licensing": "التصاريح والتراخيص",
  "Surveying & Land": "المساحة والأراضي",
  "Supervision & Project Management": "الإشراف وإدارة المشاريع",
  "Inspections & Technical Reports": "الفحوصات والتقارير الفنية",
  "MEP & Specialized Systems": "أنظمة MEP والأنظمة المتخصصة",
  "Insurance & Compliance": "التأمين والامتثال",
  "Engineering Studies": "الدراسات الهندسية",
  "Operations, Maintenance & Facility Management": "التشغيل والصيانة وإدارة المرافق",
  "Advisory & Engineering Arbitration": "الاستشارات والتحكيم الهندسي",
};

const PACKAGE_AR: Record<
  string,
  { name: string; description: string; categories: string }
> = {
  "build-my-villa": {
    name: "ابنِ فيلتي",
    description: "مسار متكامل من التصميم إلى تسليم الفيلا مع الإشراف",
    categories: "تصميم + تصاريح + إشراف + فحوصات + تأمين",
  },
  "design-to-permit": {
    name: "من التصميم إلى التصريح",
    description: "باقة تصميم متكاملة تنتهي بإصدار تصريح بناء",
    categories: "تصميم + تصاريح + مساحة",
  },
  "fast-permit": {
    name: "تصريح سريع",
    description: "إصدار سريع لتصريح بناء على تصميم جاهز",
    categories: "تصاريح",
  },
  "renovate-&-expand": {
    name: "تجديد وتوسعة",
    description: "تجديد أو توسعة مبنى قائم مع الموافقات المطلوبة",
    categories: "تصميم داخلي + تصاريح تجديد/هدم + فحوصات",
  },
  "legalize-my-building": {
    name: "تنظيم مبناي",
    description: "تنظيم مبنى غير مطابق وتصحيح وضعه",
    categories: "مساحة + تعديل تصريح + تقارير سلامة",
  },
  "design-studio": {
    name: "استوديو التصميم",
    description: "خدمات التصميم الداخلي/المعماري والتجربة البصرية",
    categories: "داخلي + معماري + أتمتة + استدامة",
  },
};

const PROVIDER_AR: Record<string, string> = {
  "Engineering office": "مكتب هندسي",
  "Office + individual engineer": "مكتب + مهندس فردي",
  "Specialized office": "مكتب متخصص",
  "Office or insurer": "مكتب أو شركة تأمين",
};

const PACKAGE_NAME_AR: Record<string, string> = {
  "Build My Villa": "ابنِ فيلتي",
  "Design to Permit": "من التصميم إلى التصريح",
  "Fast Permit": "تصريح سريع",
  "Renovate & Expand": "تجديد وتوسعة",
  "Legalize My Building": "تنظيم مبناي",
  "Design Studio": "استوديو التصميم",
};

export function getCategoryLabel(category: ServiceCategory | string, locale: string): string {
  const name = typeof category === "string" ? category : category.name;
  if (locale === "ar") return CATEGORY_AR[name] ?? name;
  return name;
}

export function getPackageField(
  pkg: ServicePackage,
  field: "name" | "description" | "categories",
  locale: string
): string {
  if (locale === "ar") {
    return PACKAGE_AR[pkg.slug]?.[field] ?? pkg[field];
  }
  return pkg[field];
}

export function getProviderLabel(provider: string, locale: string): string {
  if (locale === "ar") return PROVIDER_AR[provider] ?? provider;
  return provider;
}

export function getServiceLabel(service: EngineeringService, locale: string): string {
  if (locale !== "ar") return service.name;
  return service.name;
}

export function getPackageNameByEnglishName(name: string, locale: string): string {
  if (locale !== "ar") return name;
  return PACKAGE_NAME_AR[name] ?? name;
}
