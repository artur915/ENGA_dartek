"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ClipboardList, CreditCard, FileSignature, TrafficCone } from "lucide-react";
import { cn } from "@/lib/utils";
import { LandingSection, LandingSectionHeader } from "@/components/landing/LandingSection";

const stageIcons = [ClipboardList, FileSignature, TrafficCone, CreditCard];
const stageKeys = ["request", "compare", "execute", "close"] as const;

export function WorkflowSection() {
  const t = useTranslations("landing");
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <LandingSection variant="muted" id="how-it-works">
      <LandingSectionHeader
        badge={t("workflowBadge")}
        title={t("workflowTitle")}
        description={t("workflowDescription")}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {stageKeys.map((key, i) => {
          const Icon = stageIcons[i] ?? ClipboardList;
          const stage = t.raw(`workflowStages.${key}`) as {
            title: string;
            summary: string;
            steps: string[];
          };
          const isOpen = expanded === key;

          return (
            <article
              key={key}
              className="surface-panel overflow-hidden transition-shadow hover:shadow-card-hover"
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : key)}
                className="flex w-full items-start gap-4 p-5 text-start"
                aria-expanded={isOpen}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-base font-bold text-navy">{stage.title}</span>
                  </span>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{stage.summary}</p>
                </span>
                <ChevronDown
                  className={cn(
                    "mt-1 h-5 w-5 shrink-0 text-muted transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {isOpen && (
                <ol className="border-t border-border-subtle bg-landing-bg px-5 py-4 sm:ps-20">
                  {stage.steps.map((step, stepIndex) => (
                    <li
                      key={step}
                      className="flex items-center gap-3 py-2 text-sm text-foreground last:pb-0"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {stepIndex + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              )}
            </article>
          );
        })}
      </div>
    </LandingSection>
  );
}
