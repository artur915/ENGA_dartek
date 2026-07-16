import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { FinanceDashboard } from "@/components/finance/FinanceDashboard";
import { getFinanceRecords } from "@/actions/finance";
import { getAgencyNav } from "@/lib/nav";

export default async function AgencyFinancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("agency");
  const tc = await getTranslations("common");
  const { records, summary } = await getFinanceRecords();

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={getAgencyNav(t, tc)} />
      <div className="flex-1 bg-surface-muted p-8">
        <h1 className="text-2xl font-bold">{t("financeLite")}</h1>
        <p className="mt-1 text-muted">Project income, external income, invoices, expenses & balances</p>
        <div className="mt-8">
          <FinanceDashboard summary={summary} records={records} />
        </div>
      </div>
    </div>
  );
}
