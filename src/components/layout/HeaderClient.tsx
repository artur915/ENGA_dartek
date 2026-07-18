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
        "sticky top-0 z-50 backdrop-blur-lg transition-colors",
        isLanding
          ? "border-b border-white/10 bg-[#041612]/80"
          : "border-b border-border-subtle bg-surface/90"
      )}
    >
      <div className="container-app flex h-16 items-center justify-between lg:h-[4.5rem]">
        <Link href="/" className="group flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-200 group-hover:scale-105",
              isLanding
                ? "bg-gradient-to-br from-primary-light to-primary shadow-[0_0_20px_rgba(18,122,101,0.4)]"
                : "bg-primary"
            )}
          >
            <Building2 className="h-5 w-5" />
          </div>
          <div className="hidden flex-col sm:flex">
            <span
              className={cn(
                "text-base font-bold tracking-tight",
                isLanding ? "text-white" : "text-foreground"
              )}
            >
              {t("appName")}
            </span>
            <span className={cn("text-xs", isLanding ? "text-white/55" : "text-muted")}>
              {t("tagline")}
            </span>
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
                  isLanding
                    ? active
                      ? "bg-accent/15 text-accent-light"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    : active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                )}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/"
            locale={otherLocale}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-colors",
              isLanding
                ? "border-white/15 text-white/70 hover:border-white/30 hover:text-white"
                : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
            )}
          >
            <Globe className="h-4 w-4" />
            {localeNames[otherLocale]}
          </Link>

          {profile ? (
            <>
              {portalHref && (
                <Link
                  href={portalHref}
                  className={cn(
                    "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                    isLanding ? "text-white/70 hover:text-accent-light" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {t("dashboard")}
                </Link>
              )}
              <span className={cn("max-w-[140px] truncate text-sm", isLanding ? "text-white/55" : "text-muted")}>
                {profile.full_name || profile.email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isPending}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors",
                  isLanding
                    ? "text-white/70 hover:bg-white/10 hover:text-white"
                    : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                )}
              >
                <LogOut className="h-4 w-4" />
                {t("signOut")}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className={cn(
                  "inline-flex h-9 items-center justify-center rounded-xl px-3.5 text-sm font-semibold transition-colors",
                  isLanding
                    ? "text-white/80 hover:bg-white/10 hover:text-white"
                    : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                )}
              >
                {t("signIn")}
              </Link>
              <Link
                href="/auth/sign-up"
                className={cn(
                  "inline-flex h-9 items-center justify-center rounded-xl px-4 text-sm font-semibold shadow-sm transition-all",
                  isLanding
                    ? "bg-gradient-to-r from-accent to-accent-light text-primary-dark hover:shadow-[0_4px_20px_rgba(212,175,55,0.4)]"
                    : "bg-primary text-white hover:bg-primary-dark"
                )}
              >
                {t("getStarted")}
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl border md:hidden",
            isLanding ? "border-white/15 text-white" : "border-border"
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "md:hidden",
          isLanding ? "border-t border-white/10 bg-[#041612]/95" : "border-t border-border-subtle bg-surface",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <div className="container-app flex flex-col gap-1 py-4">
          {publicNav.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium",
                isLanding ? "text-white/80 hover:bg-white/10" : "hover:bg-surface-muted"
              )}
            >
              {t(key)}
            </Link>
          ))}
          <div className={cn("my-2 border-t", isLanding ? "border-white/10" : "border-border-subtle")} />
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
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-xl border text-sm font-semibold",
                  isLanding ? "border-white/20 text-white" : "border-border"
                )}
              >
                {t("signIn")}
              </Link>
              <Link
                href="/auth/sign-up"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold",
                  isLanding
                    ? "bg-gradient-to-r from-accent to-accent-light text-primary-dark"
                    : "bg-primary text-white"
                )}
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
