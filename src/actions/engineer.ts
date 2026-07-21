"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

export async function isEngineerRegistered() {
  const engineer = await getEngineerProfile();
  return Boolean(engineer?.registered_at);
}

export async function requireEngineerRegistered(locale: string) {
  const registered = await isEngineerRegistered();
  if (!registered) {
    redirect(`/${locale}/engineer/register`);
  }
}

export async function registerEngineer(formData: FormData) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };
  if (profile.role !== "individual_engineer" && profile.role !== "admin") {
    return { error: "Only individual engineers can register" };
  }

  const specialization = String(formData.get("specialization") ?? "").trim();
  const professional_license = String(formData.get("professional_license") ?? "").trim();
  const council_membership = String(formData.get("council_membership") ?? "").trim();
  const service_location = String(formData.get("service_location") ?? "").trim();
  const experienceRaw = String(formData.get("experience_years") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  if (!specialization) return { error: "Specialization is required" };
  if (!professional_license) return { error: "Professional license number is required" };
  if (!council_membership) return { error: "Engineering Council membership number is required" };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("engineer_profiles")
    .select("id, registered_at")
    .eq("user_id", profile.id)
    .maybeSingle();

  if (existing?.registered_at) {
    return { error: "You have already completed registration" };
  }

  const payload = {
    specialization,
    professional_license,
    council_membership,
    service_location: service_location || null,
    experience_years: experienceRaw ? parseInt(experienceRaw, 10) : null,
    bio: bio || null,
    registered_at: new Date().toISOString(),
  };

  if (existing) {
    const { error } = await supabase
      .from("engineer_profiles")
      .update(payload)
      .eq("user_id", profile.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("engineer_profiles").insert({
      user_id: profile.id,
      ...payload,
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/engineer");
  revalidatePath("/engineer/register");
  revalidatePath("/engineer/profile");
  return { success: true };
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
    .select("id, registered_at")
    .eq("user_id", profile.id)
    .maybeSingle();

  if (!existing?.registered_at) {
    return { error: "Complete registration before updating your profile" };
  }

  const { error } = await supabase
    .from("engineer_profiles")
    .update(input)
    .eq("user_id", profile.id);

  if (error) return { error: error.message };

  revalidatePath("/engineer/profile");
  return { success: true };
}

export async function getEngineerInvitations() {
  const profile = await getProfile();
  if (!profile) return [];

  const supabase = await createClient();
  const { data: engineer } = await supabase
    .from("engineer_profiles")
    .select("linked_agency_id, registered_at")
    .eq("user_id", profile.id)
    .maybeSingle();

  if (!engineer?.registered_at || !engineer.linked_agency_id) return [];

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
  const { data: engineer } = await supabase
    .from("engineer_profiles")
    .select("registered_at")
    .eq("user_id", profile.id)
    .maybeSingle();

  if (!engineer?.registered_at) return [];

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
