import { useTranslations } from "next-intl";
import { FileText, Globe, Layers, ShieldCheck } from "lucide-react";

const icons = [Layers, FileText, ShieldCheck, Globe];

export function TrustSection() {
  const t = useTranslations("landing");
  const items = t.raw("trustItems") as Record<string, { title: string; description: string }>;
  const keys = Object.keys(items);

  return (
    <section className="border-b border-border-subtle bg-surface" aria-label={t("trustTitle")}>
      <div className="container-app py-10 sm:py-12">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.12em] text-muted">
          {t("trustTitle")}
        </p>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {keys.map((key, i) => {
            const Icon = icons[i] ?? Layers;
            const item = items[key];
            return (
              <li key={key} className="text-center sm:text-start">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-landing-muted text-primary sm:mx-0">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="mt-3 text-sm font-semibold text-navy">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
