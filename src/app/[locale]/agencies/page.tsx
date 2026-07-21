import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PublicPageHeader } from "@/components/ui/PublicPageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Link } from "@/i18n/navigation";
import { getApprovedAgencies } from "@/actions/agency";
import { formatNumber } from "@/lib/format";
import { Building2, MapPin } from "lucide-react";

export default async function AgenciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("common");
  const tl = await getTranslations("landing");
  const agencies = await getApprovedAgencies();

  return (
    <>
      <Header />
      <main className="container-app flex-1 py-10 sm:py-12">
        <PublicPageHeader
          eyebrow={tl("agenciesBadge")}
          title={t("agencies")}
          description={tl("agenciesDescription")}
        />

        {agencies.length === 0 ? (
          <EmptyState
            icon={Building2}
            title={tl("agenciesEmpty")}
            className="mt-10"
          />
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agencies.map((agency: {
              id: string;
              name: string;
              description: string | null;
              disciplines: string[];
              service_areas: string[];
              indicative_price_from: number | null;
            }) => (
              <Link key={agency.id} href={`/agencies/${agency.id}`}>
                <Card hover className="h-full">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <Badge variant="success">{tl("agenciesApproved")}</Badge>
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{agency.name}</h2>
                  {agency.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted">{agency.description}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {agency.disciplines?.slice(0, 3).map((d: string) => (
                      <Badge key={d} variant="outline" size="sm">
                        {d}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="line-clamp-1">{agency.service_areas?.join(", ")}</span>
                  </div>
                  {agency.indicative_price_from != null && (
                    <p className="mt-3 text-sm font-semibold text-primary">
                      {tl("agenciesFrom")} SAR {formatNumber(Number(agency.indicative_price_from))}
                    </p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
