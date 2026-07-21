"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { createDefaultMilestones } from "@/actions/milestones";
import {
  formatPaymentTermsLabel,
  paymentMilestoneTotal,
  type PaymentMilestone,
  type PaymentTermsType,
} from "@/lib/quotation";

export interface SubmitQuotationInput {
  request_id: string;
  price: number;
  scope?: string;
  deliverables_items: string[];
  estimated_duration?: string;
  payment_terms_type: PaymentTermsType;
  payment_milestones?: PaymentMilestone[];
  terms_and_conditions: string[];
  confirmed_accurate: boolean;
}

function validateQuotationInput(input: SubmitQuotationInput): string | null {
  if (!input.confirmed_accurate) {
    return "Please confirm the quotation is accurate and binding.";
  }
  if (!input.deliverables_items.length || input.deliverables_items.every((d) => !d.trim())) {
    return "Add at least one deliverable.";
  }
  if (!input.terms_and_conditions.length || input.terms_and_conditions.every((t) => !t.trim())) {
    return "Add at least one terms & conditions clause.";
  }
  if (input.payment_terms_type === "milestones") {
    const milestones = input.payment_milestones ?? [];
    if (!milestones.length) return "Add at least one payment milestone.";
    const total = paymentMilestoneTotal(milestones);
    if (total !== 100) return `Payment milestones must total 100% (currently ${total}%).`;
    if (milestones.some((m) => !m.name.trim())) return "Each payment milestone needs a name.";
  }
  return null;
}

function buildLegacyFields(input: SubmitQuotationInput) {
  return {
    deliverables: input.deliverables_items.filter(Boolean).join("\n"),
    payment_terms: formatPaymentTermsLabel(
      input.payment_terms_type,
      input.payment_milestones ?? [],
      input.price
    ),
  };
}

export async function submitQuotation(input: SubmitQuotationInput) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };

  const validationError = validateQuotationInput(input);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { data: agency } = await supabase
    .from("agencies")
    .select("id, status")
    .eq("owner_id", profile.id)
    .maybeSingle();

  if (!agency || agency.status !== "approved") {
    return { error: "Approved agency required to submit quotations" };
  }

  const { data: invitation } = await supabase
    .from("request_invitations")
    .select("id")
    .eq("request_id", input.request_id)
    .eq("agency_id", agency.id)
    .maybeSingle();

  if (!invitation) return { error: "You are not invited to quote on this request" };

  const legacy = buildLegacyFields(input);
  const payload = {
    price: input.price,
    scope: input.scope ?? null,
    deliverables: legacy.deliverables,
    deliverables_items: input.deliverables_items.filter(Boolean),
    estimated_duration: input.estimated_duration ?? null,
    timeline_days: null,
    payment_terms: legacy.payment_terms,
    payment_terms_type: input.payment_terms_type,
    payment_milestones:
      input.payment_terms_type === "milestones" ? input.payment_milestones ?? [] : [],
    terms_and_conditions: input.terms_and_conditions.filter(Boolean),
    status: "submitted" as const,
    submitted_at: new Date().toISOString(),
  };

  const { data: existing } = await supabase
    .from("quotations")
    .select("id, revision_number")
    .eq("request_id", input.request_id)
    .eq("agency_id", agency.id)
    .maybeSingle();

  let quotationId: string;

  if (existing) {
    const { data: updated, error } = await supabase
      .from("quotations")
      .update({
        ...payload,
        revision_number: existing.revision_number + 1,
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) return { error: error.message };
    quotationId = updated.id;
  } else {
    const { data: created, error } = await supabase
      .from("quotations")
      .insert({
        request_id: input.request_id,
        agency_id: agency.id,
        ...payload,
      })
      .select()
      .single();

    if (error) return { error: error.message };
    quotationId = created.id;
  }

  await supabase
    .from("project_requests")
    .update({ status: "quoted" })
    .eq("id", input.request_id)
    .in("status", ["floating", "submitted"]);

  revalidatePath("/agency/requests");
  revalidatePath("/agency/quotations");
  revalidatePath(`/client/quotations/${input.request_id}`);
  return { success: true, quotationId };
}

