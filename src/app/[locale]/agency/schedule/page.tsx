import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalPageLayout } from "@/components/layout/PortalPageLayout";
import { ProjectScheduleWorkspace } from "@/components/client/ProjectScheduleWorkspace";
import { getAgencyActiveProjects } from "@/actions/projects";
import { getMyAgency } from "@/actions/agency";
import { getAgencyNav } from "@/lib/nav";
import { buildScheduleProject } from "@/lib/project-schedule";
import { buildProgressMapFromMilestones } from "@/lib/milestone-progress";
import { ensureMilestoneScheduleDates } from "@/lib/milestone-schedule-dates";
import { getMilestones } from "@/actions/milestones";

function unwrap<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default async function AgencySchedulePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ project?: string }>;
}) {
  const { locale } = await params;
  const { project: projectId } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("agency");
  const tc = await getTranslations("common");
  const ts = await getTranslations("agency.schedule");
  const td = await getTranslations("agency.dashboard");
  const nav = getAgencyNav(t, tc);
  const [agreements, agency] = await Promise.all([getAgencyActiveProjects(), getMyAgency()]);

  const schedules = (
    await Promise.all(
      agreements.map(async (agreement) => {
        const client = unwrap(agreement.profiles);
        const request = unwrap(agreement.project_requests);
        const quote = unwrap(agreement.quotations);
        if (!request) return null;

        await ensureMilestoneScheduleDates(request.id);
        const milestones = await getMilestones(request.id);

        return buildScheduleProject({
          requestId: request.id,
          agreementId: agreement.id,
          title: request.title,
          agencyName: agency?.name ?? "—",
          clientName: client?.full_name || client?.email || td("clientLabel"),
          signedAt: agreement.signed_at,
          estimatedDuration: quote?.estimated_duration ?? null,
          deliverablesItems: quote?.deliverables_items,
          paymentMilestones: quote?.payment_milestones,
          milestones,
          progressById: buildProgressMapFromMilestones(milestones),
          locale,
          durationWeeksLabel: (weeks) => ts("durationWeeks", { weeks }),
        });
      })
    )
  ).filter(Boolean);

  return (
    <PortalPageLayout
      title={t("title")}
      nav={nav}
      pageTitle={ts("title")}
      pageDescription={ts("pageDescription")}
    >
      <ProjectScheduleWorkspace
        portal="agency"
        projects={schedules as NonNullable<(typeof schedules)[number]>[]}
        initialProjectId={projectId}
      />
    </PortalPageLayout>
  );
}
