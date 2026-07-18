import { cn } from "@/lib/utils";

type LandingVariant = "dark" | "mid" | "glow";

const variantStyles: Record<LandingVariant, string> = {
  dark: "bg-[#041612] text-white",
  mid: "bg-[#071f19] text-white",
  glow: "bg-[#041612] text-white",
};

export function LandingSection({
  children,
  variant = "dark",
  className,
  id,
}: {
  children: React.ReactNode;
  variant?: LandingVariant;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative overflow-hidden py-20 sm:py-24 lg:py-28", variantStyles[variant], className)}>
      <LandingBackground variant={variant} />
      <div className="container-app relative z-10">{children}</div>
    </section>
  );
}

function LandingBackground({ variant }: { variant: LandingVariant }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {variant === "dark" && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(18,122,101,0.12)_0%,_transparent_70%)]" />
          <div className="absolute -end-40 top-0 h-80 w-80 rounded-full bg-primary-light/10 blur-[100px]" />
        </>
      )}
      {variant === "mid" && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(212,175,55,0.08)_0%,_transparent_50%)]" />
          <div className="absolute -start-32 bottom-0 h-96 w-96 rounded-full bg-primary/15 blur-[120px]" />
        </>
      )}
      {variant === "glow" && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(18,122,101,0.2)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,175,55,0.12)_0%,_transparent_45%)]" />
          <div className="absolute start-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[100px]" />
        </>
      )}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}

export function LandingSectionHeader({
  title,
  description,
  badge,
  action,
  align = "center",
}: {
  title: string;
  description?: string;
  badge?: string;
  action?: React.ReactNode;
  align?: "center" | "start";
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-4",
        centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        {badge && (
          <span className="mb-4 inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-light">
            {badge}
          </span>
        )}
        <h2 className="text-balance bg-gradient-to-b from-white to-white/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className={cn("mt-4 text-base leading-relaxed text-white/65 sm:text-lg", centered && "mx-auto")}>
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
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300",
        "hover:-translate-y-1 hover:border-accent/25 hover:bg-white/[0.07] hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]",
        glow && "shadow-[0_0_40px_rgba(18,122,101,0.15)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function LandingViewAllLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent-light transition-all hover:border-accent/50 hover:bg-accent/20"
    >
      {label}
      <span aria-hidden>→</span>
    </a>
  );
}
