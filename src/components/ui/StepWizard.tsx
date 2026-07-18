"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function StepWizard({
  steps,
  currentStep,
  onStepClick,
}: {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}) {
  return (
    <div className="overflow-x-auto pb-2">
      <ol className="flex min-w-max items-center gap-2 sm:gap-3">
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const isComplete = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          return (
            <li key={label} className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => onStepClick?.(stepNum)}
                disabled={!onStepClick}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all sm:px-4",
                  isCurrent && "bg-primary text-white shadow-sm",
                  isComplete && "bg-primary/10 text-primary",
                  !isCurrent && !isComplete && "border border-border bg-surface text-muted",
                  onStepClick && "hover:border-primary/30"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    isCurrent && "bg-white/20",
                    isComplete && "bg-primary text-white",
                    !isCurrent && !isComplete && "bg-surface-muted"
                  )}
                >
                  {isComplete ? <Check className="h-3.5 w-3.5" /> : stepNum}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "hidden h-px w-6 sm:block sm:w-10",
                    isComplete ? "bg-primary/40" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
