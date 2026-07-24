import type { MilestoneRow, SchedulePhaseStatus } from "@/lib/project-schedule";

export type MilestoneLike = Pick<MilestoneRow, "id" | "status" | "sort_order"> & {
  progress_percent?: number | null;
};

export function buildProgressMapFromMilestones(milestones: MilestoneLike[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const milestone of sortMilestones(milestones)) {
    if (milestone.status === "green") {
      map[milestone.id] = 100;
    } else if (milestone.progress_percent != null) {
      map[milestone.id] = Math.min(100, Math.max(0, Math.round(milestone.progress_percent)));
    }
  }
  return map;
}

export type MilestoneExecutionState = {
  status: SchedulePhaseStatus;
  progress: number;
  isActive: boolean;
  isUpcoming: boolean;
};

export function sortMilestones<T extends MilestoneLike>(milestones: T[]): T[] {
  return [...milestones].sort((a, b) => a.sort_order - b.sort_order);
}

/** Index of the current in-progress milestone, or -1 when all are complete. */
export function getActiveMilestoneIndex(milestones: MilestoneLike[]): number {
  const sorted = sortMilestones(milestones);
  return sorted.findIndex((milestone) => milestone.status !== "green");
}

export function resolveMilestoneExecution(
  milestones: MilestoneLike[],
  milestoneId: string,
  progressById: Record<string, number> = {}
): MilestoneExecutionState {
  const sorted = sortMilestones(milestones);
  const index = sorted.findIndex((milestone) => milestone.id === milestoneId);
  if (index === -1) {
    return { status: "upcoming", progress: 0, isActive: false, isUpcoming: true };
  }

  return resolveMilestoneExecutionAtIndex(sorted, index, progressById);
}

export function resolveMilestoneExecutionAtIndex(
  sorted: MilestoneLike[],
  index: number,
  progressById: Record<string, number> = {}
): MilestoneExecutionState {
  const milestone = sorted[index];
  if (!milestone) {
    return { status: "upcoming", progress: 0, isActive: false, isUpcoming: true };
  }

  if (milestone.status === "green") {
    return { status: "completed", progress: 100, isActive: false, isUpcoming: false };
  }

  const activeIndex = sorted.findIndex((item) => item.status !== "green");
  if (activeIndex === -1) {
    return { status: "completed", progress: 100, isActive: false, isUpcoming: false };
  }

  if (index < activeIndex) {
    return { status: "completed", progress: 100, isActive: false, isUpcoming: false };
  }

  if (index > activeIndex) {
    return { status: "upcoming", progress: 0, isActive: false, isUpcoming: true };
  }

  const stored = progressById[milestone.id];
  const progress =
    stored !== undefined
      ? Math.min(100, Math.max(0, Math.round(stored)))
      : milestone.progress_percent != null
        ? Math.min(100, Math.max(0, Math.round(milestone.progress_percent)))
        : 0;

  return {
    status: "in_progress",
    progress,
    isActive: true,
    isUpcoming: false,
  };
}

/** Overall schedule progress as the average milestone completion percentage. */
export function computeMilestoneProgressPercent(
  milestones: MilestoneLike[],
  progressById: Record<string, number> = {}
): number {
  if (!milestones.length) return 0;
  const sorted = sortMilestones(milestones);
  const total = sorted.reduce((sum, _, index) => {
    return sum + resolveMilestoneExecutionAtIndex(sorted, index, progressById).progress;
  }, 0);
  return Math.round(total / sorted.length);
}

export function countCompletedPhases(milestones: MilestoneLike[]): number {
  return sortMilestones(milestones).filter((milestone) => milestone.status === "green").length;
}
