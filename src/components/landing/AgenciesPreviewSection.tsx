import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getApprovedAgencies } from "@/actions/agency";
import { Building2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import {
  LandingCard,
  LandingSection,
  LandingSectionHeader,
  LandingViewAllLink,
} from "@/components/landing/LandingSection";
import { formatCurrency } from "@/lib/format";

export async function AgenciesPreviewSection() {
  const t = await getTranslations("landing");
  const tc = await getTranslations("common");
  const locale = await getLocale();
  const agencies = await getApprovedAgencies();
  const preview = agencies.slice(0, 6);

  return (
    <LandingSection variant="muted" id="agencies">
      <LandingSectionHeader
        badge={t("agenciesBadge")}
        title={t("agenciesTitle")}
        description={t("agenciesDescription")}
        align="start"
        action={<LandingViewAllLink href="/agencies" label={tc("viewAll")} />}
      />

      {preview.length === 0 ? (
        <LandingCard className="mx-auto max-w-xl text-center">
          <Building2 className="mx-auto h-10 w-10 text-muted" />
          <p className="mt-4 text-muted-foreground">{t("agenciesEmpty")}</p>
          <p className="mt-2 text-sm text-muted">{t("agenciesEmptyHint")}</p>
          <ButtonLink href="/auth/sign-up?role=agency_owner" variant="outline" size="sm" className="mt-6">
            {t("ctaJoinProvider")}
          </ButtonLink>
        </LandingCard>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((agency) => (
            <LandingCard key={agency.id} className="flex h-full flex-col">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-landing-muted text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <Badge variant="outline" size="sm">
                  {t("agenciesRegistered")}
                </Badge>
              </div>
              <h3 className="text-base font-bold text-navy">{agency.name}</h3>
              {agency.description && (
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{agency.description}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {agency.disciplines?.slice(0, 2).map((d: string) => (
                  <Badge key={d} variant="outline" size="sm">
                    {d}
                  </Badge>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="line-clamp-1">{agency.service_areas?.join(", ")}</span>
              </div>
              {agency.indicative_price_from != null && (
                <p className="mt-3 text-sm font-semibold text-primary">
                  {t("agenciesFrom")}{" "}
                  {formatCurrency(Number(agency.indicative_price_from), tc("currency"), locale)}
                </p>
              )}
              <div className="mt-5 flex items-stretch gap-2 border-t border-border-subtle pt-4">
                <Link
                  href={`/agencies/${agency.id}`}
                  className="inline-flex min-h-10 min-w-0 flex-1 items-center justify-center rounded-lg border border-border px-2 text-center text-xs font-semibold leading-snug text-navy transition-colors hover:border-primary/30 hover:text-primary sm:text-sm"
                >
                  {t("agenciesViewProfile")}
                </Link>
                <Link
                  href="/client/requests/new"
                  className="inline-flex min-h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-primary px-3 text-xs font-semibold text-white transition-colors hover:bg-primary-dark sm:text-sm"
                >
                  {t("agenciesRequestQuote")}
                </Link>
              </div>
            </LandingCard>
          ))}
        </div>
      )}
    </LandingSection>
  );
}
