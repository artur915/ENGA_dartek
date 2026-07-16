import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { getRequestById } from "@/actions/requests";
import { getQuotationsForRequest } from "@/actions/quotations";
import { QuotationCompare } from "@/components/quotations/QuotationCompare";

export default async function ClientQuotationsPage({
  params,
}: {
  params: Promise<{ locale: string; requestId: string }>;
}) {
  const { locale, requestId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("client");
  const tc = await getTranslations("common");

  const request = await getRequestById(requestId);
  if (!request) notFound();

  const quotations = await getQuotationsForRequest(requestId);

  const nav = [
    { href: "/client", label: tc("dashboard"), icon: "LayoutDashboard" },
    { href: "/client/requests", label: t("myRequests"), icon: "ClipboardList" },
    { href: "/client/requests/new", label: t("newRequest"), icon: "Plus" },
    { href: "/client/quotations", label: t("compareQuotes"), icon: "FileText" },
    { href: "/client/projects", label: t("activeProjects"), icon: "FolderKanban" },
  ];

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={nav} />
      <div className="flex-1 bg-surface-muted p-8">
        <h1 className="text-2xl font-bold">{t("compareQuotes")}</h1>
        <p className="mt-1 text-muted">{request.title} — {request.location_city}</p>

        <QuotationCompare
          requestId={requestId}
          quotations={quotations}
          requestStatus={request.status}
        />
      </div>
    </div>
  );
}
