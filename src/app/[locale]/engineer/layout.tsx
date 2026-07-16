import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EngineerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireRole(locale, ["individual_engineer", "admin"]);
  return <>{children}</>;
}
