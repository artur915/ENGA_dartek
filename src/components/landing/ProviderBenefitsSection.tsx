import { useTranslations } from "next-intl";
import { ArrowRight, Briefcase, FileText, FolderKanban, Receipt, TrendingUp, Upload } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { cn } from "@/lib/utils";
import { LandingSection, LandingSectionHeader } from "@/components/landing/LandingSection";
import { LandingGrid, LandingGridItem } from "@/components/motion/LandingGrid";
import { Reveal } from "@/components/motion/Reveal";

const icons = [Briefcase, FileText, FolderKanban, Upload, Receipt, TrendingUp];
const providerAccents = [
  "bg-accent-emerald/10 text-accent-emerald",
  "bg-accent-purple/10 text-accent-purple",
  "bg-accent-orange/10 text-accent-orange",
  "bg-accent-green/10 text-accent-green",
  "bg-accent-amber/10 text-accent-amber",
  "bg-secondary/10 text-secondary-dark",
];

export function ProviderBenefitsSection() {
  const t = useTranslations("landing.providerBenefits");
  const items = t.raw("items") as string[];

  return (
    <LandingSection variant="provider" id="benefits-providers">
      <LandingSectionHeader
        badge={t("badge")}
        title={t("title")}
        description={t("description")}
        align="start"
      />
      <LandingGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const Icon = icons[i] ?? Briefcase;
          return (
            <LandingGridItem key={item}>
              <div className="rounded-xl border border-border-subtle bg-surface/90 p-5 shadow-soft backdrop-blur-sm transition-shadow hover:shadow-card-hover">
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    providerAccents[i % providerAccents.length]
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item}</p>
              </div>
            </LandingGridItem>
          );
        })}
      </LandingGrid>
      <Reveal className="mt-10">
        <ButtonLink href="/auth/sign-up?role=agency_owner" size="lg" variant="accent">
          {t("cta")}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </ButtonLink>
      </Reveal>
    </LandingSection>
  );
}
