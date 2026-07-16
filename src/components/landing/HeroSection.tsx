import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, FileCheck } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -end-20 -top-20 h-96 w-96 rounded-full bg-accent" />
        <div className="absolute -bottom-32 -start-20 h-80 w-80 rounded-full bg-white" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <FileCheck className="h-4 w-4 text-accent-light" />
            {t("stats.services")} · {t("stats.categories")} · {t("stats.packages")}
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 text-lg text-white/85 sm:text-xl">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/auth/sign-up?role=client"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-base font-semibold text-primary-dark shadow-lg hover:bg-accent-light"
            >
              {t("ctaClient")}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3.5 text-base font-semibold text-white hover:bg-white/10"
            >
              {tc("learnMore")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
