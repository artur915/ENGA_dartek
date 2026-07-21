import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import { getEngineerProfile, getEngineerInvitations, getEngineerAssignments, requireEngineerRegistered } from "@/actions/engineer";
import { getEngineerNav } from "@/lib/nav";

export default async function EngineerDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireEngineerRegistered(locale);
  const t = await getTranslations("engineer");
  const td = await getTranslations("engineer.dashboard");
  const tc = await getTranslations("common");

  const profile = await getEngineerProfile();
  const invitations = await getEngineerInvitations();
  const assignments = await getEngineerAssignments();

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={getEngineerNav(t, tc)} />
      <div className="flex-1 bg-surface-muted p-8">
        <h1 className="text-2xl font-bold">{tc("dashboard")}</h1>
        <p className="mt-1 text-muted">{td("subtitle")}</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              label: td("profileStatus"),
              value: profile?.registered_at ? td("profileActive") : td("profileIncomplete"),
            },
            { label: td("invitationsLabel"), value: invitations.length },
            { label: td("assignmentsLabel"), value: assignments.length },
          ].map((stat) => (
            <Card key={stat.label}>
              <p className="text-sm text-muted">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-primary">{stat.value}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="font-semibold">{t("profile")}</h2>
            <p className="mt-2 text-sm text-muted">
              {profile?.specialization ?? td("updateProfilePrompt")}
            </p>
            <Link href="/engineer/profile" className="mt-4 inline-block text-sm font-semibold text-primary">
              {t("profile")} →
            </Link>
          </Card>
          <Card>
            <h2 className="font-semibold">{t("invitations")}</h2>
            <p className="mt-2 text-sm text-muted">
              {td("invitationsSummary", { count: invitations.length })}
            </p>
            <Link href="/engineer/invitations" className="mt-4 inline-block text-sm font-semibold text-primary">
              {t("invitations")} →
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
