"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  ENGINEERING_SERVICES,
  SERVICE_CATEGORIES,
  SERVICE_PACKAGES,
} from "@/data/catalog";
import { getServicesForPackage } from "@/lib/catalog-stats";
import { getPackageDisplayCounts } from "@/lib/marketplace-display";
import {
  getCategoryLabel,
  getPackageNameByEnglishName,
  getProviderLabel,
} from "@/lib/catalog-i18n";
import { MarketplacePackageCard } from "@/components/marketplace/MarketplacePackageCard";
import { MarketplaceServiceCard } from "@/components/marketplace/MarketplaceServiceCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar, FilterChip } from "@/components/ui/FilterChip";
import { Select } from "@/components/ui/Input";
import { Box, Filter, Layers, Search, Wrench, X } from "lucide-react";
import { cn } from "@/lib/utils";

type MarketplaceTab = "packages" | "services";

const PROVIDER_TYPES = Array.from(new Set(ENGINEERING_SERVICES.map((s) => s.provider)));

export function MarketplaceBrowser() {
  const t = useTranslations("marketplacePage");
  const locale = useLocale();
  const [tab, setTab] = useState<MarketplaceTab>("packages");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [pkgFilter, setPkgFilter] = useState("");
  const [provider, setProvider] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredPackages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SERVICE_PACKAGES;

    return SERVICE_PACKAGES.filter((pkg) => {
      const name = t(`packages.${pkg.slug}.name`).toLowerCase();
      const description = t(`packages.${pkg.slug}.description`).toLowerCase();
      return name.includes(q) || description.includes(q) || pkg.name.toLowerCase().includes(q);
    });
  }, [query, t]);

  const filteredServices = useMemo(() => {
    return ENGINEERING_SERVICES.filter((service) => {
      const matchCat = !category || service.category === category;
      const matchPkg = !pkgFilter || service.packages.includes(pkgFilter);
      const matchProvider = !provider || service.provider === provider;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        service.name.toLowerCase().includes(q) ||
        service.category.toLowerCase().includes(q) ||
        service.packages.some((p) => p.toLowerCase().includes(q));
      return matchCat && matchPkg && matchProvider && matchQuery;
    });
  }, [category, pkgFilter, provider, query]);

  const hasFilters = Boolean(query || category || pkgFilter || provider);

  function resetFilters() {
    setQuery("");
    setCategory("");
    setPkgFilter("");
    setProvider("");
  }

  const filterControls = (
    <>
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full sm:min-w-[180px]"
      >
        <option value="">{t("allCategories")}</option>
        {SERVICE_CATEGORIES.map((c) => (
          <option key={c.name} value={c.name}>
            {getCategoryLabel(c, locale)} ({c.count})
          </option>
        ))}
      </Select>
      <Select
        value={pkgFilter}
        onChange={(e) => setPkgFilter(e.target.value)}
        className="w-full sm:min-w-[160px]"
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
        onChange={(e) => setProvider(e.target.value)}
        className="w-full sm:min-w-[180px]"
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
      <div className="rounded-2xl border border-border-subtle bg-surface-muted/60 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-12 w-full rounded-full border border-border bg-surface py-2 ps-11 pe-4 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 lg:hidden"
          >
            <Filter className="h-4 w-4 text-primary" />
            {t("filters")}
          </button>
          <div className="hidden items-center gap-2 lg:flex">
            {tab === "services" && filterControls}
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <Filter className="h-4 w-4 text-primary" />
              {t("filters")}
            </button>
          </div>
        </div>
      </div>

      {hasFilters && tab === "services" && (
        <FilterBar onReset={resetFilters} resetLabel={t("resetFilters")} className="mt-4">
          {query && <FilterChip label={query} onRemove={() => setQuery("")} />}
          {category && (
            <FilterChip
              label={getCategoryLabel(category, locale)}
              onRemove={() => setCategory("")}
            />
          )}
          {pkgFilter && (
            <FilterChip
              label={getPackageNameByEnglishName(pkgFilter, locale)}
              onRemove={() => setPkgFilter("")}
            />
          )}
          {provider && (
            <FilterChip
              label={getProviderLabel(provider, locale)}
              onRemove={() => setProvider("")}
            />
          )}
        </FilterBar>
      )}

      <div className="mt-8 flex gap-6 border-b border-border-subtle">
        <button
          type="button"
          onClick={() => setTab("packages")}
          className={cn(
            "inline-flex items-center gap-2 border-b-2 pb-3.5 text-sm font-semibold transition-colors",
            tab === "packages"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-foreground"
          )}
        >
          <Box className="h-4 w-4" />
          {t("tabPackages")}
        </button>
        <button
          type="button"
          onClick={() => setTab("services")}
          className={cn(
            "inline-flex items-center gap-2 border-b-2 pb-3.5 text-sm font-semibold transition-colors",
            tab === "services"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-foreground"
          )}
        >
          <Wrench className="h-4 w-4" />
          {t("tabServices")}
        </button>
      </div>

      {tab === "packages" ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPackages.map((pkg) => {
            const services = getServicesForPackage(pkg.name);
            const { included, total } = getPackageDisplayCounts(pkg.slug, services.length);
            return (
              <MarketplacePackageCard
                key={pkg.slug}
                pkg={pkg}
                services={services}
                included={included}
                total={total}
              />
            );
          })}
        </div>
      ) : (
        <>
          <p className="mt-5 text-sm font-medium text-muted">
            {t("foundServices", { count: filteredServices.length })}
          </p>

          {filteredServices.length === 0 ? (
            <EmptyState
              icon={Layers}
              title={t("emptyTitle")}
              description={t("emptyDesc")}
              className="mt-8"
            />
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredServices.map((service) => (
                <MarketplaceServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </>
      )}

      {filtersOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
            aria-label="Close filters"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-surface p-5 shadow-elevated sm:inset-x-auto sm:bottom-auto sm:start-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">{t("filters")}</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-surface-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3">{filterControls}</div>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-6 h-11 w-full rounded-xl bg-primary text-sm font-semibold text-white hover:bg-primary-dark"
            >
              {t("applyFilters")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
