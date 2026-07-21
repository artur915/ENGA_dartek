"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { resolveAuthError } from "@/lib/auth-errors";
import { type UserRole } from "@/types";

export type AuthActionResult =
  | { success: true; needsConfirmation?: boolean; role?: UserRole }
  | { error: string };

export async function signUp(input: {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  redirectOrigin: string;
}): Promise<AuthActionResult> {
  try {
    if (input.role === "individual_engineer") {
      return { error: "engineerUnavailable" };
    }

    const supabase = await createClient();
    const origin = input.redirectOrigin.replace(/\/+$/, "");

    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: {
        data: { full_name: input.fullName.trim(), role: input.role },
        emailRedirectTo: `${origin}/auth/callback?next=/en/client`,
      },
    });

    if (error) return { error: resolveAuthError(error.message) };

    if (!data.session) {
      return { success: true, needsConfirmation: true, role: input.role };
    }

    return { success: true, role: input.role };
  } catch (err) {
    return { error: "authUnavailable" };
  }
}

export async function signIn(input: {
  email: string;
  password: string;
}): Promise<AuthActionResult> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email.trim(),
      password: input.password,
    });

    if (error) return { error: resolveAuthError(error.message) };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    const role =
      (profile?.role as UserRole) ??
      (data.user.user_metadata?.role as UserRole) ??
      "client";

    return { success: true, role };
  } catch (err) {
    return { error: "authUnavailable" };
  }
}

export async function signOut(locale: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}/auth/sign-in`);
}
