import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav
      className={cn("flex items-center justify-center gap-1", className)}
      aria-label="Pagination"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="btn-touch inline-flex items-center justify-center rounded-xl border border-border bg-surface px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-muted disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
      </button>

      {visible.map((p, i) => {
        const prev = visible[i - 1];
        const showEllipsis = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1">
            {showEllipsis && <span className="px-1 text-muted">…</span>}
            <button
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "inline-flex h-11 min-w-11 items-center justify-center rounded-xl px-3 text-sm font-semibold transition-colors",
                p === page
                  ? "bg-primary text-white shadow-sm"
                  : "border border-border bg-surface text-muted-foreground hover:bg-surface-muted"
              )}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="btn-touch inline-flex items-center justify-center rounded-xl border border-border bg-surface px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-muted disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
      </button>
    </nav>
  );
}
