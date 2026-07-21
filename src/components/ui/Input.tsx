import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      suppressHydrationWarning
      className={cn(
        "h-11 w-full rounded-xl border bg-surface px-4 text-sm text-foreground",
        "placeholder:text-muted/70",
        "transition-colors duration-200",
        "focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }
>(({ className, error, ...props }, ref) => (
  <textarea
    ref={ref}
    suppressHydrationWarning
    className={cn(
      "w-full rounded-xl border bg-surface px-4 py-3 text-sm text-foreground",
      "placeholder:text-muted/70",
      "transition-colors duration-200",
      "focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
      error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }
>(({ className, error, children, ...props }, ref) => (
  <select
    ref={ref}
    suppressHydrationWarning
    className={cn(
      "h-11 w-full rounded-xl border bg-surface px-4 text-sm text-foreground",
      "transition-colors duration-200",
      "focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
      error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export function Label({
  children,
  className,
  required,
}: {
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <label className={cn("mb-2 block text-sm font-medium text-foreground", className)}>
      {children}
      {required && <span className="ms-1 text-danger">*</span>}
    </label>
  );
}

export function FormField({
  label,
  required,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-0", className)}>
      <Label required={required}>{label}</Label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
