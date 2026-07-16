import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SERVICE_PACKAGES } from "@/data/catalog";
import { Card } from "@/components/ui/Card";
import { ArrowRight, Package } from "lucide-react";

export function PackagesSection() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");

  return (
    <section className="bg-surface-muted py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">{t("packagesTitle")}</h2>
            <p className="mt-2 max-w-2xl text-muted">{t("packagesSubtitle")}</p>
          </div>
          <Link
            href="/packages"
            className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:flex"
          >
            {tc("viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_PACKAGES.map((pkg) => (
            <Card key={pkg.slug} hover>
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
                <Package className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{pkg.name}</h3>
              <p className="mt-2 text-sm text-muted line-clamp-2">{pkg.description}</p>
              <p className="mt-3 text-xs text-primary font-medium">{pkg.categories}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
