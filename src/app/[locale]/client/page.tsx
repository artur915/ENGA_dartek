import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalShell } from "@/components/layout/PortalShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Link } from "@/i18n/navigation";
import { ClipboardList, FolderKanban, FileText, CheckCircle2, Plus } from "lucide-react";
import { getClientNav } from "@/lib/nav";
import { getClientDashboardStats } from "@/actions/requests";

export default async function ClientDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("client");
  const tc = await getTranslations("common");
  const stats = await getClientDashboardStats();
  const nav = getClientNav(t, tc);

  return (
    <PortalShell title={t("title")} nav={nav}>
      <PageHeader
        title={tc("dashboard")}
        description="Client journey: Discover → Request → Compare → Contract → Execute"
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Draft Requests" value={stats.draft} icon={ClipboardList} accent="muted" />
        <StatCard label="Awaiting Quotes" value={stats.quoted} icon={FileText} accent="primary" />
        <StatCard label="Active Projects" value={stats.active} icon={FolderKanban} accent="success" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} accent="accent" />
      </div>

      <Card className="mt-8">
        <CardHeader
          title={t("newRequest")}
          description="Select engineering services, set property location, upload documents, and float your request to licensed offices."
          action={
            <Link
              href="/client/requests/new"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              <Plus className="h-4 w-4" />
              {t("newRequest")}
            </Link>
          }
        />
      </Card>
    </PortalShell>
  );
}
