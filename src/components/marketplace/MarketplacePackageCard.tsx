"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { EngineeringService, ServicePackage } from "@/data/catalog";
import { Badge } from "@/components/ui/Badge";
import { ChevronDown, Package, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPackageAccent } from "@/lib/design-tokens";

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
  const accent = getPackageAccent(pkg.slug);

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-2xl border bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover",
        accent.bg,
        accent.border,
        accent.hoverBorder
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", accent.iconBg)}>
            <Package className="h-5 w-5" />
          </div>
          <h2 className="pt-1 text-lg font-bold leading-snug text-foreground">{name}</h2>
        </div>
        <Badge variant="default" size="sm" className="shrink-0 normal-case tracking-normal">
          {t("includedServices", { included, total })}
        </Badge>
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{description}</p>

      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className="mt-5 flex w-full items-center justify-between gap-2 rounded-xl border border-border-subtle bg-surface-muted px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/25 hover:bg-primary/5"
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          {t("customizeServices")}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-muted transition-transform", expanded && "rotate-180")}
        />
      </button>

      {expanded && (
        <ul className="mt-3 max-h-52 space-y-1.5 overflow-y-auto rounded-xl border border-border-subtle bg-surface-muted/80 p-3">
          {services.map((service) => (
            <li
              key={service.id}
              className="rounded-lg bg-surface px-3 py-2 text-xs leading-relaxed text-muted-foreground"
            >
              {service.name}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex justify-end border-t border-border-subtle pt-4">
        <Link
          href={`/client/requests/new?package=${encodeURIComponent(pkg.name)}`}
          className="inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover"
        >
          {t("selectPackage")}
        </Link>
      </div>
    </article>
  );
}
