"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ENGINEERING_SERVICES, SERVICE_CATEGORIES, SERVICE_PACKAGES } from "@/data/catalog";
import {
  getCategoryLabel,
  getPackageNameByEnglishName,
  getProviderLabel,
} from "@/lib/catalog-i18n";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar, FilterChip } from "@/components/ui/FilterChip";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Input";
import { Layers, SlidersHorizontal, X } from "lucide-react";

const PAGE_SIZE = 20;

const PROVIDER_TYPES = Array.from(new Set(ENGINEERING_SERVICES.map((s) => s.provider)));

interface ServicesBrowserProps {
  initialCategory?: string;
  initialQuery?: string;
}

export function ServicesBrowser({ initialCategory, initialQuery }: ServicesBrowserProps) {
  const t = useTranslations("servicesPage");
  const locale = useLocale();
  const [category, setCategory] = useState(initialCategory ?? "");
  const [pkg, setPkg] = useState("");
  const [provider, setProvider] = useState("");
  const [query, setQuery] = useState(initialQuery ?? "");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return ENGINEERING_SERVICES.filter((s) => {
      const matchCat = !category || s.category === category;
      const matchPkg = !pkg || s.packages.includes(pkg);
      const matchProvider = !provider || s.provider === provider;
      const matchQuery =
        !query ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchPkg && matchProvider && matchQuery;
    });
  }, [category, pkg, provider, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hasFilters = Boolean(category || pkg || provider || query);

  function resetFilters() {
    setCategory("");
    setPkg("");
    setProvider("");
    setQuery("");
    setPage(1);
  }

  function updateFilter<T>(setter: (v: T) => void, value: T) {
    setter(value);
    setPage(1);
  }

  const filterControls = (
    <>
      <Select
        value={category}
        onChange={(e) => updateFilter(setCategory, e.target.value)}
        className="w-full sm:w-auto sm:min-w-[180px]"
      >
        <option value="">{t("allCategories")}</option>
        {SERVICE_CATEGORIES.map((c) => (
          <option key={c.name} value={c.name}>
            {getCategoryLabel(c, locale)} ({c.count})
          </option>
        ))}
      </Select>
      <Select
        value={pkg}
        onChange={(e) => updateFilter(setPkg, e.target.value)}
        className="w-full sm:w-auto sm:min-w-[160px]"
      >
        <option value="">{t("allPackages")}</option>
        {SERVICE_PACKAGES.map((p) => (
          <option key={p.slug} value={p.name}>
            {getPackageNameByEnglishName(p.name, locale)}
          </option>
        ))}
      </Select>
      <Select
        value={provider}
        onChange={(e) => updateFilter(setProvider, e.target.value)}
        className="w-full sm:w-auto sm:min-w-[180px]"
      >
        <option value="">{t("allProviders")}</option>
        {PROVIDER_TYPES.map((p) => (
          <option key={p} value={p}>
            {getProviderLabel(p, locale)}
          </option>
        ))}
      </Select>
    </>
  );

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex-1">
          <SearchInput
            placeholder={t("searchPlaceholder")}
            value={query}
            onChange={(e) => updateFilter(setQuery, e.target.value)}
            onClear={() => updateFilter(setQuery, "")}
          />
        </div>
        <div className="hidden items-center gap-2 lg:flex">{filterControls}</div>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {t("filters")}
        </button>
      </div>

      {hasFilters && (
        <FilterBar onReset={resetFilters} resetLabel={t("resetFilters")} className="mt-4">
          {query && <FilterChip label={query} onRemove={() => updateFilter(setQuery, "")} />}
          {category && (
            <FilterChip
              label={getCategoryLabel(category, locale)}
              onRemove={() => updateFilter(setCategory, "")}
            />
          )}
          {pkg && (
            <FilterChip
              label={getPackageNameByEnglishName(pkg, locale)}
              onRemove={() => updateFilter(setPkg, "")}
            />
          )}
          {provider && (
            <FilterChip
              label={getProviderLabel(provider, locale)}
              onRemove={() => updateFilter(setProvider, "")}
            />
          )}
        </FilterBar>
      )}

      <p className="mt-4 text-sm text-muted">
        {t("found", { count: filtered.length })}
        {totalPages > 1 && (
          <span className="ms-2 text-muted-foreground">
            · {t("pageOf", { page: currentPage, total: totalPages })}
          </span>
        )}
      </p>

      {pageItems.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={t("emptyTitle")}
          description={t("emptyDesc")}
          className="mt-8"
          action={
            hasFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-semibold text-primary hover:text-primary-dark"
              >
                {t("resetFilters")}
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
          <ul className="mt-6 divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-subtle bg-surface shadow-card">
            {pageItems.map((service) => (
              <li
                key={service.id}
                className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-foreground">{service.name}</h3>
                    <Badge variant="outline" size="sm">
                      {getCategoryLabel(service.category, locale)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">{getProviderLabel(service.provider, locale)}</p>
                  {service.packages.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {service.packages.slice(0, 2).map((p) => (
                        <Badge key={p} size="sm">
                          {getPackageNameByEnglishName(p, locale)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link
                    href={`/services/${service.id}`}
                    className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
                  >
                    {t("viewDetails")}
                  </Link>
                  <ButtonLink
                    href={`/client/requests/new?service=${service.id}`}
                    variant="primary"
                    size="sm"
                  >
                    {t("requestService")}
                  </ButtonLink>
                </div>
              </li>
            ))}
          </ul>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-8"
          />
        </>
      )}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Close filters"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-surface p-5 shadow-elevated">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{t("filters")}</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-surface-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3">{filterControls}</div>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 h-11 w-full rounded-xl bg-primary text-sm font-semibold text-white"
            >
              {t("applyFilters")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
