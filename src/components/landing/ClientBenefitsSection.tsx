import { useTranslations } from "next-intl";
import { CheckCircle2, Clock3, FileCheck2, FolderOpen, ListChecks, Scale } from "lucide-react";
import { LandingSection, LandingSectionHeader } from "@/components/landing/LandingSection";
import { LandingGrid, LandingGridItem } from "@/components/motion/LandingGrid";

const icons = [ListChecks, Scale, FolderOpen, FileCheck2, Clock3, CheckCircle2];

export function ClientBenefitsSection() {
  const t = useTranslations("landing.clientBenefits");
  const items = t.raw("items") as string[];

  return (
    <LandingSection variant="light" id="benefits-clients">
      <LandingSectionHeader
        badge={t("badge")}
        title={t("title")}
        description={t("description")}
        align="start"
      />
      <LandingGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const Icon = icons[i] ?? CheckCircle2;
          return (
            <LandingGridItem key={item}>
            <div
              className="rounded-xl border border-border bg-surface p-5 shadow-soft transition-shadow hover:shadow-card-hover"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item}</p>
            </div>
            </LandingGridItem>
          );
        })}
      </LandingGrid>
    </LandingSection>
  );
}
