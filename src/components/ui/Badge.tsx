import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "outline" | "accent" | "info" | "secondary";
  size?: "sm" | "md";
  className?: string;
}

const variants = {
  default: "bg-primary/10 text-primary ring-1 ring-primary/15",
  success: "bg-success/10 text-success ring-1 ring-success/15",
  warning: "bg-warning/10 text-warning ring-1 ring-warning/15",
  danger: "bg-danger/10 text-danger ring-1 ring-danger/15",
  outline: "border border-border bg-surface text-muted-foreground",
  accent: "bg-secondary/10 text-secondary-dark ring-1 ring-secondary/20",
  info: "bg-info/10 text-info ring-1 ring-info/15",
  secondary: "bg-secondary-light text-secondary-dark ring-1 ring-secondary/15",
};

const sizes = {
  sm: "px-2 py-0.5 text-[10px] uppercase tracking-wide",
  md: "px-2.5 py-1 text-xs",
};

export function Badge({ children, variant = "default", size = "md", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
