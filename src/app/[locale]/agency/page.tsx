import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/navigation";
import { getMyAgency } from "@/actions/agency";
import { getAgencyDashboardStats } from "@/actions/requests";
import { getAgencyNav } from "@/lib/nav";

export default async function AgencyDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("agency");
  const tc = await getTranslations("common");
  const stats = await getAgencyDashboardStats();
  const agency = await getMyAgency();

  const nav = getAgencyNav(t, tc);

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={nav} />
      <div className="flex-1 bg-surface-muted p-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{tc("dashboard")}</h1>
          {agency && (
            <Badge variant={agency.status === "approved" ? "success" : "warning"}>
              {agency.status}
            </Badge>
          )}
        </div>
        <p className="mt-1 text-muted">Office journey: Register → Win Work → Contract → Deliver → Grow</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Incoming Requests", value: stats.incoming },
            { label: "Pending Quotes", value: stats.pendingQuotes },
            { label: "Active Projects", value: stats.active },
            { label: "Revenue (SAR)", value: stats.revenue.toLocaleString() },
          ].map((stat) => (
            <Card key={stat.label}>
              <p className="text-sm text-muted">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-primary">{stat.value}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="font-semibold">{t("register")}</h2>
            <p className="mt-2 text-sm text-muted">
              {agency
                ? `${agency.name} — ${agency.status}`
                : "Complete business verification, company profile, disciplines, and service packages."}
            </p>
            <Link href="/agency/register" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
              {agency ? "Update Registration" : t("register")} →
            </Link>
          </Card>
          <Card>
            <h2 className="font-semibold">{t("incomingRequests")}</h2>
            <p className="mt-2 text-sm text-muted">
              Review matched project requests, client requirements, and submit quotations.
            </p>
            <Link href="/agency/requests" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
              {t("incomingRequests")} →
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
