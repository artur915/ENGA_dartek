import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";

export default async function ClientProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("client");
  const tc = await getTranslations("common");
  const profile = await getProfile();

  const supabase = await createClient();
  const { data: agreements } = profile
    ? await supabase
        .from("agreements")
        .select(`
          id, signed_at,
          agencies(name),
          project_requests(title, status, location_city),
          quotations(price, timeline_days)
        `)
        .eq("client_id", profile.id)
        .order("created_at", { ascending: false })
    : { data: [] };

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
        <h1 className="text-2xl font-bold">{t("activeProjects")}</h1>
        <p className="mt-1 text-muted">Projects with accepted quotations and signed agreements</p>

        {!agreements?.length ? (
          <Card className="mt-8 text-center">
            <p className="text-muted">No active projects yet. Accept a quotation to start a project.</p>
          </Card>
        ) : (
          <div className="mt-8 space-y-4">
            {agreements.map((a) => {
              const agency = Array.isArray(a.agencies) ? a.agencies[0] : a.agencies;
              const request = Array.isArray(a.project_requests) ? a.project_requests[0] : a.project_requests;
              const quote = Array.isArray(a.quotations) ? a.quotations[0] : a.quotations;
              return (
              <Card key={a.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{request?.title}</h3>
                    <p className="text-sm text-muted">
                      {agency?.name} · {request?.location_city}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="font-bold text-primary">
                      SAR {Number(quote?.price ?? 0).toLocaleString()}
                    </p>
                    <Badge variant="success">{request?.status}</Badge>
                  </div>
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
