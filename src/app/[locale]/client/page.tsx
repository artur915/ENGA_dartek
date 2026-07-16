import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import { Plus } from "lucide-react";
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

  const nav = [
    { href: "/client", label: tc("dashboard"), icon: "LayoutDashboard" },
    { href: "/client/requests", label: t("myRequests"), icon: "ClipboardList" },
    { href: "/client/requests/new", label: t("newRequest"), icon: "Plus" },
    { href: "/client/quotations", label: t("compareQuotes"), icon: "FileText" },
    { href: "/client/projects", label: t("activeProjects"), icon: "FolderKanban" },
  ];

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={nav} />
      <div className="flex-1 bg-surface-muted p-8">
        <h1 className="text-2xl font-bold text-foreground">{tc("dashboard")}</h1>
        <p className="mt-1 text-muted">Client journey: Discover → Request → Compare → Contract → Execute</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Draft Requests", value: stats.draft, color: "text-muted" },
            { label: "Awaiting Quotes", value: stats.quoted, color: "text-primary" },
            { label: "Active Projects", value: stats.active, color: "text-success" },
            { label: "Completed", value: stats.completed, color: "text-accent" },
          ].map((stat) => (
            <Card key={stat.label}>
              <p className="text-sm text-muted">{stat.label}</p>
              <p className={`mt-2 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <h2 className="text-lg font-semibold">{t("newRequest")}</h2>
          <p className="mt-2 text-sm text-muted">
            Select engineering services, set property location, upload documents, and float your request to licensed offices.
          </p>
          <Link
            href="/client/requests/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" />
            {t("newRequest")}
          </Link>
        </Card>
      </div>
    </div>
  );
}
