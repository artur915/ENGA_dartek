import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export function FilterChip({
  label,
  onRemove,
  active = true,
  onClick,
}: {
  label: string;
  onRemove?: () => void;
  active?: boolean;
  onClick?: () => void;
}) {
  const Component = onClick ? "button" : "span";

  return (
    <Component
      {...(onClick ? { type: "button" as const, onClick } : {})}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "border-primary/25 bg-primary/8 text-primary"
          : "border-border bg-surface text-muted-foreground hover:border-primary/20 hover:bg-surface-muted"
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded-full p-0.5 hover:bg-primary/10"
          aria-label={`Remove ${label}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Component>
  );
}

export function FilterBar({
  children,
  onReset,
  resetLabel,
  className,
}: {
  children: React.ReactNode;
  onReset?: () => void;
  resetLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {children}
      {onReset && resetLabel && (
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-primary hover:text-primary-dark"
        >
          {resetLabel}
        </button>
      )}
    </div>
  );
}
