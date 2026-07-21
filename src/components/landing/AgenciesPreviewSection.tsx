import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getApprovedAgencies } from "@/actions/agency";
import { Building2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import {
  LandingCard,
  LandingSection,
  LandingSectionHeader,
  LandingViewAllLink,
} from "@/components/landing/LandingSection";
import { formatNumber } from "@/lib/format";

export async function AgenciesPreviewSection() {
  const t = await getTranslations("landing");
  const tc = await getTranslations("common");
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
        <LandingCard className="text-center">
          <p className="text-muted">{t("agenciesEmpty")}</p>
        </LandingCard>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((agency) => (
            <Link key={agency.id} href={`/agencies/${agency.id}`} className="block h-full">
              <LandingCard className="flex h-full flex-col">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <Badge variant="success">{t("agenciesApproved")}</Badge>
                </div>
                <h3 className="text-base font-bold text-navy">{agency.name}</h3>
                {agency.description && (
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{agency.description}</p>
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
                    {t("agenciesFrom")} SAR {formatNumber(Number(agency.indicative_price_from))}
                  </p>
                )}
              </LandingCard>
            </Link>
          ))}
        </div>
      )}
    </LandingSection>
  );
}
