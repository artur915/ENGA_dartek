import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { type ComponentProps } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-sm hover:bg-primary-dark",
  secondary:
    "bg-surface-muted text-foreground hover:bg-border-subtle",
  outline:
    "border border-border bg-surface text-foreground hover:border-primary/40 hover:bg-primary/5",
  ghost:
    "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 min-h-[2.75rem] px-3.5 text-xs gap-1.5",
  md: "h-11 min-h-[2.75rem] px-5 text-sm gap-2",
  lg: "h-12 min-h-[2.75rem] px-6 text-base gap-2.5",
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
