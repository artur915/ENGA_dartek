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
import { getAgencyActiveProjects } from "@/actions/projects";
import { AgencyActiveProjectsSection } from "@/components/agency/AgencyActiveProjectsSection";
import { formatNumber } from "@/lib/format";
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
  const ts = await getTranslations("status.agency");
  const [stats, agency, activeProjects] = await Promise.all([
    getAgencyDashboardStats(),
    getMyAgency(),
    getAgencyActiveProjects(),
  ]);
  const nav = getAgencyNav(t, tc);

  return (
    <PortalShell title={t("title")} nav={nav}>
      <PageHeader
        title={tc("dashboard")}
        description={t("dashboard.subtitle")}
        badge={
          agency ? (
            <Badge variant={agency.status === "approved" ? "success" : agency.status === "pending" ? "warning" : "outline"}>
              {ts.has(agency.status) ? ts(agency.status) : agency.status}
            </Badge>
          ) : undefined
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t("incomingRequests")} value={stats.incoming} icon={ClipboardList} accent="primary" />
        <StatCard label={t("dashboard.pendingQuotes")} value={stats.pendingQuotes} icon={FileText} accent="warning" />
        <StatCard label={t("activeProjects")} value={stats.active} icon={FolderKanban} accent="success" />
        <StatCard
          label={t("dashboard.revenue")}
          value={formatNumber(stats.revenue)}
          icon={TrendingUp}
          accent="accent"
        />
      </div>

      <AgencyActiveProjectsSection projects={activeProjects} />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title={t("register")}
            description={
              agency
                ? `${agency.name} — ${ts.has(agency.status) ? ts(agency.status) : agency.status}`
                : t("dashboard.registerPrompt")
            }
          />
          <Link href="/agency/register" className="link-primary text-sm">
            {agency ? t("dashboard.updateRegistration") : t("register")} →
          </Link>
        </Card>
        <Card>
          <CardHeader
            title={t("incomingRequests")}
            description={t("dashboard.incomingDesc")}
          />
          <Link href="/agency/requests" className="link-primary text-sm">
            {t("incomingRequests")} →
          </Link>
        </Card>
      </div>
    </PortalShell>
  );
}
