import { cn } from "@/lib/utils";

export type TrafficStatus = "green" | "amber" | "red";

const statusStyles: Record<TrafficStatus, string> = {
  green: "bg-success ring-success/20",
  amber: "bg-warning ring-warning/20",
  red: "bg-danger ring-danger/20",
};

const statusLabels: Record<TrafficStatus, string> = {
  green: "On track",
  amber: "Attention needed",
  red: "Blocked",
};

export function StatusDot({ status, className }: { status: TrafficStatus; className?: string }) {
  return (
    <span
      className={cn("inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-2", statusStyles[status], className)}
      aria-label={statusLabels[status]}
    />
  );
}

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: TrafficStatus;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold text-white",
        statusStyles[status].split(" ")[0],
        className
      )}
    >
      <StatusDot status={status} className="h-2 w-2 bg-white/90 ring-white/30" />
      {label ?? statusLabels[status]}
    </span>
  );
}

export function StatusToggle({
  value,
  onChange,
  disabled,
}: {
  value: TrafficStatus;
  onChange: (status: TrafficStatus) => void;
  disabled?: boolean;
}) {
  const options: TrafficStatus[] = ["green", "amber", "red"];

  return (
    <div className="inline-flex gap-1 rounded-lg border border-border-subtle bg-surface-muted p-1">
      {options.map((status) => (
        <button
          key={status}
          type="button"
          disabled={disabled}
          onClick={() => onChange(status)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-semibold capitalize transition-colors",
            value === status
              ? cn("text-white shadow-sm", statusStyles[status].split(" ")[0])
              : "text-muted hover:bg-surface hover:text-foreground"
          )}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
