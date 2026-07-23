import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PublicPageHeader } from "@/components/ui/PublicPageHeader";
import { SERVICE_PACKAGES } from "@/data/catalog";
import { getPackageField } from "@/lib/catalog-i18n";
import { getPackageAccent } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Package } from "lucide-react";

export default async function PackagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");

  return (
    <>
      <Header />
      <main className="container-app flex-1 py-10 sm:py-12">
        <PublicPageHeader
          eyebrow={t("packagesBadge")}
          title={t("packagesTitle")}
          description={t("packagesSubtitle")}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICE_PACKAGES.map((pkg, i) => {
            const accent = getPackageAccent(pkg.slug);
            return (
              <Card
                key={pkg.slug}
                hover
                className={cn("flex flex-col border", accent.bg, accent.border, accent.hoverBorder)}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className={cn("inline-flex rounded-xl p-2.5", accent.iconBg)}>
                    <Package className="h-5 w-5" />
                  </div>
                  {i === 0 && (
                    <Badge variant="accent" size="sm">
                      {t("packagesPopular")}
                    </Badge>
                  )}
                </div>
                <h2 className="text-xl font-bold text-navy">{getPackageField(pkg, "name", locale)}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {getPackageField(pkg, "description", locale)}
                </p>
                <p className={cn("mt-5 rounded-xl px-4 py-3 text-sm font-medium", accent.bg, accent.text)}>
                  {getPackageField(pkg, "categories", locale)}
                </p>
                <ButtonLink
                  href={`/client/requests/new?package=${encodeURIComponent(pkg.name)}`}
                  variant="primary"
                  size="sm"
                  className="mt-5 w-full"
                >
                  {t("ctaSubmitRequest")}
                </ButtonLink>
              </Card>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
