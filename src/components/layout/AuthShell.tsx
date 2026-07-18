export function AuthShell({
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -end-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -start-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-border-subtle bg-surface p-8 shadow-elevated sm:p-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{title}</h1>
              <p className="text-sm text-muted">{subtitle}</p>
            </div>
          </div>
          {children}
        </div>
        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>
  );
}
