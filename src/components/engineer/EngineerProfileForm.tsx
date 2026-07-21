"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { saveEngineerProfile } from "@/actions/engineer";

export function EngineerProfileForm({
  initial,
}: {
  initial: {
    specialization?: string | null;
    experience_years?: number | null;
    council_membership?: string | null;
    professional_license?: string | null;
    service_location?: string | null;
    bio?: string | null;
  } | null;
}) {
  const t = useTranslations("engineer");
  const tp = useTranslations("engineer.profileForm");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    specialization: initial?.specialization ?? "",
    experience_years: initial?.experience_years?.toString() ?? "",
    council_membership: initial?.council_membership ?? "",
    professional_license: initial?.professional_license ?? "",
    service_location: initial?.service_location ?? "",
    bio: initial?.bio ?? "",
  });
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await saveEngineerProfile({
        specialization: form.specialization || undefined,
        experience_years: form.experience_years ? parseInt(form.experience_years) : undefined,
        council_membership: form.council_membership || undefined,
        professional_license: form.professional_license || undefined,
        service_location: form.service_location || undefined,
        bio: form.bio || undefined,
      });
      setMessage(result.error ? result.error : tp("saved"));
      router.refresh();
    });
  }

  const fields = [
    { key: "specialization", label: tp("specialization") },
    { key: "council_membership", label: tp("councilMembership") },
    { key: "professional_license", label: tp("professionalLicense") },
    { key: "service_location", label: tp("serviceLocation") },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
          <input
            value={form[f.key]}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
          />
        </div>
      ))}
      <div>
        <label className="mb-1.5 block text-sm font-medium">{t("experienceYears")}</label>
        <input
          type="number"
          value={form.experience_years}
          onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">{tp("bio")}</label>
        <textarea
          rows={4}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
        />
      </div>
      {message && <p className="text-sm text-primary">{message}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white"
      >
        {isPending ? tp("saving") : tp("saveProfile")}
      </button>
    </form>
  );
}
