"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Building2, Globe, LogOut, Menu, X } from "lucide-react";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { localeNames, type Locale } from "@/i18n/config";
import { ROLE_PORTAL, type Profile } from "@/types";
import { signOut } from "@/actions/auth";
import { ButtonLink } from "@/components/ui/ButtonLink";

const publicNav = [
  { href: "/services", key: "services" as const },
  { href: "/packages", key: "packages" as const },
  { href: "/agencies", key: "engineeringProviders" as const },
  { href: "#how-it-works", key: "howItWorks" as const, anchor: true },
];

export function HeaderClient({ profile }: { profile: Profile | null }) {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const otherLocale = locale === "en" ? "ar" : "en";
  const portalHref = profile ? ROLE_PORTAL[profile.role] : null;
  const isLanding = pathname === "/";

  function handleSignOut() {
    startTransition(() => signOut(locale));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/95 backdrop-blur-md">
      <div className="container-app flex h-14 items-center justify-between gap-4 lg:h-16">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-navy">{t("appName")}</span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label={t("platform")}>
          {publicNav.map(({ href, key, anchor }) => {
            const active =
              !anchor && (pathname === href || pathname.startsWith(href + "/"));
            if (anchor) {
              return isLanding ? (
                <a
                  key={key}
                  href={href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-navy"
                >
                  {t(key)}
                </a>
              ) : (
                <Link
                  key={key}
                  href="/#how-it-works"
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-navy"
                >
                  {t(key)}
                </Link>
              );
            }
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/8 text-primary"
                    : "text-muted-foreground hover:bg-surface-muted hover:text-navy"
                )}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/"
            locale={otherLocale}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/25 hover:text-primary"
            aria-label={t("language")}
          >
            <Globe className="h-4 w-4" />
            {localeNames[otherLocale]}
          </Link>

          {profile ? (
            <>
              {portalHref && (
                <Link
                  href={portalHref}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("dashboard")}
                </Link>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isPending}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-navy"
              >
                <LogOut className="h-4 w-4" />
                {t("signOut")}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="inline-flex h-10 items-center rounded-lg px-3.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-muted hover:text-navy"
              >
                {t("signIn")}
              </Link>
              <ButtonLink href="/client/requests/new" size="sm">
                {t("submitRequest")}
              </ButtonLink>
            </>
          )}
        </div>

        <button
          type="button"
          className="btn-touch flex items-center justify-center rounded-lg border border-border lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? t("closeNav") : t("openNav")}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-border-subtle bg-surface lg:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <nav className="container-app flex flex-col gap-0.5 py-4">
          {publicNav.map(({ href, key, anchor }) =>
            anchor ? (
              isLanding ? (
                <a
                  key={key}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-surface-muted"
                >
                  {t(key)}
                </a>
              ) : (
                <Link
                  key={key}
                  href="/#how-it-works"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-surface-muted"
                >
                  {t(key)}
                </Link>
              )
            ) : (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-surface-muted"
              >
                {t(key)}
              </Link>
            )
          )}
          <div className="my-2 border-t border-border-subtle" />
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
              <ButtonLink href="/client/requests/new" fullWidth onClick={() => setMobileOpen(false)}>
                {t("submitRequest")}
              </ButtonLink>
              <Link
                href="/auth/sign-in"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border text-sm font-semibold"
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
