"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { EngineeringService, ServicePackage } from "@/data/catalog";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketplacePackageCardProps {
  pkg: ServicePackage;
  services: EngineeringService[];
  included: number;
  total: number;
}

export function MarketplacePackageCard({
  pkg,
  services,
  included,
  total,
}: MarketplacePackageCardProps) {
  const t = useTranslations("marketplacePage");
  const [expanded, setExpanded] = useState(false);

  const name = t(`packages.${pkg.slug}.name`);
  const description = t(`packages.${pkg.slug}.description`);

  return (
    <article className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-bold leading-snug text-gray-900">{name}</h2>
        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          {t("includedServices", { included, total })}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-gray-500">{description}</p>

      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className="mt-5 flex w-full items-center justify-between gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          {t("customizeServices")}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-gray-500 transition-transform", expanded && "rotate-180")}
        />
      </button>

      {expanded && (
        <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50/60 p-3">
          {services.map((service) => (
            <li key={service.id} className="text-xs leading-relaxed text-gray-600">
              {service.name}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex justify-end">
        <Link
          href={`/client/requests/new?package=${encodeURIComponent(pkg.name)}`}
          className="inline-flex h-10 items-center rounded-lg bg-emerald-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
        >
          {t("selectPackage")}
        </Link>
      </div>
    </article>
  );
}
