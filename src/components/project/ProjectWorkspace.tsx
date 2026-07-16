"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { updateMilestone, addMilestone } from "@/actions/milestones";
import { recordPayment, updatePaymentStatus, closeProject, archiveProject } from "@/actions/payments";
import type { MilestoneStatus, PaymentStatus, RequestStatus } from "@/types";
import { TrafficCone, CreditCard, Archive, CheckCircle } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  status: MilestoneStatus;
  status_update: string | null;
  sort_order: number;
}

interface Payment {
  id: string;
  amount: number;
  status: PaymentStatus;
  method: string | null;
  notes: string | null;
  created_at: string;
}

interface AgreementInfo {
  id: string;
  signed_at: string | null;
  agencies?: { name: string } | { name: string }[] | null;
  quotations?: {
    price: number;
    scope: string | null;
    deliverables: string | null;
    timeline_days: number | null;
    payment_terms: string | null;
  } | {
    price: number;
    scope: string | null;
    deliverables: string | null;
    timeline_days: number | null;
    payment_terms: string | null;
  }[] | null;
}

const STATUS_COLORS: Record<MilestoneStatus, string> = {
  green: "bg-success text-white",
  amber: "bg-warning text-white",
  red: "bg-danger text-white",
};

const PAYMENT_VARIANT: Record<PaymentStatus, "default" | "success" | "warning" | "danger" | "outline"> = {
  pending: "warning",
  processing: "default",
  confirmed: "success",
  failed: "danger",
};

