import { useTranslations } from "next-intl";
import { CheckCircle2, Clock3, FileCheck2, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { LandingCard, LandingSection, LandingSectionHeader } from "@/components/landing/LandingSection";

const clientIcons = [ShieldCheck, FileCheck2, Clock3];
const agencyIcons = [TrendingUp, Users, CheckCircle2];

export function BenefitsSection() {
  const t = useTranslations("landing");

  const clientBenefits = t.raw("clientBenefits.items") as string[];
  const agencyBenefits = t.raw("agencyBenefits.items") as string[];

  return (
    <LandingSection variant="light" id="benefits">
      <LandingSectionHeader
        badge={t("benefitsBadge")}
        title={t("benefitsTitle")}
        description={t("benefitsDescription")}
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <LandingCard highlight className="h-full">
          <p className="eyebrow mb-2">{t("clientBenefits.label")}</p>
          <h3 className="text-xl font-bold text-navy">{t("clientBenefits.title")}</h3>
          <ul className="mt-6 space-y-4">
            {clientBenefits.map((item, i) => {
              const Icon = clientIcons[i] ?? ShieldCheck;
              return (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
                </li>
              );
            })}
          </ul>
        </LandingCard>

        <LandingCard className="h-full">
          <p className="eyebrow mb-2">{t("agencyBenefits.label")}</p>
          <h3 className="text-xl font-bold text-navy">{t("agencyBenefits.title")}</h3>
          <ul className="mt-6 space-y-4">
            {agencyBenefits.map((item, i) => {
              const Icon = agencyIcons[i] ?? TrendingUp;
              return (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-primary-dark">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
                </li>
              );
            })}
          </ul>
        </LandingCard>
      </div>
    </LandingSection>
  );
}
