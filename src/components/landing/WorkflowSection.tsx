import { useTranslations } from "next-intl";
import {
  Archive,
  ArrowRightLeft,
  ClipboardList,
  CreditCard,
  FileSignature,
  MapPin,
  Package,
  Send,
  TrafficCone,
} from "lucide-react";
import { LandingCard, LandingSection, LandingSectionHeader } from "@/components/landing/LandingSection";

const stepIcons = [
  ClipboardList,
  MapPin,
  Package,
  Send,
  ArrowRightLeft,
  FileSignature,
  TrafficCone,
  CreditCard,
  Archive,
];

export function WorkflowSection() {
  const t = useTranslations("landing");
  const steps = t.raw("workflowSteps") as Record<string, string>;
  const stepKeys = Object.keys(steps);

  return (
    <LandingSection variant="muted" id="how-it-works">
      <LandingSectionHeader
        badge={t("workflowBadge")}
        title={t("workflowTitle")}
        description={t("workflowDescription")}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stepKeys.map((key, i) => {
          const Icon = stepIcons[i] ?? ClipboardList;
          return (
            <LandingCard key={key} className="relative flex flex-col">
              <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold leading-snug text-foreground">{steps[key]}</p>
            </LandingCard>
          );
        })}
      </div>
    </LandingSection>
  );
}
