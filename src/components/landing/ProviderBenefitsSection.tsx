import { useTranslations } from "next-intl";
import { ArrowRight, Briefcase, FileText, FolderKanban, Receipt, TrendingUp, Upload } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { LandingSection, LandingSectionHeader } from "@/components/landing/LandingSection";

const icons = [Briefcase, FileText, FolderKanban, Upload, Receipt, TrendingUp];

export function ProviderBenefitsSection() {
  const t = useTranslations("landing.providerBenefits");
  const items = t.raw("items") as string[];

  return (
    <LandingSection variant="navy" id="benefits-providers">
      <LandingSectionHeader
        badge={t("badge")}
        title={t("title")}
        description={t("description")}
        align="start"
        inverted
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const Icon = icons[i] ?? Briefcase;
          return (
            <div
              key={item}
              className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-primary-light">
                <Icon className="h-4 w-4" />
              </span>
              <p className="mt-4 text-sm leading-relaxed text-white/80">{item}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-10">
        <ButtonLink
          href="/auth/sign-up?role=agency_owner"
          size="lg"
          variant="secondary"
          className="bg-white text-navy hover:bg-white/90"
        >
          {t("cta")}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </ButtonLink>
      </div>
    </LandingSection>
  );
}
