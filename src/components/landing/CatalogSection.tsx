import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SERVICE_CATEGORIES } from "@/data/catalog";
import { Layers } from "lucide-react";
import {
  LandingCard,
  LandingSection,
  LandingSectionHeader,
  LandingViewAllLink,
} from "@/components/landing/LandingSection";

export function CatalogSection() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");

  return (
    <LandingSection variant="light" id="catalog">
      <LandingSectionHeader
        badge={t("catalogBadge")}
        title={t("catalogTitle")}
        description={t("catalogSubtitle")}
        align="start"
        action={<LandingViewAllLink href="/services" label={tc("viewAll")} />}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {SERVICE_CATEGORIES.map((cat) => (
          <Link key={cat.name} href={`/services?category=${encodeURIComponent(cat.name)}`}>
            <LandingCard className="h-full">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-primary/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                  {cat.count} {t("catalogServicesLabel")}
                </span>
                <Layers className="h-4 w-4 text-muted/50 transition-colors group-hover:text-primary" />
              </div>
              <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                {cat.name}
              </h3>
            </LandingCard>
          </Link>
        ))}
      </div>
    </LandingSection>
  );
}
