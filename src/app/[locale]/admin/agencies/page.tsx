import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalPageLayout } from "@/components/layout/PortalPageLayout";
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
  const ta = await getTranslations("adminPage");
  const ts = await getTranslations("status.agency");
  const te = await getTranslations("empty");

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

  const sections = [
    { title: ta("pendingApproval"), items: grouped.pending, showActions: true },
    { title: ta("approved"), items: grouped.approved, showActions: false },
    { title: ta("suspendedRejected"), items: grouped.other, showActions: false },
  ];

  return (
    <PortalPageLayout
      title={tc("admin")}
      nav={getAdminNav(tc)}
      pageTitle={tc("agencies")}
      pageDescription={ta("manageAgencies")}
    >
      {sections.map((section) => (
        <Card key={section.title} className="mt-6 first:mt-0">
          <h2 className="text-lg font-semibold">
            {section.title} ({section.items.length})
          </h2>
          {section.items.length === 0 ? (
            <p className="mt-4 text-sm text-muted">{te("none")}</p>
          ) : (
            <div className="mt-4 divide-y divide-border">
              {section.items.map((agency) => (
                <div
                  key={agency.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{agency.name}</h3>
                      <Badge
                        variant={
                          agency.status === "approved"
                            ? "success"
                            : agency.status === "pending"
                              ? "warning"
                              : "outline"
                        }
                      >
                        {ts.has(agency.status) ? ts(agency.status) : agency.status}
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
    </PortalPageLayout>
  );
}
