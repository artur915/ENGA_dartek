import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { Card } from "@/components/ui/Card";
import { EngineerProfileForm } from "@/components/engineer/EngineerProfileForm";
import { getEngineerProfile, requireEngineerRegistered } from "@/actions/engineer";
import { getEngineerNav } from "@/lib/nav";

export default async function EngineerProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireEngineerRegistered(locale);
  const t = await getTranslations("engineer");
  const tc = await getTranslations("common");
  const profile = await getEngineerProfile();

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={getEngineerNav(t, tc)} />
      <div className="flex-1 bg-surface-muted p-8">
        <h1 className="text-2xl font-bold">{t("profile")}</h1>
        <p className="mt-1 text-muted">Council membership, specialization, experience & portfolio</p>
        <Card className="mt-8 max-w-2xl">
          <EngineerProfileForm initial={profile} />
        </Card>
      </div>
    </div>
  );
}
