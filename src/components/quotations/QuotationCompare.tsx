"use client";

import { useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { acceptQuotation } from "@/actions/quotations";
import {
  getQuotationDeliverables,
  getQuotationDuration,
  getQuotationPaymentMilestones,
  getQuotationTerms,
  type QuotationDisplayData,
} from "@/lib/quotation-display";
import { Building2, Clock, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { QUOTATION_STATUS_ACCENT } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

interface Quotation extends QuotationDisplayData {
  id: string;
  status: string;
  agencies: {
    id: string;
    name: string;
    disciplines: string[];
    service_areas: string[];
    indicative_price_from: number | null;
  } | null;
}

export function QuotationCompare({
  requestId,
  quotations,
  requestStatus,
}: {
  requestId: string;
  quotations: Quotation[];
  requestStatus: string;
}) {
  const t = useTranslations("quotationsPage");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleAccept(quotationId: string) {
    if (!confirm(t("acceptConfirm"))) return;
    startTransition(async () => {
      const result = await acceptQuotation(quotationId);
      if (result.success) {
        router.push(`/client/projects/${requestId}`);
        router.refresh();
      } else {
        alert(result.error);
      }
    });
  }

  if (quotations.length === 0) {
    return (
      <Card className="mt-8 border-dashed bg-surface-muted text-center">
        <p className="text-muted">{requestStatus === "floating" ? t("floating") : t("none")}</p>
      </Card>
    );
  }

  function statusBadgeVariant(status: string): "default" | "success" | "warning" | "danger" | "info" | "accent" {
    const accent = QUOTATION_STATUS_ACCENT[status];
    if (accent === "green") return "success";
    if (accent === "amber") return "warning";
    if (accent === "rose") return "danger";
    if (accent === "blue" || accent === "sky") return "info";
    if (accent === "teal") return "accent";
    if (accent === "purple") return "default";
    return "default";
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {quotations.map((q) => {
        const duration = getQuotationDuration(q);
        const deliverables = getQuotationDeliverables(q);
        const terms = getQuotationTerms(q);
        const paymentMilestones = getQuotationPaymentMilestones(q);

        const isAccepted = q.status === "accepted";

        return (
          <Card
            key={q.id}
            className={cn(
              "relative",
              isAccepted && "border-secondary/30 ring-2 ring-secondary/15"
            )}
          >
            <div className="mb-4 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{q.agencies?.name}</h3>
                  <Badge variant={statusBadgeVariant(q.status)} size="sm" className="mt-1">
                    {q.status}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-1">
                {q.agencies?.disciplines?.slice(0, 2).map((d) => (
                  <Badge key={d} variant="outline" size="sm">
                    {d}
                  </Badge>
                ))}
              </div>
            </div>

            <p className="text-3xl font-bold text-primary">
              {formatCurrency(Number(q.price), tc("currency"), locale)}
            </p>

            {duration && (
              <div className="mt-3 flex items-center gap-1.5 text-sm text-muted">
                <Clock className="h-4 w-4" />
                {duration}
              </div>
            )}

            {q.scope && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase text-muted">{t("scope")}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm">{q.scope}</p>
              </div>
            )}

            {deliverables.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase text-muted">{t("deliverables")}</p>
                <ul className="mt-1 space-y-1 text-sm">
                  {deliverables.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {(q.payment_terms || paymentMilestones.length > 0) && (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase text-muted">{t("paymentTerms")}</p>
                {paymentMilestones.length > 0 ? (
                  <ul className="mt-1 space-y-1 text-sm">
                    {paymentMilestones.map((m) => (
                      <li key={m.id}>
                        {m.name}: {m.percentage}%
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm">{q.payment_terms}</p>
                )}
              </div>
            )}

            {terms.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase text-muted">{t("terms")}</p>
                <ul className="mt-1 space-y-1 text-sm">
                  {terms.slice(0, 3).map((term) => (
                    <li key={term}>• {term}</li>
                  ))}
                </ul>
              </div>
            )}

            {requestStatus !== "accepted" && (
              <button
                type="button"
                onClick={() => handleAccept(q.id)}
                disabled={isPending}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                {isPending ? t("processing") : t("accept")}
              </button>
            )}
          </Card>
        );
      })}
    </div>
  );
}
