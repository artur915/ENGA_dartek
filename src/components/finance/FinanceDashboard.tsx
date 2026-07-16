"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { addFinanceRecord } from "@/actions/finance";

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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Project Income", value: summary.projectIncome },
          { label: "External Income", value: summary.externalIncome },
          { label: "Expenses", value: summary.expenses },
          { label: "Balance", value: summary.balance },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-primary">
              SAR {s.value.toLocaleString()}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-lg font-semibold">Add Record</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-4">
          <select
            value={form.record_type}
            onChange={(e) => setForm({ ...form, record_type: e.target.value as typeof form.record_type })}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          >
            <option value="external_income">External Income</option>
            <option value="expense">Expense</option>
            <option value="invoice">Invoice</option>
          </select>
          <input
            type="number"
            required
            placeholder="Amount (SAR)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Add
          </button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Records</h2>
        {records.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No finance records yet.</p>
        ) : (
          <div className="mt-4 divide-y divide-border">
            {records.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{r.description || r.record_type}</p>
                  <p className="text-xs text-muted">{r.record_date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{r.record_type}</Badge>
                  <span className="font-medium">SAR {Number(r.amount).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
