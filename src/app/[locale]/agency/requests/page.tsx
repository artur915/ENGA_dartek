import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalPageLayout } from "@/components/layout/PortalPageLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Link } from "@/i18n/navigation";
import { getAgencyIncomingRequests } from "@/actions/requests";
import { getMyAgency } from "@/actions/agency";
import { getAgencyNav } from "@/lib/nav";
import { Inbox } from "lucide-react";

export default async function AgencyRequestsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("agency");
  const tc = await getTranslations("common");
  const te = await getTranslations("empty");
  const tq = await getTranslations("quotationsPage");
  const tsRequest = await getTranslations("status.request");
  const tsQuotation = await getTranslations("status.quotation");
  const tsAgency = await getTranslations("status.agency");

  const agency = await getMyAgency();
  const incoming = await getAgencyIncomingRequests();
  const nav = getAgencyNav(t, tc);

  return (
    <PortalPageLayout
      title={t("title")}
      nav={nav}
      pageTitle={t("incomingRequests")}
      pageDescription={t("requestsPage.description")}
    >
      {!agency ? (
        <EmptyState
          title={te("registerOffice")}
          description={te("registerOfficeDesc")}
          action={
            <Link href="/agency/register">
              <Button>{t("register")}</Button>
            </Link>
          }
        />
      ) : agency.status === "suspended" ? (
        <Card>
          <Badge variant="warning" className="mb-3">
            {tsAgency("suspended")}
          </Badge>
          <p className="text-muted">{t("accountSuspended")}</p>
        </Card>
      ) : agency.status === "rejected" ? (
        <Card>
          <Badge variant="danger" className="mb-3">
            {tsAgency("rejected")}
          </Badge>
          <p className="text-muted">{t("accountRejected")}</p>
        </Card>
      ) : incoming.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={te("noIncoming")}
          description={te("noIncomingDesc")}
        />
      ) : (
        <div className="space-y-4">
          {incoming.map((item) => {
            const req = item.request;
            if (!req) return null;
            const statusKey = item.hasQuote ? "quoted" : req.status;
            const statusLabel = item.hasQuote
              ? tsQuotation("quoted")
              : tsRequest.has(statusKey)
                ? tsRequest(statusKey)
                : statusKey;
            return (
              <Card key={item.invitation.id} hover>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">{req.title}</h3>
                      <Badge variant={item.hasQuote ? "success" : "warning"}>
                        {statusLabel}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {req.location_city}
                      {req.service_packages?.name && ` · ${req.service_packages.name}`}
                    </p>
                    {req.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted">{req.description}</p>
                    )}
                  </div>
                  <Link href={`/agency/requests/${req.id}`} className="shrink-0">
                    <Button
                      size="sm"
                      className="h-auto min-h-10 w-[10.5rem] whitespace-normal px-3 py-2.5 text-center text-[11px] leading-snug sm:text-xs"
                    >
                      {item.hasQuote ? tq("viewRevise") : t("submitQuote")}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </PortalPageLayout>
  );
}
