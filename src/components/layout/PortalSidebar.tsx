"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Building2,
  ClipboardList,
  DollarSign,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Plus,
  Settings,
  Star,
  User,
  UserPlus,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  ClipboardList,
  Plus,
  FileText,
  FolderKanban,
  Building2,
  DollarSign,
  Settings,
  User,
  UserPlus,
  Briefcase,
  Star,
};

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface PortalSidebarProps {
  title: string;
  items: NavItem[];
}

function NavLinks({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/client" &&
            item.href !== "/agency" &&
            item.href !== "/engineer" &&
            item.href !== "/admin" &&
            pathname.startsWith(item.href + "/")) ||
          (["/client", "/agency", "/engineer", "/admin"].includes(item.href) &&
            pathname === item.href);
        const Icon = iconMap[item.icon] ?? LayoutDashboard;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:bg-surface-muted hover:text-foreground"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                isActive ? "text-white/90" : "text-muted group-hover:text-primary"
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function PortalSidebar({ title, items }: PortalSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border-subtle bg-surface/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{title}</p>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          />
          <aside className="absolute inset-y-0 start-0 flex w-72 max-w-[85vw] flex-col bg-surface shadow-elevated">
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
              <p className="text-sm font-bold text-primary">{title}</p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              <NavLinks
                items={items}
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </nav>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-e border-border-subtle bg-surface lg:flex">
        <div className="border-b border-border-subtle px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{title}</p>
              <p className="text-xs text-muted">ENGA Platform</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <NavLinks items={items} pathname={pathname} />
        </nav>
        <div className="border-t border-border-subtle p-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            ← Back to site
          </Link>
        </div>
      </aside>
    </>
  );
}
