"use client";

import { cn } from "@/lib/utils";

export function MilestoneProgressControl({
  value,
  onChange,
  disabled = false,
  label,
  completedLabel,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label: string;
  completedLabel?: string;
}) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  if (clamped >= 100 && completedLabel) {
    return (
      <p className="mt-3 text-xs font-semibold text-success">{completedLabel}</p>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-medium text-muted">{label}</label>
        <span className="text-xs font-bold text-primary">{clamped}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={clamped}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className={cn(
          "h-2 w-full cursor-pointer accent-primary",
          disabled && "cursor-not-allowed opacity-60"
        )}
      />
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
        <div className="h-full rounded-full bg-info transition-all" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
