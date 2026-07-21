import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalShell } from "@/components/layout/PortalShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActiveProjectsSection } from "@/components/client/ActiveProjectsSection";
import { QuotationsInboxSection } from "@/components/client/QuotationsInboxSection";
import { getClientNav } from "@/lib/nav";
import { getClientActiveProjects, getClientQuotationsInbox } from "@/actions/projects";

export default async function ClientDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("client");
  const td = await getTranslations("client.dashboard");
  const tc = await getTranslations("common");
  const nav = getClientNav(t, tc);

  const [activeProjects, quotationsInbox] = await Promise.all([
    getClientActiveProjects(),
    getClientQuotationsInbox(),
  ]);

  return (
    <PortalShell title={t("title")} nav={nav}>
      <PageHeader title={tc("dashboard")} description={td("subtitle")} />

      <ActiveProjectsSection projects={activeProjects} />
      <QuotationsInboxSection requests={quotationsInbox} />
    </PortalShell>
  );
}
