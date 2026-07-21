import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Building2, Mail } from "lucide-react";

export function Footer() {
  const t = useTranslations("common");
  const tf = useTranslations("landing.footer");

  return (
    <footer className="mt-auto border-t border-border-subtle bg-surface">
      <div className="container-app py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{t("appName")}</h3>
                <p className="text-xs text-muted">{t("tagline")}</p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{t("tagline")}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-muted px-4 py-2.5 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" />
              {tf("region")}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-primary">{tf("explore")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li>
                <Link href="/services" className="transition-colors hover:text-primary">
                  {t("services")}
                </Link>
              </li>
              <li>
                <Link href="/packages" className="transition-colors hover:text-primary">
                  {t("packages")}
                </Link>
              </li>
              <li>
                <Link href="/agencies" className="transition-colors hover:text-primary">
                  {t("agencies")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-primary">{t("getStarted")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li>
                <Link href="/auth/sign-up?role=client" className="transition-colors hover:text-primary">
                  {t("signUp")}
                </Link>
              </li>
              <li>
                <Link href="/auth/sign-in" className="transition-colors hover:text-primary">
                  {t("signIn")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border-subtle pt-8 text-sm text-muted sm:flex-row">
          <p>{tf("copyright")}</p>
          <p className="text-xs">{tf("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
