/** Locale-aware formatting; pass locale for Arabic UI labels and numerals. */
function resolveLocale(locale?: string): string {
  return locale === "ar" ? "ar-SA" : "en-GB";
}

export function formatDateTime(iso: string, locale?: string): string {
  return new Date(iso).toLocaleString(resolveLocale(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function formatDate(iso: string, locale?: string): string {
  return new Date(iso).toLocaleDateString(resolveLocale(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatNumber(value: number, locale?: string): string {
  return new Intl.NumberFormat(resolveLocale(locale)).format(value);
}

export function formatCurrency(value: number, currencyLabel: string, locale?: string): string {
  const formatted = formatNumber(value, locale);
  return locale === "ar" ? `${formatted} ${currencyLabel}` : `${currencyLabel} ${formatted}`;
}
