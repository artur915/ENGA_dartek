"use client";

import { useTransition } from "react";
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
import { formatNumber } from "@/lib/format";

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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleAccept(quotationId: string) {
    if (!confirm("Accept this quotation and generate agreement?")) return;
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
      <Card className="mt-8 text-center">
        <p className="text-muted">
          {requestStatus === "floating"
            ? "Your request is floating. Agencies are reviewing it — check back soon."
            : "No quotations received yet."}
        </p>
      </Card>
    );
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {quotations.map((q) => {
        const duration = getQuotationDuration(q);
        const deliverables = getQuotationDeliverables(q);
        const terms = getQuotationTerms(q);
        const paymentMilestones = getQuotationPaymentMilestones(q);

        return (
          <Card key={q.id} className="relative">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{q.agencies?.name}</h3>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {q.agencies?.disciplines?.slice(0, 2).map((d) => (
                      <Badge key={d} variant="outline">{d}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-3xl font-bold text-primary">
              SAR {formatNumber(Number(q.price))}
            </p>

            {duration && (
              <div className="mt-3 flex items-center gap-1.5 text-sm text-muted">
                <Clock className="h-4 w-4" />
                {duration}
              </div>
            )}

            {q.scope && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase text-muted">Scope</p>
                <p className="mt-1 text-sm whitespace-pre-wrap">{q.scope}</p>
              </div>
            )}

            {deliverables.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase text-muted">Deliverables</p>
                <ul className="mt-1 space-y-1 text-sm">
                  {deliverables.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {(q.payment_terms || paymentMilestones.length > 0) && (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase text-muted">Payment Terms</p>
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
                <p className="text-xs font-semibold uppercase text-muted">Terms & Conditions</p>
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
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                {isPending ? "Processing..." : "Accept Quotation"}
              </button>
            )}
          </Card>
        );
      })}
    </div>
  );
}
