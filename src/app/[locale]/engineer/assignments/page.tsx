import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { Card } from "@/components/ui/Card";
import { getEngineerAssignments, getEngineerProfile } from "@/actions/engineer";
import { getEngineerNav } from "@/lib/nav";

export default async function EngineerAssignmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("engineer");
  const tc = await getTranslations("common");
  const assignments = await getEngineerAssignments();
  const profile = await getEngineerProfile();

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={getEngineerNav(t, tc)} />
      <div className="flex-1 bg-surface-muted p-8">
        <h1 className="text-2xl font-bold">{t("assignments")}</h1>
        <p className="mt-1 text-muted">Your active engineering assignments and office links</p>

        {profile && (
          <Card className="mt-8">
            <h2 className="font-semibold">Professional Profile</h2>
            <p className="mt-2 text-sm">{profile.specialization} · {profile.experience_years} years</p>
            <p className="text-sm text-muted">{profile.service_location}</p>
          </Card>
        )}

        {assignments.length === 0 ? (
          <Card className="mt-4 text-center">
            <p className="text-muted">No office assignments yet.</p>
          </Card>
        ) : (
          <div className="mt-4 space-y-3">
            {assignments.map((a: {
              agency_id: string;
              title: string | null;
              agencies: { name: string } | { name: string }[] | null;
            }) => {
              const agency = Array.isArray(a.agencies) ? a.agencies[0] : a.agencies;
              return (
                <Card key={a.agency_id}>
                  <h3 className="font-semibold">{agency?.name}</h3>
                  <p className="text-sm text-muted">{a.title ?? "Team member"}</p>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
