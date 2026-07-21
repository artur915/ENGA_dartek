import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getPendingAgencies } from "@/actions/agency";
import { AdminAgencyActions } from "@/components/admin/AdminAgencyActions";
import { getAdminNav } from "@/lib/nav";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tc = await getTranslations("common");
  const ta = await getTranslations("adminPage");
  const pending = await getPendingAgencies();

  const nav = getAdminNav(tc);

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={tc("admin")} items={nav} />
      <div className="flex-1 bg-surface-muted p-8">
        <h1 className="text-2xl font-bold">{tc("admin")}</h1>
        <p className="mt-1 text-muted">{ta("description")}</p>

        <Card className="mt-8">
          <h2 className="text-lg font-semibold">
            {ta("legacyPendingTitle", { count: pending.length })}
          </h2>
          <p className="mt-2 text-sm text-muted">{ta("legacyPendingDesc")}</p>
          {pending.length === 0 ? (
            <p className="mt-4 text-sm text-muted">{ta("noPendingRegistrations")}</p>
          ) : (
            <div className="mt-4 divide-y divide-border">
              {pending.map((agency: {
                id: string;
                name: string;
                commercial_registration: string | null;
                engineering_license: string | null;
                disciplines: string[];
                service_areas: string[];
                owner_id: string;
              }) => (
                <div key={agency.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{agency.name}</h3>
                    <p className="mt-1 text-xs text-muted">
                      {ta("crPrefix")}: {agency.commercial_registration} · {ta("licensePrefix")}:{" "}
                      {agency.engineering_license}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {agency.disciplines?.map((d: string) => (
                        <Badge key={d} variant="outline">{d}</Badge>
                      ))}
                    </div>
                  </div>
                  <AdminAgencyActions agencyId={agency.id} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
