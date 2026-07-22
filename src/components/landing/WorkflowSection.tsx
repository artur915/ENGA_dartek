"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ClipboardList, CreditCard, FileSignature, TrafficCone } from "lucide-react";
import { cn } from "@/lib/utils";
import { LandingSection, LandingSectionHeader } from "@/components/landing/LandingSection";

const stageIcons = [ClipboardList, FileSignature, TrafficCone, CreditCard];
const stageKeys = ["submit", "compare", "execute", "complete"] as const;

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

      {/* Desktop: horizontal process */}
      <ol className="hidden lg:grid lg:grid-cols-4 lg:gap-0">
        {stageKeys.map((key, i) => {
          const Icon = stageIcons[i] ?? ClipboardList;
          const stage = t.raw(`workflowStages.${key}`) as {
            title: string;
            summary: string;
            steps: string[];
          };
          const isOpen = expanded === key;

          return (
            <li key={key} className="relative flex flex-col">
              {i < stageKeys.length - 1 && (
                <div
                  className="absolute top-6 end-0 hidden h-px w-full translate-x-1/2 bg-border lg:block"
                  aria-hidden
                />
              )}
              <article className="relative flex flex-1 flex-col pe-4 last:pe-0">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : key)}
                  className="flex flex-1 flex-col rounded-xl border border-border bg-surface p-5 text-start shadow-soft transition-shadow hover:shadow-card-hover"
                  aria-expanded={isOpen}
                  aria-controls={`workflow-panel-${key}`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="mt-4 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-base font-bold text-navy">{stage.title}</span>
                  </span>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{stage.summary}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    {isOpen ? t("workflowHideDetails") : t("workflowViewDetails")}
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} />
                  </span>
                </button>
                {isOpen && (
                  <ol
                    id={`workflow-panel-${key}`}
                    className="mt-2 rounded-xl border border-border-subtle bg-landing-bg p-4"
                  >
                    {stage.steps.map((step, stepIndex) => (
                      <li key={step} className="flex items-start gap-2.5 py-1.5 text-sm text-foreground">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {stepIndex + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                )}
              </article>
            </li>
          );
        })}
      </ol>

      {/* Mobile / tablet: vertical process */}
      <div className="space-y-3 lg:hidden">
        {stageKeys.map((key, i) => {
          const Icon = stageIcons[i] ?? ClipboardList;
          const stage = t.raw(`workflowStages.${key}`) as {
            title: string;
            summary: string;
            steps: string[];
          };
          const isOpen = expanded === key;

          return (
            <article key={key} className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : key)}
                className="flex w-full items-start gap-4 p-5 text-start"
                aria-expanded={isOpen}
                aria-controls={`workflow-mobile-${key}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-base font-bold text-navy">{stage.title}</span>
                  </span>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{stage.summary}</p>
                </span>
                <ChevronDown
                  className={cn("mt-1 h-5 w-5 shrink-0 text-muted transition-transform", isOpen && "rotate-180")}
                />
              </button>
              {isOpen && (
                <ol id={`workflow-mobile-${key}`} className="border-t border-border-subtle bg-landing-muted px-5 py-4">
                  {stage.steps.map((step, stepIndex) => (
                    <li key={step} className="flex items-start gap-2.5 py-1.5 text-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
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
