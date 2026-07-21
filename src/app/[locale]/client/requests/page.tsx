import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalPageLayout } from "@/components/layout/PortalPageLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Link } from "@/i18n/navigation";
import { getClientRequests } from "@/actions/requests";
import { getClientNav } from "@/lib/nav";
import { formatDate } from "@/lib/format";
import { ClipboardList } from "lucide-react";

const STATUS_VARIANT: Record<string, "default" | "success" | "warning" | "outline"> = {
  draft: "outline",
  floating: "warning",
  quoted: "default",
  accepted: "success",
  in_progress: "success",
  completed: "success",
  cancelled: "outline",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  floating: "Floating",
  quoted: "Quoted",
  accepted: "Accepted",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default async function ClientRequestsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("client");
  const tc = await getTranslations("common");
  const requests = await getClientRequests();
  const nav = getClientNav(t, tc);

  return (
    <PortalPageLayout
      title={t("title")}
      nav={nav}
      pageTitle={t("myRequests")}
      pageDescription="View and manage all your project requests in one place."
      action={
        <Link href="/client/requests/new">
          <Button>{t("newRequest")}</Button>
        </Link>
      }
    >
      {requests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No requests yet"
          description="Create your first project request to receive quotations from licensed engineering offices."
          action={
            <Link href="/client/requests/new">
              <Button>{t("newRequest")}</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {requests.map((req: {
            id: string;
            title: string;
            status: string;
            location_city: string | null;
            created_at: string;
            service_packages?: { name: string } | null;
          }) => (
            <Card key={req.id} hover>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-foreground">{req.title}</h3>
                    <Badge variant={STATUS_VARIANT[req.status] ?? "outline"}>
                      {STATUS_LABELS[req.status] ?? req.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {req.location_city}
                    {req.service_packages?.name && ` · ${req.service_packages.name}`}
                  </p>
                  <p className="mt-1 text-xs text-muted">{formatDate(req.created_at)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {(req.status === "quoted" || req.status === "floating") && (
                    <Link href={`/client/quotations/${req.id}`}>
                      <Button size="sm">{t("compareQuotes")}</Button>
                    </Link>
                  )}
                  {req.status === "draft" && (
                    <Link href={`/client/requests/new?draft=${req.id}`}>
                      <Button variant="outline" size="sm">
                        {tc("continue")}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PortalPageLayout>
  );
}
