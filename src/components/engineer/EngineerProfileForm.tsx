"use client";

import { useState, useTransition } from "react";
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
      setMessage(result.error ? result.error : "Profile saved!");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { key: "specialization", label: "Specialization" },
        { key: "council_membership", label: "Engineering Council Membership" },
        { key: "professional_license", label: "Professional License" },
        { key: "service_location", label: "Service Location" },
      ].map((f) => (
        <div key={f.key}>
          <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
          <input
            value={form[f.key as keyof typeof form]}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
          />
        </div>
      ))}
      <div>
        <label className="mb-1.5 block text-sm font-medium">Experience (years)</label>
        <input
          type="number"
          value={form.experience_years}
          onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Bio</label>
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
        {isPending ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
