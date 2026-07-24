import {
  formatPoRef,
  needsClientReview,
} from "@/lib/client-dashboard";
import {
  computeMilestoneProgressPercent,
  countCompletedPhases,
  resolveMilestoneExecutionAtIndex,
  sortMilestones,
} from "@/lib/milestone-progress";
import {
  parseDeliverablesItems,
  parsePaymentMilestones,
  type PaymentMilestone,
} from "@/lib/quotation";

export type MilestoneRow = {
  id: string;
  title: string;
  status: string;
  sort_order: number;
  due_date: string | null;
  status_update: string | null;
  progress_percent?: number | null;
  updated_at?: string | null;
};

export type SchedulePhaseStatus = "completed" | "in_progress" | "upcoming";

export type SchedulePhase = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  linkedWork: string[];
  progress: number;
  status: SchedulePhaseStatus;
  weekStart: number;
  weekSpan: number;
};

export type ScheduleWeek = {
  index: number;
  label: string;
  startDate: Date;
  endDate: Date;
  dateLabel: string;
  isCurrent: boolean;
};

export type ScheduleProject = {
  requestId: string;
  agreementId: string;
  title: string;
  agencyName: string;
  clientName?: string;
  poRef: string;
  signedAt: string | null;
  progress: number;
  completedPhases: number;
  totalPhases: number;
  awaitingApproval: boolean;
  phases: SchedulePhase[];
  weeks: ScheduleWeek[];
  periodLabel: string;
  durationLabel: string;
  milestones: MilestoneRow[];
};

export type ProjectUpdateEntry = {
  id: string;
  requestId: string;
  projectTitle: string;
  agencyName: string;
  milestoneTitle: string;
  message: string;
  status: string;
  updatedAt: string;
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function parseDurationWeeks(estimatedDuration: string | null | undefined): number {
  if (!estimatedDuration) return 7;
  const weeksMatch = estimatedDuration.match(/(\d+)\s*week/i);
  if (weeksMatch) return Math.max(1, Number(weeksMatch[1]));
  const daysMatch = estimatedDuration.match(/(\d+)\s*day/i);
  if (daysMatch) return Math.max(1, Math.ceil(Number(daysMatch[1]) / 7));
  return 7;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  next.setHours(0, 0, 0, 0);
  return next;
}

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function daysBetween(start: Date, end: Date): number {
  return Math.max(0, Math.round((startOfDay(end).getTime() - startOfDay(start).getTime()) / MS_PER_DAY));
}

function formatShortDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(date);
}

function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getPhaseBarStyle(
  phase: Pick<SchedulePhase, "startDate" | "endDate">,
  weeks: ScheduleWeek[]
): { left: string; width: string } {
  if (!weeks.length) return { left: "0%", width: "0%" };

  const timelineStart = startOfDay(weeks[0].startDate);
  const timelineEnd = startOfDay(weeks[weeks.length - 1].endDate);
  const phaseStart = startOfDay(new Date(phase.startDate));
  const phaseEnd = startOfDay(new Date(phase.endDate));

  const totalDays = Math.max(1, daysBetween(timelineStart, timelineEnd) + 1);
  const startDay = Math.max(0, daysBetween(timelineStart, phaseStart));
  const endDay = Math.min(totalDays - 1, daysBetween(timelineStart, phaseEnd));
  const spanDays = Math.max(1, endDay - startDay + 1);

  return {
    left: `${(startDay / totalDays) * 100}%`,
    width: `${(spanDays / totalDays) * 100}%`,
  };
}

export function computeDefaultMilestoneDueDates(
  projectStart: Date,
  milestoneCount: number,
  estimatedDuration: string | null | undefined
): string[] {
  if (milestoneCount <= 0) return [];

  const durationWeeks = parseDurationWeeks(estimatedDuration);
  const totalDays = Math.max(milestoneCount, durationWeeks * 7);
  const segmentDays = Math.max(1, Math.floor(totalDays / milestoneCount));

  return Array.from({ length: milestoneCount }, (_, index) =>
    formatIsoDate(addDays(projectStart, (index + 1) * segmentDays - 1))
  );
}

function distributeDeliverables(
  deliverables: string[],
  milestoneCount: number,
  milestoneIndex: number
): string[] {
  if (!deliverables.length || milestoneCount <= 0) return [];
  const chunkSize = Math.max(1, Math.ceil(deliverables.length / milestoneCount));
  const start = milestoneIndex * chunkSize;
  return deliverables.slice(start, start + chunkSize).slice(0, 2);
}

function buildLinkedWork(
  milestoneTitle: string,
  milestoneIndex: number,
  milestoneCount: number,
  deliverables: string[],
  paymentMilestones: PaymentMilestone[]
): string[] {
  const fromDeliverables = distributeDeliverables(deliverables, milestoneCount, milestoneIndex);
  if (fromDeliverables.length) return fromDeliverables;

  if (paymentMilestones.length === milestoneCount) {
    const payment = paymentMilestones[milestoneIndex];
    if (payment?.name.trim()) return [payment.name.trim()];
  }

  const paymentByIndex = paymentMilestones[milestoneIndex];
  if (paymentByIndex?.name.trim()) return [paymentByIndex.name.trim()];

  return [`${milestoneTitle} deliverables`, "Status review"];
}

