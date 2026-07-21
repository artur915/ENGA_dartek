import { useTranslations, useLocale } from "next-intl";
import { SERVICE_PACKAGES } from "@/data/catalog";
import { getPackageField } from "@/lib/catalog-i18n";
import { Package } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import {
  LandingCard,
  LandingSection,
  LandingSectionHeader,
  LandingViewAllLink,
} from "@/components/landing/LandingSection";
import { Badge } from "@/components/ui/Badge";

export function PackagesSection() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");
  const locale = useLocale();

  return (
    <LandingSection variant="light" id="packages">
      <LandingSectionHeader
        badge={t("packagesBadge")}
        title={t("packagesTitle")}
        description={t("packagesSubtitle")}
        align="start"
        action={<LandingViewAllLink href="/packages" label={tc("viewAll")} />}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_PACKAGES.map((pkg, i) => (
          <LandingCard key={pkg.slug} highlight={i === 0} className="flex flex-col">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Package className="h-5 w-5" />
              </div>
              {i === 0 && (
                <Badge variant="accent" size="sm">
                  {t("packagesPopular")}
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-bold text-navy">{getPackageField(pkg, "name", locale)}</h3>
            <p className="mt-2 flex-1 line-clamp-3 text-sm leading-relaxed text-muted">
              {getPackageField(pkg, "description", locale)}
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary">
              {getPackageField(pkg, "categories", locale)}
            </p>
            <ButtonLink
              href={`/client/requests/new?package=${encodeURIComponent(pkg.name)}`}
              variant="outline"
              size="sm"
              className="mt-5 w-full"
            >
              {t("ctaSubmitRequest")}
            </ButtonLink>
          </LandingCard>
        ))}
      </div>
    </LandingSection>
  );
}
