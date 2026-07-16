"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";

const EMPTY_SUMMARY = {
  projectIncome: 0,
  externalIncome: 0,
  income: 0,
  expenses: 0,
  balance: 0,
};

export async function getFinanceRecords() {
  const profile = await getProfile();
  if (!profile) return { records: [], summary: EMPTY_SUMMARY };

  const supabase = await createClient();
  const { data: agency } = await supabase
    .from("agencies")
    .select("id")
    .eq("owner_id", profile.id)
    .maybeSingle();

  if (!agency) return { records: [], summary: EMPTY_SUMMARY };

  const { data: records } = await supabase
    .from("finance_records")
    .select("*")
    .eq("agency_id", agency.id)
    .order("record_date", { ascending: false });

  const { data: payments } = await supabase
    .from("payments")
    .select("amount, status, request_id")
    .eq("status", "confirmed");

  const { data: agreements } = await supabase
    .from("agreements")
    .select("request_id, quotations(price)")
    .eq("agency_id", agency.id);

  const agreementRequestIds = new Set((agreements ?? []).map((a) => a.request_id));
  let projectIncome = 0;
  for (const p of payments ?? []) {
    if (agreementRequestIds.has(p.request_id)) {
      projectIncome += Number(p.amount);
    }
  }

  let externalIncome = 0;
  let expenses = 0;
  for (const r of records ?? []) {
    if (r.record_type === "project_income" || r.record_type === "external_income") {
      if (r.record_type === "external_income") externalIncome += Number(r.amount);
    } else if (r.record_type === "expense") {
      expenses += Number(r.amount);
    }
  }

  const income = projectIncome + externalIncome;
  return {
    records: records ?? [],
    summary: {
      projectIncome,
      externalIncome,
      income,
      expenses,
      balance: income - expenses,
    },
  };
}

export async function addFinanceRecord(input: {
  record_type: "project_income" | "external_income" | "invoice" | "expense";
  amount: number;
  description?: string;
  record_date?: string;
}) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };

  const supabase = await createClient();
  const { data: agency } = await supabase
    .from("agencies")
    .select("id")
    .eq("owner_id", profile.id)
    .maybeSingle();

  if (!agency) return { error: "Agency not found" };

  const { error } = await supabase.from("finance_records").insert({
    agency_id: agency.id,
    record_type: input.record_type,
    amount: input.amount,
    description: input.description ?? null,
    record_date: input.record_date ?? new Date().toISOString().split("T")[0],
  });

  if (error) return { error: error.message };

  revalidatePath("/agency/finance");
  return { success: true };
}
