import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { ProjectWorkspace } from "@/components/project/ProjectWorkspace";
import { getProjectDetail } from "@/actions/projects";
import { getMilestones } from "@/actions/milestones";
import { getPayments } from "@/actions/payments";
import { getClientNav } from "@/lib/nav";

export default async function ClientProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("client");
  const tc = await getTranslations("common");

  const project = await getProjectDetail(id);
  if (!project) notFound();

  const milestones = await getMilestones(id);
  const payments = await getPayments(id);

  const agreements = project.agreements;
  const agreement = Array.isArray(agreements) ? agreements[0] : agreements;
  const quote = agreement?.quotations
    ? Array.isArray(agreement.quotations)
      ? agreement.quotations[0]
      : agreement.quotations
    : null;

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={getClientNav(t, tc)} />
      <div className="flex-1 bg-surface-muted p-8">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <p className="mt-1 text-muted">{project.location_city} · {project.status}</p>
        <div className="mt-8">
          <ProjectWorkspace
            requestId={id}
            requestTitle={project.title}
            requestStatus={project.status}
            agreement={agreement ?? null}
            milestones={milestones}
            payments={payments}
            mode="client"
            quotedPrice={quote?.price ? Number(quote.price) : undefined}
          />
        </div>
      </div>
    </div>
  );
}
