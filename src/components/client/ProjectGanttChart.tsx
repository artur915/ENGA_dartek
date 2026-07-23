"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { SchedulePhase, ScheduleWeek } from "@/lib/project-schedule";

export function ProjectGanttChart({
  phases,
  weeks,
  portal = "client",
}: {
  phases: SchedulePhase[];
  weeks: ScheduleWeek[];
  portal?: "client" | "agency";
}) {
  const t = useTranslations(portal === "agency" ? "agency.schedule" : "client.schedule");

  return (
    <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">
      <div className="overflow-x-auto">
        <div
          className="min-w-[760px]"
          style={{
            display: "grid",
            gridTemplateColumns: `minmax(220px, 280px) repeat(${weeks.length}, minmax(72px, 1fr))`,
          }}
        >
          <div className="border-b border-e border-border-subtle bg-surface-muted px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted">
            {t("phaseColumn")}
          </div>
          {weeks.map((week) => (
            <div
              key={week.label}
              className={cn(
                "border-b border-e border-border-subtle px-2 py-3 text-center last:border-e-0",
                week.isCurrent && "bg-primary/5"
              )}
            >
              <p className="text-xs font-bold text-foreground">{week.label}</p>
              <p className="mt-0.5 text-[11px] text-muted">{week.dateLabel}</p>
            </div>
          ))}

          {phases.map((phase) => (
            <GanttPhaseRow key={phase.id} phase={phase} weeks={weeks} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle px-4 py-3 text-xs text-muted">
        <div className="flex flex-wrap items-center gap-4">
          <LegendDot className="bg-primary" label={t("legendCompleted")} />
          <LegendDot className="bg-info" label={t("legendInProgress")} />
          <LegendDot className="bg-gray-200" label={t("legendUpcoming")} />
        </div>
        <p>{t("datesNote")}</p>
      </div>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("h-2.5 w-2.5 rounded-full", className)} />
      {label}
    </span>
  );
}

function GanttPhaseRow({ phase, weeks }: { phase: SchedulePhase; weeks: ScheduleWeek[] }) {
  const isUpcoming = phase.status === "upcoming";

  return (
    <>
      <div className="border-b border-e border-border-subtle px-4 py-4">
        <p className="text-sm font-bold text-foreground">{phase.title}</p>
        <p className="mt-1 text-[11px] text-muted">
          {phase.startDate} — {phase.endDate}
        </p>
        <ul className="mt-2 space-y-0.5">
          {phase.linkedWork.map((item) => (
            <li key={item} className="text-[11px] text-muted-foreground">
              • {item}
            </li>
          ))}
        </ul>
      </div>

      <div
        className="relative border-b border-border-subtle"
        style={{ gridColumn: `2 / span ${weeks.length}` }}
      >
        <div
          className="grid h-[4.5rem] items-center"
          style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(72px, 1fr))` }}
        >
          {weeks.map((week) => (
            <div
              key={`${phase.id}-${week.label}`}
              className={cn(
                "h-full border-e border-border-subtle/70 last:border-e-0",
                week.isCurrent && "bg-primary/5"
              )}
            />
          ))}
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 flex items-center px-1"
          style={{
            left: `${(phase.weekStart / weeks.length) * 100}%`,
            width: `${Math.max((phase.weekSpan / weeks.length) * 100, 2.5)}%`,
          }}
        >
          <div
            className={cn(
              "relative h-8 w-full overflow-hidden rounded-md text-xs font-bold shadow-sm",
              isUpcoming ? "bg-gray-200 text-gray-500" : "bg-primary/20 text-white"
            )}
          >
            {!isUpcoming && phase.status === "completed" && (
              <div className="flex h-full w-full items-center justify-center bg-primary">{phase.progress}%</div>
            )}
            {!isUpcoming && phase.status === "in_progress" && (
              <>
                <div className="absolute inset-0 bg-info/25" />
                <div
                  className="absolute inset-y-0 start-0 bg-info"
                  style={{ width: `${phase.progress}%` }}
                />
                <span className="relative z-10 flex h-full items-center justify-center text-white">
                  {phase.progress}%
                </span>
              </>
            )}
            {isUpcoming && (
              <span className="flex h-full items-center justify-center text-[11px] font-semibold text-muted">
                —
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
