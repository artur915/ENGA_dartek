"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ClipboardList, CreditCard, FileSignature, TrafficCone } from "lucide-react";
import { cn } from "@/lib/utils";
import { getWorkflowStageAccent } from "@/lib/design-tokens";
import { LandingSection, LandingSectionHeader } from "@/components/landing/LandingSection";
import { LandingGrid, LandingGridItem } from "@/components/motion/LandingGrid";

const stageIcons = [ClipboardList, FileSignature, TrafficCone, CreditCard];
const stageKeys = ["submit", "compare", "execute", "complete"] as const;
const stageNumberBg: Record<(typeof stageKeys)[number], string> = {
  submit: "bg-accent-blue",
  compare: "bg-accent-teal",
  execute: "bg-accent-orange",
  complete: "bg-accent-green",
};

function StageCard({
  stageKey,
  index,
  stage,
  isOpen,
  onToggle,
  t,
  layout,
}: {
  stageKey: (typeof stageKeys)[number];
  index: number;
  stage: { title: string; summary: string; steps: string[] };
  isOpen: boolean;
  onToggle: () => void;
  t: ReturnType<typeof useTranslations>;
  layout: "desktop" | "mobile";
}) {
  const Icon = stageIcons[index] ?? ClipboardList;
  const accent = getWorkflowStageAccent(stageKey);
  const panelId = layout === "desktop" ? `workflow-panel-${stageKey}` : `workflow-mobile-${stageKey}`;

  return (
    <article className={cn("relative flex flex-col", layout === "desktop" && "pe-4 last:pe-0")}>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex flex-1 flex-col rounded-xl border bg-surface p-5 text-start shadow-soft transition-all hover:shadow-card-hover",
          accent.border,
          accent.bg
        )}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white",
            stageNumberBg[stageKey]
          )}
        >
          {index + 1}
        </span>
        <span className="mt-4 flex items-center gap-2">
          <Icon className={cn("h-4 w-4", accent.text)} />
          <span className="text-base font-bold text-navy">{stage.title}</span>
        </span>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{stage.summary}</p>
        <span className={cn("mt-3 inline-flex items-center gap-1 text-xs font-semibold", accent.text)}>
          {isOpen ? t("workflowHideDetails") : t("workflowViewDetails")}
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} />
        </span>
      </button>
      {isOpen && (
        <ol
          id={panelId}
          className={cn(
            "mt-2 rounded-xl border border-border-subtle p-4",
            accent.bg
          )}
        >
          {stage.steps.map((step, stepIndex) => (
            <li key={step} className="flex items-start gap-2.5 py-1.5 text-sm text-foreground">
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ring-1",
                  accent.badge
                )}
              >
                {stepIndex + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}

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

      <LandingGrid className="hidden lg:grid lg:grid-cols-4 lg:gap-4">
        {stageKeys.map((key, i) => {
          const stage = t.raw(`workflowStages.${key}`) as {
            title: string;
            summary: string;
            steps: string[];
          };
          const isOpen = expanded === key;

          return (
            <LandingGridItem key={key}>
              <div className="relative flex flex-col">
                {i < stageKeys.length - 1 && (
                  <div
                    className="absolute top-6 end-0 hidden h-px w-full translate-x-1/2 bg-border lg:block"
                    aria-hidden
                  />
                )}
                <StageCard
                  stageKey={key}
                  index={i}
                  stage={stage}
                  isOpen={isOpen}
                  onToggle={() => setExpanded(isOpen ? null : key)}
                  t={t}
                  layout="desktop"
                />
              </div>
            </LandingGridItem>
          );
        })}
      </LandingGrid>

      <div className="space-y-3 lg:hidden">
        {stageKeys.map((key, i) => {
          const stage = t.raw(`workflowStages.${key}`) as {
            title: string;
            summary: string;
            steps: string[];
          };
          const isOpen = expanded === key;
          const accent = getWorkflowStageAccent(key);

          return (
            <article
              key={key}
              className={cn(
                "overflow-hidden rounded-xl border bg-surface shadow-soft",
                accent.border
              )}
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : key)}
                className="flex w-full items-start gap-4 p-5 text-start"
                aria-expanded={isOpen}
                aria-controls={`workflow-mobile-${key}`}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white",
                    stageNumberBg[key]
                  )}
                >
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    {(() => {
                      const Icon = stageIcons[i] ?? ClipboardList;
                      return <Icon className={cn("h-4 w-4", accent.text)} />;
                    })()}
                    <span className="text-base font-bold text-navy">{stage.title}</span>
                  </span>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{stage.summary}</p>
                </span>
                <ChevronDown
                  className={cn("mt-1 h-5 w-5 shrink-0 text-muted transition-transform", isOpen && "rotate-180")}
                />
              </button>
              {isOpen && (
                <ol id={`workflow-mobile-${key}`} className={cn("border-t border-border-subtle px-5 py-4", accent.bg)}>
                  {stage.steps.map((step, stepIndex) => (
                    <li key={step} className="flex items-start gap-2.5 py-1.5 text-sm">
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ring-1",
                          accent.badge
                        )}
                      >
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
