import { useTranslations } from "next-intl";
import { FileText, Globe, Layers, ShieldCheck } from "lucide-react";

const icons = [Layers, FileText, ShieldCheck, Globe];

export function TrustSection() {
  const t = useTranslations("landing");
  const items = t.raw("trustItems") as Record<string, string>;
  const keys = Object.keys(items);

  return (
    <section className="border-y border-border-subtle bg-surface">
      <div className="container-app py-8 sm:py-10">
        <p className="text-center text-sm font-semibold text-muted-foreground">{t("trustTitle")}</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {keys.map((key, i) => {
            const Icon = icons[i] ?? Layers;
            return (
              <li
                key={key}
                className="flex items-start gap-3 rounded-xl border border-border-subtle bg-landing-bg px-4 py-3.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium leading-snug text-foreground">{items[key]}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
