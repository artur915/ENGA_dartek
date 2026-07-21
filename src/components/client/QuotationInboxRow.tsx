"use client";

import { useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { acceptQuotation, declineQuotation } from "@/actions/quotations";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/navigation";
import {
  MessageSquare,
  Ban,
  CheckCircle2,
  Star,
  MapPin,
  Clock,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";

interface QuotationRow {
  id: string;
  price: number;
  scope: string | null;
  estimated_duration: string | null;
  timeline_days?: number | null;
  agencies: {
    id: string;
    name: string;
    service_areas: string[] | null;
    disciplines: string[] | null;
  } | null;
}

function matchScore(agencyId: string, requestId: string): number {
  const seed = parseInt(`${agencyId}${requestId}`.replace(/-/g, "").slice(0, 12), 16);
  return 70 + (seed % 29);
}

export function QuotationInboxRow({
  quotation,
  requestId,
  locationCity,
}: {
  quotation: QuotationRow;
  requestId: string;
  locationCity: string | null;
}) {
  const t = useTranslations("client.dashboard");
  const tq = useTranslations("quotationsPage");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const agency = quotation.agencies;
  const match = agency ? matchScore(agency.id, requestId) : null;
  const location =
    locationCity ??
    agency?.service_areas?.[0] ??
    "—";
  const duration =
    quotation.estimated_duration ??
    (quotation.timeline_days ? tq("daysCount", { count: quotation.timeline_days }) : null);

  function handleAccept() {
    const name = agency?.name ?? tq("thisProvider");
    if (!confirm(tq("acceptConfirmNamed", { name }))) return;
    startTransition(async () => {
      const result = await acceptQuotation(quotation.id);
      if (result.success) {
        router.push(`/client/projects/${requestId}`);
        router.refresh();
      } else {
        alert(result.error);
      }
    });
  }

  function handleDecline() {
    const name = agency?.name ?? tq("thisProvider");
    if (!confirm(tq("declineConfirmNamed", { name }))) return;
    startTransition(async () => {
      const result = await declineQuotation(quotation.id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error);
      }
    });
  }

  return (
    <div className="border-b border-border-subtle px-6 py-5 last:border-b-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold">{agency?.name ?? tq("engineeringOffice")}</h4>
            {match !== null && (
              <Badge variant="success" size="sm">
                {t("matchScore", { score: match })}
              </Badge>
            )}
            <Badge variant="warning" size="sm">
              {t("awaitingDecision")}
            </Badge>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              4.8
            </span>
            {duration && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {duration}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {t("locationLabel", { city: location })}
            </span>
          </div>

          {quotation.scope && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {quotation.scope}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2 lg:min-w-[140px]">
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(Number(quotation.price), tc("currency"), locale)}
          </p>
          <Link
            href={`/client/quotations/${requestId}`}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            {t("addToComparison")}
          </Link>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Link
          href={`/client/quotations/${requestId}`}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-warning/30 px-3 text-sm font-semibold text-warning transition-colors hover:bg-warning/5"
        >
          <MessageSquare className="h-4 w-4" />
          {t("requestRevision")}
        </Link>
        <button
          type="button"
          onClick={handleDecline}
          disabled={isPending}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-danger/30 px-3 text-sm font-semibold text-danger transition-colors hover:bg-danger/5 disabled:opacity-50"
        >
          <Ban className="h-4 w-4" />
          {t("decline")}
        </button>
        <button
          type="button"
          onClick={handleAccept}
          disabled={isPending}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" />
          {isPending ? t("processing") : t("acceptProceed")}
        </button>
      </div>
    </div>
  );
}
