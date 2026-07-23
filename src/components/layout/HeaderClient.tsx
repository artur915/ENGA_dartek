"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Building2, Globe, LogOut, MapPin, Menu, X } from "lucide-react";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { localeNames, type Locale } from "@/i18n/config";
import { ROLE_PORTAL, type Profile } from "@/types";
import { signOut } from "@/actions/auth";
import { ButtonLink } from "@/components/ui/ButtonLink";

const publicNav = [
  { href: "/", key: "home" as const, exact: true },
  { href: "/marketplace", key: "marketplace" as const },
  { href: "/services", key: "services" as const },
  { href: "/packages", key: "packages" as const },
  { href: "/agencies", key: "agencies" as const },
];

export function HeaderClient({ profile }: { profile: Profile | null }) {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const otherLocale = locale === "en" ? "ar" : "en";
  const portalHref = profile ? ROLE_PORTAL[profile.role] : null;

  function handleSignOut() {
    startTransition(() => signOut(locale));
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-transform group-hover:scale-[1.02]">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <span className="block text-base font-bold tracking-tight text-navy">{t("appName")}</span>
            <span className="block text-xs text-muted">{t("logoTagline")}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label={t("platform")}>
          {publicNav.map(({ href, key, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "nav-active bg-primary/8" : "nav-link"
                )}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-4 w-4 text-secondary" />
            {t("location")}
          </span>

          <Link
            href="/"
            locale={otherLocale}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-primary"
            aria-label={t("language")}
          >
            <Globe className="h-4 w-4" />
            {localeNames[otherLocale]}
          </Link>

          {profile ? (
            <>
              {portalHref && (
                <Link href={portalHref} className="rounded-lg px-3 py-2 text-sm font-medium nav-link">
                  {t("dashboard")}
                </Link>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isPending}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                {t("signOut")}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                {t("signIn")}
              </Link>
              <ButtonLink href="/auth/sign-up" size="sm">
                {t("signUp")}
              </ButtonLink>
            </>
          )}
        </div>

        <button
          type="button"
          className="btn-touch flex items-center justify-center rounded-xl border border-border text-foreground lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? t("closeNav") : t("openNav")}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-border bg-surface lg:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <nav className="container-app flex flex-col gap-0.5 py-4">
          {publicNav.map(({ href, key }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-3 text-sm font-medium",
                  active ? "bg-primary/8 text-primary" : "hover:bg-surface-muted"
                )}
              >
                {t(key)}
              </Link>
            );
          })}
          <div className="my-2 border-t border-border" />
          <p className="flex items-center gap-2 px-3 py-2 text-sm text-muted">
            <MapPin className="h-4 w-4 text-secondary" />
            {t("location")}
          </p>
          <Link
            href="/"
            locale={otherLocale}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium hover:bg-surface-muted"
          >
            <Globe className="h-4 w-4" />
            {localeNames[otherLocale]}
          </Link>
          {profile ? (
            <>
              {portalHref && (
                <Link href={portalHref} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium">
                  {t("dashboard")}
                </Link>
              )}
              <button type="button" onClick={handleSignOut} className="rounded-lg px-3 py-3 text-start text-sm font-medium">
                {t("signOut")}
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <ButtonLink href="/auth/sign-up" fullWidth onClick={() => setMobileOpen(false)}>
                {t("signUp")}
              </ButtonLink>
              <Link
                href="/auth/sign-in"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border text-sm font-semibold"
              >
                {t("signIn")}
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
