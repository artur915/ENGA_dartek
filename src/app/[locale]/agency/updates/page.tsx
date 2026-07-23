import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalPageLayout } from "@/components/layout/PortalPageLayout";
import { ProjectUpdatesWorkspace } from "@/components/client/ProjectUpdatesWorkspace";
import { getAgencyActiveProjects } from "@/actions/projects";
import { getProjectMessages } from "@/actions/messages";
import { getMyAgency } from "@/actions/agency";
import { getProfile } from "@/lib/auth";
import { getAgencyNav } from "@/lib/nav";
import { Badge } from "@/components/ui/Badge";
import { buildUpdatesProjects } from "@/lib/project-updates-display";

export default async function AgencyUpdatesPage({
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
  const tu = await getTranslations("agency.updates");
  const td = await getTranslations("agency.dashboard");
  const tc = await getTranslations("common");
  const nav = getAgencyNav(t, tc);
  const [profile, agency, agreements] = await Promise.all([
    getProfile(),
    getMyAgency(),
    getAgencyActiveProjects(),
  ]);

  const requestIds = agreements
    .map((agreement) => {
      const request = Array.isArray(agreement.project_requests)
        ? agreement.project_requests[0]
        : agreement.project_requests;
      return request?.id;
    })
    .filter(Boolean) as string[];
  const messagesByRequest = await getProjectMessages(requestIds);

  const projects = buildUpdatesProjects({
    agreements,
    messagesByRequest,
    agencyName: agency?.name ?? "—",
    clientFallback: td("clientLabel"),
    labels: {
      clientRole: tu("clientRole"),
      managerRole: tu("managerRole"),
      deliverable: (title) => tu("deliverableSubmitted", { title }),
      approval: (title) => tu("approvalRequested", { title }),
      discussion: tu("discussionUpdated"),
      noUpdatesYet: tu("noUpdatesYet"),
    },
  });

  return (
    <PortalPageLayout
      title={t("title")}
      nav={nav}
      pageTitle={tu("title")}
      pageDescription={tu("pageDescription")}
      badge={
        projects.length > 0 ? (
          <Badge variant="default" size="sm">
            {tu("activeProjectsCount", { count: projects.length })}
          </Badge>
        ) : undefined
      }
    >
      <ProjectUpdatesWorkspace
        portal="agency"
        projects={projects}
        initialProjectId={projectId}
        senderDisplayName={profile?.full_name ?? agency?.name ?? tu("you")}
      />
    </PortalPageLayout>
  );
}
