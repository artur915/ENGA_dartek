import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SERVICE_PACKAGES } from "@/data/catalog";
import { ArrowRight, Package, Sparkles } from "lucide-react";
import {
  LandingCard,
  LandingSection,
  LandingSectionHeader,
} from "@/components/landing/LandingSection";

export function PackagesSection() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");

  return (
    <LandingSection variant="mid" id="packages">
      <LandingSectionHeader
        badge="Homeowner Journeys"
        title={t("packagesTitle")}
        description={t("packagesSubtitle")}
        align="start"
        action={
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent-light transition-all hover:border-accent/50 hover:bg-accent/20"
          >
            {tc("viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_PACKAGES.map((pkg, i) => (
          <LandingCard key={pkg.slug} glow={i === 0} className="flex flex-col">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-light/30 to-primary/10 text-white">
                <Package className="h-6 w-6" />
              </div>
              {i === 0 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-light">
                  <Sparkles className="h-3 w-3" /> Popular
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold tracking-tight text-white">{pkg.name}</h3>
            <p className="mt-2 flex-1 line-clamp-3 text-sm leading-relaxed text-white/60">
              {pkg.description}
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-accent-light/90">
              {pkg.categories}
            </p>
          </LandingCard>
        ))}
      </div>
    </LandingSection>
  );
}
