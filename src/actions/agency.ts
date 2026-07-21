"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";

export async function registerAgency(formData: FormData) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };
  if (profile.role !== "agency_owner" && profile.role !== "admin") {
    return { error: "Only agency owners can register an office" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const name_ar = String(formData.get("name_ar") ?? "").trim();
  const commercial_registration = String(formData.get("commercial_registration") ?? "").trim();
  const engineering_license = String(formData.get("engineering_license") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const disciplines = formData.getAll("disciplines").map(String);
  const service_areas = formData.getAll("service_areas").map(String);
  const indicativeRaw = String(formData.get("indicative_price_from") ?? "").trim();

  if (!name) return { error: "Office name is required" };
  if (!commercial_registration) return { error: "Commercial registration number is required" };
  if (!engineering_license) return { error: "Engineering license number is required" };
  if (disciplines.length === 0) return { error: "Select at least one discipline" };
  if (service_areas.length === 0) return { error: "Select at least one service area" };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("agencies")
    .select("id")
    .eq("owner_id", profile.id)
    .maybeSingle();

  const now = new Date().toISOString();
  const agencyPayload = {
    name,
    name_ar: name_ar || null,
    commercial_registration,
    engineering_license,
    description: description || null,
    disciplines,
    service_areas,
    indicative_price_from: indicativeRaw ? parseFloat(indicativeRaw) : null,
    status: "approved" as const,
    approved_at: now,
    approved_by: profile.id,
  };

  if (existing) {
    const { error } = await supabase
      .from("agencies")
      .update(agencyPayload)
      .eq("id", existing.id);

    if (error) return { error: error.message };

    revalidatePath("/agency");
    revalidatePath("/agency/register");
    revalidatePath("/agencies");
    return { success: true, agencyId: existing.id };
  }

  const { data: agency, error } = await supabase
    .from("agencies")
    .insert({
      owner_id: profile.id,
      ...agencyPayload,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  await supabase.from("agency_members").insert({
    agency_id: agency.id,
    user_id: profile.id,
    title: "Owner",
  });

  revalidatePath("/agency");
  revalidatePath("/agency/register");
  revalidatePath("/agencies");
  return { success: true, agencyId: agency.id };
}

export async function getMyAgency() {
  const profile = await getProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("agencies")
    .select("*")
    .eq("owner_id", profile.id)
    .maybeSingle();

  return data;
}

export async function getApprovedAgencies() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("agencies")
    .select("*")
    .eq("status", "approved")
    .order("name");

  return data ?? [];
}

export async function getPendingAgencies() {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("agencies")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function approveAgency(agencyId: string) {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("agencies")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: profile.id,
    })
    .eq("id", agencyId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/agencies");
  return { success: true };
}

export async function rejectAgency(agencyId: string) {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("agencies")
    .update({ status: "rejected" })
    .eq("id", agencyId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true };
}

export async function suspendAgency(agencyId: string) {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("agencies")
    .update({ status: "suspended" })
    .eq("id", agencyId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/admin/agencies");
  return { success: true };
}

export type AgencyRegistration = {
  id: string;
  name: string;
  name_ar: string | null;
  commercial_registration: string | null;
  engineering_license: string | null;
  description: string | null;
  disciplines: string[] | null;
  service_areas: string[] | null;
  indicative_price_from: number | null;
  status: string;
};
