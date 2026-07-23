"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { MilestoneRow } from "@/lib/project-schedule";
import { resolveMilestoneExecution, sortMilestones } from "@/lib/milestone-progress";
import { MilestoneProgressControl } from "@/components/project/MilestoneProgressControl";
import { Badge } from "@/components/ui/Badge";

type Portal = "client" | "agency";

export function ScheduleMilestonePanel({
  milestones,
  portal,
  progressById,
  onProgressChange,
}: {
  milestones: MilestoneRow[];
  portal: Portal;
  progressById: Record<string, number>;
  onProgressChange?: (milestoneId: string, progress: number) => void;
}) {
  const t = useTranslations(portal === "agency" ? "agency.schedule" : "client.schedule");
  const sorted = sortMilestones(milestones);
  const canEdit = portal === "agency" && Boolean(onProgressChange);

  if (!sorted.length) return null;

  return (
    <div className="mt-6 rounded-xl border border-border-subtle bg-surface-muted/40 p-4">
      <p className="text-sm font-semibold text-foreground">{t("milestoneProgressTitle")}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {canEdit ? t("milestoneProgressHintAgency") : t("milestoneProgressHintClient")}
      </p>
      <ul className="mt-4 space-y-3">
        {sorted.map((milestone) => {
          const execution = resolveMilestoneExecution(sorted, milestone.id, progressById);
          const progressValue =
            milestone.status === "green" ? 100 : progressById[milestone.id] ?? execution.progress;

          return (
            <li
              key={milestone.id}
              className="rounded-xl border border-border-subtle bg-surface px-4 py-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-navy">{milestone.title}</p>
                    {execution.isUpcoming && (
                      <Badge variant="outline" size="sm">
                        {t("upcomingMilestone")}
                      </Badge>
                    )}
                  </div>
                  {milestone.due_date && (
                    <p className="mt-1 text-[11px] text-muted">
                      {t("milestoneDue", { date: milestone.due_date })}
                    </p>
                  )}
                </div>
                {milestone.status === "green" ? (
                  <span className="text-xs font-bold text-success">100%</span>
                ) : execution.isActive ? (
                  canEdit ? (
                    <MilestoneProgressControl
                      value={progressValue}
                      onChange={(value) => onProgressChange?.(milestone.id, value)}
                      label={t("progressLabel")}
                      completedLabel={t("completedMilestone")}
                    />
                  ) : (
                    <span className="text-xs font-bold text-primary">{progressValue}%</span>
                  )
                ) : (
                  <span className="text-xs font-semibold text-muted">0%</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
