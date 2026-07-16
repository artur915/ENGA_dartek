import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AgencyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireRole(locale, ["agency_owner", "agency_employee", "finance_user", "admin"]);
  return <>{children}</>;
}
