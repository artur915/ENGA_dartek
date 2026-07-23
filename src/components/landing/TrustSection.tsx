"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { FileText, Globe, Layers, ShieldCheck } from "lucide-react";
import { LandingGrid, LandingGridItem } from "@/components/motion/LandingGrid";
import { fadeUp, motionVariants, viewportOnce } from "@/lib/motion";
import { useHydrated } from "@/hooks/use-hydrated";

const icons = [Layers, FileText, ShieldCheck, Globe];

export function TrustSection() {
  const t = useTranslations("landing");
  const hydrated = useHydrated();
  const reducedMotion = useReducedMotion();
  const items = t.raw("trustItems") as Record<string, { title: string; description: string }>;
  const keys = Object.keys(items);

  return (
    <motion.section
      className="border-b border-border-subtle bg-surface"
      aria-label={t("trustTitle")}
      {...(hydrated
        ? {
            initial: "hidden",
            whileInView: "visible",
            viewport: viewportOnce,
            variants: motionVariants(fadeUp, reducedMotion),
          }
        : {})}
    >
      <div className="container-app py-10 sm:py-12">
        <motion.p
          className="text-center text-sm font-semibold uppercase tracking-[0.12em] text-muted"
          {...(hydrated
            ? {
                initial: { opacity: 0, y: 16 },
                whileInView: { opacity: 1, y: 0 },
                viewport: viewportOnce,
                transition: { duration: 0.5 },
              }
            : {})}
        >
          {t("trustTitle")}
        </motion.p>
        <LandingGrid className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {keys.map((key, i) => {
            const Icon = icons[i] ?? Layers;
            const item = items[key];
            return (
              <LandingGridItem key={key}>
                <motion.div
                  className="text-center sm:text-start"
                  {...(hydrated && !reducedMotion
                    ? { whileHover: { y: -3 }, transition: { duration: 0.2 } }
                    : {})}
                >
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-landing-muted text-primary sm:mx-0">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-navy">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </motion.div>
              </LandingGridItem>
            );
          })}
        </LandingGrid>
      </div>
    </motion.section>
  );
}
