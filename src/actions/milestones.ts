"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import type { MilestoneStatus, RequestStatus } from "@/types";

const DEFAULT_MILESTONES = [
  "Site survey & assessment",
  "Design & documentation",
  "Permits & approvals",
  "Final delivery & handover",
];

export async function createDefaultMilestones(requestId: string) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("milestones")
    .select("id")
    .eq("request_id", requestId)
    .limit(1);

  if (existing?.length) return;

  await supabase.from("milestones").insert(
    DEFAULT_MILESTONES.map((title, i) => ({
      request_id: requestId,
      title,
      sort_order: i + 1,
      status: i === 0 ? "amber" : "amber",
    }))
  );

  await supabase
    .from("project_requests")
    .update({ status: "in_progress" as RequestStatus })
    .eq("id", requestId);
}

export async function getMilestones(requestId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("milestones")
    .select("*")
    .eq("request_id", requestId)
    .order("sort_order");

  return data ?? [];
}

export async function updateMilestone(
  milestoneId: string,
  updates: { status?: MilestoneStatus; status_update?: string; title?: string }
) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("milestones")
    .update({
      ...updates,
      completed_at: updates.status === "green" ? new Date().toISOString() : null,
    })
    .eq("id", milestoneId);

  if (error) return { error: error.message };

  revalidatePath("/client/projects");
  revalidatePath("/agency/projects");
  return { success: true };
}

export async function addMilestone(requestId: string, title: string) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };

  const supabase = await createClient();
  const { count } = await supabase
    .from("milestones")
    .select("*", { count: "exact", head: true })
    .eq("request_id", requestId);

  const { error } = await supabase.from("milestones").insert({
    request_id: requestId,
    title,
    sort_order: (count ?? 0) + 1,
    status: "amber",
  });

  if (error) return { error: error.message };
  revalidatePath("/client/projects");
  revalidatePath("/agency/projects");
  return { success: true };
}
