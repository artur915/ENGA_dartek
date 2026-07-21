import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/navigation";
import { getQuotableRequests } from "@/actions/projects";
import { getClientNav } from "@/lib/nav";

export default async function ClientQuotationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("client");
  const tq = await getTranslations("client.quotationsListPage");
  const tc = await getTranslations("common");
  const requests = await getQuotableRequests();

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={getClientNav(t, tc)} />
      <div className="flex-1 bg-surface-muted p-8">
        <h1 className="text-2xl font-bold">{t("compareQuotes")}</h1>
        <p className="mt-1 text-muted">{tq("description")}</p>

        {requests.length === 0 ? (
          <Card className="mt-8 text-center">
            <p className="text-muted">{tq("noOpenQuotations")}</p>
            <Link href="/client/requests/new" className="mt-4 inline-block text-sm font-semibold text-primary">
              {t("newRequest")} →
            </Link>
          </Card>
        ) : (
          <div className="mt-8 space-y-4">
            {requests.map((req: {
              id: string;
              title: string;
              status: string;
              location_city: string | null;
              quotations?: { id: string; status: string; price: number; agencies?: { name: string } | { name: string }[] }[];
            }) => {
              const quotes = req.quotations ?? [];
              const submitted = quotes.filter((q) => q.status === "submitted");
              return (
                <Card key={req.id} hover>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{req.title}</h3>
                      <p className="text-sm text-muted">{req.location_city}</p>
                      <Badge className="mt-2">{tq("quoteCount", { count: submitted.length })}</Badge>
                    </div>
                    <Link
                      href={`/client/quotations/${req.id}`}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                    >
                      {t("compareQuotes")}
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
