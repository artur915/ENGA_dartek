import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { updateSession, isSupabaseConfigured } from "@/lib/supabase/middleware";
import { locales, defaultLocale } from "@/i18n/config";

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

const PROTECTED_PREFIXES = ["/client", "/agency", "/engineer", "/admin"];
const AUTH_ROUTES = ["/auth/sign-in", "/auth/sign-up"];

function stripLocale(pathname: string): { locale: string; path: string } {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  if (locales.includes(maybeLocale as "en" | "ar")) {
    return { locale: maybeLocale, path: "/" + segments.slice(2).join("/") || "/" };
  }
  return { locale: defaultLocale, path: pathname };
}

export async function middleware(request: NextRequest) {
  let response = isSupabaseConfigured()
    ? await updateSession(request)
    : NextResponse.next({ request });

  const { locale, path } = stripLocale(request.nextUrl.pathname);

  if (isSupabaseConfigured()) {
    const { createServerClient } = await import("@supabase/ssr");
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    const isProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p));
    const isAuthRoute = AUTH_ROUTES.some((p) => path.startsWith(p));

    if (isProtected && !user) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/auth/sign-in`;
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }

    if (isAuthRoute && user) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/client`;
      return NextResponse.redirect(url);
    }
  }

  const intlResponse = intlMiddleware(request);
  response.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });
  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
