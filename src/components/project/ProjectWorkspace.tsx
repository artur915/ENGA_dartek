"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MilestoneProgressControl } from "@/components/project/MilestoneProgressControl";
import { updateMilestone, addMilestone } from "@/actions/milestones";
import { recordPayment, updatePaymentStatus, closeProject, archiveProject } from "@/actions/payments";
import type { MilestoneStatus, PaymentStatus, RequestStatus } from "@/types";
import {
  getQuotationDeliverables,
  getQuotationDuration,
  getQuotationPaymentMilestones,
  getQuotationTerms,
  type QuotationDisplayData,
} from "@/lib/quotation-display";
import {
  resolveMilestoneExecution,
  sortMilestones,
} from "@/lib/milestone-progress";
import {
  loadMilestoneProgress,
  setMilestoneProgress,
  clearMilestoneProgress,
} from "@/lib/milestone-progress-storage";
import { formatDate, formatDateTime, formatNumber, formatCurrency } from "@/lib/format";
import { TrafficCone, CreditCard, Archive, CheckCircle } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  status: MilestoneStatus;
  status_update: string | null;
  sort_order: number;
  due_date: string | null;
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
  quotations?: QuotationDisplayData | QuotationDisplayData[] | null;
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
  const t = useTranslations("projectWorkspace");
  const ts = useTranslations("status");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newMilestone, setNewMilestone] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(quotedPrice?.toString() ?? "");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [progressById, setProgressById] = useState<Record<string, number>>({});

  const sortedMilestones = useMemo(() => sortMilestones(milestones), [milestones]);

  useEffect(() => {
    const stored = loadMilestoneProgress();
    sortedMilestones.forEach((milestone) => {
      if (milestone.status === "green") {
        stored[milestone.id] = 100;
      }
    });
    setProgressById(stored);
  }, [sortedMilestones]);

  function handleProgressChange(milestoneId: string, progress: number) {
    if (mode !== "agency") return;

    const clamped = Math.min(100, Math.max(0, Math.round(progress)));
    setMilestoneProgress(milestoneId, clamped);
    setProgressById((current) => ({ ...current, [milestoneId]: clamped }));

    if (clamped >= 100 && mode === "agency") {
      handleMilestoneUpdate(milestoneId, "green", t("statusUpdated"));
    }
  }

  function handleMilestoneUpdate(id: string, status: MilestoneStatus, status_update?: string) {
    const previous = sortedMilestones.find((milestone) => milestone.id === id);

    if (status === "green") {
      setMilestoneProgress(id, 100);
      setProgressById((current) => ({ ...current, [id]: 100 }));
    } else if (previous?.status === "green") {
      clearMilestoneProgress(id);
      setProgressById((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
    }

    startTransition(async () => {
      await updateMilestone(id, { status, status_update });
      router.refresh();
    });
  }

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

  function handleDueDateChange(id: string, dueDate: string) {
    startTransition(async () => {
      await updateMilestone(id, { due_date: dueDate || null });
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
        notes: t("paymentNote"),
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
            {t("agreementTitle")}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted">{t("agency")}</p>
              <p className="font-medium">{agency?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted">{t("contractValue")}</p>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(Number(quote?.price ?? 0), tc("currency"), locale)}
              </p>
            </div>
            {quote?.scope && (
              <div className="sm:col-span-2">
                <p className="text-sm text-muted">{t("scope")}</p>
                <p className="text-sm whitespace-pre-wrap">{quote.scope}</p>
              </div>
            )}
            {quote && getQuotationDeliverables(quote).length > 0 && (
              <div className="sm:col-span-2">
                <p className="text-sm text-muted">{t("deliverables")}</p>
                <ul className="text-sm">
                  {getQuotationDeliverables(quote).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}
            {quote?.payment_terms && (
              <div>
                <p className="text-sm text-muted">{t("paymentTerms")}</p>
                {getQuotationPaymentMilestones(quote).length > 0 ? (
                  <ul className="text-sm">
                    {getQuotationPaymentMilestones(quote).map((m) => (
                      <li key={m.id}>{m.name}: {m.percentage}%</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm">{quote.payment_terms}</p>
                )}
              </div>
            )}
            {quote && getQuotationDuration(quote) && (
              <div>
                <p className="text-sm text-muted">{t("estimatedDuration")}</p>
                <p className="text-sm">{getQuotationDuration(quote)}</p>
              </div>
            )}
            {quote && getQuotationTerms(quote).length > 0 && (
              <div className="sm:col-span-2">
                <p className="text-sm text-muted">{t("terms")}</p>
                <ul className="text-sm">
                  {getQuotationTerms(quote).map((term) => (
                    <li key={term}>• {term}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {agreement.signed_at && (
            <p className="mt-3 text-xs text-muted">
              {t("signed", { date: formatDateTime(agreement.signed_at, locale) })}
            </p>
          )}
        </Card>
      )}

      <Card>
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <TrafficCone className="h-5 w-5 text-warning" />
          {t("milestonesTitle")}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {requestTitle} · {t("statusLabel", {
            status: ts.has(`request.${requestStatus}`) ? ts(`request.${requestStatus}`) : requestStatus,
          })}
        </p>

        <div className="mt-4 space-y-3">
          {sortedMilestones.map((m) => {
            const execution = resolveMilestoneExecution(sortedMilestones, m.id, progressById);
            const progressValue =
              m.status === "green" ? 100 : progressById[m.id] ?? execution.progress;

            return (
            <div key={m.id} className="rounded-lg border border-border p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${STATUS_COLORS[m.status]}`}>
                    {m.status === "green" ? "✓" : m.status === "amber" ? "!" : "✕"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{m.title}</p>
                      {execution.isUpcoming && (
                        <Badge variant="outline" size="sm">
                          {t("upcomingMilestone")}
                        </Badge>
                      )}
                    </div>
                    {m.status_update && (
                      <p className="text-xs text-muted">{m.status_update}</p>
                    )}
                    {m.status === "green" ? (
                      <p className="mt-2 text-xs font-semibold text-success">
                        {t("completedMilestone")} · 100%
                      </p>
                    ) : execution.isActive ? (
                      mode === "agency" ? (
                        <>
                          <MilestoneProgressControl
                            value={progressValue}
                            onChange={(value) => handleProgressChange(m.id, value)}
                            disabled={requestStatus === "archived" || isPending}
                            label={t("progressLabel")}
                            completedLabel={t("completedMilestone")}
                          />
                          <label className="mt-3 block text-xs text-muted">
                            {t("milestoneDueLabel")}
                            <input
                              type="date"
                              value={m.due_date ?? ""}
                              disabled={isPending}
                              onChange={(event) => handleDueDateChange(m.id, event.target.value)}
                              className="mt-1 block h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground"
                            />
                          </label>
                        </>
                      ) : (
                        <p className="mt-2 text-xs font-semibold text-primary">
                          {t("progressLabel")}: {progressValue}%
                        </p>
                      )
                    ) : execution.isUpcoming ? (
                      <p className="mt-2 text-xs text-muted">{t("upcomingHint")}</p>
                    ) : null}
                  </div>
                </div>
                {mode === "agency" && requestStatus !== "archived" && execution.isActive && (
                  <div className="flex flex-wrap gap-2">
                    {(["green", "amber", "red"] as MilestoneStatus[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={isPending}
                        onClick={() => handleMilestoneUpdate(m.id, s, t("statusUpdated"))}
                        className={`rounded px-2 py-1 text-xs font-medium capitalize ${
                          m.status === s ? STATUS_COLORS[s] : "border border-border text-muted"
                        }`}
                      >
                        {ts(`traffic.${s}`)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )})}
        </div>

        {mode === "agency" && requestStatus !== "archived" && (
          <div className="mt-4 flex gap-2">
            <input
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              placeholder={t("addMilestonePlaceholder")}
              className="flex-1 rounded-lg border border-border px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handleAddMilestone}
              disabled={isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              {t("add")}
            </button>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <CreditCard className="h-5 w-5 text-primary" />
          {t("paymentsTitle")}
        </h2>

        {payments.length === 0 ? (
          <p className="mt-3 text-sm text-muted">{t("noPayments")}</p>
        ) : (
          <div className="mt-4 space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium">
                    {formatCurrency(Number(p.amount), tc("currency"), locale)}
                  </p>
                  <p className="text-xs text-muted">
                    {p.method === "bank_transfer"
                      ? t("bankTransfer")
                      : p.method === "cash"
                        ? t("cash")
                        : p.method === "cheque"
                          ? t("cheque")
                          : p.method}{" "}
                    · {formatDate(p.created_at, locale)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={PAYMENT_VARIANT[p.status]}>
                    {ts.has(`payment.${p.status}`) ? ts(`payment.${p.status}`) : p.status}
                  </Badge>
                  {mode === "agency" && p.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => handleConfirmPayment(p.id)}
                      disabled={isPending}
                      className="rounded bg-success px-3 py-1 text-xs font-medium text-white"
                    >
                      {t("confirm")}
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
              placeholder={t("amountPlaceholder")}
              className="rounded-lg border border-border px-3 py-2 text-sm"
            />
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-sm"
            >
              <option value="bank_transfer">{t("bankTransfer")}</option>
              <option value="cash">{t("cash")}</option>
              <option value="cheque">{t("cheque")}</option>
            </select>
            <button
              type="button"
              onClick={handleRecordPayment}
              disabled={isPending || !paymentAmount}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              {t("recordPayment")}
            </button>
          </div>
        )}
      </Card>

      {(mode === "client" || mode === "agency") && requestStatus !== "archived" && (
        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Archive className="h-5 w-5" />
            {t("closeTitle")}
          </h2>
          <p className="mt-2 text-sm text-muted">{t("closeHint")}</p>
          <div className="mt-2 flex gap-4 text-xs text-muted">
            <span className={allGreen ? "text-success" : ""}>
              {t("milestonesProgress", {
                status: allGreen ? t("milestonesAllGreen") : t("milestonesInProgress"),
              })}
            </span>
            <span className={hasConfirmedPayment ? "text-success" : ""}>
              {t("paymentProgress", {
                status: hasConfirmedPayment ? t("paymentConfirmed") : t("paymentPending"),
              })}
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
                {t("markCompleted")}
              </button>
            )}
            {requestStatus === "completed" && mode === "client" && (
              <button
                type="button"
                onClick={handleArchive}
                disabled={isPending}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium"
              >
                {t("archiveProject")}
              </button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
