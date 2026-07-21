"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar, FilterChip } from "@/components/ui/FilterChip";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/format";
import { Building2, MapPin, SlidersHorizontal, X } from "lucide-react";

type Agency = {
  id: string;
  name: string;
  description: string | null;
  disciplines: string[];
  service_areas: string[];
  indicative_price_from: number | null;
};

export function AgenciesBrowser({ agencies }: { agencies: Agency[] }) {
  const t = useTranslations("common");
  const tl = useTranslations("landing");
  const ta = useTranslations("agenciesPage");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const regions = useMemo(
    () => Array.from(new Set(agencies.flatMap((a) => a.service_areas ?? []))).sort(),
    [agencies]
  );
  const disciplines = useMemo(
    () => Array.from(new Set(agencies.flatMap((a) => a.disciplines ?? []))).sort(),
    [agencies]
  );

  const filtered = useMemo(() => {
    return agencies.filter((a) => {
      const matchQuery =
        !query ||
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.description?.toLowerCase().includes(query.toLowerCase());
      const matchRegion = !region || a.service_areas?.includes(region);
      const matchDiscipline = !discipline || a.disciplines?.includes(discipline);
      return matchQuery && matchRegion && matchDiscipline;
    });
  }, [agencies, query, region, discipline]);

  const hasFilters = Boolean(query || region || discipline);

  function resetFilters() {
    setQuery("");
    setRegion("");
    setDiscipline("");
  }

  const filterControls = (
    <>
      <Select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full sm:min-w-[160px]">
        <option value="">{ta("allRegions")}</option>
        {regions.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </Select>
      <Select
        value={discipline}
        onChange={(e) => setDiscipline(e.target.value)}
        className="w-full sm:min-w-[160px]"
      >
        <option value="">{ta("allDisciplines")}</option>
        {disciplines.map((d) => (
          <option key={d} value={d}>
            {d}
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
            placeholder={ta("searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery("")}
          />
        </div>
        <div className="hidden gap-2 lg:flex">{filterControls}</div>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {ta("filters")}
        </button>
      </div>

      {hasFilters && (
        <FilterBar onReset={resetFilters} resetLabel={ta("resetFilters")} className="mt-4">
          {query && <FilterChip label={query} onRemove={() => setQuery("")} />}
          {region && <FilterChip label={region} onRemove={() => setRegion("")} />}
          {discipline && <FilterChip label={discipline} onRemove={() => setDiscipline("")} />}
        </FilterBar>
      )}

      <p className="mt-4 text-sm text-muted">{ta("found", { count: filtered.length })}</p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={ta("emptyTitle")}
          description={ta("emptyDesc")}
          className="mt-8"
        />
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((agency) => (
            <article
              key={agency.id}
              className="surface-panel flex flex-col p-5 transition-shadow hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <Badge variant="success" size="sm">
                  {tl("agenciesApproved")}
                </Badge>
              </div>
              <h2 className="mt-4 text-lg font-bold text-foreground">{agency.name}</h2>
              {agency.description && (
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{agency.description}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {agency.disciplines?.slice(0, 3).map((d) => (
                  <Badge key={d} variant="outline" size="sm">
                    {d}
                  </Badge>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="line-clamp-1">{agency.service_areas?.join(", ")}</span>
              </div>
              {agency.indicative_price_from != null && (
                <p className="mt-3 text-sm font-semibold text-primary">
                  {tl("agenciesFrom")}{" "}
                  {formatCurrency(Number(agency.indicative_price_from), t("currency"), locale)}
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-2 border-t border-border-subtle pt-4">
                <Link
                  href={`/agencies/${agency.id}`}
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-border text-sm font-semibold hover:bg-surface-muted"
                >
                  {ta("viewProfile")}
                </Link>
                <Link
                  href="/client/requests/new"
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  {ta("requestQuote")}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-surface p-5">
            <div className="mb-4 flex justify-between">
              <h2 className="font-bold">{ta("filters")}</h2>
              <button type="button" onClick={() => setMobileFiltersOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3">{filterControls}</div>
          </div>
        </div>
      )}
    </div>
  );
}
