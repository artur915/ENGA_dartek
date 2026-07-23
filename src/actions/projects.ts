"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";

export async function getProjectDetail(requestId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("project_requests")
    .select(`
      *,
      service_packages(name),
      request_services(service_id, engineering_services(name)),
      agreements(
        id, signed_at, document_path,
        agencies(id, name, commercial_registration, engineering_license),
        quotations(price, scope, deliverables, deliverables_items, estimated_duration, payment_terms, payment_terms_type, payment_milestones, terms_and_conditions)
      )
    `)
    .eq("id", requestId)
    .maybeSingle();

  return data;
}

export async function getProjectByAgreementId(agreementId: string) {
  const supabase = await createClient();
  const { data: agreement } = await supabase
    .from("agreements")
    .select("request_id")
    .eq("id", agreementId)
    .single();

  if (!agreement) return null;
  return getProjectDetail(agreement.request_id);
}

export async function getClientActiveProjects() {
  const profile = await getProfile();
  if (!profile) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("agreements")
    .select(`
      id, signed_at, created_at,
      agencies(name),
      project_requests(
        id, title, status, location_city, created_at,
        milestones(id, title, status, sort_order, due_date, status_update, updated_at),
        payments(id, amount, status)
      ),
      quotations(price, estimated_duration, deliverables_items, payment_milestones)
    `)
    .eq("client_id", profile.id)
    .order("created_at", { ascending: false });

  const activeStatuses = new Set(["accepted", "in_progress"]);

  return (data ?? []).filter((agreement) => {
    const request = Array.isArray(agreement.project_requests)
      ? agreement.project_requests[0]
      : agreement.project_requests;
    return request && activeStatuses.has(request.status);
  });
}

export async function getClientQuotationsInbox() {
  const profile = await getProfile();
  if (!profile) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("project_requests")
    .select(`
      id, title, status, location_city,
      quotations(
        id, status, price, scope, estimated_duration,
        agencies(id, name, service_areas, disciplines)
      )
    `)
    .eq("client_id", profile.id)
    .in("status", ["floating", "quoted"])
    .order("created_at", { ascending: false });

  return (data ?? [])
    .map((request) => ({
      ...request,
      quotations: (request.quotations ?? []).filter(
        (q: { status: string }) => q.status === "submitted"
      ),
    }))
    .filter((request) => request.quotations.length > 0);
}

export async function getAgencyActiveProjects() {
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
    .from("agreements")
    .select(`
      id, signed_at, created_at,
      project_requests(
        id, title, status, location_city, created_at,
        milestones(id, title, status, sort_order, due_date, status_update, updated_at),
        payments(id, amount, status)
      ),
      quotations(price, estimated_duration, deliverables_items, payment_milestones),
      profiles!agreements_client_id_fkey(full_name, email)
    `)
    .eq("agency_id", agency.id)
    .order("created_at", { ascending: false });

  const activeStatuses = new Set(["accepted", "in_progress"]);

  return (data ?? []).filter((agreement) => {
    const request = Array.isArray(agreement.project_requests)
      ? agreement.project_requests[0]
      : agreement.project_requests;
    return request && activeStatuses.has(request.status);
  });
}

export async function getQuotableRequests() {
  const profile = await getProfile();
  if (!profile) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("project_requests")
    .select(`
      id, title, status, location_city, created_at,
      quotations(id, status, price, agency_id, agencies(name))
    `)
    .eq("client_id", profile.id)
    .in("status", ["floating", "quoted"])
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getAgreementDetail(agreementId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("agreements")
    .select(`
      *,
      agencies(name, commercial_registration, engineering_license, disciplines),
      project_requests(id, title, description, location_city, status),
      quotations(price, scope, deliverables, deliverables_items, estimated_duration, payment_terms, payment_terms_type, payment_milestones, terms_and_conditions),
      profiles!agreements_client_id_fkey(full_name, email)
    `)
    .eq("id", agreementId)
    .maybeSingle();

  return data;
}
