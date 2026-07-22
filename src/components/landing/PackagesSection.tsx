import { useTranslations, useLocale } from "next-intl";
import { SERVICE_PACKAGES } from "@/data/catalog";
import { getPackageField } from "@/lib/catalog-i18n";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import {
  LandingCard,
  LandingSection,
  LandingSectionHeader,
  LandingViewAllLink,
} from "@/components/landing/LandingSection";

const LANDING_PACKAGE_SLUGS = [
  "build-my-villa",
  "design-to-permit",
  "renovate-&-expand",
  "legalize-my-building",
] as const;

export function PackagesSection() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");
  const locale = useLocale();

  const packages = SERVICE_PACKAGES.filter((p) =>
    (LANDING_PACKAGE_SLUGS as readonly string[]).includes(p.slug)
  );

  const packageMeta = t.raw("packageMeta") as Record<
    string,
    { forWho: string; problem: string }
  >;

  return (
    <LandingSection variant="muted" id="packages">
      <LandingSectionHeader
        badge={t("packagesBadge")}
        title={t("packagesTitle")}
        description={t("packagesSubtitle")}
        align="start"
        action={<LandingViewAllLink href="/packages" label={tc("viewAll")} />}
      />
      <div className="grid gap-5 md:grid-cols-2">
        {packages.map((pkg) => {
          const meta = packageMeta[pkg.slug];
          return (
            <LandingCard key={pkg.slug} className="flex h-full flex-col">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
                {meta?.forWho ?? getPackageField(pkg, "categories", locale)}
              </p>
              <h3 className="mt-2 text-xl font-bold text-navy">
                {getPackageField(pkg, "name", locale)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {meta?.problem ?? getPackageField(pkg, "description", locale)}
              </p>
              <p className="mt-4 flex-1 text-xs text-muted">
                {getPackageField(pkg, "categories", locale)}
              </p>
              <ButtonLink
                href={`/client/requests/new?package=${encodeURIComponent(pkg.name)}`}
                variant="outline"
                size="sm"
                className="mt-6 w-full sm:w-auto"
              >
                {t("ctaSubmitRequest")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </ButtonLink>
            </LandingCard>
          );
        })}
      </div>
    </LandingSection>
  );
}
