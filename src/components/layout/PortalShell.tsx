import { PortalSidebar, type NavItem } from "@/components/layout/PortalSidebar";
import { cn } from "@/lib/utils";

export function PortalShell({
  title,
  nav,
  children,
  className,
}: {
  title: string;
  nav: NavItem[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-screen bg-surface-muted">
      <PortalSidebar title={title} items={nav} />
      <main className={cn("min-w-0 flex-1", className)}>
        <div className="container-app py-6 sm:py-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
