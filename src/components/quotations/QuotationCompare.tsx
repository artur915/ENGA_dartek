"use client";

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { acceptQuotation } from "@/actions/quotations";
import { Building2, Clock, CheckCircle } from "lucide-react";

interface Quotation {
  id: string;
  price: number;
  scope: string | null;
  deliverables: string | null;
  timeline_days: number | null;
  payment_terms: string | null;
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
      {quotations.map((q) => (
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
            SAR {Number(q.price).toLocaleString()}
          </p>

          {q.timeline_days && (
            <div className="mt-3 flex items-center gap-1.5 text-sm text-muted">
              <Clock className="h-4 w-4" />
              {q.timeline_days} days
            </div>
          )}

          {q.scope && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-muted">Scope</p>
              <p className="mt-1 text-sm">{q.scope}</p>
            </div>
          )}

          {q.deliverables && (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase text-muted">Deliverables</p>
              <p className="mt-1 text-sm">{q.deliverables}</p>
            </div>
          )}

          {q.payment_terms && (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase text-muted">Payment Terms</p>
              <p className="mt-1 text-sm">{q.payment_terms}</p>
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
      ))}
    </div>
  );
}
