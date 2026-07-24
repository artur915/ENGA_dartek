"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { Calendar, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScheduleProject } from "@/lib/project-schedule";
import { refreshScheduleProject } from "@/lib/project-schedule";
import { saveScheduleProgress } from "@/actions/milestones";
import { buildProgressMapFromMilestones } from "@/lib/milestone-progress";
import { ProjectGanttChart } from "@/components/client/ProjectGanttChart";
import { ScheduleMilestonePanel } from "@/components/client/ScheduleMilestonePanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";

type Portal = "client" | "agency";

export function ProjectScheduleWorkspace({
  projects,
  initialProjectId,
  portal = "client",
}: {
  projects: ScheduleProject[];
  initialProjectId?: string;
  portal?: Portal;
}) {
  const t = useTranslations(portal === "agency" ? "agency.schedule" : "client.schedule");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [progressById, setProgressById] = useState<Record<string, number>>({});
  const [savedProgressById, setSavedProgressById] = useState<Record<string, number>>({});
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const fromServer = buildProgressMapFromMilestones(projects.flatMap((project) => project.milestones));
    setProgressById(fromServer);
    if (portal === "agency") {
      setSavedProgressById(fromServer);
    }
  }, [projects, portal]);

  const scheduleProjects = useMemo(
    () => projects.map((project) => refreshScheduleProject(project, progressById)),
    [projects, progressById]
  );

  const basePath = portal === "agency" ? "/agency/schedule" : "/client/schedule";
  const workspacePath = portal === "agency" ? "/agency/projects" : "/client/projects";
  const emptyHref = portal === "agency" ? "/agency/projects" : "/client/quotations";
  const emptyLabel = portal === "agency" ? t("browseProjects") : t("browseQuotations");

  const selectedId =
    initialProjectId && scheduleProjects.some((p) => p.requestId === initialProjectId)
      ? initialProjectId
      : scheduleProjects[0]?.requestId;

  const selected = useMemo(
    () => scheduleProjects.find((project) => project.requestId === selectedId) ?? scheduleProjects[0] ?? null,
    [scheduleProjects, selectedId]
  );

  const isDirty = useMemo(() => {
    if (portal !== "agency" || !selected) return false;

    return selected.milestones.some((milestone) => {
      if (milestone.status === "green") return false;
      const saved = savedProgressById[milestone.id] ?? 0;
      const draft = progressById[milestone.id] ?? saved;
      return draft !== saved;
    });
  }, [portal, selected, progressById, savedProgressById]);

  if (!scheduleProjects.length || !selected) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface p-8 text-center">
        <p className="text-muted">{t("empty")}</p>
        <ButtonLink href={emptyHref} variant="outline" size="sm" className="mt-4">
          {emptyLabel}
        </ButtonLink>
      </div>
    );
  }

  const awaitingApproval = selected.awaitingApproval && !approvedIds.has(selected.requestId);
  const subtitle = portal === "agency" ? selected.clientName ?? "—" : selected.agencyName;

  function handleAgencyProgressChange(milestoneId: string, progress: number) {
    if (portal !== "agency") return;

    const clamped = Math.min(100, Math.max(0, Math.round(progress)));
    setSaveMessage(null);
    setSaveError(null);
    setProgressById((current) => ({ ...current, [milestoneId]: clamped }));
  }

  function handleSaveSchedule() {
    if (portal !== "agency" || !isDirty) return;

    const updates = selected.milestones
      .filter((milestone) => milestone.status !== "green")
      .map((milestone) => ({
        milestoneId: milestone.id,
        progress: progressById[milestone.id] ?? savedProgressById[milestone.id] ?? 0,
      }))
      .filter((update) => {
        const saved = savedProgressById[update.milestoneId] ?? 0;
        return update.progress !== saved;
      });

    startTransition(async () => {
      const result = await saveScheduleProgress(selected.requestId, updates, t("statusUpdated"));
      if (result.error) {
        setSaveError(result.error);
        setSaveMessage(null);
        return;
      }

      const nextSaved = { ...savedProgressById };
      for (const update of updates) {
        nextSaved[update.milestoneId] = update.progress;
      }
      setSavedProgressById(nextSaved);
      setSaveMessage(t("saveScheduleSuccess"));
      setSaveError(null);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="rounded-2xl border border-border-subtle bg-surface p-3">
        <p className="px-2 py-2 text-xs font-bold uppercase tracking-wide text-muted">{t("ongoingProjects")}</p>
        <ul className="space-y-1">
          {scheduleProjects.map((project) => {
            const active = project.requestId === selected.requestId;
            const projectSubtitle = portal === "agency" ? project.clientName ?? "—" : project.agencyName;
            return (
              <li key={project.requestId}>
                <Link
                  href={`${basePath}?project=${project.requestId}`}
                  className={cn(
                    "block rounded-xl px-3 py-3 transition-colors",
                    active ? "bg-primary text-white shadow-sm" : "hover:bg-surface-muted"
                  )}
                >
                  <p className="text-sm font-semibold leading-snug">{project.title}</p>
                  <p className={cn("mt-1 text-xs", active ? "text-white/80" : "text-muted")}>
                    {projectSubtitle}
                  </p>
                  <p className={cn("mt-2 text-[11px] font-medium", active ? "text-white/90" : "text-primary")}>
                    {project.progress}% · {project.completedPhases}/{project.totalPhases} {t("phasesShort")}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-muted">{t("subtitle")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {awaitingApproval ? (
              <Badge variant="warning" size="sm">
                {t("awaitingApproval")}
              </Badge>
            ) : (
              <Badge variant="success" size="sm">
                {t("approved")}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard title={t("projectPeriod")}>
            <p className="text-sm font-semibold text-foreground">{selected.periodLabel}</p>
            <p className="mt-1 text-xs text-muted">
              {selected.durationLabel} · {selected.poRef}
            </p>
            <p className="mt-1 text-xs text-muted">{subtitle}</p>
          </SummaryCard>
          <SummaryCard title={t("scheduleProgress")}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-2xl font-bold text-primary">{selected.progress}%</p>
              <p className="text-xs text-muted">
                {t("phasesComplete", {
                  completed: selected.completedPhases,
                  total: selected.totalPhases,
                })}
              </p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${selected.progress}%` }} />
            </div>
          </SummaryCard>
          <SummaryCard title={t("approvalStatus")}>
            <p className="text-sm font-semibold text-foreground">
              {awaitingApproval ? t("awaitingApproval") : t("approved")}
            </p>
            <p className="mt-1 text-xs text-muted">
              {awaitingApproval ? t("approvalHintPending") : t("approvalHintApproved")}
            </p>
          </SummaryCard>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-foreground">{selected.title}</p>
            <div className="flex flex-wrap gap-2">
              <ButtonLink href={`${workspacePath}/${selected.requestId}`} variant="outline" size="sm">
                {t("openWorkspace")}
              </ButtonLink>
              {portal === "client" && awaitingApproval && (
                <button
                  type="button"
                  onClick={() =>
                    setApprovedIds((current) => new Set(current).add(selected.requestId))
                  }
                  className="inline-flex h-9 items-center rounded-xl bg-primary px-4 text-xs font-semibold text-white hover:bg-primary-dark"
                >
                  {t("approveSchedule")}
                </button>
              )}
            </div>
          </div>

          {awaitingApproval && (
            <div className="mt-4 rounded-xl border border-warning/20 bg-warning/10 px-4 py-3 text-sm text-muted-foreground">
              {portal === "agency" ? t("reviewBannerAgency") : t("reviewBanner")}
            </div>
          )}

          <div className="mt-5">
            <ProjectGanttChart phases={selected.phases} weeks={selected.weeks} portal={portal} />
          </div>

          <ScheduleMilestonePanel
            milestones={selected.milestones}
            portal={portal}
            progressById={progressById}
            onProgressChange={portal === "agency" ? handleAgencyProgressChange : undefined}
          />

          {portal === "agency" && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4">
              <p className="text-xs text-muted">{t("saveScheduleHint")}</p>
              <div className="flex flex-wrap items-center gap-3">
                {saveError && <p className="text-xs font-medium text-danger">{saveError}</p>}
                {saveMessage && !saveError && (
                  <p className="text-xs font-medium text-success">{saveMessage}</p>
                )}
                <Button
                  type="button"
                  onClick={handleSaveSchedule}
                  disabled={!isDirty || isPending}
                  size="sm"
                >
                  {isPending ? t("saving") : t("saveSchedule")}
                </Button>
              </div>
            </div>
          )}

          <p className="mt-4 inline-flex items-center gap-2 text-xs text-muted">
            <Clock3 className="h-3.5 w-3.5" />
            {t("datesNote")}
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-muted">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
