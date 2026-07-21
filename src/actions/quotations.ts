"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { createDefaultMilestones } from "@/actions/milestones";

export interface SubmitQuotationInput {
  request_id: string;
  price: number;
  scope?: string;
  deliverables?: string;
  timeline_days?: number;
  payment_terms?: string;
}

export async function submitQuotation(input: SubmitQuotationInput) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };

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
        price: input.price,
        scope: input.scope ?? null,
        deliverables: input.deliverables ?? null,
        timeline_days: input.timeline_days ?? null,
        payment_terms: input.payment_terms ?? null,
        status: "submitted",
        revision_number: existing.revision_number + 1,
        submitted_at: new Date().toISOString(),
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
        price: input.price,
        scope: input.scope ?? null,
        deliverables: input.deliverables ?? null,
        timeline_days: input.timeline_days ?? null,
        payment_terms: input.payment_terms ?? null,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return { error: error.message };
    quotationId = created.id;
  }

  // Update request status to quoted if floating
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
