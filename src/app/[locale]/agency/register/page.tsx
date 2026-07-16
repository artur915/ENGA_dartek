"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { registerAgency } from "@/actions/agency";
import { getAgencyNav } from "@/lib/nav";
import { Building2 } from "lucide-react";

const DISCIPLINES = [
  "Architectural", "Structural", "MEP", "Civil", "Interior Design",
  "Surveying", "Project Management", "Permits & Licensing",
];
const AREAS = [
  "Riyadh", "Jeddah", "Dammam", "Makkah", "Madinah",
  "Khobar", "Tabuk", "Abha", "Eastern Province",
];

export default function AgencyRegisterPage() {
  const t = useTranslations("agency");
  const tc = useTranslations("common");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    name_ar: "",
    commercial_registration: "",
    engineering_license: "",
    description: "",
    disciplines: [] as string[],
    service_areas: [] as string[],
    indicative_price_from: "",
  });

  const nav = getAgencyNav(t, tc);

  function toggleItem(field: "disciplines" | "service_areas", value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await registerAgency({
        name: form.name,
        name_ar: form.name_ar || undefined,
        commercial_registration: form.commercial_registration,
        engineering_license: form.engineering_license,
        description: form.description || undefined,
        disciplines: form.disciplines,
        service_areas: form.service_areas,
        indicative_price_from: form.indicative_price_from
          ? parseFloat(form.indicative_price_from)
          : undefined,
      });
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/agency");
      }
    });
  }

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={nav} />
      <div className="flex-1 bg-surface-muted p-8">
        <h1 className="text-2xl font-bold">{t("register")}</h1>
        <p className="mt-1 text-sm text-muted">
          Submit your engineering office for platform approval
        </p>

        <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6 rounded-xl border border-border bg-surface p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Office Name (EN) *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Office Name (AR)</label>
              <input
                value={form.name_ar}
                onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Commercial Registration *</label>
              <input
                required
                value={form.commercial_registration}
                onChange={(e) => setForm({ ...form, commercial_registration: e.target.value })}
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Engineering License *</label>
              <input
                required
                value={form.engineering_license}
                onChange={(e) => setForm({ ...form, engineering_license: e.target.value })}
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Engineering Disciplines *</label>
            <div className="flex flex-wrap gap-2">
              {DISCIPLINES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleItem("disciplines", d)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    form.disciplines.includes(d)
                      ? "bg-primary text-white"
                      : "border border-border text-muted"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Service Areas *</label>
            <div className="flex flex-wrap gap-2">
              {AREAS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleItem("service_areas", a)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    form.service_areas.includes(a)
                      ? "bg-primary text-white"
                      : "border border-border text-muted"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Indicative Starting Price (SAR)</label>
            <input
              type="number"
              min="0"
              value={form.indicative_price_from}
              onChange={(e) => setForm({ ...form, indicative_price_from: e.target.value })}
              className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={isPending || form.disciplines.length === 0 || form.service_areas.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
          >
            <Building2 className="h-4 w-4" />
            {isPending ? "Submitting..." : "Submit for Approval"}
          </button>
        </form>
      </div>
    </div>
  );
}
