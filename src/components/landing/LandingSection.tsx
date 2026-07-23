"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { fadeUp, heroItem, heroStagger, motionVariants, viewportOnce } from "@/lib/motion";
import { useHydrated } from "@/hooks/use-hydrated";

type LandingVariant = "light" | "muted" | "navy" | "accent";

const variantStyles: Record<LandingVariant, string> = {
  light: "bg-landing-bg text-foreground",
  muted: "bg-landing-muted text-foreground",
  navy: "gradient-accent text-foreground",
  accent: "bg-primary/8 text-foreground border-y border-primary/15",
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
  const hydrated = useHydrated();
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={cn("relative overflow-hidden py-16 sm:py-20 lg:py-24", variantStyles[variant], className)}
      {...(hydrated
        ? {
            initial: "hidden",
            whileInView: "visible",
            viewport: viewportOnce,
            variants: motionVariants(fadeUp, reducedMotion),
          }
        : {})}
    >
      <div className="container-app relative z-10">{children}</div>
    </motion.section>
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
  const hydrated = useHydrated();
  const reducedMotion = useReducedMotion();
  const itemVariants = motionVariants(heroItem, reducedMotion);
  const headerMotion = hydrated
    ? {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: viewportOnce,
        variants: motionVariants(heroStagger, reducedMotion),
      }
    : {};

  return (
    <motion.div
      className={cn(
        "mb-10 flex flex-col gap-4 lg:mb-12",
        centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"
      )}
      {...headerMotion}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        {badge && (
          <motion.span
            {...(hydrated ? { variants: itemVariants } : {})}
            className={cn(
              "mb-3 inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em]",
              inverted
                ? "border-primary/20 bg-white/70 text-primary-dark"
                : "border-primary/15 bg-primary/10 text-primary-dark"
            )}
          >
            {badge}
          </motion.span>
        )}
        <motion.h2
          {...(hydrated ? { variants: itemVariants } : {})}
          className={cn(
            "text-balance text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl",
            inverted ? "text-navy" : "text-navy"
          )}
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p
            {...(hydrated ? { variants: itemVariants } : {})}
            className={cn(
              "mt-3 text-base leading-relaxed sm:text-lg",
              inverted ? "text-muted-foreground" : "text-muted-foreground",
              centered && "mx-auto"
            )}
          >
            {description}
          </motion.p>
        )}
      </div>
      {action && (
        <motion.div className="shrink-0" {...(hydrated ? { variants: itemVariants } : {})}>
          {action}
        </motion.div>
      )}
    </motion.div>
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
  const hydrated = useHydrated();
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "group rounded-xl border border-border bg-surface p-6 shadow-soft transition-colors duration-200",
        "hover:border-primary/20 hover:shadow-card-hover",
        highlight && "border-primary/25 ring-1 ring-primary/10",
        className
      )}
      {...(hydrated && !reducedMotion
        ? { whileHover: { y: -4, transition: { duration: 0.25 } } }
        : {})}
    >
      {children}
    </motion.div>
  );
}

export function LandingViewAllLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-navy transition-colors hover:border-primary/30 hover:text-primary"
    >
      {label}
      <ArrowRight className="h-4 w-4 rtl:rotate-180" />
    </Link>
  );
}
