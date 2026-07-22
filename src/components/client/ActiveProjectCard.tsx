"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AlertCircle, Calendar, ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActiveProjectCardProps = {
  scheduleHref: string;
  workspaceHref: string;
  title: string;
  contractValueLabel: string;
  contractValueFormatted: string;
  progressLabel: string;
  progress: number;
  viewScheduleLabel: string;
  openWorkspaceLabel: string;
  showDetailsLabel: string;
  hideDetailsLabel: string;
  expanded: {
    statusLabel: string;
    statusVariant: "success" | "warning" | "accent";
    projectRef: string;
    subtitle: string | null;
    showAlert: boolean;
    reviewNextItemLabel: string;
    currentPhaseLabel: string;
    currentPhase: string;
    nextItemLabel: string;
    nextItemTitle: string | null;
    nextItemDue: string | null;
    dueLabel: string;
    allMilestonesCompleteLabel: string;
    paymentStatusLabel: string;
    paymentLabel: string;
    paymentVariant: "success" | "warning" | "default";
  };
};

export function ActiveProjectCard({
  scheduleHref,
  workspaceHref,
  title,
  contractValueLabel,
  contractValueFormatted,
  progressLabel,
  progress,
  viewScheduleLabel,
  openWorkspaceLabel,
  showDetailsLabel,
  hideDetailsLabel,
  expanded: details,
}: ActiveProjectCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <Card padding="none" className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 px-6 py-4 text-start transition-colors hover:bg-surface-muted/40"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
        </div>
        <div className="shrink-0 text-end">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            {contractValueLabel}
          </p>
          <p className="text-lg font-bold text-primary">{contractValueFormatted}</p>
        </div>
        <ChevronDown
          className={cn(
            "mt-1 h-5 w-5 shrink-0 text-muted transition-transform",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      <div className="border-t border-border-subtle px-6 py-4">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted">
          <span>{progressLabel}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {open && (
          <div className="mt-5 space-y-4 border-t border-border-subtle pt-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={
                  details.statusVariant === "success"
                    ? "success"
                    : details.statusVariant === "warning"
                      ? "warning"
                      : "accent"
                }
              >
                {details.statusLabel}
              </Badge>
              <span className="text-xs text-muted">{details.projectRef}</span>
            </div>

            {details.subtitle && (
              <p className="text-sm text-muted">{details.subtitle}</p>
            )}

            {details.showAlert && (
              <div className="flex items-start gap-2 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-primary-dark">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{details.reviewNextItemLabel}</span>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  {details.currentPhaseLabel}
                </p>
                <p className="mt-1 text-sm font-medium">{details.currentPhase}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  {details.nextItemLabel}
                </p>
                <p className="mt-1 text-sm font-medium">
                  {details.nextItemTitle ? (
                    <>
                      {details.nextItemTitle}
                      {details.nextItemDue && (
                        <span className="mt-0.5 block text-xs text-muted">
                          {details.dueLabel}: {details.nextItemDue}
                        </span>
                      )}
                    </>
                  ) : (
                    details.allMilestonesCompleteLabel
                  )}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  {details.paymentStatusLabel}
                </p>
                <p
                  className={cn(
                    "mt-1 text-sm font-medium",
                    details.paymentVariant === "warning" ? "text-warning" : "text-success"
                  )}
                >
                  {details.paymentLabel}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-xs font-semibold text-primary hover:text-primary-dark"
          >
            {open ? hideDetailsLabel : showDetailsLabel}
          </button>
          <div className="flex flex-wrap justify-end gap-2">
            <Link
              href={scheduleHref}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-border-subtle bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/20"
            >
              <Calendar className="h-4 w-4" />
              {viewScheduleLabel}
            </Link>
            <Link
              href={workspaceHref}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <ExternalLink className="h-4 w-4" />
              {openWorkspaceLabel}
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
