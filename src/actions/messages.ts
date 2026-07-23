"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";

export type ProjectMessageRow = {
  id: string;
  request_id: string;
  sender_id: string;
  sender_role: "client" | "agency";
  body: string;
  created_at: string;
};

export async function getProjectMessages(requestIds: string[]): Promise<Record<string, ProjectMessageRow[]>> {
  if (!requestIds.length) return {};

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_messages")
    .select("id, request_id, sender_id, sender_role, body, created_at")
    .in("request_id", requestIds)
    .order("created_at", { ascending: true });

  if (error) {
    return {};
  }

  const grouped: Record<string, ProjectMessageRow[]> = {};
  for (const row of data ?? []) {
    const message = row as ProjectMessageRow;
    if (!grouped[message.request_id]) grouped[message.request_id] = [];
    grouped[message.request_id].push(message);
  }

  return grouped;
}

export async function sendProjectMessage(requestId: string, body: string) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };

  const trimmed = body.trim();
  if (!trimmed) return { error: "Message cannot be empty." };

  const senderRole =
    profile.role === "agency_owner" || profile.role === "agency_employee" ? "agency" : "client";

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_messages")
    .insert({
      request_id: requestId,
      sender_id: profile.id,
      sender_role: senderRole,
      body: trimmed,
    })
    .select("id, request_id, sender_id, sender_role, body, created_at")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/client/updates");
  revalidatePath("/agency/projects");
  return { success: true, message: data as ProjectMessageRow };
}
