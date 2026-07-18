import { useTranslations } from "next-intl";
import {
  Archive,
  ArrowRightLeft,
  ClipboardList,
  CreditCard,
  FileSignature,
  Send,
  TrafficCone,
} from "lucide-react";
import {
  LandingCard,
  LandingSection,
  LandingSectionHeader,
} from "@/components/landing/LandingSection";

const stepIcons = [ClipboardList, Send, ArrowRightLeft, FileSignature, TrafficCone, CreditCard, Archive];

export function WorkflowSection() {
  const t = useTranslations("landing");
  const steps = t.raw("workflowSteps") as Record<string, string>;
  const stepKeys = Object.keys(steps);

  return (
    <LandingSection variant="dark" id="how-it-works">
      <LandingSectionHeader
        badge="Platform Journey"
        title={t("workflowTitle")}
        description="From first request to project archive — seven seamless steps on one platform."
      />
      <div className="relative">
        <div className="absolute start-0 end-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-accent/30 to-transparent xl:block" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {stepKeys.map((key, i) => {
            const Icon = stepIcons[i] ?? ClipboardList;
            const isGold = i === 0 || i === stepKeys.length - 1;
            return (
              <LandingCard key={key} className="flex flex-col items-center text-center">
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                    isGold
                      ? "bg-gradient-to-br from-accent/30 to-accent/10 text-accent-light shadow-[0_0_24px_rgba(212,175,55,0.2)]"
                      : "bg-primary-light/20 text-white group-hover:bg-primary-light/30"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-light/80">
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-semibold leading-snug text-white/90">{steps[key]}</p>
              </LandingCard>
            );
          })}
        </div>
      </div>
    </LandingSection>
  );
}