export function ProjectWorkspace({
  requestId,
  requestTitle,
  requestStatus,
  agreement,
  milestones,
  payments,
  mode,
  quotedPrice,
}: {
  requestId: string;
  requestTitle: string;
  requestStatus: RequestStatus;
  agreement: AgreementInfo | null;
  milestones: Milestone[];
  payments: Payment[];
  mode: "client" | "agency";
  quotedPrice?: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newMilestone, setNewMilestone] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(quotedPrice?.toString() ?? "");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");

  const agency = agreement?.agencies
    ? Array.isArray(agreement.agencies)
      ? agreement.agencies[0]
      : agreement.agencies
    : null;
  const quote = agreement?.quotations
    ? Array.isArray(agreement.quotations)
      ? agreement.quotations[0]
      : agreement.quotations
    : null;

  function handleMilestoneUpdate(id: string, status: MilestoneStatus, status_update?: string) {
    startTransition(async () => {
      await updateMilestone(id, { status, status_update });
      router.refresh();
    });
  }

  function handleAddMilestone() {
    if (!newMilestone.trim()) return;
    startTransition(async () => {
      await addMilestone(requestId, newMilestone.trim());
      setNewMilestone("");
      router.refresh();
    });
  }

  function handleRecordPayment() {
    startTransition(async () => {
      await recordPayment({
        request_id: requestId,
        amount: parseFloat(paymentAmount),
        method: paymentMethod,
        notes: "Client recorded bank transfer",
      });
      router.refresh();
    });
  }

  function handleConfirmPayment(paymentId: string) {
    startTransition(async () => {
      await updatePaymentStatus(paymentId, "confirmed");
      router.refresh();
    });
  }

  function handleClose() {
    startTransition(async () => {
      await closeProject(requestId);
      router.refresh();
    });
  }

  function handleArchive() {
    startTransition(async () => {
      await archiveProject(requestId);
      router.refresh();
    });
  }

  const allGreen = milestones.length > 0 && milestones.every((m) => m.status === "green");
  const hasConfirmedPayment = payments.some((p) => p.status === "confirmed");

  return (
    <div className="space-y-6">
      {agreement && (
        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <CheckCircle className="h-5 w-5 text-success" />
            Agreement / Purchase Order
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted">Agency</p>
              <p className="font-medium">{agency?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Contract Value</p>
              <p className="text-xl font-bold text-primary">
                SAR {Number(quote?.price ?? 0).toLocaleString()}
              </p>
            </div>
            {quote?.scope && (
              <div className="sm:col-span-2">
                <p className="text-sm text-muted">Scope</p>
                <p className="text-sm">{quote.scope}</p>
              </div>
            )}
            {quote?.deliverables && (
              <div className="sm:col-span-2">
                <p className="text-sm text-muted">Deliverables</p>
                <p className="text-sm">{quote.deliverables}</p>
              </div>
            )}
            {quote?.payment_terms && (
              <div>
                <p className="text-sm text-muted">Payment Terms</p>
                <p className="text-sm">{quote.payment_terms}</p>
              </div>
            )}
            {quote?.timeline_days && (
              <div>
                <p className="text-sm text-muted">Timeline</p>
                <p className="text-sm">{quote.timeline_days} days</p>
              </div>
            )}
          </div>
          {agreement.signed_at && (
            <p className="mt-3 text-xs text-muted">
              Signed: {new Date(agreement.signed_at).toLocaleString()}
            </p>
          )}
        </Card>
      )}

      <Card>
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <TrafficCone className="h-5 w-5 text-warning" />
          Milestones — Traffic-Light Execution
        </h2>
        <p className="mt-1 text-sm text-muted">{requestTitle} · Status: {requestStatus}</p>

        <div className="mt-4 space-y-3">
          {milestones.map((m) => (
            <div key={m.id} className="rounded-lg border border-border p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${STATUS_COLORS[m.status]}`}>
                    {m.status === "green" ? "✓" : m.status === "amber" ? "!" : "✕"}
                  </span>
                  <div>
                    <p className="font-medium">{m.title}</p>
                    {m.status_update && (
                      <p className="text-xs text-muted">{m.status_update}</p>
                    )}
                  </div>
                </div>
                {mode === "agency" && requestStatus !== "archived" && (
                  <div className="flex flex-wrap gap-2">
                    {(["green", "amber", "red"] as MilestoneStatus[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={isPending}
                        onClick={() => handleMilestoneUpdate(m.id, s, `${s} status updated`)}
                        className={`rounded px-2 py-1 text-xs font-medium capitalize ${
                          m.status === s ? STATUS_COLORS[s] : "border border-border text-muted"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {mode === "agency" && requestStatus !== "archived" && (
          <div className="mt-4 flex gap-2">
            <input
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              placeholder="Add milestone..."
              className="flex-1 rounded-lg border border-border px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handleAddMilestone}
              disabled={isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Add
            </button>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <CreditCard className="h-5 w-5 text-primary" />
          Manual Payment Tracking
        </h2>

        {payments.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No payments recorded yet.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium">SAR {Number(p.amount).toLocaleString()}</p>
                  <p className="text-xs text-muted">{p.method} · {new Date(p.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={PAYMENT_VARIANT[p.status]}>{p.status}</Badge>
                  {mode === "agency" && p.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => handleConfirmPayment(p.id)}
                      disabled={isPending}
                      className="rounded bg-success px-3 py-1 text-xs font-medium text-white"
                    >
                      Confirm
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {mode === "client" && requestStatus !== "archived" && requestStatus !== "completed" && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Amount (SAR)"
              className="rounded-lg border border-border px-3 py-2 text-sm"
            />
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-sm"
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
            </select>
            <button
              type="button"
              onClick={handleRecordPayment}
              disabled={isPending || !paymentAmount}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Record Payment
            </button>
          </div>
        )}
      </Card>

      {(mode === "client" || mode === "agency") && requestStatus !== "archived" && (
        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Archive className="h-5 w-5" />
            Close & Archive
          </h2>
          <p className="mt-2 text-sm text-muted">
            Complete when all milestones are green and payment is confirmed.
          </p>
          <div className="mt-2 flex gap-4 text-xs text-muted">
            <span className={allGreen ? "text-success" : ""}>
              Milestones: {allGreen ? "✓ All green" : "In progress"}
            </span>
            <span className={hasConfirmedPayment ? "text-success" : ""}>
              Payment: {hasConfirmedPayment ? "✓ Confirmed" : "Pending"}
            </span>
          </div>
          <div className="mt-4 flex gap-3">
            {requestStatus !== "completed" && (
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending || !allGreen || !hasConfirmedPayment}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                Mark Completed
              </button>
            )}
            {requestStatus === "completed" && mode === "client" && (
              <button
                type="button"
                onClick={handleArchive}
                disabled={isPending}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium"
              >
                Archive Project
              </button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
