"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { submitQuotation } from "@/actions/quotations";

export function SubmitQuotationForm({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    price: "",
    scope: "",
    deliverables: "",
    timeline_days: "",
    payment_terms: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await submitQuotation({
        request_id: requestId,
        price: parseFloat(form.price),
        scope: form.scope || undefined,
        deliverables: form.deliverables || undefined,
        timeline_days: form.timeline_days ? parseInt(form.timeline_days) : undefined,
        payment_terms: form.payment_terms || undefined,
      });
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/agency/quotations");
        router.refresh();
      }
    });
  }

  return (
    <Card>
      <h2 className="font-semibold">Submit Quotation</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Price (SAR) *</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Scope of Work</label>
          <textarea
            rows={3}
            value={form.scope}
            onChange={(e) => setForm({ ...form, scope: e.target.value })}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Deliverables</label>
          <textarea
            rows={2}
            value={form.deliverables}
            onChange={(e) => setForm({ ...form, deliverables: e.target.value })}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Timeline (days)</label>
          <input
            type="number"
            min="1"
            value={form.timeline_days}
            onChange={(e) => setForm({ ...form, timeline_days: e.target.value })}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Payment Terms</label>
          <input
            value={form.payment_terms}
            onChange={(e) => setForm({ ...form, payment_terms: e.target.value })}
            placeholder="e.g. 50% upfront, 50% on completion"
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
          />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {isPending ? "Submitting..." : "Submit Quotation"}
        </button>
      </form>
    </Card>
  );
}
