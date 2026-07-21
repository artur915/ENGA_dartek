import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

type LandingVariant = "light" | "muted" | "brand" | "dark";

const variantStyles: Record<LandingVariant, string> = {
  light: "bg-landing-bg text-foreground",
  muted: "bg-landing-muted text-foreground",
  brand: "gradient-primary text-white",
  dark: "bg-primary text-white",
};

export function LandingSection({
  children,
  variant = "light",
  className,
  id,
}: {
  children: React.ReactNode;
  variant?: LandingVariant;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative overflow-hidden section-padding", variantStyles[variant], className)}
    >
      <LandingBackground variant={variant} />
      <div className="container-app relative z-10">{children}</div>
    </section>
  );
}

function LandingBackground({ variant }: { variant: LandingVariant }) {
  const isLight = variant === "light" || variant === "muted";

  return (
    <div className="pointer-events-none absolute inset-0">
      {isLight && (
        <>
          <div className="absolute -end-32 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -start-24 bottom-0 h-80 w-80 rounded-full bg-primary-light/8 blur-3xl" />
        </>
      )}
      {variant === "brand" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.08)_0%,_transparent_55%)]" />
      )}
      {variant === "dark" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(18,122,101,0.15)_0%,_transparent_70%)]" />
      )}
      {isLight && (
        <div
          className="absolute end-0 top-1/2 hidden h-[520px] w-[520px] -translate-y-1/2 translate-x-1/4 rounded-full border border-primary/10 lg:block"
          aria-hidden
        />
      )}
    </div>
  );
}

export function LandingSectionHeader({
  title,
  description,
  badge,
  action,
  align = "center",
  inverted = false,
}: {
  title: string;
  description?: string;
  badge?: string;
  action?: React.ReactNode;
  align?: "center" | "start";
  inverted?: boolean;
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-4 lg:mb-14",
        centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        {badge && (
          <span
            className={cn(
              "eyebrow mb-3 inline-flex items-center rounded-full px-3 py-1",
              inverted ? "bg-white/10 text-white" : "bg-primary/8 text-primary"
            )}
          >
            {badge}
          </span>
        )}
        <h2
          className={cn(
            "text-balance text-3xl font-bold tracking-tight sm:text-4xl",
            inverted ? "text-white" : "text-navy"
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-4 text-base leading-relaxed sm:text-lg",
              inverted ? "text-white/75" : "text-muted",
              centered && "mx-auto"
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function LandingCard({
  children,
  className,
  highlight = false,
}: {
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "group rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-primary/15 hover:shadow-card-hover",
        highlight && "border-primary/20 ring-1 ring-primary/10",
        className
      )}
    >
      {children}
    </div>
  );
}

export function LandingViewAllLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary/35 hover:bg-primary/10"
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
