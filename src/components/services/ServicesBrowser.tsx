"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { ENGINEERING_SERVICES, SERVICE_CATEGORIES } from "@/data/catalog";
import { getCategoryLabel, getProviderLabel, getPackageNameByEnglishName } from "@/lib/catalog-i18n";
import { Badge } from "@/components/ui/Badge";
import { Search } from "lucide-react";

interface ServicesBrowserProps {
  initialCategory?: string;
  initialQuery?: string;
}

export function ServicesBrowser({ initialCategory, initialQuery }: ServicesBrowserProps) {
  const t = useTranslations("servicesPage");
  const locale = useLocale();
  const [category, setCategory] = useState(initialCategory ?? "");
  const [query, setQuery] = useState(initialQuery ?? "");

  const filtered = useMemo(() => {
    return ENGINEERING_SERVICES.filter((s) => {
      const matchCat = !category || s.category === category;
      const matchQuery =
        !query ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [category, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder={t("searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-border py-2.5 ps-10 pe-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">{t("allCategories")}</option>
          {SERVICE_CATEGORIES.map((c) => (
            <option key={c.name} value={c.name}>
              {getCategoryLabel(c, locale)} ({c.count})
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-sm text-muted">{t("found", { count: filtered.length })}</p>

      <div className="mt-6 divide-y divide-border rounded-2xl border border-border-subtle bg-surface shadow-card">
        {filtered.map((service) => (
          <div key={service.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted">#{service.id}</span>
                <h3 className="font-medium text-foreground">{service.name}</h3>
              </div>
              <p className="mt-1 text-xs text-muted">{getProviderLabel(service.provider, locale)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{getCategoryLabel(service.category, locale)}</Badge>
              {service.packages.slice(0, 2).map((p) => (
                <Badge key={p}>{getPackageNameByEnglishName(p, locale)}</Badge>
              ))}
              {service.packages.length > 2 && <Badge>+{service.packages.length - 2}</Badge>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
