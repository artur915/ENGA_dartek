import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import { Building2 } from "lucide-react";
import { QuotationInboxRow } from "@/components/client/QuotationInboxRow";

type InboxRequest = {
  id: string;
  title: string;
  location_city: string | null;
  quotations: {
    id: string;
    price: number;
    scope: string | null;
    timeline_days: number | null;
    agencies: {
      id: string;
      name: string;
      service_areas: string[] | null;
      disciplines: string[] | null;
    } | {
      id: string;
      name: string;
      service_areas: string[] | null;
      disciplines: string[] | null;
    }[] | null;
  }[];
};

function unwrapAgency(
  agency: InboxRequest["quotations"][number]["agencies"]
): QuotationInboxRowPropsAgency | null {
  if (!agency) return null;
  return Array.isArray(agency) ? agency[0] ?? null : agency;
}

type QuotationInboxRowPropsAgency = {
  id: string;
  name: string;
  service_areas: string[] | null;
  disciplines: string[] | null;
};

export async function QuotationsInboxSection({
  requests,
}: {
  requests: InboxRequest[];
}) {
  const t = await getTranslations("client.dashboard");

  return (
    <section className="mt-12">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight">{t("quotationsInbox")}</h2>
        </div>
        {requests.length > 0 && (
          <Link
            href="/client/quotations"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            {t("structuredComparison")}
          </Link>
        )}
      </div>

      {!requests.length ? (
        <Card className="text-center">
          <p className="text-muted">{t("noQuotations")}</p>
          <Link
            href="/client/requests/new"
            className="mt-4 inline-block text-sm font-semibold text-primary"
          >
            {t("createRequest")} →
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <Card key={request.id} padding="none" className="overflow-hidden">
              <div className="border-b border-border-subtle bg-surface-muted/60 px-6 py-3">
                <p className="text-sm text-muted-foreground">
                  {t("quotationsFor")}:{" "}
                  <span className="font-semibold text-foreground">{request.title}</span>
                </p>
              </div>

              {request.quotations.map((quotation) => {
                const agency = unwrapAgency(quotation.agencies);
                return (
                  <QuotationInboxRow
                    key={quotation.id}
                    quotation={{
                      ...quotation,
                      agencies: agency,
                    }}
                    requestId={request.id}
                    locationCity={request.location_city}
                  />
                );
              })}
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
