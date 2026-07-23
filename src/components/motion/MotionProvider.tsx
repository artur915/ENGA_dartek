"use client";

import { MotionConfig } from "framer-motion";

/**
 * In development, always allow animations so they can be previewed locally.
 * In production, respect the user's OS "reduce motion" preference.
 * @see https://motion.dev/troubleshooting/reduced-motion-disabled
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion={process.env.NODE_ENV === "production" ? "user" : "never"}>
      {children}
    </MotionConfig>
  );
}
