import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Building2,
  Layers,
  MapPin,
  Network,
  Sparkles,
  Users,
} from "lucide-react";

export function HeroSection() {
  const t = useTranslations("landing");

  const floatingCards = [
    {
      icon: Building2,
      title: t("heroCards.kafd"),
      subtitle: t("heroCards.kafdSub"),
      tone: "primary" as const,
      className: "start-0 top-8 lg:-start-6",
    },
    {
      icon: Sparkles,
      title: t("heroCards.murabba"),
      subtitle: t("heroCards.murabbaSub"),
      tone: "accent" as const,
      className: "end-4 top-16 lg:end-0",
    },
    {
      icon: Network,
      title: t("heroCards.network"),
      subtitle: t("heroCards.networkSub"),
      tone: "violet" as const,
      className: "start-8 bottom-28 lg:start-4",
    },
    {
      icon: MapPin,
      title: t("heroCards.qiddiya"),
      subtitle: t("heroCards.qiddiyaSub"),
      tone: "amber" as const,
      className: "end-0 bottom-12 lg:-end-4",
    },
  ];

  const toneStyles = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-primary-dark",
    violet: "bg-violet-100 text-violet-700",
    amber: "bg-amber-100 text-amber-800",
  };

  return (
    <section className="relative overflow-hidden bg-landing-bg pt-8 lg:pt-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -end-20 top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute start-0 bottom-0 h-96 w-96 rounded-full bg-primary-light/5 blur-3xl" />
      </div>

      <div className="container-app relative grid items-center gap-12 pb-16 pt-4 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-8">
        <div className="max-w-xl">
          <p className="eyebrow">{t("heroEyebrow")}</p>

          <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-navy sm:text-5xl lg:text-[3.25rem]">
            {t("heroTitleLine1")}{" "}
            <span className="text-primary">{t("heroTitleHighlight")}</span>
            {t("heroTitleLine2") ? <> {t("heroTitleLine2")}</> : null}
          </h1>

          <p className="mt-3 text-xl font-semibold text-navy/80">{t("heroRegion")}</p>

          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{t("heroSubtitle")}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/auth/sign-up?role=client"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark sm:h-[3.25rem] sm:px-7 sm:text-base"
            >
              {t("ctaStartProject")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/sign-up?role=agency_owner"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-surface px-6 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 sm:h-[3.25rem] sm:px-7 sm:text-base"
            >
              {t("ctaJoinProfessional")}
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2 rtl:space-x-reverse">
              {[Users, Layers, Building2, Sparkles].map((Icon, i) => (
                <div
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface bg-surface-muted text-primary"
                >
                  <Icon className="h-4 w-4" />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted">
              <span className="font-bold text-foreground">{t("heroSocialProofCount")}</span>{" "}
              {t("heroSocialProofText")}
            </p>
          </div>
        </div>

        <div className="relative mx-auto min-h-[420px] w-full max-w-lg lg:min-h-[480px]">
          <div className="absolute inset-0 rounded-[2rem] border border-primary/10 bg-gradient-to-br from-primary/5 via-surface to-landing-muted" />

          {floatingCards.map(({ icon: Icon, title, subtitle, tone, className }) => (
            <div
              key={title}
              className={`absolute z-10 w-[min(100%,14rem)] rounded-xl border border-border-subtle bg-surface p-4 shadow-soft ${className}`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${toneStyles[tone]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="mt-0.5 text-xs text-muted">{subtitle}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-6 start-6 end-6 z-20 rounded-2xl border border-border-subtle bg-surface p-5 shadow-elevated">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{t("heroLiveProjects")}</p>
                <p className="mt-1 text-2xl font-bold text-navy">{t("heroLiveProjectsCount")}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                <span className="h-2 w-2 rounded-full bg-success" />
                {t("heroActiveLabel")}
              </span>
            </div>
            <div className="mt-4 rounded-xl bg-primary/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t("heroFeaturedProject")}</p>
                  <p className="text-xs text-muted">{t("heroFeaturedPhase")}</p>
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-border-subtle">
                <div className="h-full w-[65%] rounded-full bg-primary" />
              </div>
              <p className="mt-2 text-xs font-medium text-primary">{t("heroFeaturedProgress")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
