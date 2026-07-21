"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { generateQuotationScope } from "@/actions/ai";
import { submitQuotation } from "@/actions/quotations";
import {
  DEFAULT_TERMS_AND_CONDITIONS,
  SUGGESTED_TERMS,
  defaultDeliverablesFromServices,
  paymentMilestoneTotal,
  type PaymentMilestone,
  type PaymentTermsType,
} from "@/lib/quotation";
import {
  Sparkles,
  ListChecks,
  Wallet,
  DollarSign,
  Layers,
  Trash2,
  Plus,
  FileText,
  Check,
} from "lucide-react";

export interface QuotationRequestContext {
  requestId: string;
  requestTitle: string;
  requestDescription?: string;
  location: string;
  packageName?: string;
  serviceNames: string[];
  agencyName?: string;
}

function SectionHeader({ icon: Icon, title }: { icon: typeof Sparkles; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

function PaymentTermCard({
  selected,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: typeof DollarSign;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-1 flex-col items-start rounded-xl border p-4 text-start transition-all",
        selected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border-subtle hover:border-primary/20"
      )}
    >
      {selected && (
        <span className="absolute end-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
          <Check className="h-3 w-3" />
        </span>
      )}
      <Icon className={cn("mb-2 h-5 w-5", selected ? "text-primary" : "text-muted")} />
      <span className={cn("font-semibold", selected && "text-primary")}>{title}</span>
      <span className="mt-1 text-xs text-muted">{description}</span>
    </button>
  );
}

