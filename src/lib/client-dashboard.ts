type Milestone = {
  title: string;
  status: string;
  sort_order: number;
  due_date: string | null;
  status_update: string | null;
};

type Payment = {
  amount: number;
  status: string;
};

export function formatProjectRef(id: string, createdAt: string): string {
  const year = new Date(createdAt).getFullYear();
  const num = (parseInt(id.replace(/-/g, "").slice(0, 8), 16) % 900) + 100;
  return `PRJ-${year}-${num}`;
}

export function formatPoRef(agreementId: string, signedAt: string | null): string {
  const date = signedAt ?? new Date().toISOString();
  const year = new Date(date).getFullYear();
  const num = (parseInt(agreementId.replace(/-/g, "").slice(0, 8), 16) % 9000) + 1000;
  return `PO-${year}-${num}`;
}

export function computeProgress(milestones: Milestone[]): number {
  if (!milestones.length) return 0;
  const sorted = [...milestones].sort((a, b) => a.sort_order - b.sort_order);
  const completed = sorted.filter((m) => m.status === "green").length;
  return Math.round((completed / sorted.length) * 100);
}

export function getCurrentPhase(milestones: Milestone[]): string {
  if (!milestones.length) return "Project kickoff";
  const sorted = [...milestones].sort((a, b) => a.sort_order - b.sort_order);
  const active = sorted.find((m) => m.status !== "green");
  if (active) return active.title;
  return sorted[sorted.length - 1]?.title ?? "Project kickoff";
}

export function getNextItem(milestones: Milestone[]): { title: string; dueDate: string | null } | null {
  const sorted = [...milestones].sort((a, b) => a.sort_order - b.sort_order);
  const next = sorted.find((m) => m.status === "amber" || m.status === "red");
  if (!next) return null;
  return { title: next.title, dueDate: next.due_date };
}

export function getPaymentLabel(
  payments: Payment[],
  contractValue: number
): { label: string; variant: "success" | "warning" | "default" } {
  const pending = payments.some((p) => p.status === "pending");
  if (pending) return { label: "Payment pending", variant: "warning" };

  const confirmed = payments
    .filter((p) => p.status === "confirmed")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  if (confirmed >= contractValue && contractValue > 0) {
    return { label: "Paid in full", variant: "success" };
  }
  if (confirmed > 0) return { label: "Paid to date", variant: "success" };
  return { label: "Awaiting payment", variant: "warning" };
}

export function getProjectStatusBadge(
  milestones: Milestone[],
  payments: Payment[],
  contractValue: number
): { label: string; variant: "success" | "warning" | "accent" } {
  const payment = getPaymentLabel(payments, contractValue);
  if (payment.label === "Awaiting payment" || payment.label === "Payment pending") {
    return { label: "Awaiting payment", variant: "warning" };
  }

  const next = getNextItem(milestones);
  if (next) {
    return { label: "Awaiting your decision", variant: "accent" };
  }

  return { label: "On track", variant: "success" };
}

export function needsClientReview(milestones: Milestone[]): boolean {
  return milestones.some((m) => m.status === "amber" || m.status === "red");
}
