"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";

export interface CreateRequestInput {
  title: string;
  description?: string;
  location_city: string;
  location_district?: string;
  package_id?: number;
  service_ids: number[];
}

export async function createProjectRequest(input: CreateRequestInput) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };
  if (profile.role !== "client" && profile.role !== "admin") {
    return { error: "Only clients can create requests" };
  }

  const supabase = await createClient();

  const { data: request, error } = await supabase
    .from("project_requests")
    .insert({
      client_id: profile.id,
      title: input.title,
      description: input.description ?? null,
      location_city: input.location_city,
      location_district: input.location_district ?? null,
      package_id: input.package_id ?? null,
      status: "draft",
    })
    .select()
    .single();

  if (error) return { error: error.message };

  if (input.service_ids.length > 0) {
    const { error: svcError } = await supabase.from("request_services").insert(
      input.service_ids.map((service_id) => ({
        request_id: request.id,
        service_id,
      }))
    );
    if (svcError) return { error: svcError.message };
  }

  revalidatePath("/client/requests");
  return { success: true, requestId: request.id };
}

export async function uploadRequestDocument(requestId: string, formData: FormData) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };

  const file = formData.get("file");
  if (!file || !(file instanceof File) || file.size === 0) {
    return { error: "No file provided" };
  }

  const supabase = await createClient();
  const { data: request } = await supabase
    .from("project_requests")
    .select("client_id")
    .eq("id", requestId)
    .single();

  if (!request || request.client_id !== profile.id) {
    return { error: "Not authorized" };
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${profile.id}/${requestId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("request-documents")
    .upload(filePath, file, { contentType: file.type, upsert: false });

  if (uploadError) return { error: uploadError.message };

  const { error: dbError } = await supabase.from("request_documents").insert({
    request_id: requestId,
    file_name: file.name,
    file_path: filePath,
    file_size: file.size,
    mime_type: file.type,
    uploaded_by: profile.id,
  });

  if (dbError) return { error: dbError.message };

  revalidatePath("/client/requests");
  revalidatePath("/agency/requests");
  return { success: true };
}

export async function floatProjectRequest(requestId: string) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };

  const supabase = await createClient();

  const { data: request } = await supabase
    .from("project_requests")
    .select("id, client_id, status")
    .eq("id", requestId)
    .single();

  if (!request || request.client_id !== profile.id) {
    return { error: "Request not found" };
  }

  if (request.status !== "draft" && request.status !== "submitted") {
    return { error: "Request cannot be floated in current status" };
  }

  const { data: inviteCount, error } = await supabase.rpc("float_project_request", {
    p_request_id: requestId,
  });

  if (error) {
    // Fallback if RPC not deployed: manual float
    const { data: agencies } = await supabase
      .from("agencies")
      .select("id")
      .eq("status", "approved");

    await supabase
      .from("project_requests")
      .update({ status: "floating", floated_at: new Date().toISOString() })
      .eq("id", requestId);

    if (agencies && agencies.length > 0) {
      await supabase.from("request_invitations").upsert(
        agencies.map((a) => ({ request_id: requestId, agency_id: a.id })),
        { onConflict: "request_id,agency_id", ignoreDuplicates: true }
      );
    }

    revalidatePath("/client/requests");
    revalidatePath("/agency/requests");
    return { success: true, inviteCount: agencies?.length ?? 0 };
  }

  revalidatePath("/client/requests");
  revalidatePath("/agency/requests");
  return { success: true, inviteCount: inviteCount as number };
}

