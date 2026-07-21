import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalPageLayout } from "@/components/layout/PortalPageLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Link } from "@/i18n/navigation";
import { getClientActiveProjects } from "@/actions/projects";
import { getClientNav } from "@/lib/nav";
import { formatCurrency } from "@/lib/format";
import { FolderKanban } from "lucide-react";

export default async function ClientProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("client");
  const tc = await getTranslations("common");
  const ts = await getTranslations("status.request");
  const projects = await getClientActiveProjects();

  return (
    <PortalPageLayout
      title={t("title")}
      nav={getClientNav(t, tc)}
      pageTitle={t("activeProjects")}
      pageDescription={t("dashboard.activeProjectsDescription")}
    >
      {!projects?.length ? (
        <EmptyState
          icon={FolderKanban}
          title={t("dashboard.noActiveProjects")}
          action={
            <Link href="/client/quotations">
              <Button variant="outline">{t("dashboard.browseQuotations")}</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {projects.map((a: {
            id: string;
            agencies: { name: string } | { name: string }[] | null;
            project_requests: { id: string; title: string; status: string; location_city: string | null } | { id: string; title: string; status: string; location_city: string | null }[] | null;
            quotations: { price: number } | { price: number }[] | null;
          }) => {
            const agency = Array.isArray(a.agencies) ? a.agencies[0] : a.agencies;
            const request = Array.isArray(a.project_requests) ? a.project_requests[0] : a.project_requests;
            const quote = Array.isArray(a.quotations) ? a.quotations[0] : a.quotations;
            if (!request) return null;
            return (
              <Card key={a.id} hover>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">{request.title}</h3>
                    <p className="text-sm text-muted">
                      {agency?.name} · {request.location_city}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant={request.status === "archived" ? "outline" : "success"}>
                        {ts.has(request.status) ? ts(request.status) : request.status}
                      </Badge>
                      <span className="text-sm font-semibold text-primary">
                        {formatCurrency(Number(quote?.price ?? 0), tc("currency"), locale)}
                      </span>
                    </div>
                  </div>
                  <Link href={`/client/projects/${request.id}`}>
                    <Button size="sm">{t("dashboard.openWorkspace")}</Button>
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
