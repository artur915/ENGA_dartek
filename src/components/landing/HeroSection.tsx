import { useTranslations } from "next-intl";
import { ArrowRight, Building2, CheckCircle2, ClipboardList, FileText } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function HeroSection() {
  const t = useTranslations("landing");

  return (
    <section className="relative overflow-hidden bg-landing-bg pt-6 lg:pt-10">
      <div className="container-app relative grid items-center gap-12 pb-14 lg:grid-cols-2 lg:gap-16 lg:pb-20">
        <div className="max-w-xl">
          <p className="eyebrow">{t("heroEyebrow")}</p>

          <h1 className="text-display mt-4">{t("heroHeadline")}</h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            {t("heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/client/requests/new" size="lg" variant="primary">
              {t("ctaSubmitRequest")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </ButtonLink>
            <ButtonLink href="/services" size="lg" variant="outline">
              {t("ctaBrowseServices")}
            </ButtonLink>
          </div>

          <p className="mt-5">
            <ButtonLink
              href="/auth/sign-up?role=agency_owner"
              variant="ghost"
              size="sm"
              className="h-auto px-0 text-sm text-muted-foreground hover:bg-transparent hover:text-primary"
            >
              {t("ctaJoinProvider")} →
            </ButtonLink>
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
          <div className="surface-panel overflow-hidden">
            <div className="border-b border-border-subtle bg-surface-muted px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {t("heroPreviewRequest")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{t("heroPreviewStatus")}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                  <span className="h-2 w-2 rounded-full bg-success" aria-hidden />
                  {t("heroPreviewActive")}
                </span>
              </div>
            </div>

            <div className="space-y-3 p-5">
              {[
                { icon: ClipboardList, label: t("heroPreviewStep1"), done: true },
                { icon: FileText, label: t("heroPreviewStep2"), done: true },
                { icon: Building2, label: t("heroPreviewStep"), done: false },
              ].map(({ icon: Icon, label, done }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-border-subtle bg-landing-bg px-4 py-3"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      done ? "bg-primary/10 text-primary" : "bg-surface-muted text-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
                  {done && <CheckCircle2 className="h-4 w-4 text-success" aria-hidden />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
