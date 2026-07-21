import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/format";
import { Building2, MapPin } from "lucide-react";

export default async function AgencyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const tc = await getTranslations("common");
  const ta = await getTranslations("agenciesPage");
  const ts = await getTranslations("status.agency");

  const supabase = await createClient();
  const { data: agency } = await supabase
    .from("agencies")
    .select("*")
    .eq("id", id)
    .eq("status", "approved")
    .maybeSingle();

  if (!agency) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{agency.name}</h1>
            {agency.name_ar && <p className="text-muted" dir="rtl">{agency.name_ar}</p>}
            <Badge variant="success" className="mt-2">{ta("approved")}</Badge>
          </div>
        </div>

        {agency.description && (
          <p className="mt-6 text-muted">{agency.description}</p>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <Card>
            <h2 className="font-semibold">{ta("disciplines")}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {agency.disciplines?.map((d: string) => (
                <Badge key={d} variant="outline">{d}</Badge>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="font-semibold">{ta("serviceAreas")}</h2>
            <div className="mt-3 flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="h-4 w-4" />
              {agency.service_areas?.join(", ")}
            </div>
          </Card>
          <Card>
            <h2 className="font-semibold">{ta("licenses")}</h2>
            <p className="mt-2 text-sm">
              {ta("crLabel")}: {agency.commercial_registration}
            </p>
            <p className="text-sm">
              {ta("engineeringLabel")}: {agency.engineering_license}
            </p>
          </Card>
          {agency.indicative_price_from && (
            <Card>
              <h2 className="font-semibold">{ta("startingPrice")}</h2>
              <p className="mt-2 text-2xl font-bold text-primary">
                {formatCurrency(Number(agency.indicative_price_from), tc("currency"), locale)}
              </p>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
