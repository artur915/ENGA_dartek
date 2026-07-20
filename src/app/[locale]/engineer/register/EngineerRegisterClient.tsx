"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { registerEngineer } from "@/actions/engineer";
import { getEngineerNav } from "@/lib/nav";
import { FileUp, UserRound } from "lucide-react";
import { Alert } from "@/components/ui/Alert";

export default function EngineerRegisterClient() {
  const t = useTranslations("engineer");
  const tc = useTranslations("common");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [certificateName, setCertificateName] = useState("");

  const [form, setForm] = useState({
    specialization: "",
    professional_license: "",
    council_membership: "",
    service_location: "",
    experience_years: "",
    bio: "",
  });

  const nav = getEngineerNav(t, tc);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    Object.entries(form).forEach(([key, value]) => formData.set(key, value));

    startTransition(async () => {
      const result = await registerEngineer(formData);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/engineer");
      }
    });
  }

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={nav} />
      <div className="flex-1 bg-surface-muted p-8">
        <h1 className="text-2xl font-bold">{t("register")}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{t("registerDescription")}</p>
        <p className="mt-2 max-w-2xl text-xs text-muted">{t("registerNote")}</p>

        <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-5 rounded-xl border border-border bg-surface p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("specialization")} *</label>
            <input
              required
              name="specialization"
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
              placeholder="Structural Engineering"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">{t("professionalLicense")} *</label>
              <input
                required
                name="professional_license"
                value={form.professional_license}
                onChange={(e) => setForm({ ...form, professional_license: e.target.value })}
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
                placeholder={t("licenseNumberPlaceholder")}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">{t("councilMembership")} *</label>
              <input
                required
                name="council_membership"
                value={form.council_membership}
                onChange={(e) => setForm({ ...form, council_membership: e.target.value })}
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
                placeholder={t("registrationNumberPlaceholder")}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("councilCertificate")} *</label>
            <p className="mb-2 text-xs text-muted">{t("certificateHint")}</p>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border-subtle bg-surface-muted/50 px-4 py-8 text-center transition-colors hover:border-primary/40">
              <FileUp className="mb-2 h-8 w-8 text-primary" />
              <span className="text-sm font-medium">
                {certificateName || t("uploadCertificate")}
              </span>
              <span className="mt-1 text-xs text-muted">PDF, JPEG, PNG, or WebP (max 50MB)</span>
              <input
                type="file"
                name="certificate"
                required
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
                className="sr-only"
                onChange={(e) => setCertificateName(e.target.files?.[0]?.name ?? "")}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">{t("serviceLocation")}</label>
              <input
                name="service_location"
                value={form.service_location}
                onChange={(e) => setForm({ ...form, service_location: e.target.value })}
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
                placeholder="Riyadh"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">{t("experienceYears")}</label>
              <input
                type="number"
                min="0"
                name="experience_years"
                value={form.experience_years}
                onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("bio")}</label>
            <textarea
              rows={3}
              name="bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
            />
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <button
            type="submit"
            disabled={isPending || !certificateName}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
          >
            <UserRound className="h-4 w-4" />
            {isPending ? t("submitting") : t("completeRegistration")}
          </button>
        </form>
      </div>
    </div>
  );
}
