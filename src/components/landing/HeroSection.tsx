import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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

const toneStyles = {
  primary: "bg-emerald-100 text-emerald-700",
  teal: "bg-teal-100 text-teal-700",
  violet: "bg-violet-100 text-violet-700",
  amber: "bg-amber-100 text-amber-800",
  green: "bg-emerald-50 text-emerald-600",
} as const;

export function HeroSection() {
  const t = useTranslations("landing");

  const floatingCards = [
    {
      icon: Building2,
      title: t("heroCards.kafd"),
      subtitle: t("heroCards.kafdSub"),
      tone: "primary" as const,
      className: "start-[6%] top-[8%] sm:start-[4%] sm:top-[10%]",
    },
    {
      icon: Box,
      title: t("heroCards.murabba"),
      subtitle: t("heroCards.murabbaSub"),
      tone: "teal" as const,
      className: "end-[5%] top-[10%] sm:end-[3%] sm:top-[12%]",
    },
    {
      icon: Users,
      title: t("heroCards.network"),
      subtitle: t("heroCards.networkSub"),
      tone: "violet" as const,
      className: "-start-6 top-[38%] sm:-start-8 sm:top-[40%] lg:-start-10",
    },
    {
      icon: Landmark,
      title: t("heroCards.qiddiya"),
      subtitle: t("heroCards.qiddiyaSub"),
      tone: "amber" as const,
      className: "start-[10%] bottom-[26%] sm:start-[8%] sm:bottom-[28%]",
    },
    {
      icon: Star,
      title: t("heroCards.salman"),
      subtitle: t("heroCards.salmanSub"),
      tone: "green" as const,
      className: "start-[36%] bottom-[10%] sm:start-[32%] sm:bottom-[12%]",
    },
  ];

  const socialAvatars = [User, HardHat, Pencil, Plus] as const;

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container-app relative grid items-center gap-10 py-10 lg:grid-cols-2 lg:gap-8 lg:py-14 xl:py-16">
        <div className="max-w-xl lg:pe-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-700 sm:text-xs">
            {t("heroEyebrow")}
          </p>

          <h1 className="mt-5 text-balance font-bold leading-[1.06] tracking-tight text-gray-900">
            <span className="block text-4xl sm:text-5xl lg:text-[3.35rem]">{t("heroTitleLine1")}</span>
            <span className="block text-4xl text-emerald-700 sm:text-5xl lg:text-[3.35rem]">
              {t("heroTitleHighlight")}
            </span>
            {t("heroTitleLine2") ? (
              <span className="block text-4xl sm:text-5xl lg:text-[3.35rem]">{t("heroTitleLine2")}</span>
            ) : null}
          </h1>

          <p className="mt-3 text-xl font-semibold text-gray-900 sm:text-2xl">{t("heroRegion")}</p>

          <p className="mt-5 max-w-md text-base leading-relaxed text-gray-500">
            {t("heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/client/requests/new"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-emerald-700 px-7 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
            >
              {t("ctaStartProject")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <Link
              href="/auth/sign-up?role=agency_owner"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-gray-200 bg-white px-7 text-sm font-semibold text-gray-900 transition-colors hover:border-emerald-200 hover:bg-emerald-50/40"
            >
              {t("ctaJoinProfessional")}
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2.5 rtl:space-x-reverse">
              {socialAvatars.map((Icon, i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-gray-500"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </div>
              ))}
            </div>
            <div className="text-sm leading-snug">
              <p className="font-bold text-gray-900">{t("heroSocialProofCount")}</p>
              <p className="text-gray-500">{t("heroSocialProofText")}</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto min-h-[440px] w-full max-w-xl sm:min-h-[500px] lg:mx-0 lg:max-w-none lg:min-h-[540px]">
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-[#f3f5f4]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute h-[17rem] w-[17rem] rounded-full border border-emerald-700/12 sm:h-[19rem] sm:w-[19rem]" />
              <div className="absolute h-[24rem] w-[24rem] rounded-full border border-emerald-700/10 sm:h-[26rem] sm:w-[26rem]" />
            </div>
            <div
              className="pointer-events-none absolute -bottom-24 -start-16 h-[140%] w-px rotate-[38deg] bg-emerald-700/10"
              aria-hidden
            />
          </div>

          {floatingCards.map(({ icon: Icon, title, subtitle, tone, className }) => (
            <div
              key={title}
              className={`absolute z-10 w-[min(100%,11.5rem)] rounded-2xl border border-gray-100 bg-white p-3.5 shadow-[0_8px_30px_rgba(15,23,42,0.08)] sm:w-44 sm:p-4 ${className}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${toneStyles[tone]}`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold leading-snug text-gray-900 sm:text-sm">{title}</p>
                  <p className="mt-1 text-[11px] leading-snug text-gray-500 sm:text-xs">{subtitle}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-4 end-2 z-20 w-[min(100%,15rem)] rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.1)] sm:bottom-6 sm:end-4 sm:w-60 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-bold text-gray-900 sm:text-base">{t("heroLiveProjects")}</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                {t("heroLiveProjectsCount")}
              </span>
            </div>

            <div className="mt-4 flex h-28 items-center justify-center rounded-2xl bg-emerald-50 sm:h-32">
              <Network className="h-14 w-14 text-emerald-700/80 sm:h-16 sm:w-16" strokeWidth={1.25} />
            </div>

            <div className="mt-4 rounded-xl border border-gray-100 bg-white p-3">
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 sm:text-sm">{t("heroFeaturedProject")}</p>
                  <p className="mt-0.5 text-[11px] text-gray-500 sm:text-xs">{t("heroFeaturedPhase")}</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[65%] rounded-full bg-emerald-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
