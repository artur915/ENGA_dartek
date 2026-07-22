"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ENGINEERING_SERVICES,
  SERVICE_CATEGORIES,
  SERVICE_PACKAGES,
} from "@/data/catalog";
import { getServicesForPackage } from "@/lib/catalog-stats";
import {
  getCategoryLabel,
  getPackageNameByEnglishName,
  getProviderLabel,
} from "@/lib/catalog-i18n";
import { MarketplacePackageCard } from "@/components/marketplace/MarketplacePackageCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
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

  const hasServiceFilters = Boolean(category || pkgFilter || provider);

  function resetServiceFilters() {
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-12 w-full rounded-full border border-gray-200 bg-white py-2 ps-11 pe-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          />
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50/40 lg:hidden"
        >
          <Filter className="h-4 w-4" />
          {t("filters")}
        </button>
        <div className="hidden items-center gap-2 lg:flex">
          {tab === "services" && filterControls}
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50/40"
          >
            <Filter className="h-4 w-4" />
            {t("filters")}
          </button>
        </div>
      </div>

      <div className="mt-8 flex gap-8 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setTab("packages")}
          className={cn(
            "inline-flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors",
            tab === "packages"
              ? "border-emerald-700 text-emerald-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          <Box className="h-4 w-4" />
          {t("tabPackages")}
        </button>
        <button
          type="button"
          onClick={() => setTab("services")}
          className={cn(
            "inline-flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors",
            tab === "services"
              ? "border-emerald-700 text-emerald-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          <Wrench className="h-4 w-4" />
          {t("tabServices")}
        </button>
      </div>

      {tab === "packages" ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPackages.map((pkg) => {
            const included = Number(t(`packages.${pkg.slug}.included`));
            const total = Number(t(`packages.${pkg.slug}.total`));
            return (
              <MarketplacePackageCard
                key={pkg.slug}
                pkg={pkg}
                services={getServicesForPackage(pkg.name)}
                included={included}
                total={total}
              />
            );
          })}
        </div>
      ) : (
        <>
          {hasServiceFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={resetServiceFilters}
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                {t("resetFilters")}
              </button>
            </div>
          )}

          <p className="mt-4 text-sm text-gray-500">
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
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <article
                  key={service.id}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-gray-900">{service.name}</h2>
                    <Badge variant="outline" size="sm">
                      {getCategoryLabel(service.category, locale)}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {getProviderLabel(service.provider, locale)}
                  </p>
                  {service.packages.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {service.packages.slice(0, 2).map((p) => (
                        <Badge key={p} size="sm">
                          {getPackageNameByEnglishName(p, locale)}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="mt-5 flex justify-end gap-2">
                    <Link
                      href={`/services/${service.id}`}
                      className="inline-flex h-10 items-center rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      {t("viewDetails")}
                    </Link>
                    <Link
                      href={`/client/requests/new?service=${service.id}`}
                      className="inline-flex h-10 items-center rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
                    >
                      {t("requestService")}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {filtersOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
            aria-label="Close filters"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:inset-x-auto sm:bottom-auto sm:start-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{t("filters")}</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3">{filterControls}</div>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-6 h-11 w-full rounded-xl bg-emerald-700 text-sm font-semibold text-white"
            >
              {t("applyFilters")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
