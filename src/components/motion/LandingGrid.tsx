"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { motionVariants, staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { useHydrated } from "@/hooks/use-hydrated";

export function LandingGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const hydrated = useHydrated();
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      {...(hydrated
        ? {
            initial: "hidden",
            whileInView: "visible",
            viewport: viewportOnce,
            variants: motionVariants(staggerContainer, reducedMotion),
          }
        : {})}
    >
      {children}
    </motion.div>
  );
}

export function LandingGridItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const hydrated = useHydrated();
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      {...(hydrated ? { variants: motionVariants(staggerItem, reducedMotion) } : {})}
    >
      {children}
    </motion.div>
  );
}