export function SubmitQuotationForm({ context }: { context: QuotationRequestContext }) {
  const t = useTranslations("agency.quotationForm");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isGeneratingScope, startGenerateScope] = useTransition();
  const [error, setError] = useState("");

  const [scope, setScope] = useState("");
  const [price, setPrice] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>(() =>
    defaultDeliverablesFromServices(context.serviceNames)
  );
  const [paymentTermsType, setPaymentTermsType] = useState<PaymentTermsType>("full_on_completion");
  const [paymentMilestones, setPaymentMilestones] = useState<PaymentMilestone[]>([
    { id: "payment-milestone-1", name: "", percentage: 40 },
    { id: "payment-milestone-2", name: "", percentage: 60 },
  ]);
  const nextMilestoneId = useRef(3);
  const [terms, setTerms] = useState<string[]>([...DEFAULT_TERMS_AND_CONDITIONS]);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (deliverables.length === 0 && context.serviceNames.length) {
      setDeliverables(defaultDeliverablesFromServices(context.serviceNames));
    }
  }, [context.serviceNames, deliverables.length]);

  const milestoneTotal = useMemo(() => paymentMilestoneTotal(paymentMilestones), [paymentMilestones]);

  function updateDeliverable(index: number, value: string) {
    setDeliverables((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function addDeliverable() {
    setDeliverables((prev) => [...prev, ""]);
  }

  function removeDeliverable(index: number) {
    setDeliverables((prev) => prev.filter((_, i) => i !== index));
  }

  function updatePaymentMilestone(id: string, field: "name" | "percentage", value: string) {
    setPaymentMilestones((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "percentage" ? Number(value) || 0 : value,
            }
          : item
      )
    );
  }

  function addPaymentMilestone() {
    setPaymentMilestones((prev) => [
      ...prev,
      { id: `payment-milestone-${nextMilestoneId.current++}`, name: "", percentage: 0 },
    ]);
  }

  function removePaymentMilestone(id: string) {
    setPaymentMilestones((prev) => prev.filter((item) => item.id !== id));
  }

  function updateTerm(index: number, value: string) {
    setTerms((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function addTerm(value = "") {
    setTerms((prev) => [...prev, value]);
  }

  function removeTerm(index: number) {
    setTerms((prev) => prev.filter((_, i) => i !== index));
  }

  function handleGenerateScope() {
    startGenerateScope(async () => {
      const result = await generateQuotationScope({
        requestTitle: context.requestTitle,
        requestDescription: context.requestDescription,
        serviceNames: context.serviceNames,
        location: context.location,
        packageName: context.packageName,
        agencyName: context.agencyName,
      });
      setScope(result.scope);
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await submitQuotation({
        request_id: context.requestId,
        price: parseFloat(price),
        scope: scope || undefined,
        deliverables_items: deliverables.filter(Boolean),
        estimated_duration: estimatedDuration || undefined,
        payment_terms_type: paymentTermsType,
        payment_milestones: paymentTermsType === "milestones" ? paymentMilestones : [],
        terms_and_conditions: terms.filter(Boolean),
        confirmed_accurate: confirmed,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <SectionHeader icon={Sparkles} title={t("scopeTitle")} />
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            disabled={isGeneratingScope}
            onClick={handleGenerateScope}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5 disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {isGeneratingScope ? t("generating") : t("aiAssist")}
          </button>
        </div>
        <Textarea
          rows={5}
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          placeholder={t("scopePlaceholder")}
        />
      </Card>

      <Card>
        <SectionHeader icon={ListChecks} title={t("deliverablesTitle")} />
        <div className="space-y-3">
          {deliverables.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="w-5 text-sm text-muted">{index + 1}</span>
              <Input
                value={item}
                onChange={(e) => updateDeliverable(index, e.target.value)}
                placeholder={t("deliverablePlaceholder")}
              />
              <button
                type="button"
                onClick={() => removeDeliverable(index)}
                className="rounded-lg p-2 text-muted hover:bg-surface-muted hover:text-danger"
                aria-label={t("removeDeliverable")}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addDeliverable}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <Plus className="h-4 w-4" />
          {t("addDeliverable")}
        </button>
      </Card>

      <Card>
        <SectionHeader icon={Wallet} title={t("paymentsTitle")} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>{t("quoteAmount")}</Label>
            <Input
              type="number"
              required
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={t("quoteAmountPlaceholder")}
              className="mt-2"
            />
          </div>
          <div>
            <Label>{t("estimatedDuration")}</Label>
            <Input
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              placeholder={t("estimatedDurationPlaceholder")}
              className="mt-2"
            />
          </div>
        </div>

        <div className="mt-6">
          <Label>{t("paymentTerms")}</Label>
          <div className="mt-3 flex flex-col gap-3 lg:flex-row">
            <PaymentTermCard
              selected={paymentTermsType === "full_on_completion"}
              onClick={() => setPaymentTermsType("full_on_completion")}
              icon={DollarSign}
              title={t("fullOnCompletion")}
              description={t("fullOnCompletionDesc")}
            />
            <PaymentTermCard
              selected={paymentTermsType === "advance_balance"}
              onClick={() => setPaymentTermsType("advance_balance")}
              icon={Wallet}
              title={t("advanceBalance")}
              description={t("advanceBalanceDesc")}
            />
            <PaymentTermCard
              selected={paymentTermsType === "milestones"}
              onClick={() => setPaymentTermsType("milestones")}
              icon={Layers}
              title={t("milestones")}
              description={t("milestonesDesc")}
            />
          </div>
        </div>

        {paymentTermsType === "milestones" && (
          <div className="mt-4 rounded-xl border border-border-subtle bg-surface-muted/40 p-4">
            <div className="space-y-3">
              {paymentMilestones.map((milestone, index) => (
                <div key={milestone.id} className="flex items-center gap-3">
                  <span className="w-5 text-sm text-muted">{index + 1}</span>
                  <Input
                    value={milestone.name}
                    onChange={(e) => updatePaymentMilestone(milestone.id, "name", e.target.value)}
                    placeholder={t("milestoneNamePlaceholder")}
                  />
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={milestone.percentage}
                    onChange={(e) =>
                      updatePaymentMilestone(milestone.id, "percentage", e.target.value)
                    }
                    className="w-24"
                  />
                  <span className="text-sm text-muted">%</span>
                  <button
                    type="button"
                    onClick={() => removePaymentMilestone(milestone.id)}
                    className="rounded-lg p-2 text-muted hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={addPaymentMilestone}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <Plus className="h-4 w-4" />
                {t("addMilestone")}
              </button>
              <span
                className={cn(
                  "text-sm font-semibold",
                  milestoneTotal === 100 ? "text-success" : "text-danger"
                )}
              >
                {t("milestoneTotal", { total: milestoneTotal })}
              </span>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <SectionHeader icon={FileText} title={t("termsTitle")} />
        <p className="mb-4 text-sm text-muted">{t("termsIntro")}</p>
        <div className="space-y-3">
          {terms.map((term, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="mt-3 w-5 text-sm text-muted">{index + 1}</span>
              <Textarea
                rows={2}
                value={term}
                onChange={(e) => updateTerm(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeTerm(index)}
                className="mt-2 rounded-lg p-2 text-muted hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addTerm()}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <Plus className="h-4 w-4" />
          {t("addCustomClause")}
        </button>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {t("suggestedClauses")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTED_TERMS.map((clause) => (
              <button
                key={clause}
                type="button"
                onClick={() => addTerm(clause)}
                className="rounded-full border border-border-subtle px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-primary"
              >
                + {clause.length > 42 ? `${clause.slice(0, 42)}…` : clause}
              </button>
            ))}
          </div>
        </div>

        <label className="mt-6 flex items-start gap-3 rounded-xl border border-border-subtle p-4">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-primary"
          />
          <span className="text-sm">{t("confirmAccurate")}</span>
        </label>
      </Card>

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {isPending ? t("submitting") : t("submitQuotation")}
      </button>
    </form>
  );
}
