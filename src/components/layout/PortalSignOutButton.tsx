"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "@/actions/auth";
import { cn } from "@/lib/utils";

export function PortalSignOutButton({ className }: { className?: string }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => signOut(locale))}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark disabled:opacity-50",
        className
      )}
    >
      <LogOut className="hidden h-4 w-4 sm:inline" />
      {t("signOut")}
    </button>
  );
}
