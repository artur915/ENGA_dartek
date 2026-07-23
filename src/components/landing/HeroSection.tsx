"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Box,
  Building2,
  HardHat,
  Landmark,
  Network,
  Pencil,
  Plus,
  Star,
  User,
  Users,
} from "lucide-react";
import {
  heroItem,
  heroStagger,
  motionVariants,
  scaleIn,
  slideInRight,
} from "@/lib/motion";
import { useHydrated } from "@/hooks/use-hydrated";
import { type AccentToken, getAccentStyle } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const heroCardTones: AccentToken[] = ["blue", "teal", "purple", "orange", "green"];

export function HeroSection() {
  const t = useTranslations("landing");
  const hydrated = useHydrated();
  const reducedMotion = useReducedMotion();
  const animate = hydrated && !reducedMotion;
  const itemVariants = motionVariants(heroItem, reducedMotion);
  const leftMotion = hydrated
    ? { initial: "hidden" as const, animate: "visible" as const, variants: motionVariants(heroStagger, reducedMotion) }
    : {};
  const rightMotion = hydrated
    ? { initial: "hidden" as const, animate: "visible" as const, variants: motionVariants(slideInRight, reducedMotion) }
    : {};

  const floatingCards = [
    {
      icon: Building2,
      title: t("heroCards.kafd"),
      subtitle: t("heroCards.kafdSub"),
      tone: heroCardTones[0],
      className: "start-[6%] top-[8%] sm:start-[4%] sm:top-[10%]",
      floatDelay: 0,
    },
    {
      icon: Box,
      title: t("heroCards.murabba"),
      subtitle: t("heroCards.murabbaSub"),
      tone: heroCardTones[1],
      className: "end-[5%] top-[10%] sm:end-[3%] sm:top-[12%]",
      floatDelay: 0.4,
    },
    {
      icon: Users,
      title: t("heroCards.network"),
      subtitle: t("heroCards.networkSub"),
      tone: heroCardTones[2],
      className: "-start-6 top-[38%] sm:-start-8 sm:top-[40%] lg:-start-10",
      floatDelay: 0.8,
    },
    {
      icon: Landmark,
      title: t("heroCards.qiddiya"),
      subtitle: t("heroCards.qiddiyaSub"),
      tone: heroCardTones[3],
      className: "start-[10%] bottom-[26%] sm:start-[8%] sm:bottom-[28%]",
      floatDelay: 1.2,
    },
    {
      icon: Star,
      title: t("heroCards.salman"),
      subtitle: t("heroCards.salmanSub"),
      tone: heroCardTones[4],
      className: "start-[36%] bottom-[10%] sm:start-[32%] sm:bottom-[12%]",
      floatDelay: 1.6,
    },
  ];

  const socialAvatars = [User, HardHat, Pencil, Plus] as const;

  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="container-app relative grid items-center gap-10 py-10 lg:grid-cols-2 lg:gap-8 lg:py-14 xl:py-16">
        <motion.div className="max-w-xl lg:pe-4" {...leftMotion}>
          <motion.p
            {...(hydrated ? { variants: itemVariants } : {})}
            className="eyebrow text-[11px] sm:text-xs"
          >
            {t("heroEyebrow")}
          </motion.p>

          <motion.h1
            {...(hydrated ? { variants: motionVariants(heroStagger, reducedMotion) } : {})}
            className="mt-5 text-balance font-bold leading-[1.06] tracking-tight text-navy"
          >
            <motion.span
              {...(hydrated ? { variants: itemVariants } : {})}
              className="block text-4xl sm:text-5xl lg:text-[3.35rem]"
            >
              {t("heroTitleLine1")}
            </motion.span>
            <motion.span
              {...(hydrated ? { variants: itemVariants } : {})}
              className="block text-4xl text-primary sm:text-5xl lg:text-[3.35rem]"
            >
              {t("heroTitleHighlight")}
            </motion.span>
            {t("heroTitleLine2") ? (
              <motion.span
                {...(hydrated ? { variants: itemVariants } : {})}
                className="block text-4xl sm:text-5xl lg:text-[3.35rem]"
              >
                {t("heroTitleLine2")}
              </motion.span>
            ) : null}
          </motion.h1>

          <motion.p
            {...(hydrated ? { variants: itemVariants } : {})}
            className="mt-3 text-xl font-semibold text-navy sm:text-2xl"
          >
            {t("heroRegion")}
          </motion.p>

          <motion.p
            {...(hydrated ? { variants: itemVariants } : {})}
            className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground"
          >
            {t("heroSubtitle")}
          </motion.p>

          <motion.div
            {...(hydrated ? { variants: itemVariants } : {})}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="/client/requests/new"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover"
            >
              {t("ctaStartProject")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <Link
              href="/auth/sign-up?role=agency_owner"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-surface px-7 text-sm font-semibold text-navy transition-colors hover:border-secondary/30 hover:bg-secondary-light/50"
            >
              {t("ctaJoinProfessional")}
            </Link>
          </motion.div>

          <motion.div
            {...(hydrated ? { variants: itemVariants } : {})}
            className="mt-10 flex items-center gap-4"
          >
            <div className="flex -space-x-2.5 rtl:space-x-reverse">
              {socialAvatars.map((Icon, i) => (
                <motion.div
                  key={i}
                  {...(animate
                    ? {
                        initial: { opacity: 0, scale: 0.8 },
                        animate: { opacity: 1, scale: 1 },
                        transition: { delay: 0.55 + i * 0.08, duration: 0.4 },
                      }
                    : {})}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-surface-muted text-muted"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </motion.div>
              ))}
            </div>
            <div className="text-sm leading-snug">
              <p className="font-bold text-navy">{t("heroSocialProofCount")}</p>
              <p className="text-muted">{t("heroSocialProofText")}</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto min-h-[440px] w-full max-w-xl sm:min-h-[500px] lg:mx-0 lg:max-w-none lg:min-h-[540px]"
          {...rightMotion}
        >
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-[2rem] bg-surface-muted"
            {...(hydrated ? { variants: motionVariants(scaleIn, reducedMotion) } : {})}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="absolute h-[17rem] w-[17rem] rounded-full border border-primary/12 sm:h-[19rem] sm:w-[19rem]"
                {...(animate
                  ? {
                      animate: { scale: [1, 1.03, 1], opacity: [0.5, 0.8, 0.5] },
                      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    }
                  : {})}
              />
              <motion.div
                className="absolute h-[24rem] w-[24rem] rounded-full border border-secondary/15 sm:h-[26rem] sm:w-[26rem]"
                {...(animate
                  ? {
                      animate: { scale: [1, 1.02, 1], opacity: [0.35, 0.6, 0.35] },
                      transition: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                    }
                  : {})}
              />
            </div>
            <div
              className="pointer-events-none absolute -bottom-24 -start-16 h-[140%] w-px rotate-[38deg] bg-primary/10"
              aria-hidden
            />
          </motion.div>

          {floatingCards.map(({ icon: Icon, title, subtitle, tone, className, floatDelay }, index) => {
            const accent = getAccentStyle(tone);
            return (
              <motion.div
                key={title}
                {...(animate
                  ? {
                      initial: { opacity: 0, y: 24, scale: 0.94 },
                      animate: { opacity: 1, y: 0, scale: 1 },
                      transition: {
                        delay: 0.35 + index * 0.1,
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }
                  : {})}
                className={cn(
                  "absolute z-10 w-[min(100%,11.5rem)] rounded-2xl border border-border-subtle bg-surface p-3.5 shadow-soft sm:w-44 sm:p-4",
                  className
                )}
              >
                <motion.div
                  {...(animate
                    ? {
                        animate: { y: [0, -5, 0] },
                        transition: {
                          duration: 4.5 + floatDelay,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: floatDelay,
                        },
                      }
                    : {})}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10",
                        accent.iconBg
                      )}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-snug text-navy sm:text-sm">{title}</p>
                      <p className="mt-1 text-[11px] leading-snug text-muted sm:text-xs">{subtitle}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}

          <motion.div
            {...(animate
              ? {
                  initial: { opacity: 0, y: 28 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.85, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                }
              : {})}
            className="absolute bottom-4 end-2 z-20 w-[min(100%,15rem)] rounded-2xl border border-border-subtle bg-surface p-4 shadow-elevated sm:bottom-6 sm:end-4 sm:w-60 sm:p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-bold text-navy sm:text-base">{t("heroLiveProjects")}</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-light px-2.5 py-1 text-[10px] font-semibold text-secondary-dark sm:text-xs">
                {animate ? (
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-secondary"
                    aria-hidden
                    animate={{ scale: [1, 1.35, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden />
                )}
                {t("heroLiveProjectsCount")}
              </span>
            </div>

            <div className="mt-4 flex h-28 items-center justify-center rounded-2xl bg-primary-light sm:h-32">
              <Network className="h-14 w-14 text-primary/70 sm:h-16 sm:w-16" strokeWidth={1.25} />
            </div>

            <div className="mt-4 rounded-xl border border-border-subtle bg-surface p-3">
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-teal/12 text-accent-teal">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-navy sm:text-sm">{t("heroFeaturedProject")}</p>
                  <p className="mt-0.5 text-[11px] text-muted sm:text-xs">{t("heroFeaturedPhase")}</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                {animate ? (
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    transition={{ delay: 1.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  />
                ) : (
                  <div className="h-full w-[65%] rounded-full bg-primary" />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
