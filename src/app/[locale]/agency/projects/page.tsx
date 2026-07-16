import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/navigation";
import { getAgencyActiveProjects } from "@/actions/projects";
import { getAgencyNav } from "@/lib/nav";

export default async function AgencyProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("agency");
  const tc = await getTranslations("common");
  const projects = await getAgencyActiveProjects();

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={getAgencyNav(t, tc)} />
      <div className="flex-1 bg-surface-muted p-8">
        <h1 className="text-2xl font-bold">{t("activeProjects")}</h1>
        <p className="mt-1 text-muted">Projects with signed agreements — manage execution & payments</p>

        {projects.length === 0 ? (
          <Card className="mt-8 text-center">
            <p className="text-muted">No active projects yet. Submit quotations on incoming requests.</p>
            <Link href="/agency/requests" className="mt-4 inline-block text-sm font-semibold text-primary">
              {t("incomingRequests")} →
            </Link>
          </Card>
        ) : (
          <div className="mt-8 space-y-4">
            {projects.map((p: {
              id: string;
              project_requests: { id: string; title: string; status: string; location_city: string | null } | { id: string; title: string; status: string; location_city: string | null }[] | null;
              quotations: { price: number } | { price: number }[] | null;
              profiles?: { full_name: string | null } | { full_name: string | null }[] | null;
            }) => {
              const req = Array.isArray(p.project_requests) ? p.project_requests[0] : p.project_requests;
              const quote = Array.isArray(p.quotations) ? p.quotations[0] : p.quotations;
              const client = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
              if (!req) return null;
              return (
                <Card key={p.id} hover>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{req.title}</h3>
                      <p className="text-sm text-muted">
                        {client?.full_name} · {req.location_city}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Badge>{req.status}</Badge>
                        <span className="text-sm font-medium text-primary">
                          SAR {Number(quote?.price ?? 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/agency/projects/${req.id}`}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                    >
                      Manage
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
