import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { redirect } from "@/i18n/navigation";
import { ROLE_PORTAL, type Profile, type UserRole } from "@/types";

export async function getSession() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile) return profile as Profile;

  return {
    id: user.id,
    email: user.email ?? "",
    full_name: user.user_metadata?.full_name ?? null,
    phone: null,
    role: (user.user_metadata?.role as UserRole) ?? "client",
    locale: "en",
    avatar_url: null,
  };
}

export async function requireAuth(locale: string) {
  const profile = await getProfile();
  if (!profile) {
    redirect({ href: "/auth/sign-in", locale });
  }
  return profile!;
}

export async function requireRole(locale: string, roles: UserRole[]) {
  const profile = await requireAuth(locale);
  if (!roles.includes(profile.role)) {
    redirect({ href: ROLE_PORTAL[profile.role], locale });
  }
  return profile;
}

export async function getAgencyForOwner(userId: string) {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("agencies")
    .select("*")
    .eq("owner_id", userId)
    .maybeSingle();
  return data;
}
