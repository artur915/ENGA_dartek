import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/navigation";
import { getApprovedAgencies } from "@/actions/agency";
import { Building2, MapPin } from "lucide-react";

export default async function AgenciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("common");
  const agencies = await getApprovedAgencies();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">{t("agencies")}</h1>
        <p className="mt-2 text-muted">
          Government-approved engineering offices registered on the platform
        </p>

        {agencies.length === 0 ? (
          <Card className="mt-10 text-center">
            <p className="text-muted">No approved agencies yet. Engineering offices can register and await admin approval.</p>
          </Card>
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
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <Badge variant="success">Approved</Badge>
                </div>
                <h2 className="text-lg font-bold">{agency.name}</h2>
                {agency.description && (
                  <p className="mt-2 text-sm text-muted line-clamp-2">{agency.description}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {agency.disciplines?.slice(0, 3).map((d: string) => (
                    <Badge key={d} variant="outline">{d}</Badge>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                  <MapPin className="h-3.5 w-3.5" />
                  {agency.service_areas?.join(", ")}
                </div>
                {agency.indicative_price_from && (
                  <p className="mt-3 text-sm font-medium text-primary">
                    From SAR {Number(agency.indicative_price_from).toLocaleString()}
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
