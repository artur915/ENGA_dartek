import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SERVICE_CATEGORIES } from "@/data/catalog";
import { ArrowRight, Layers } from "lucide-react";
import {
  LandingCard,
  LandingSection,
  LandingSectionHeader,
} from "@/components/landing/LandingSection";

export function CatalogSection() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");

  return (
    <LandingSection variant="dark" id="catalog">
      <LandingSectionHeader
        badge="147 Services"
        title={t("catalogTitle")}
        description={t("catalogSubtitle")}
        align="start"
        action={
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent-light transition-all hover:border-accent/50 hover:bg-accent/20"
          >
            {tc("viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {SERVICE_CATEGORIES.map((cat) => (
          <Link key={cat.name} href={`/services?category=${encodeURIComponent(cat.name)}`}>
            <LandingCard className="h-full">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full border border-primary-light/30 bg-primary-light/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-light">
                  {cat.count} services
                </span>
                <Layers className="h-4 w-4 text-white/30 transition-colors group-hover:text-accent-light" />
              </div>
              <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white/90 transition-colors group-hover:text-accent-light">
                {cat.name}
              </h3>
            </LandingCard>
          </Link>
        ))}
      </div>
    </LandingSection>
  );
}
