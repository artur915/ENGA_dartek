import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Building2, Mail } from "lucide-react";

export function Footer() {
  const t = useTranslations("common");

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-[#020d0a] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(18,122,101,0.15)_0%,_transparent_60%)]" />
      <div className="container-app relative py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-light to-primary shadow-[0_0_30px_rgba(18,122,101,0.3)]">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{t("appName")}</h3>
                <p className="text-xs text-accent-light/80">Engineering Services Marketplace</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60">{t("tagline")}</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/70">
              <Mail className="h-4 w-4 text-accent-light" />
              Kingdom of Saudi Arabia
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-accent-light/90">
              Explore
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              <li>
                <Link href="/services" className="transition-colors hover:text-accent-light">
                  {t("services")}
                </Link>
              </li>
              <li>
                <Link href="/packages" className="transition-colors hover:text-accent-light">
                  {t("packages")}
                </Link>
              </li>
              <li>
                <Link href="/agencies" className="transition-colors hover:text-accent-light">
                  {t("agencies")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-accent-light/90">
              {t("getStarted")}
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              <li>
                <Link href="/auth/sign-up?role=client" className="transition-colors hover:text-accent-light">
                  {t("signUp")}
                </Link>
              </li>
              <li>
                <Link href="/auth/sign-in" className="transition-colors hover:text-accent-light">
                  {t("signIn")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} ENGA — Engineering Services Marketplace
          </p>
          <p className="text-xs">Licensed engineering offices · Built for Saudi Arabia</p>
        </div>
      </div>
    </footer>
  );
}
