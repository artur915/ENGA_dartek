import { setRequestLocale } from "next-intl/server";
import { getMyAgency, type AgencyRegistration } from "@/actions/agency";
import { requireRole } from "@/lib/auth";
import AgencyRegisterClient from "./AgencyRegisterClient";

export default async function AgencyRegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profile = await requireRole(locale, [
    "agency_owner",
    "agency_employee",
    "finance_user",
    "admin",
  ]);
  const agency = (await getMyAgency()) as AgencyRegistration | null;
  const canRegister = profile.role === "agency_owner" || profile.role === "admin";

  return (
    <AgencyRegisterClient existingAgency={agency} canRegister={canRegister} />
  );
}
