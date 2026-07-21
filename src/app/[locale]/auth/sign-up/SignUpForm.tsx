"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { signUp } from "@/actions/auth";
import { ROLE_PORTAL, REGISTRATION_PORTAL, type UserRole } from "@/types";
import { Building2 } from "lucide-react";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

export function SignUpForm({ initialRole }: { initialRole: UserRole }) {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>(initialRole);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordsMatch = password === confirmPassword;
  const showPasswordMismatch = confirmPassword.length > 0 && !passwordsMatch;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      setLoading(false);
      return;
    }

    const result = await signUp({
      email,
      password,
      fullName,
      role,
      redirectOrigin: window.location.origin,
    });

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result.needsConfirmation) {
      setSuccess(
        "Account created! Check your email and click the confirmation link, then sign in."
      );
      setLoading(false);
      return;
    }

    const userRole = (result.role ?? role) as UserRole;
    router.push(REGISTRATION_PORTAL[userRole] ?? ROLE_PORTAL[userRole] ?? "/client");
  }

  return (
    <AuthShell
      title={tc("signUp")}
      subtitle={tc("tagline")}
      icon={Building2}
      footer={
        <p className="text-center text-sm text-muted">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/auth/sign-in" className="link-primary">
            {tc("signIn")}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label={t("fullName")} required>
          <Input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />
        </FormField>
        <FormField label={t("email")} required>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </FormField>
        <FormField label={t("password")} required hint="Minimum 8 characters">
          <Input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </FormField>
        <FormField
          label={t("confirmPassword")}
          required
          error={showPasswordMismatch ? t("passwordsDoNotMatch") : undefined}
        >
          <Input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            error={showPasswordMismatch}
          />
        </FormField>
        <FormField label={t("role")} required>
          <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
            <option value="client">{t("roles.client")}</option>
            <option value="agency_owner">{t("roles.agency_owner")}</option>
          </Select>
        </FormField>
        {error && <Alert variant="error">{error}</Alert>}
        {success && (
          <Alert variant="success" title="Account created">
            {success}
            <Link href="/auth/sign-in" className="link-primary mt-2 inline-block text-xs">
              Go to Sign In →
            </Link>
          </Alert>
        )}
        <Button
          type="submit"
          fullWidth
          disabled={loading || showPasswordMismatch}
          size="lg"
        >
          {loading ? "Creating account…" : t("createAccount")}
        </Button>
      </form>
    </AuthShell>
  );
}
