"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";

export async function getEngineerProfile() {
  const profile = await getProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("engineer_profiles")
    .select("*, agencies(name)")
    .eq("user_id", profile.id)
    .maybeSingle();

  return data;
}

export async function saveEngineerProfile(input: {
  specialization?: string;
  experience_years?: number;
  council_membership?: string;
  professional_license?: string;
  service_location?: string;
  bio?: string;
  linked_agency_id?: string;
}) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("engineer_profiles")
    .select("id")
    .eq("user_id", profile.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("engineer_profiles")
      .update(input)
      .eq("user_id", profile.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("engineer_profiles").insert({
      user_id: profile.id,
      ...input,
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/engineer/profile");
  return { success: true };
}

export async function getEngineerInvitations() {
  const profile = await getProfile();
  if (!profile) return [];

  const supabase = await createClient();
  const { data: engineer } = await supabase
    .from("engineer_profiles")
    .select("linked_agency_id")
    .eq("user_id", profile.id)
    .maybeSingle();

  if (!engineer?.linked_agency_id) return [];

  const { data } = await supabase
    .from("request_invitations")
    .select(`
      id, invited_at,
      project_requests(id, title, location_city, status, description)
    `)
    .eq("agency_id", engineer.linked_agency_id)
    .order("invited_at", { ascending: false })
    .limit(20);

  return data ?? [];
}

export async function getEngineerAssignments() {
  const profile = await getProfile();
  if (!profile) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("agency_members")
    .select(`
      agency_id,
      agencies(name),
      title
    `)
    .eq("user_id", profile.id)
    .eq("is_active", true);

  return data ?? [];
}
