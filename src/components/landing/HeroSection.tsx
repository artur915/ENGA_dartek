import { useTranslations } from "next-intl";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { HeroProductPreview } from "@/components/landing/HeroProductPreview";

export function HeroSection() {
  const t = useTranslations("landing");

  const trustPoints = t.raw("heroTrustPoints") as string[];

  return (
    <section className="relative overflow-hidden border-b border-border-subtle bg-landing-bg">
      <div className="absolute inset-0 landing-grid-line opacity-40" aria-hidden />
      <div className="container-app relative grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16 lg:py-16 xl:py-20">
        <div className="max-w-xl">
          <p className="eyebrow">{t("heroEyebrow")}</p>
          <h1 className="heading-display mt-4">{t("heroHeadline")}</h1>
          <p className="text-lead mt-5 max-w-lg">{t("heroSubtitle")}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/client/requests/new" size="lg" variant="primary">
              {t("ctaSubmitRequest")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </ButtonLink>
            <ButtonLink href="/services" size="lg" variant="outline">
              {t("ctaBrowseServices")}
            </ButtonLink>
          </div>

          <p className="mt-4">
            <ButtonLink
              href="/auth/sign-up?role=agency_owner"
              variant="ghost"
              size="sm"
              className="h-auto px-0 text-sm text-muted-foreground hover:bg-transparent hover:text-primary"
            >
              {t("ctaJoinProvider")} →
            </ButtonLink>
          </p>

          <ul className="mt-8 space-y-2.5 border-t border-border-subtle pt-6">
            {trustPoints.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <HeroProductPreview />
        </div>
      </div>
    </section>
  );
}
