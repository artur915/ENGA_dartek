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
  Plus,
  Settings,
  Star,
  User,
  type LucideIcon,
} from "lucide-react";

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

export function PortalSidebar({ title, items }: PortalSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-e border-border bg-surface">
      <div className="border-b border-border px-6 py-5">
        <h2 className="text-sm font-semibold text-primary">{title}</h2>
      </div>
      <nav className="space-y-1 p-4">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = iconMap[item.icon] ?? LayoutDashboard;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-surface-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
