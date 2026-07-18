import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";

type AlertVariant = "info" | "success" | "warning" | "error";

const config: Record<
  AlertVariant,
  { icon: typeof Info; className: string }
> = {
  info: {
    icon: Info,
    className: "border-primary/20 bg-primary/5 text-foreground",
  },
  success: {
    icon: CheckCircle2,
    className: "border-success/25 bg-success/5 text-foreground",
  },
  warning: {
    icon: TriangleAlert,
    className: "border-warning/25 bg-warning/5 text-foreground",
  },
  error: {
    icon: AlertCircle,
    className: "border-danger/25 bg-danger/5 text-danger",
  },
};

export function Alert({
  variant = "info",
  title,
  children,
  className,
}: {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { icon: Icon, className: variantClass } = config[variant];
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-xl border px-4 py-3.5 text-sm",
        variantClass,
        className
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">
        {title && <p className="mb-1 font-semibold">{title}</p>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
