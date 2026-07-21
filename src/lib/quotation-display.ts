import {
  parseDeliverablesItems,
  parsePaymentMilestones,
  parseTermsAndConditions,
  type PaymentTermsType,
} from "@/lib/quotation";

export interface QuotationDisplayData {
  price: number;
  scope?: string | null;
  deliverables?: string | null;
  deliverables_items?: unknown;
  estimated_duration?: string | null;
  timeline_days?: number | null;
  payment_terms?: string | null;
  payment_terms_type?: PaymentTermsType | string | null;
  payment_milestones?: unknown;
  terms_and_conditions?: unknown;
}

export function getQuotationDuration(quote: QuotationDisplayData): string | null {
  if (quote.estimated_duration?.trim()) return quote.estimated_duration.trim();
  if (quote.timeline_days) return `${quote.timeline_days} days`;
  return null;
}

export function getQuotationDeliverables(quote: QuotationDisplayData): string[] {
  const structured = parseDeliverablesItems(quote.deliverables_items);
  if (structured.length) return structured;
  return parseDeliverablesItems(quote.deliverables);
}

export function getQuotationTerms(quote: QuotationDisplayData): string[] {
  return parseTermsAndConditions(quote.terms_and_conditions);
}

export function getQuotationPaymentMilestones(quote: QuotationDisplayData) {
  return parsePaymentMilestones(quote.payment_milestones);
}
