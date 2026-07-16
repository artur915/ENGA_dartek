"use client";

import { useMemo, useState } from "react";
import { ENGINEERING_SERVICES, SERVICE_CATEGORIES } from "@/data/catalog";
import { Badge } from "@/components/ui/Badge";
import { Search } from "lucide-react";

interface ServicesBrowserProps {
  initialCategory?: string;
  initialQuery?: string;
}

export function ServicesBrowser({ initialCategory, initialQuery }: ServicesBrowserProps) {
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
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-border py-2.5 ps-10 pe-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">All categories</option>
          {SERVICE_CATEGORIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} ({c.count})
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-sm text-muted">{filtered.length} services found</p>

      <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-surface">
        {filtered.map((service) => (
          <div key={service.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted">#{service.id}</span>
                <h3 className="font-medium text-foreground">{service.name}</h3>
              </div>
              <p className="mt-1 text-xs text-muted">{service.provider}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{service.category}</Badge>
              {service.packages.slice(0, 2).map((p) => (
                <Badge key={p}>{p}</Badge>
              ))}
              {service.packages.length > 2 && (
                <Badge>+{service.packages.length - 2}</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
