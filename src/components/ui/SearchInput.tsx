import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, ...props }, ref) => (
    <div className="relative">
      <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        ref={ref}
        type="search"
        value={value}
        className={cn(
          "h-11 w-full rounded-xl border border-border bg-surface py-2.5 ps-10 pe-10 text-sm text-foreground",
          "placeholder:text-muted",
          "transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute end-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:bg-surface-muted hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
);
SearchInput.displayName = "SearchInput";
