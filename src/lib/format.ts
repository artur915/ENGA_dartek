/** Fixed-locale formatting so SSR and client hydration produce the same string. */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Stable numeric formatting for currency display. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-GB").format(value);
}
