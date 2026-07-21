"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Building2, Globe, LogOut, Menu, X } from "lucide-react";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { localeNames, type Locale } from "@/i18n/config";
import { ROLE_PORTAL, type Profile } from "@/types";
import { signOut } from "@/actions/auth";

const publicNav = [
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
  const isLanding = pathname === "/";

  function handleSignOut() {
    startTransition(() => signOut(locale));
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-lg transition-colors",
        isLanding
          ? "border-border-subtle/80 bg-surface/90"
          : "border-border-subtle bg-surface/90"
      )}
    >
      <div className="container-app flex h-16 items-center justify-between lg:h-[4.5rem]">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-base font-bold tracking-tight text-foreground">{t("appName")}</span>
            <span className="text-xs text-muted">{t("tagline")}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {publicNav.map(({ href, key }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                )}
              >
                {t(key)}
              </Link>
            );
          })}
          {isLanding && (
            <Link
              href="#how-it-works"
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              {t("learnMore")}
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/"
            locale={otherLocale}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-3.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
          >
            <Globe className="h-4 w-4" />
            {localeNames[otherLocale]}
          </Link>

          {profile ? (
            <>
              {portalHref && (
                <Link
                  href={portalHref}
                  className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("dashboard")}
                </Link>
              )}
              <span className="max-w-[140px] truncate text-sm text-muted">{profile.full_name || profile.email}</span>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isPending}
                className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                {t("signOut")}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="inline-flex h-9 items-center justify-center rounded-xl px-3.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                {t("signIn")}
              </Link>
              <Link
                href="/auth/sign-up"
                className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
              >
                {t("getStarted")}
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={t("toggleMenu")}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-border-subtle bg-surface md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <div className="container-app flex flex-col gap-1 py-4">
          {publicNav.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-surface-muted"
            >
              {t(key)}
            </Link>
          ))}
          {isLanding && (
            <Link
              href="#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-surface-muted"
            >
              {t("learnMore")}
            </Link>
          )}
          <div className="my-2 border-t border-border-subtle" />
          {profile ? (
            <>
              {portalHref && (
                <Link href={portalHref} className="rounded-lg px-3 py-2.5 text-sm font-medium">
                  {t("dashboard")}
                </Link>
              )}
              <button type="button" onClick={handleSignOut} className="rounded-lg px-3 py-2.5 text-start text-sm font-medium">
                {t("signOut")}
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/auth/sign-in"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border text-sm font-semibold"
              >
                {t("signIn")}
              </Link>
              <Link
                href="/auth/sign-up"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white"
              >
                {t("getStarted")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
