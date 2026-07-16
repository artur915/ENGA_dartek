import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AdminAgencyActions } from "@/components/admin/AdminAgencyActions";
import { createClient } from "@/lib/supabase/server";
import { getAdminNav } from "@/lib/nav";

export default async function AdminAgenciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tc = await getTranslations("common");

  const supabase = await createClient();
  const { data: agencies } = await supabase
    .from("agencies")
    .select("*")
    .order("created_at", { ascending: false });

  const grouped = {
    pending: (agencies ?? []).filter((a) => a.status === "pending"),
    approved: (agencies ?? []).filter((a) => a.status === "approved"),
    other: (agencies ?? []).filter((a) => !["pending", "approved"].includes(a.status)),
  };

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={tc("admin")} items={getAdminNav(tc)} />
      <div className="flex-1 bg-surface-muted p-8">
        <h1 className="text-2xl font-bold">{tc("agencies")}</h1>
        <p className="mt-1 text-muted">Manage all engineering offices on the platform</p>

        {[
          { title: "Pending Approval", items: grouped.pending, showActions: true },
          { title: "Approved", items: grouped.approved, showActions: false },
          { title: "Suspended / Rejected", items: grouped.other, showActions: false },
        ].map((section) => (
          <Card key={section.title} className="mt-8">
            <h2 className="text-lg font-semibold">{section.title} ({section.items.length})</h2>
            {section.items.length === 0 ? (
              <p className="mt-4 text-sm text-muted">None</p>
            ) : (
              <div className="mt-4 divide-y divide-border">
                {section.items.map((agency) => (
                  <div key={agency.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{agency.name}</h3>
                        <Badge variant={agency.status === "approved" ? "success" : agency.status === "pending" ? "warning" : "outline"}>
                          {agency.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted">
                        CR: {agency.commercial_registration} · {agency.service_areas?.join(", ")}
                      </p>
                    </div>
                    {section.showActions && <AdminAgencyActions agencyId={agency.id} />}
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
