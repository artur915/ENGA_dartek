"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { computeDefaultMilestoneDueDates } from "@/lib/project-schedule";
import type { MilestoneStatus, RequestStatus } from "@/types";

const DEFAULT_MILESTONES = [
  "Site survey & assessment",
  "Design & documentation",
  "Permits & approvals",
  "Final delivery & handover",
];

async function getAgreementScheduleContext(requestId: string) {
  const supabase = await createClient();
  const { data: agreement } = await supabase
    .from("agreements")
    .select("signed_at, quotations(estimated_duration)")
    .eq("request_id", requestId)
    .order("signed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const signedAt = agreement?.signed_at ? new Date(agreement.signed_at) : new Date();
  const quoteRaw = agreement?.quotations;
  const quote = Array.isArray(quoteRaw) ? quoteRaw[0] : quoteRaw;
  const estimatedDuration =
    quote && typeof quote === "object" && "estimated_duration" in quote
      ? (quote.estimated_duration as string | null)
      : null;

  return { signedAt, estimatedDuration };
}

export async function createDefaultMilestones(requestId: string) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("milestones")
    .select("id")
    .eq("request_id", requestId)
    .limit(1);

  if (existing?.length) return;

  const { signedAt, estimatedDuration } = await getAgreementScheduleContext(requestId);
  const dueDates = computeDefaultMilestoneDueDates(
    signedAt,
    DEFAULT_MILESTONES.length,
    estimatedDuration
  );

  await supabase.from("milestones").insert(
    DEFAULT_MILESTONES.map((title, i) => ({
      request_id: requestId,
      title,
      sort_order: i + 1,
      status: "amber" as MilestoneStatus,
      due_date: dueDates[i] ?? null,
    }))
  );

  await supabase
    .from("project_requests")
    .update({ status: "in_progress" as RequestStatus })
    .eq("id", requestId);
}

/** Backfill missing due dates so the Gantt matches the provider schedule baseline. */
export async function ensureMilestoneScheduleDates(requestId: string) {
  const supabase = await createClient();
  const { data: milestones } = await supabase
    .from("milestones")
    .select("id, due_date, sort_order")
    .eq("request_id", requestId)
    .order("sort_order");

  if (!milestones?.length) return;
  if (milestones.every((milestone) => milestone.due_date)) return;

  const { signedAt, estimatedDuration } = await getAgreementScheduleContext(requestId);
  const dueDates = computeDefaultMilestoneDueDates(
    signedAt,
    milestones.length,
    estimatedDuration
  );

  await Promise.all(
    milestones.map((milestone, index) => {
      if (milestone.due_date) return Promise.resolve();
      return supabase
        .from("milestones")
        .update({ due_date: dueDates[index] ?? null })
        .eq("id", milestone.id);
    })
  );

  revalidatePath("/client/schedule");
  revalidatePath("/agency/schedule");
  revalidatePath("/client/projects");
  revalidatePath("/agency/projects");
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
  updates: {
    status?: MilestoneStatus;
    status_update?: string;
    title?: string;
    due_date?: string | null;
  }
) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };

  if (
    profile.role !== "agency_owner" &&
    profile.role !== "agency_employee" &&
    profile.role !== "admin"
  ) {
    return { error: "Only providers can update milestones" };
  }

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
  revalidatePath("/client/schedule");
  revalidatePath("/agency/schedule");
  return { success: true };
}

export async function addMilestone(requestId: string, title: string) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };

  if (
    profile.role !== "agency_owner" &&
    profile.role !== "agency_employee" &&
    profile.role !== "admin"
  ) {
    return { error: "Only providers can add milestones" };
  }

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
  revalidatePath("/client/schedule");
  revalidatePath("/agency/schedule");
  return { success: true };
}
