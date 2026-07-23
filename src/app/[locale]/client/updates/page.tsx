import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalPageLayout } from "@/components/layout/PortalPageLayout";
import { ProjectUpdatesWorkspace } from "@/components/client/ProjectUpdatesWorkspace";
import { getClientActiveProjects } from "@/actions/projects";
import { getProjectMessages } from "@/actions/messages";
import { getProfile } from "@/lib/auth";
import { getClientNav } from "@/lib/nav";
import { Badge } from "@/components/ui/Badge";
import { buildUpdatesProjects } from "@/lib/project-updates-display";

export default async function ClientUpdatesPage({
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
  const tu = await getTranslations("client.updates");
  const tc = await getTranslations("common");
  const nav = getClientNav(t, tc);
  const profile = await getProfile();
  const agreements = await getClientActiveProjects();
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
    clientName: profile?.full_name ?? tu("you"),
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
      <ProjectUpdatesWorkspace projects={projects} initialProjectId={projectId} />
    </PortalPageLayout>
  );
}
