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

const stepIcons = [ClipboardList, Send, ArrowRightLeft, FileSignature, TrafficCone, CreditCard, Archive];

export function WorkflowSection() {
  const t = useTranslations("landing");
  const steps = t.raw("workflowSteps") as Record<string, string>;
  const stepKeys = Object.keys(steps);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-foreground">
          {t("workflowTitle")}
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {stepKeys.map((key, i) => {
            const Icon = stepIcons[i] ?? ClipboardList;
            return (
              <div
                key={key}
                className="relative flex flex-col items-center rounded-xl border border-border bg-surface p-5 text-center"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="mb-1 text-xs font-bold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-medium text-foreground">{steps[key]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
