import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalShell } from "@/components/layout/PortalShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/navigation";
import { getMyAgency } from "@/actions/agency";
import { getAgencyNav } from "@/lib/nav";
import { getAgencyDashboardStats } from "@/actions/requests";
import { ClipboardList, FileText, FolderKanban, TrendingUp } from "lucide-react";

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
    <PortalShell title={t("title")} nav={nav}>
      <PageHeader
        title={tc("dashboard")}
        description="Office journey: Register → Win Work → Contract → Deliver → Grow"
        badge={
          agency ? (
            <Badge variant={agency.status === "approved" ? "success" : agency.status === "pending" ? "warning" : "outline"}>
              {agency.status}
            </Badge>
          ) : undefined
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Incoming Requests" value={stats.incoming} icon={ClipboardList} accent="primary" />
        <StatCard label="Pending Quotes" value={stats.pendingQuotes} icon={FileText} accent="warning" />
        <StatCard label="Active Projects" value={stats.active} icon={FolderKanban} accent="success" />
        <StatCard
          label="Revenue (SAR)"
          value={stats.revenue.toLocaleString()}
          icon={TrendingUp}
          accent="accent"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title={t("register")}
            description={
              agency
                ? `${agency.name} — ${agency.status}`
                : "Complete registration with your license details to activate your account."
            }
          />
          <Link href="/agency/register" className="link-primary text-sm">
            {agency ? "Update Registration" : t("register")} →
          </Link>
        </Card>
        <Card>
          <CardHeader
            title={t("incomingRequests")}
            description="Review matched project requests, client requirements, and submit quotations."
          />
          <Link href="/agency/requests" className="link-primary text-sm">
            {t("incomingRequests")} →
          </Link>
        </Card>
      </div>
    </PortalShell>
  );
}
