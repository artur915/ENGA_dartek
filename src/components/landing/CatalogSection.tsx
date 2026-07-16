import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SERVICE_CATEGORIES } from "@/data/catalog";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight } from "lucide-react";

export function CatalogSection() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">{t("catalogTitle")}</h2>
            <p className="mt-2 max-w-2xl text-muted">{t("catalogSubtitle")}</p>
          </div>
          <Link
            href="/services"
            className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:flex"
          >
            {tc("viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {SERVICE_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/services?category=${encodeURIComponent(cat.name)}`}
              className="group rounded-xl border border-border bg-surface p-5 transition-all hover:border-primary hover:shadow-md"
            >
              <Badge className="mb-3">{cat.count} services</Badge>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary line-clamp-2">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
