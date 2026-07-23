import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  tone = "primary",
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  tone?: "primary" | "secondary" | "muted";
}) {
  const iconTones = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary-dark",
    muted: "bg-surface-muted text-muted",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-muted/50 px-6 py-12 text-center",
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl",
            iconTones[tone]
          )}
        >
          <Icon className="h-7 w-7" />
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
