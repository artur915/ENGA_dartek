"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { addFinanceRecord } from "@/actions/finance";
import { formatCurrency } from "@/lib/format";

export function FinanceDashboard({
  summary,
  records,
}: {
  summary: {
    projectIncome: number;
    externalIncome: number;
    income: number;
    expenses: number;
    balance: number;
  };
  records: {
    id: string;
    record_type: string;
    amount: number;
    description: string | null;
    record_date: string;
  }[];
}) {
  const t = useTranslations("financePage");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    record_type: "external_income" as "external_income" | "expense" | "invoice",
    amount: "",
    description: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await addFinanceRecord({
        record_type: form.record_type,
        amount: parseFloat(form.amount),
        description: form.description || undefined,
      });
      setForm({ record_type: "external_income", amount: "", description: "" });
      router.refresh();
    });
  }

  const statCards = [
    { label: t("projectIncome"), value: summary.projectIncome },
    { label: t("externalIncome"), value: summary.externalIncome },
    { label: t("expenses"), value: summary.expenses },
    { label: t("balance"), value: summary.balance },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-primary">
              {formatCurrency(s.value, tc("currency"), locale)}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-lg font-semibold">{t("addRecord")}</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-4">
          <select
            value={form.record_type}
            onChange={(e) => setForm({ ...form, record_type: e.target.value as typeof form.record_type })}
            className="rounded-xl border border-border px-3 py-2 text-sm"
          >
            <option value="external_income">{t("recordTypes.external_income")}</option>
            <option value="expense">{t("recordTypes.expense")}</option>
            <option value="invoice">{t("recordTypes.invoice")}</option>
          </select>
          <input
            type="number"
            required
            placeholder={t("amountPlaceholder")}
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="rounded-xl border border-border px-3 py-2 text-sm"
          />
          <input
            placeholder={t("descriptionPlaceholder")}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-xl border border-border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            {t("add")}
          </button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">{t("records")}</h2>
        {records.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{t("noRecords")}</p>
        ) : (
          <div className="mt-4 divide-y divide-border">
            {records.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">
                    {r.description ||
                      t(`recordTypes.${r.record_type as "external_income" | "expense" | "invoice"}`)}
                  </p>
                  <p className="text-xs text-muted">{r.record_date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {t(`recordTypes.${r.record_type as "external_income" | "expense" | "invoice"}`)}
                  </Badge>
                  <span className="font-medium">
                    {formatCurrency(Number(r.amount), tc("currency"), locale)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
