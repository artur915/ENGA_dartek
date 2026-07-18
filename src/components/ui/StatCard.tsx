import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "primary",
  className,
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: string;
  accent?: "primary" | "success" | "warning" | "accent" | "muted";
  className?: string;
}) {
  const accents = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    accent: "bg-accent/15 text-accent",
    muted: "bg-surface-muted text-muted",
  };

  const valueColors = {
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    accent: "text-accent",
    muted: "text-foreground",
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface p-6",
        "shadow-card transition-all duration-300 hover:border-primary/20 hover:shadow-card-hover",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className={cn("mt-2 text-3xl font-bold tracking-tight", valueColors[accent])}>
            {value}
          </p>
          {trend && <p className="mt-1 text-xs text-muted">{trend}</p>}
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
              accents[accent]
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
