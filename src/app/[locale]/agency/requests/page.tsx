import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/navigation";
import { getAgencyIncomingRequests } from "@/actions/requests";
import { getMyAgency } from "@/actions/agency";
import { getAgencyNav } from "@/lib/nav";

export default async function AgencyRequestsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("agency");
  const tc = await getTranslations("common");

  const agency = await getMyAgency();
  const incoming = await getAgencyIncomingRequests();

  const nav = getAgencyNav(t, tc);

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={nav} />
      <div className="flex-1 bg-surface-muted p-8">
        <h1 className="text-2xl font-bold">{t("incomingRequests")}</h1>

        {!agency ? (
          <Card className="mt-8">
            <p className="text-muted">Register your engineering office first.</p>
            <Link href="/agency/register" className="mt-4 inline-block text-sm font-semibold text-primary">
              {t("register")} →
            </Link>
          </Card>
        ) : agency.status !== "approved" ? (
          <Card className="mt-8">
            <Badge variant="warning" className="mb-3">Pending Approval</Badge>
            <p className="text-muted">Your office registration is awaiting admin approval. You will receive requests once approved.</p>
          </Card>
        ) : incoming.length === 0 ? (
          <Card className="mt-8 text-center">
            <p className="text-muted">No incoming requests yet. They will appear when clients float projects.</p>
          </Card>
        ) : (
          <div className="mt-8 space-y-4">
            {incoming.map((item) => {
              const req = item.request;
              if (!req) return null;
              return (
                <Card key={item.invitation.id} hover>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{req.title}</h3>
                        <Badge variant={item.hasQuote ? "success" : "warning"}>
                          {item.hasQuote ? "Quoted" : req.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted">
                        {req.location_city}
                        {req.service_packages?.name && ` · ${req.service_packages.name}`}
                      </p>
                      {req.description && (
                        <p className="mt-2 text-sm text-muted line-clamp-2">{req.description}</p>
                      )}
                    </div>
                    <Link
                      href={`/agency/requests/${req.id}`}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                    >
                      {item.hasQuote ? "View / Revise" : t("submitQuote")}
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