export async function getAgencyQuotationForRequest(requestId: string) {
  const profile = await getProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const { data: agency } = await supabase
    .from("agencies")
    .select("id")
    .eq("owner_id", profile.id)
    .maybeSingle();

  if (!agency) return null;

  const { data } = await supabase
    .from("quotations")
    .select("*")
    .eq("request_id", requestId)
    .eq("agency_id", agency.id)
    .maybeSingle();

  return data;
}

export async function getQuotationsForRequest(requestId: string) {
  const profile = await getProfile();
  if (!profile) return [];

  const supabase = await createClient();

  const { data: request } = await supabase
    .from("project_requests")
    .select("client_id")
    .eq("id", requestId)
    .single();

  if (!request || (request.client_id !== profile.id && profile.role !== "admin")) {
    return [];
  }

  const { data } = await supabase
    .from("quotations")
    .select(`
      *,
      agencies(id, name, disciplines, service_areas, indicative_price_from)
    `)
    .eq("request_id", requestId)
    .eq("status", "submitted")
    .order("price", { ascending: true });

  return data ?? [];
}

export async function acceptQuotation(quotationId: string) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };

  const supabase = await createClient();

  const { data: agreementId, error } = await supabase.rpc("accept_quotation", {
    p_quotation_id: quotationId,
  });

  if (error) {
    const { data: quote } = await supabase
      .from("quotations")
      .select("request_id, agency_id")
      .eq("id", quotationId)
      .single();

    if (!quote) return { error: "Quotation not found" };

    const { data: request } = await supabase
      .from("project_requests")
      .select("client_id")
      .eq("id", quote.request_id)
      .single();

    if (!request || request.client_id !== profile.id) {
      return { error: "Not authorized" };
    }

    await supabase.from("quotations").update({ status: "accepted" }).eq("id", quotationId);
    await supabase
      .from("quotations")
      .update({ status: "rejected" })
      .eq("request_id", quote.request_id)
      .neq("id", quotationId)
      .eq("status", "submitted");
    await supabase
      .from("project_requests")
      .update({ status: "accepted" })
      .eq("id", quote.request_id);

    const { data: agreement } = await supabase
      .from("agreements")
      .insert({
        quotation_id: quotationId,
        request_id: quote.request_id,
        agency_id: quote.agency_id,
        client_id: profile.id,
        signed_at: new Date().toISOString(),
      })
      .select()
      .single();

    revalidatePath("/client");
    revalidatePath("/client/quotations");
    revalidatePath("/client/projects");
    if (agreement?.id) {
      await createDefaultMilestones(quote.request_id);
    }
    return { success: true, agreementId: agreement?.id };
  }

  revalidatePath("/client");
  revalidatePath("/client/quotations");
  revalidatePath("/client/projects");

  const { data: quote } = await supabase
    .from("quotations")
    .select("request_id")
    .eq("id", quotationId)
    .single();
  if (quote) await createDefaultMilestones(quote.request_id);

  return { success: true, agreementId: agreementId as string };
}

export async function declineQuotation(quotationId: string) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };

  const supabase = await createClient();
  const { data: quote } = await supabase
    .from("quotations")
    .select("request_id, status")
    .eq("id", quotationId)
    .single();

  if (!quote) return { error: "Quotation not found" };
  if (quote.status !== "submitted") return { error: "Quotation cannot be declined" };

  const { data: request } = await supabase
    .from("project_requests")
    .select("client_id")
    .eq("id", quote.request_id)
    .single();

  if (!request || request.client_id !== profile.id) {
    return { error: "Not authorized" };
  }

  const { error } = await supabase
    .from("quotations")
    .update({ status: "rejected" })
    .eq("id", quotationId);

  if (error) return { error: error.message };

  revalidatePath("/client");
  revalidatePath("/client/quotations");
  revalidatePath(`/client/quotations/${quote.request_id}`);
  return { success: true };
}

export async function getAgencyQuotations() {
  const profile = await getProfile();
  if (!profile) return [];

  const supabase = await createClient();
  const { data: agency } = await supabase
    .from("agencies")
    .select("id")
    .eq("owner_id", profile.id)
    .maybeSingle();

  if (!agency) return [];

  const { data } = await supabase
    .from("quotations")
    .select(`
      *,
      project_requests(id, title, status, location_city)
    `)
    .eq("agency_id", agency.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}
