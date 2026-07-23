"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { EngineeringService } from "@/data/catalog";
import {
  getCategoryLabel,
  getPackageNameByEnglishName,
  getProviderLabel,
} from "@/lib/catalog-i18n";
import { Badge } from "@/components/ui/Badge";

export function MarketplaceServiceCard({ service }: { service: EngineeringService }) {
  const t = useTranslations("marketplacePage");
  const locale = useLocale();

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border-subtle bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover">
      <div className="flex flex-wrap items-start gap-2">
        <h2 className="text-base font-bold leading-snug text-foreground">{service.name}</h2>
        <Badge variant="outline" size="sm">
          {getCategoryLabel(service.category, locale)}
        </Badge>
      </div>

      <p className="mt-2 text-sm text-muted">{getProviderLabel(service.provider, locale)}</p>

      {service.packages.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {service.packages.slice(0, 3).map((p) => (
            <Badge key={p} size="sm">
              {getPackageNameByEnglishName(p, locale)}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-stretch gap-2 border-t border-border-subtle pt-4">
        <Link
          href={`/services/${service.id}`}
          className="inline-flex min-h-10 min-w-0 flex-1 items-center justify-center rounded-xl border border-border px-2 text-center text-xs font-semibold leading-snug text-foreground transition-colors hover:border-primary/30 hover:bg-surface-muted sm:text-sm"
        >
          {t("viewDetails")}
        </Link>
        <Link
          href={`/client/requests/new?service=${service.id}`}
          className="inline-flex min-h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-primary px-3 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark sm:text-sm"
        >
          {t("requestService")}
        </Link>
      </div>
    </article>
  );
}
