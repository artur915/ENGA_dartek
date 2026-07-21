import { SignUpForm } from "./SignUpForm";
import { type UserRole } from "@/types";

const VALID_ROLES = ["client", "agency_owner"] as const;

function parseRole(role?: string): UserRole {
  if (role && VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
    return role as UserRole;
  }
  return "client";
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;

  return <SignUpForm initialRole={parseRole(role)} />;
}
