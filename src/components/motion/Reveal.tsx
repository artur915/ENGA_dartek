"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, motionVariants, viewportOnce } from "@/lib/motion";
import { useHydrated } from "@/hooks/use-hydrated";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "span";
}

export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const hydrated = useHydrated();
  const reducedMotion = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={cn(className)}
      {...(hydrated
        ? {
            initial: "hidden",
            whileInView: "visible",
            viewport: viewportOnce,
            variants: motionVariants(fadeUp, reducedMotion),
            transition: { delay: reducedMotion ? 0 : delay },
          }
        : {})}
    >
      {children}
    </Component>
  );
}
