import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfigError, getSupabaseEnv } from "./env";

export function createClient() {
  try {
    const { url, key } = getSupabaseEnv();
    return createBrowserClient(url, key);
  } catch (err) {
    throw new Error(getSupabaseConfigError(err));
  }
}
