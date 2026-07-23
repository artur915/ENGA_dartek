import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalPageLayout } from "@/components/layout/PortalPageLayout";
import { ProjectScheduleWorkspace } from "@/components/client/ProjectScheduleWorkspace";
import { getClientActiveProjects } from "@/actions/projects";
import { getClientNav } from "@/lib/nav";
import { buildScheduleProject } from "@/lib/project-schedule";

function unwrap<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default async function ClientSchedulePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ project?: string }>;
}) {
  const { locale } = await params;
  const { project: projectId } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("client");
  const tc = await getTranslations("common");
  const ts = await getTranslations("client.schedule");
  const nav = getClientNav(t, tc);
  const agreements = await getClientActiveProjects();

  const schedules = agreements
    .map((agreement) => {
      const agency = unwrap(agreement.agencies);
      const request = unwrap(agreement.project_requests);
      const quote = unwrap(agreement.quotations);
      if (!request) return null;

      return buildScheduleProject({
        requestId: request.id,
        agreementId: agreement.id,
        title: request.title,
        agencyName: agency?.name ?? "—",
        signedAt: agreement.signed_at,
        estimatedDuration: quote?.estimated_duration ?? null,
        deliverablesItems: quote?.deliverables_items,
        paymentMilestones: quote?.payment_milestones,
        milestones: request.milestones ?? [],
        locale,
        durationWeeksLabel: (weeks) => ts("durationWeeks", { weeks }),
      });
    })
    .filter(Boolean);

  return (
    <PortalPageLayout
      title={t("title")}
      nav={nav}
      pageTitle={ts("title")}
      pageDescription={ts("pageDescription")}
    >
      <ProjectScheduleWorkspace
        projects={schedules as NonNullable<(typeof schedules)[number]>[]}
        initialProjectId={projectId}
      />
    </PortalPageLayout>
  );
}
