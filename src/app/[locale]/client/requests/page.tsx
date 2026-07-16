import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/navigation";
import { getClientRequests } from "@/actions/requests";
import { getClientNav } from "@/lib/nav";

const STATUS_VARIANT: Record<string, "default" | "success" | "warning" | "outline"> = {
  draft: "outline",
  floating: "warning",
  quoted: "default",
  accepted: "success",
  in_progress: "success",
  completed: "success",
  cancelled: "outline",
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
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={nav} />
      <div className="flex-1 bg-surface-muted p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("myRequests")}</h1>
          <Link
            href="/client/requests/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            {t("newRequest")}
          </Link>
        </div>

        {requests.length === 0 ? (
          <Card className="mt-8 text-center">
            <p className="text-muted">No requests yet. Create your first project request.</p>
            <Link href="/client/requests/new" className="mt-4 inline-block text-sm font-semibold text-primary">
              {t("newRequest")} →
            </Link>
          </Card>
        ) : (
          <div className="mt-8 space-y-4">
            {requests.map((req: {
              id: string;
              title: string;
              status: string;
              location_city: string | null;
              created_at: string;
              service_packages?: { name: string } | null;
              quotations?: { id: string; status: string }[];
            }) => (
              <Card key={req.id} hover>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{req.title}</h3>
                      <Badge variant={STATUS_VARIANT[req.status] ?? "outline"}>
                        {req.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {req.location_city}
                      {req.service_packages?.name && ` · ${req.service_packages.name}`}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {new Date(req.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {(req.status === "quoted" || req.status === "floating") && (
                      <Link
                        href={`/client/quotations/${req.id}`}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                      >
                        {t("compareQuotes")}
                      </Link>
                    )}
                    {req.status === "draft" && (
                      <Link
                        href={`/client/requests/new?draft=${req.id}`}
                        className="rounded-lg border border-border px-4 py-2 text-sm font-medium"
                      >
                        Continue
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