export async function getClientRequests() {
  const profile = await getProfile();
  if (!profile) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("project_requests")
    .select(`
      *,
      service_packages(name),
      request_services(service_id, engineering_services(name)),
      quotations(id, status, price, agency_id, agencies(name))
    `)
    .eq("client_id", profile.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getRequestById(requestId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("project_requests")
    .select(`
      *,
      service_packages(name, slug),
      request_services(service_id, engineering_services(id, name, category_id)),
      request_documents(id, file_name, file_path),
      profiles!project_requests_client_id_fkey(full_name, email)
    `)
    .eq("id", requestId)
    .single();

  return data;
}

export async function getAgencyIncomingRequests() {
  const profile = await getProfile();
  if (!profile) return [];

  const supabase = await createClient();
  const { data: agency } = await supabase
    .from("agencies")
    .select("id, status")
    .eq("owner_id", profile.id)
    .maybeSingle();

  if (!agency || agency.status !== "approved") return [];

  const { data: invitations } = await supabase
    .from("request_invitations")
    .select(`
      id,
      invited_at,
      viewed_at,
      request_id,
      project_requests(
        id, title, description, location_city, location_district,
        status, created_at, floated_at,
        service_packages(name)
      )
    `)
    .eq("agency_id", agency.id)
    .order("invited_at", { ascending: false });

  const requestIds = (invitations ?? []).map((i) => i.request_id);
  const { data: quotes } = requestIds.length
    ? await supabase
        .from("quotations")
        .select("request_id")
        .eq("agency_id", agency.id)
        .in("request_id", requestIds)
    : { data: [] };

  const quotedRequests = new Set((quotes ?? []).map((q) => q.request_id));

  return (invitations ?? []).map((inv) => {
    const raw = inv.project_requests;
    const request = (Array.isArray(raw) ? raw[0] : raw) as {
      id: string;
      title: string;
      description: string | null;
      location_city: string | null;
      status: string;
      service_packages?: { name: string } | { name: string }[] | null;
    } | null;
    const pkg = request?.service_packages;
    const packageName = Array.isArray(pkg) ? pkg[0]?.name : pkg?.name;
    return {
      invitation: { id: inv.id, invited_at: inv.invited_at },
      request: request
        ? { ...request, service_packages: packageName ? { name: packageName } : null }
        : null,
      hasQuote: quotedRequests.has(inv.request_id),
    };
  });
}

export async function markInvitationViewed(invitationId: string) {
  const supabase = await createClient();
  await supabase
    .from("request_invitations")
    .update({ viewed_at: new Date().toISOString() })
    .eq("id", invitationId);
}

export async function getClientDashboardStats() {
  const profile = await getProfile();
  if (!profile) return { draft: 0, quoted: 0, active: 0, completed: 0 };

  const supabase = await createClient();
  const { data } = await supabase
    .from("project_requests")
    .select("status")
    .eq("client_id", profile.id);

  const stats = { draft: 0, quoted: 0, active: 0, completed: 0 };
  for (const r of data ?? []) {
    if (r.status === "draft") stats.draft++;
    else if (r.status === "floating" || r.status === "quoted") stats.quoted++;
    else if (r.status === "accepted" || r.status === "in_progress") stats.active++;
    else if (r.status === "completed" || r.status === "archived") stats.completed++;
  }
  return stats;
}

export async function getAgencyDashboardStats() {
  const profile = await getProfile();
  if (!profile) return { incoming: 0, pendingQuotes: 0, active: 0, revenue: 0 };

  const supabase = await createClient();
  const { data: agency } = await supabase
    .from("agencies")
    .select("id")
    .eq("owner_id", profile.id)
    .maybeSingle();

  if (!agency) return { incoming: 0, pendingQuotes: 0, active: 0, revenue: 0 };

  const { count: incoming } = await supabase
    .from("request_invitations")
    .select("*", { count: "exact", head: true })
    .eq("agency_id", agency.id);

  const { data: quotes } = await supabase
    .from("quotations")
    .select("status, price")
    .eq("agency_id", agency.id);

  let pendingQuotes = 0;
  let revenue = 0;
  for (const q of quotes ?? []) {
    if (q.status === "draft") pendingQuotes++;
    if (q.status === "accepted") revenue += Number(q.price);
  }

  const { count: active } = await supabase
    .from("agreements")
    .select("*", { count: "exact", head: true })
    .eq("agency_id", agency.id);

  return {
    incoming: incoming ?? 0,
    pendingQuotes,
    active: active ?? 0,
    revenue,
  };
}
