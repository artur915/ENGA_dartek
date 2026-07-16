import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("common");

  return (
    <footer className="border-t border-border bg-primary-dark text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-white">{t("appName")}</h3>
            <p className="mt-2 text-sm">{t("tagline")}</p>
          </div>
          <div>
            <h4 className="font-semibold text-white">{t("services")}</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-white">{t("services")}</Link></li>
              <li><Link href="/packages" className="hover:text-white">{t("packages")}</Link></li>
              <li><Link href="/agencies" className="hover:text-white">{t("agencies")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">{t("getStarted")}</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/auth/sign-up?role=client" className="hover:text-white">{t("signUp")}</Link></li>
              <li><Link href="/auth/sign-in" className="hover:text-white">{t("signIn")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm">
          © {new Date().getFullYear()} ENGA — Engineering Services Marketplace MVP
        </div>
      </div>
    </footer>
  );
}
