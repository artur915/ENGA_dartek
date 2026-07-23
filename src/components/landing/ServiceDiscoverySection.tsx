"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import {
  ClipboardCheck,
  Compass,
  FileCheck2,
  HardHat,
  PenTool,
  ScrollText,
} from "lucide-react";
import { SearchInput } from "@/components/ui/SearchInput";
import { getCategoryLabel } from "@/lib/catalog-i18n";
import {
  LandingCard,
  LandingSection,
  LandingSectionHeader,
  LandingViewAllLink,
} from "@/components/landing/LandingSection";
import { LandingGrid, LandingGridItem } from "@/components/motion/LandingGrid";
import { Reveal } from "@/components/motion/Reveal";

const FEATURED_CATEGORIES = [
  "Design",
  "Permits & Licensing",
  "Surveying & Land",
  "Supervision & Project Management",
  "Inspections & Technical Reports",
  "Engineering Studies",
] as const;

const categoryIcons: Record<string, typeof PenTool> = {
  Design: PenTool,
  "Permits & Licensing": ScrollText,
  "Surveying & Land": Compass,
  "Supervision & Project Management": HardHat,
  "Inspections & Technical Reports": ClipboardCheck,
  "Engineering Studies": FileCheck2,
};

const categoryCounts: Record<string, number> = {
  Design: 30,
  "Permits & Licensing": 19,
  "Surveying & Land": 11,
  "Supervision & Project Management": 14,
  "Inspections & Technical Reports": 15,
  "Engineering Studies": 22,
};

export function ServiceDiscoverySection() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/services?q=${encodeURIComponent(q)}`);
    else router.push("/services");
  }

  const descriptions = t.raw("catalogCategoryDescriptions") as Record<string, string>;

  return (
    <LandingSection variant="light" id="catalog">
      <LandingSectionHeader
        badge={t("catalogBadge")}
        title={t("catalogTitle")}
        description={t("catalogSubtitle")}
        align="start"
        action={<LandingViewAllLink href="/services" label={t("catalogExploreAll")} />}
      />

      <Reveal delay={0.1}>
        <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery("")}
            placeholder={t("catalogSearchPlaceholder")}
            aria-label={tc("search")}
          />
        </form>
      </Reveal>

      <LandingGrid className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_CATEGORIES.map((catName) => {
          const Icon = categoryIcons[catName] ?? PenTool;
          const count = categoryCounts[catName];
          const label = getCategoryLabel(catName, locale);
          const description = descriptions[catName] ?? "";

          return (
            <LandingGridItem key={catName}>
            <Link href={`/services?category=${encodeURIComponent(catName)}`}>
              <LandingCard className="h-full">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-landing-muted text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-navy transition-colors group-hover:text-primary">
                      {label}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                    <p className="mt-3 text-xs font-medium text-muted">
                      {t("catalogServicesCount", { count })}
                    </p>
                  </div>
                </div>
              </LandingCard>
            </Link>
            </LandingGridItem>
          );
        })}
      </LandingGrid>
    </LandingSection>
  );
}
