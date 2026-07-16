"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import type { PaymentStatus, RequestStatus } from "@/types";

export async function getPayments(requestId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("payments")
    .select("*")
    .eq("request_id", requestId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function recordPayment(input: {
  request_id: string;
  amount: number;
  method?: string;
  notes?: string;
}) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };

  const supabase = await createClient();
  const { data: request } = await supabase
    .from("project_requests")
    .select("client_id")
    .eq("id", input.request_id)
    .single();

  if (!request || request.client_id !== profile.id) {
    return { error: "Not authorized" };
  }

  const { error } = await supabase.from("payments").insert({
    request_id: input.request_id,
    amount: input.amount,
    method: input.method ?? "bank_transfer",
    notes: input.notes ?? null,
    status: "pending" as PaymentStatus,
  });

  if (error) return { error: error.message };

  revalidatePath("/client/projects");
  revalidatePath("/agency/projects");
  return { success: true };
}

export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentStatus,
  notes?: string
) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("payments")
    .update({
      status,
      notes: notes ?? null,
      confirmed_at: status === "confirmed" ? new Date().toISOString() : null,
      confirmed_by: status === "confirmed" ? profile.id : null,
    })
    .eq("id", paymentId);

  if (error) return { error: error.message };

  revalidatePath("/client/projects");
  revalidatePath("/agency/projects");
  revalidatePath("/agency/finance");
  return { success: true };
}

export async function closeProject(requestId: string) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };

  const supabase = await createClient();
  const { data: request } = await supabase
    .from("project_requests")
    .select("client_id, status")
    .eq("id", requestId)
    .single();

  if (!request) return { error: "Project not found" };

  const canClose =
    profile.role === "admin" ||
    request.client_id === profile.id ||
    ["agency_owner", "agency_employee", "finance_user"].includes(profile.role);

  if (!canClose) return { error: "Not authorized" };

  const { error } = await supabase
    .from("project_requests")
    .update({ status: "completed" as RequestStatus })
    .eq("id", requestId);

  if (error) return { error: error.message };

  revalidatePath("/client/projects");
  revalidatePath("/agency/projects");
  return { success: true };
}

export async function archiveProject(requestId: string) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };

  const supabase = await createClient();
  const { data: request } = await supabase
    .from("project_requests")
    .select("client_id, status")
    .eq("id", requestId)
    .single();

  if (!request || (request.client_id !== profile.id && profile.role !== "admin")) {
    return { error: "Not authorized" };
  }

  if (request.status !== "completed") {
    return { error: "Project must be completed before archiving" };
  }

  const { error } = await supabase
    .from("project_requests")
    .update({ status: "archived" as RequestStatus })
    .eq("id", requestId);

  if (error) return { error: error.message };

  revalidatePath("/client/projects");
  return { success: true };
}
