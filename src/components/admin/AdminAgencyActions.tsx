"use client";

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { approveAgency, rejectAgency } from "@/actions/agency";

export function AdminAgencyActions({ agencyId }: { agencyId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(async () => {
      await approveAgency(agencyId);
      router.refresh();
    });
  }

  function handleReject() {
    startTransition(async () => {
      await rejectAgency(agencyId);
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleApprove}
        disabled={isPending}
        className="rounded-lg bg-success px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        Approve
      </button>
      <button
        type="button"
        onClick={handleReject}
        disabled={isPending}
        className="rounded-lg border border-danger px-4 py-2 text-sm font-semibold text-danger hover:bg-danger/5 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
