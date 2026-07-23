"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { EngineeringService } from "@/data/catalog";
import {
  getAgencyDescription,
  getAgencyDisplayName,
  getAgencyMemberSinceYear,
  type AgencyProfileRecord,
} from "@/lib/agency-profile-display";
import { getCategoryAccent } from "@/lib/design-tokens";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Layers,
  MapPin,
  MessageSquare,
  Send,
  Star,
  Wrench,
} from "lucide-react";

type ProfileTab = "overview" | "services" | "portfolio" | "reviews";

interface AgencyProfileProps {
  agency: AgencyProfileRecord;
  services: EngineeringService[];
}

function CredentialRow({ label }: { label: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
      <span>{label}</span>
    </li>
  );
}

function StatPill({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-border-subtle bg-surface px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary-dark">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold leading-tight text-navy">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}

export function AgencyProfile({ agency, services }: AgencyProfileProps) {
  const t = useTranslations("agenciesPage");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [tab, setTab] = useState<ProfileTab>("overview");

  const displayName = getAgencyDisplayName(agency, locale);
  const description = getAgencyDescription(agency, locale);
  const disciplines = agency.disciplines ?? [];
  const serviceAreas = agency.service_areas ?? [];
  const primaryDiscipline = disciplines[0] ?? t("generalEngineering");
  const memberSince = getAgencyMemberSinceYear(agency);

  const tabs: { id: ProfileTab; label: string }[] = [
    { id: "overview", label: t("tabOverview") },
    { id: "services", label: t("tabServices") },
    { id: "portfolio", label: t("tabPortfolio") },
    { id: "reviews", label: t("tabReviews") },
  ];

  const credentials: string[] = [];
  if (agency.commercial_registration) {
    credentials.push(t("credentialCr", { number: agency.commercial_registration }));
  }
  if (agency.engineering_license) {
    credentials.push(t("credentialEngineering", { number: agency.engineering_license }));
  }
  credentials.push(t("verifiedOnEnga"));

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-6 xl:gap-8">
      {/* Left sidebar */}
      <aside className="lg:col-span-3">
        <div className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-soft lg:sticky lg:top-24">
          <div className="flex items-start gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Building2 className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="flex items-start gap-1.5">
                <h1 className="text-lg font-bold leading-snug text-navy">{displayName}</h1>
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-label={t("verifiedOffice")} />
              </div>
              <p className="mt-1 text-sm font-semibold text-secondary-dark">{primaryDiscipline}</p>
            </div>
          </div>

          <ul className="mt-6 space-y-3 border-t border-border-subtle pt-5">
            {serviceAreas.length > 0 && (
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-muted" />
                <span>{serviceAreas.join(", ")}</span>
              </li>
            )}
            <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0 text-muted" />
              <span>{t("memberSince", { year: memberSince })}</span>
            </li>
            <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <span className="flex h-2 w-2 shrink-0 rounded-full bg-success" aria-hidden />
              <span>{t("availableForProjects")}</span>
            </li>
          </ul>

          <div className="mt-6 border-t border-border-subtle pt-5">
            <h2 className="text-sm font-bold text-navy">{t("verifiedCredentials")}</h2>
            <ul className="mt-3 space-y-2.5">
              {credentials.map((item) => (
                <CredentialRow key={item} label={item} />
              ))}
            </ul>
          </div>

          <Link
            href="/agencies"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover"
          >
            {t("browseAllOffices")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 lg:col-span-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-light via-secondary-light/60 to-surface-muted">
          <div
            className="absolute inset-0 opacity-40"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 80%, rgba(29,78,216,0.12), transparent 50%), radial-gradient(circle at 80% 20%, rgba(13,148,136,0.15), transparent 45%)",
            }}
          />
          <div className="relative aspect-[21/9] min-h-[10rem] sm:min-h-[12rem]" />
          <div className="absolute bottom-4 start-4">
            <Badge variant="success" size="md" className="gap-1.5 shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t("verifiedOffice")}
            </Badge>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">{displayName}</h2>
            {description && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
            )}
          </div>
          <Badge variant="success" size="md" className="shrink-0 gap-1">
            <BadgeCheck className="h-3.5 w-3.5" />
            {t("approved")}
          </Badge>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatPill
            icon={Layers}
            label={t("statDisciplines")}
            value={String(disciplines.length)}
          />
          <StatPill
            icon={MapPin}
            label={t("statRegions")}
            value={String(serviceAreas.length)}
          />
          {agency.indicative_price_from != null && (
            <StatPill
              icon={BarChart3}
              label={t("startingPrice")}
              value={formatCurrency(Number(agency.indicative_price_from), tc("currency"), locale)}
            />
          )}
          <StatPill icon={Calendar} label={t("statMemberSince")} value={String(memberSince)} />
        </div>

        <nav
          className="mt-8 flex gap-1 overflow-x-auto border-b border-border-subtle pb-px"
          aria-label={t("profileSections")}
        >
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
                tab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-8">
          {tab === "overview" && (
            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-bold text-navy">{t("aboutTitle", { name: displayName })}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {description ?? t("aboutFallback")}
                </p>
                {disciplines.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {disciplines.map((discipline) => {
                      const accent = getCategoryAccent("Design");
                      return (
                        <span
                          key={discipline}
                          className={cn(
                            "inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1",
                            accent.badge
                          )}
                        >
                          {discipline}
                        </span>
                      );
                    })}
                  </div>
                )}
              </section>

              {services.length > 0 && (
                <section>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-xl font-bold text-navy">{t("servicesOffered")}</h3>
                    <Link
                      href="/marketplace"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-secondary-dark hover:text-secondary"
                    >
                      {t("exploreMarketplace")}
                      <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                    </Link>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {services.slice(0, 3).map((service) => (
                      <article
                        key={service.id}
                        className="flex flex-col rounded-2xl border border-border-subtle bg-surface p-4 shadow-card"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary-dark">
                          <Wrench className="h-4 w-4" />
                        </div>
                        <h4 className="mt-3 text-sm font-bold text-navy">{service.name}</h4>
                        <p className="mt-1 flex-1 text-xs text-muted">{service.category}</p>
                        <Link
                          href={`/services/${service.id}`}
                          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-secondary-dark hover:text-secondary"
                        >
                          {t("requestService")}
                          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {tab === "services" && (
            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-navy">{t("servicesOffered")}</h3>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-secondary-dark hover:text-secondary"
                >
                  {t("exploreMarketplace")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>
              {services.length === 0 ? (
                <EmptyState
                  icon={Wrench}
                  title={t("servicesEmptyTitle")}
                  description={t("servicesEmptyDesc")}
                  action={
                    <ButtonLink href="/services" variant="outline" size="sm">
                      {tc("browseServices")}
                    </ButtonLink>
                  }
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {services.map((service) => (
                    <article
                      key={service.id}
                      className="flex flex-col rounded-2xl border border-border-subtle bg-surface p-5 shadow-card"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Wrench className="h-4 w-4" />
                      </div>
                      <h4 className="mt-3 font-bold text-navy">{service.name}</h4>
                      <p className="mt-1 text-sm text-muted">{service.category}</p>
                      <Link
                        href={`/services/${service.id}`}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover"
                      >
                        {t("requestService")}
                        <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {tab === "portfolio" && (
            <EmptyState
              icon={Building2}
              title={t("portfolioEmptyTitle")}
              description={t("portfolioEmptyDesc")}
            />
          )}

          {tab === "reviews" && (
            <EmptyState
              icon={Star}
              title={t("reviewsEmptyTitle")}
              description={t("reviewsEmptyDesc")}
            />
          )}
        </div>
      </div>

      {/* Right sidebar */}
      <aside className="lg:col-span-3">
        <div className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-soft">
            <h2 className="text-base font-bold text-navy">{t("workWith", { name: displayName })}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("workWithDesc")}</p>
            <ButtonLink href="/client/requests/new" fullWidth size="md" className="mt-5">
              <Send className="h-4 w-4" />
              {t("requestQuote")}
            </ButtonLink>
            <div className="mt-3 grid gap-2">
              <Link
                href="/services"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                <FileText className="h-4 w-4 text-muted" />
                {t("browseServicesCta")}
              </Link>
              <a
                href="mailto:hello@enga.sa"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                <MessageSquare className="h-4 w-4 text-muted" />
                {t("contactOffice")}
              </a>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-success" />
              {t("responseNote")}
            </p>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-soft">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-secondary-dark" />
              <h2 className="text-base font-bold text-navy">{t("officeHighlights")}</h2>
            </div>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-secondary" />
                <span className="text-muted-foreground">{t("memberSince", { year: memberSince })}</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Layers className="h-4 w-4 text-secondary" />
                <span className="text-muted-foreground">
                  {t("highlightDisciplines", { count: disciplines.length })}
                </span>
              </li>
              {agency.indicative_price_from != null && (
                <li className="flex items-center gap-3 text-sm">
                  <BarChart3 className="h-4 w-4 text-secondary" />
                  <span className="font-semibold text-primary">
                    {formatCurrency(Number(agency.indicative_price_from), tc("currency"), locale)}
                  </span>
                </li>
              )}
              <li className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-muted-foreground">{t("approved")}</span>
              </li>
            </ul>
          </div>

          {disciplines.length > 0 && (
            <div className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-soft">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted" />
                <h2 className="text-base font-bold text-navy">{t("officeSpecialisms")}</h2>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {disciplines.map((discipline) => (
                  <span
                    key={discipline}
                    className="rounded-lg border border-border-subtle bg-surface-muted px-3 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    {discipline}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
