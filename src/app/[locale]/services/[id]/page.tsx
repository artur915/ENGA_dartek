import { setRequestLocale } from "next-intl/server";
import { getTranslations, getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ENGINEERING_SERVICES } from "@/data/catalog";
import {
  getCategoryLabel,
  getPackageNameByEnglishName,
  getProviderLabel,
} from "@/lib/catalog-i18n";
import { ArrowLeft, Package } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("servicesPage");
  const tc = await getTranslations("common");
  const currentLocale = await getLocale();

  const serviceId = parseInt(id, 10);
  const service = ENGINEERING_SERVICES.find((s) => s.id === serviceId);
  if (!service) notFound();

  return (
    <>
      <Header />
      <main className="container-app flex-1 py-10 sm:py-12">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {tc("services")}
        </Link>

        <div className="mt-6 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{getCategoryLabel(service.category, currentLocale)}</Badge>
            <Badge>{getProviderLabel(service.provider, currentLocale)}</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {service.name}
          </h1>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <h2 className="text-lg font-semibold">{t("detailOverview")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {service.name} — {getCategoryLabel(service.category, currentLocale)}. Request
                quotations from eligible engineering providers on ENGA. Pricing is set by
                providers per project, not by the platform.
              </p>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold">{t("detailDeliverables")}</h2>
              <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-muted">
                <li>Scope aligned to your project requirements</li>
                <li>Deliverables defined in the accepted quotation</li>
                <li>Coordination with relevant authorities where applicable</li>
              </ul>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold">{t("detailPrepare")}</h2>
              <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-muted">
                <li>Project location and site details</li>
                <li>Existing drawings or documents if available</li>
                <li>Timeline expectations and any constraints</li>
              </ul>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                {t("detailProvider")}
              </h2>
              <p className="mt-2 font-medium">{getProviderLabel(service.provider, currentLocale)}</p>
            </Card>

            {service.packages.length > 0 && (
              <Card>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                  {t("detailRelated")}
                </h2>
                <ul className="mt-3 space-y-2">
                  {service.packages.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm font-medium">
                      <Package className="h-4 w-4 text-primary" />
                      {getPackageNameByEnglishName(p, currentLocale)}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            <ButtonLink
              href={`/client/requests/new?service=${service.id}`}
              fullWidth
              size="lg"
            >
              {t("detailCta")}
            </ButtonLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
