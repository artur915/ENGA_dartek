"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Building2, Globe, Mail } from "lucide-react";
import { localeNames, type Locale } from "@/i18n/config";
import { useLocale } from "next-intl";

export function Footer() {
  const t = useTranslations("common");
  const tf = useTranslations("landing.footer");
  const locale = useLocale() as Locale;
  const otherLocale = locale === "en" ? "ar" : "en";

  return (
    <footer className="mt-auto gradient-footer text-footer-fg">
      <div className="container-app py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-white">{t("appName")}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">{tf("description")}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-slate-200">
              <Mail className="h-4 w-4 text-secondary-light" />
              {tf("region")}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-secondary-light">{tf("platform")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
              <li><Link href="/services" className="transition-colors hover:text-white">{t("services")}</Link></li>
              <li><Link href="/packages" className="transition-colors hover:text-white">{t("packages")}</Link></li>
              <li><Link href="/agencies" className="transition-colors hover:text-white">{t("engineeringProviders")}</Link></li>
              <li><a href="#how-it-works" className="transition-colors hover:text-white">{t("howItWorks")}</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-secondary-light">{tf("company")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
              <li><Link href="/#benefits-clients" className="transition-colors hover:text-white">{tf("about")}</Link></li>
              <li><a href="mailto:hello@enga.sa" className="transition-colors hover:text-white">{tf("contact")}</a></li>
              <li><span className="text-slate-500">{tf("privacy")}</span></li>
              <li><span className="text-slate-500">{tf("terms")}</span></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-secondary-light">{t("getStarted")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/client/requests/new" className="font-semibold text-white transition-colors hover:text-secondary-light">
                  {t("submitRequest")}
                </Link>
              </li>
              <li>
                <Link href="/auth/sign-up?role=agency_owner" className="transition-colors hover:text-white">
                  {tf("joinProvider")}
                </Link>
              </li>
              <li>
                <Link href="/auth/sign-in" className="transition-colors hover:text-white">{t("signIn")}</Link>
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-2">
              <Globe className="h-4 w-4 text-secondary-light" />
              <Link
                href="/"
                locale={otherLocale}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/30 hover:text-white"
              >
                {localeNames[otherLocale]}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-sm text-slate-400 sm:flex-row">
          <p>{tf("copyright")}</p>
          <p className="text-xs">{tf("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
