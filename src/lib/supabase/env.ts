export class SupabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseConfigError";
  }
}

function normalizeEnvValue(value: string | undefined): string {
  if (!value) return "";
  return value.trim().replace(/^['"]+|['"]+$/g, "");
}

function normalizeSupabaseUrl(raw: string): string {
  if (!raw) return "";

  let url = raw.replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("supabase")) {
      return "";
    }
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return "";
  }
}

function readSupabaseEnv() {
  const url = normalizeSupabaseUrl(
    normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
      normalizeEnvValue(process.env.SUPABASE_URL)
  );
  const key =
    normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    normalizeEnvValue(process.env.SUPABASE_ANON_KEY);

  return { url, key };
}

const PLACEHOLDERS = ["your-project", "your-anon-key", "YOUR_PROJECT"];

export function isSupabaseConfigured(): boolean {
  const { url, key } = readSupabaseEnv();
  if (!url || !key) return false;
  return !PLACEHOLDERS.some((p) => url.includes(p) || key.includes(p));
}

export function getSupabaseEnv() {
  const { url, key } = readSupabaseEnv();

  if (!url || !key || PLACEHOLDERS.some((p) => url.includes(p) || key.includes(p))) {
    throw new SupabaseConfigError(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY " +
        "in your environment (Vercel → Project Settings → Environment Variables), then redeploy."
    );
  }

  return { url, key };
}

export function getSupabaseEnvSafe() {
  try {
    return getSupabaseEnv();
  } catch {
    return null;
  }
}

export function getSupabaseConfigError(err: unknown): string {
  if (err instanceof SupabaseConfigError) return err.message;
  if (err instanceof TypeError && String(err.message).includes("fetch")) {
    return (
      "Supabase connection failed. Check NEXT_PUBLIC_SUPABASE_URL in Vercel environment variables " +
      "(must be https://YOUR_PROJECT.supabase.co), then redeploy."
    );
  }
  if (err instanceof Error) return err.message;
  return "Authentication service is unavailable. Please try again later.";
}
