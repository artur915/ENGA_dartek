import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalPageLayout } from "@/components/layout/PortalPageLayout";
import { PartnersWorkspace } from "@/components/agency/PartnersWorkspace";
import { getAgencyActiveProjects } from "@/actions/projects";
import { getAgencyNav } from "@/lib/nav";

function unwrap<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default async function AgencyPartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("agency");
  const tp = await getTranslations("agency.partners");
  const tc = await getTranslations("common");
  const nav = getAgencyNav(t, tc);
  const agreements = await getAgencyActiveProjects();

  const projects = agreements
    .map((agreement) => {
      const request = unwrap(agreement.project_requests);
      if (!request) return null;
      return { id: request.id, title: request.title };
    })
    .filter(Boolean) as { id: string; title: string }[];

  return (
    <PortalPageLayout title={t("title")} nav={nav} pageTitle={tp("title")} pageDescription={tp("subtitle")}>
      <PartnersWorkspace projects={projects} />
    </PortalPageLayout>
  );
}
