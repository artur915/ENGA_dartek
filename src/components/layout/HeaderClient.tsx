"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Building2, Globe, Menu, X, LogOut } from "lucide-react";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { localeNames, type Locale } from "@/i18n/config";
import { ROLE_PORTAL, type Profile } from "@/types";
import { signOut } from "@/actions/auth";

export function HeaderClient({ profile }: { profile: Profile | null }) {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const otherLocale = locale === "en" ? "ar" : "en";

  function handleSignOut() {
    startTransition(() => signOut(locale));
  }

  const portalHref = profile ? ROLE_PORTAL[profile.role] : null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight text-primary">{t("appName")}</span>
            <span className="text-xs text-muted">{t("tagline")}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/services" className="text-sm font-medium hover:text-primary">{t("services")}</Link>
          <Link href="/packages" className="text-sm font-medium hover:text-primary">{t("packages")}</Link>
          <Link href="/agencies" className="text-sm font-medium hover:text-primary">{t("agencies")}</Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/"
            locale={otherLocale}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted hover:border-primary hover:text-primary"
          >
            <Globe className="h-4 w-4" />
            {localeNames[otherLocale]}
          </Link>

          {profile ? (
            <>
              {portalHref && (
                <Link href={portalHref} className="text-sm font-medium hover:text-primary">
                  {t("dashboard")}
                </Link>
              )}
              <span className="text-sm text-muted">{profile.full_name || profile.email}</span>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isPending}
                className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"
              >
                <LogOut className="h-4 w-4" />
                {t("signOut")}
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/sign-in" className="text-sm font-medium hover:text-primary">{t("signIn")}</Link>
              <Link href="/auth/sign-up" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
                {t("getStarted")}
              </Link>
            </>
          )}
        </div>

        <button type="button" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className={cn("border-t border-border bg-surface md:hidden", mobileOpen ? "block" : "hidden")}>
        <div className="flex flex-col gap-2 px-4 py-4">
          <Link href="/services" className="py-2 text-sm font-medium">{t("services")}</Link>
          <Link href="/packages" className="py-2 text-sm font-medium">{t("packages")}</Link>
          <Link href="/agencies" className="py-2 text-sm font-medium">{t("agencies")}</Link>
          {profile ? (
            <>
              {portalHref && <Link href={portalHref} className="py-2 text-sm font-medium">{t("dashboard")}</Link>}
              <button type="button" onClick={handleSignOut} className="py-2 text-start text-sm font-medium">{t("signOut")}</button>
            </>
          ) : (
            <>
              <Link href="/auth/sign-in" className="py-2 text-sm font-medium">{t("signIn")}</Link>
              <Link href="/auth/sign-up" className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white">{t("getStarted")}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
