import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getEngineerInvitations, requireEngineerRegistered } from "@/actions/engineer";
import { getEngineerNav } from "@/lib/nav";

export default async function EngineerInvitationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireEngineerRegistered(locale);
  const t = await getTranslations("engineer");
  const ti = await getTranslations("engineer.invitationsPage");
  const tc = await getTranslations("common");
  const ts = await getTranslations("status.request");
  const invitations = await getEngineerInvitations();

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={getEngineerNav(t, tc)} />
      <div className="flex-1 bg-surface-muted p-8">
        <h1 className="text-2xl font-bold">{t("invitations")}</h1>
        <p className="mt-1 text-muted">{ti("description")}</p>

        {invitations.length === 0 ? (
          <Card className="mt-8 text-center">
            <p className="text-muted">{ti("noInvitations")}</p>
          </Card>
        ) : (
          <div className="mt-8 space-y-4">
            {invitations.map((inv: {
              id: string;
              invited_at: string;
              project_requests: { title: string; location_city: string | null; status: string; description: string | null } | { title: string; location_city: string | null; status: string; description: string | null }[] | null;
            }) => {
              const req = Array.isArray(inv.project_requests) ? inv.project_requests[0] : inv.project_requests;
              if (!req) return null;
              return (
                <Card key={inv.id}>
                  <h3 className="font-semibold">{req.title}</h3>
                  <p className="text-sm text-muted">{req.location_city}</p>
                  <Badge className="mt-2">{ts.has(req.status) ? ts(req.status) : req.status}</Badge>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
