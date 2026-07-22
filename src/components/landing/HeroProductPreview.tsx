import { useTranslations } from "next-intl";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroProductPreview() {
  const t = useTranslations("landing.heroPreview");

  const quotes = [
    { name: t("quote1Office"), price: t("quote1Price"), selected: true },
    { name: t("quote2Office"), price: t("quote2Price"), selected: false },
    { name: t("quote3Office"), price: t("quote3Price"), selected: false },
  ];

  return (
    <div className="surface-panel overflow-hidden shadow-elevated">
      <div className="border-b border-border-subtle bg-navy px-5 py-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
              {t("requestLabel")}
            </p>
            <p className="mt-1 text-sm font-semibold">{t("requestTitle")}</p>
            <p className="mt-0.5 text-xs text-white/60">{t("requestLocation")}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-success/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            {t("statusActive")}
          </span>
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
          {t("quotationsTitle")}
        </p>
        <ul className="mt-3 space-y-2">
          {quotes.map((q) => (
            <li
              key={q.name}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-sm transition-colors",
                q.selected
                  ? "border-primary/30 bg-primary/5"
                  : "border-border-subtle bg-surface-muted/50"
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                {q.selected ? (
                  <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-border" aria-hidden />
                )}
                <span className={cn("truncate font-medium", q.selected && "text-navy")}>{q.name}</span>
              </span>
              <span className={cn("shrink-0 font-semibold tabular-nums", q.selected ? "text-primary" : "text-muted-foreground")}>
                {q.price}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 rounded-lg border border-border-subtle bg-landing-muted px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{t("milestoneLabel")}</p>
              <p className="mt-1 text-sm font-medium text-navy">{t("milestoneTitle")}</p>
            </div>
            <span className="inline-flex h-7 items-center rounded-md bg-success px-2.5 text-[11px] font-bold text-white">
              {t("milestoneStatus")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
