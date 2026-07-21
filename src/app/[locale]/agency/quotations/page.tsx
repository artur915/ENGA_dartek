import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/navigation";
import { getAgencyQuotations } from "@/actions/quotations";
import { formatCurrency } from "@/lib/format";
import { getAgencyNav } from "@/lib/nav";

export default async function AgencyQuotationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("agency");
  const tq = await getTranslations("agency.quotationsPage");
  const tc = await getTranslations("common");
  const ts = await getTranslations("status.quotation");
  const quotations = await getAgencyQuotations();

  const nav = getAgencyNav(t, tc);

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={nav} />
      <div className="flex-1 bg-surface-muted p-8">
        <h1 className="text-2xl font-bold">{tc("quotations")}</h1>

        {quotations.length === 0 ? (
          <Card className="mt-8 text-center">
            <p className="text-muted">{tq("noQuotations")}</p>
            <Link href="/agency/requests" className="mt-4 inline-block text-sm font-semibold text-primary">
              {t("incomingRequests")} →
            </Link>
          </Card>
        ) : (
          <div className="mt-8 space-y-4">
            {quotations.map((q: {
              id: string;
              price: number;
              status: string;
              timeline_days: number | null;
              submitted_at: string | null;
              project_requests: { id: string; title: string; location_city: string | null; status: string } | null;
            }) => (
              <Card key={q.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{q.project_requests?.title}</h3>
                    <p className="text-sm text-muted">{q.project_requests?.location_city}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(Number(q.price), tc("currency"), locale)}
                    </p>
                    <Badge className="mt-1">{ts.has(q.status) ? ts(q.status) : q.status}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
