import { PortalShell } from "@/components/layout/PortalShell";
import { PageHeader } from "@/components/ui/PageHeader";
import type { NavItem } from "@/components/layout/PortalSidebar";

export function PortalPageLayout({
  title,
  nav,
  pageTitle,
  pageDescription,
  badge,
  action,
  children,
}: {
  title: string;
  nav: NavItem[];
  pageTitle: string;
  pageDescription?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <PortalShell title={title} nav={nav}>
      <PageHeader title={pageTitle} description={pageDescription} badge={badge} actions={action} />
      <div>{children}</div>
    </PortalShell>
  );
}
