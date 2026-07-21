"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { signIn } from "@/actions/auth";
import { ROLE_PORTAL, type UserRole } from "@/types";
import { Building2 } from "lucide-react";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

export default function SignInPage() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const tf = useTranslations("landing.footer");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn({ email, password });

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
      return;
    }

    const role = (result.role ?? "client") as UserRole;
    router.push(ROLE_PORTAL[role] ?? "/client");
    router.refresh();
  }

  return (
    <AuthShell
      title={tc("signIn")}
      subtitle={tc("tagline")}
      icon={Building2}
      shellEyebrow={t("shellEyebrow")}
      shellTitle={t("shellTitle")}
      shellSubtitle={t("shellSubtitle")}
      shellRegion={tf("region")}
      footer={
        <p className="text-center text-sm text-muted">
          {t("noAccount")}{" "}
          <Link href="/auth/sign-up" className="link-primary">
            {tc("signUp")}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label={t("email")} required>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
          />
        </FormField>
        <FormField label={t("password")} required>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </FormField>
        {error && <Alert variant="error">{error}</Alert>}
        <Button type="submit" fullWidth disabled={loading} size="lg">
          {loading ? t("signingIn") : tc("signIn")}
        </Button>
      </form>
    </AuthShell>
  );
}