function computePhaseRanges(
  milestones: MilestoneRow[],
  projectStart: Date,
  defaultEnd: Date
): { start: Date; end: Date }[] {
  const count = milestones.length;
  if (!count) return [];

  const totalDays = Math.max(1, daysBetween(projectStart, defaultEnd) + 1);
  const hasDueDates = milestones.some((milestone) => milestone.due_date);

  if (hasDueDates) {
    return milestones.map((milestone, index) => {
      const end = milestone.due_date ? startOfDay(new Date(milestone.due_date)) : addDays(projectStart, totalDays - 1);

      let start: Date;
      if (index === 0) {
        start = new Date(projectStart);
      } else {
        const previous = milestones[index - 1];
        const previousEnd = previous.due_date
          ? startOfDay(new Date(previous.due_date))
          : addDays(projectStart, Math.round((index / count) * totalDays) - 1);
        start = addDays(previousEnd, 1);
      }

      if (start > end) start = new Date(end);
      return { start, end };
    });
  }

  const segmentDays = Math.max(1, Math.floor(totalDays / count));
  return milestones.map((_, index) => {
    const start = addDays(projectStart, index * segmentDays);
    const end =
      index === count - 1 ? addDays(projectStart, totalDays - 1) : addDays(start, segmentDays - 1);
    return { start, end };
  });
}

export function buildScheduleProject(input: {
  requestId: string;
  agreementId: string;
  title: string;
  agencyName: string;
  clientName?: string;
  signedAt: string | null;
  estimatedDuration: string | null;
  deliverablesItems?: unknown;
  paymentMilestones?: unknown;
  milestones: MilestoneRow[];
  locale: string;
  durationWeeksLabel: (weeks: number) => string;
  progressById?: Record<string, number>;
}): ScheduleProject {
  const milestones = sortMilestones(input.milestones);
  const progressById = input.progressById ?? {};
  const deliverables = parseDeliverablesItems(input.deliverablesItems);
  const paymentMilestones = parsePaymentMilestones(input.paymentMilestones);
  const durationWeeks = parseDurationWeeks(input.estimatedDuration);
  const projectStart = startOfDay(input.signedAt ? new Date(input.signedAt) : new Date());
  let projectEnd = addDays(projectStart, durationWeeks * 7 - 1);

  const phaseRanges = computePhaseRanges(milestones, projectStart, projectEnd);
  for (const range of phaseRanges) {
    if (range.end > projectEnd) projectEnd = range.end;
  }

  const totalDays = Math.max(1, daysBetween(projectStart, projectEnd) + 1);
  const weekCount = Math.max(1, Math.ceil(totalDays / 7));
  const today = startOfDay(new Date());

  const weeks: ScheduleWeek[] = Array.from({ length: weekCount }, (_, index) => {
    const startDate = addDays(projectStart, index * 7);
    const endDate = addDays(startDate, 6);
    return {
      index,
      label: `W${index + 1}`,
      startDate,
      endDate,
      dateLabel: formatShortDate(startDate, input.locale),
      isCurrent: today >= startDate && today <= endDate,
    };
  });

  const phases: SchedulePhase[] = milestones.map((milestone, index) => {
    const range = phaseRanges[index] ?? {
      start: projectStart,
      end: projectEnd,
    };
    const startOffsetDays = daysBetween(projectStart, range.start);
    const phaseDays = daysBetween(range.start, range.end) + 1;
    const execution = resolveMilestoneExecutionAtIndex(milestones, index, progressById);

    return {
      id: milestone.id,
      title: milestone.title,
      startDate: formatIsoDate(range.start),
      endDate: formatIsoDate(range.end),
      linkedWork: buildLinkedWork(
        milestone.title,
        index,
        milestones.length,
        deliverables,
        paymentMilestones
      ),
      progress: execution.progress,
      status: execution.status,
      weekStart: startOffsetDays / 7,
      weekSpan: Math.max(phaseDays / 7, 1 / 7),
    };
  });

  const completedPhases = countCompletedPhases(milestones);
  const progress = computeMilestoneProgressPercent(milestones, progressById);

  return {
    requestId: input.requestId,
    agreementId: input.agreementId,
    title: input.title,
    agencyName: input.agencyName,
    clientName: input.clientName,
    poRef: formatPoRef(input.agreementId, input.signedAt),
    signedAt: input.signedAt,
    progress,
    completedPhases,
    totalPhases: milestones.length,
    awaitingApproval: needsClientReview(milestones),
    phases,
    weeks,
    periodLabel: `${formatShortDate(projectStart, input.locale)} – ${formatShortDate(projectEnd, input.locale)}`,
    durationLabel: input.durationWeeksLabel(weekCount),
    milestones,
  };
}

export function refreshScheduleProject(
  project: ScheduleProject,
  progressById: Record<string, number>
): ScheduleProject {
  const milestones = sortMilestones(project.milestones);
  const phases = project.phases.map((phase, index) => {
    const execution = resolveMilestoneExecutionAtIndex(milestones, index, progressById);
    return {
      ...phase,
      progress: execution.progress,
      status: execution.status,
    };
  });

  return {
    ...project,
    progress: computeMilestoneProgressPercent(milestones, progressById),
    completedPhases: countCompletedPhases(milestones),
    phases,
    milestones,
  };
}

export function collectProjectUpdates(
  projects: {
    requestId: string;
    title: string;
    agencyName: string;
    milestones: MilestoneRow[];
  }[]
): ProjectUpdateEntry[] {
  const entries: ProjectUpdateEntry[] = [];

  for (const project of projects) {
    for (const milestone of project.milestones) {
      if (!milestone.status_update?.trim()) continue;
      entries.push({
        id: milestone.id,
        requestId: project.requestId,
        projectTitle: project.title,
        agencyName: project.agencyName,
        milestoneTitle: milestone.title,
        message: milestone.status_update.trim(),
        status: milestone.status,
        updatedAt: milestone.updated_at ?? new Date().toISOString(),
      });
    }
  }

  return entries.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
