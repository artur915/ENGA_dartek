import { Link } from "@/i18n/navigation";

export function AuthShell({
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  shellEyebrow,
  shellTitle,
  shellSubtitle,
  shellRegion,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  footer?: React.ReactNode;
  shellEyebrow?: string;
  shellTitle?: string;
  shellSubtitle?: string;
  shellRegion?: string;
}) {
  return (
    <div className="flex min-h-screen bg-landing-bg">
      <div className="relative hidden w-[42%] flex-col justify-between bg-primary p-10 text-white lg:flex xl:p-14">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">ENGA</span>
          </Link>
          <div className="mt-16 max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              {shellEyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight">{shellTitle}</h2>
            <p className="mt-4 text-base leading-relaxed text-white/75">{shellSubtitle}</p>
          </div>
        </div>
        <p className="text-sm text-white/60">{shellRegion}</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-4 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{title}</h1>
              <p className="text-sm text-muted">{subtitle}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-8 shadow-soft sm:p-10">
            <div className="mb-8 hidden lg:block">
              <h1 className="text-2xl font-bold tracking-tight text-navy">{title}</h1>
              <p className="mt-2 text-sm text-muted">{subtitle}</p>
            </div>
            {children}
          </div>
          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
