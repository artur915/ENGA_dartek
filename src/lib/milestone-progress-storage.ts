const STORAGE_KEY = "enga-milestone-progress";

type ProgressMap = Record<string, number>;

function readAll(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressMap;
  } catch {
    return {};
  }
}

function writeAll(data: ProgressMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadMilestoneProgress(): ProgressMap {
  return readAll();
}

export function getMilestoneProgress(milestoneId: string): number | undefined {
  return readAll()[milestoneId];
}

export function setMilestoneProgress(milestoneId: string, progress: number) {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));
  const all = readAll();
  all[milestoneId] = clamped;
  writeAll(all);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("enga-milestone-progress"));
  }
}

export function clearMilestoneProgress(milestoneId: string) {
  const all = readAll();
  delete all[milestoneId];
  writeAll(all);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("enga-milestone-progress"));
  }
}
