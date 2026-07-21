export type PaymentTermsType = "full_on_completion" | "advance_balance" | "milestones";

export interface PaymentMilestone {
  id: string;
  name: string;
  percentage: number;
}

export const DEFAULT_TERMS_AND_CONDITIONS = [
  "The quoted price covers only the scope of work and deliverables listed in this quotation.",
  "This quotation is valid for 30 days from the date of submission.",
  "All work will comply with the Saudi Building Code (SBC) and relevant authority requirements.",
  "Up to two rounds of revisions are included per deliverable; further changes are billed separately.",
  "Government fees, permit charges, and third-party testing costs are not included and are billed at cost.",
] as const;

export const SUGGESTED_TERMS = [
  "Timelines assume the client provides timely approvals and site access.",
  "All amounts are exclusive of 15% VAT unless stated otherwise.",
  "Intellectual property of deliverables transfers upon full payment.",
  "Either party may terminate with written notice subject to work completed.",
] as const;

export function createId(): string {
  // Only use after user interaction — not in useState initializers (SSR hydration mismatch).
  return crypto.randomUUID();
}

export function parseDeliverablesItems(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim() !== "");
  }
  if (typeof value === "string" && value.trim()) {
    return value.split("\n").map((line) => line.trim()).filter(Boolean);
  }
  return [];
}

export function parsePaymentMilestones(value: unknown): PaymentMilestone[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const row = item as { id?: string; name?: string; percentage?: number };
      const name = row.name?.trim();
      const percentage = Number(row.percentage);
      if (!name || Number.isNaN(percentage)) return null;
      return {
        id: row.id ?? `milestone-${index}`,
        name,
        percentage,
      };
    })
    .filter((item): item is PaymentMilestone => item !== null);
}

export function parseTermsAndConditions(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim() !== "");
  }
  return [];
}

export function paymentMilestoneTotal(milestones: PaymentMilestone[]): number {
  return milestones.reduce((sum, item) => sum + (Number(item.percentage) || 0), 0);
}

export function formatPaymentTermsLabel(
  type: PaymentTermsType,
  milestones: PaymentMilestone[],
  price: number
): string {
  if (type === "full_on_completion") return "100% paid on delivery";
  if (type === "advance_balance") return "50% upfront, 50% on delivery";
  if (!milestones.length) return "Milestone-based payments";
  return milestones
    .map((m) => `${m.name}: ${m.percentage}% (SAR ${Math.round((price * m.percentage) / 100).toLocaleString()})`)
    .join("; ");
}

export function defaultDeliverablesFromServices(serviceNames: string[]): string[] {
  if (!serviceNames.length) return ["Project deliverables"];
  return serviceNames.map((name) => `${name} deliverables`);
}
