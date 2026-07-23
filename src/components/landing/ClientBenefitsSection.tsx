import { useTranslations } from "next-intl";
import { CheckCircle2, Clock3, FileCheck2, FolderOpen, ListChecks, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { LandingSection, LandingSectionHeader } from "@/components/landing/LandingSection";
import { LandingGrid, LandingGridItem } from "@/components/motion/LandingGrid";

const icons = [ListChecks, Scale, FolderOpen, FileCheck2, Clock3, CheckCircle2];
const clientAccents = [
  "bg-primary/10 text-primary",
  "bg-secondary/10 text-secondary-dark",
  "bg-accent-sky/10 text-accent-sky",
  "bg-accent-blue/10 text-accent-blue",
  "bg-secondary-light text-secondary-dark",
  "bg-primary-light text-primary-dark",
];

export function ClientBenefitsSection() {
  const t = useTranslations("landing.clientBenefits");
  const items = t.raw("items") as string[];

  return (
    <LandingSection variant="light" id="benefits-clients" className="border-y border-border-subtle">
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
              <div className="rounded-xl border border-border bg-surface p-5 shadow-soft transition-shadow hover:border-primary/20 hover:shadow-card-hover">
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    clientAccents[i % clientAccents.length]
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
    </LandingSection>
  );
}
