import { createClient } from "@/lib/supabase/server";
import { computeDefaultMilestoneDueDates } from "@/lib/project-schedule";

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
}
