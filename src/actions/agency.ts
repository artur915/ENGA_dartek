"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";

export interface RegisterAgencyInput {
  name: string;
  name_ar?: string;
  commercial_registration: string;
  engineering_license: string;
  description?: string;
  disciplines: string[];
  service_areas: string[];
  indicative_price_from?: number;
}

export async function registerAgency(input: RegisterAgencyInput) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };
  if (profile.role !== "agency_owner" && profile.role !== "admin") {
    return { error: "Only agency owners can register" };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("agencies")
    .select("id, status")
    .eq("owner_id", profile.id)
    .maybeSingle();

  if (existing) {
    return { error: "You already have a registered agency", agencyId: existing.id };
  }

  const { data: agency, error } = await supabase
    .from("agencies")
    .insert({
      owner_id: profile.id,
      name: input.name,
      name_ar: input.name_ar ?? null,
      commercial_registration: input.commercial_registration,
      engineering_license: input.engineering_license,
      description: input.description ?? null,
      disciplines: input.disciplines,
      service_areas: input.service_areas,
      indicative_price_from: input.indicative_price_from ?? null,
      status: "pending",
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
