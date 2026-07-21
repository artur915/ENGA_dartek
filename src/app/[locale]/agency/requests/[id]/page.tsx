import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { getRequestById } from "@/actions/requests";
import { getMyAgency } from "@/actions/agency";
import { SubmitQuotationForm } from "@/components/quotations/SubmitQuotationForm";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getAgencyNav } from "@/lib/nav";

export default async function AgencyRequestDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("agency");
  const tc = await getTranslations("common");
  const ts = await getTranslations("status.request");
  const tr = await getTranslations("agency.requestDetail");

  const [request, agency] = await Promise.all([getRequestById(id), getMyAgency()]);
  if (!request) notFound();

  const nav = getAgencyNav(t, tc);

  const services = request.request_services as { engineering_services: { name: string } }[] | null;
  const documents = (request.request_documents ?? []) as { id: string; file_name: string }[];
  const serviceNames =
    services?.map((rs) => rs.engineering_services?.name).filter(Boolean) ?? [];
  const pkg = request.service_packages as { name: string } | { name: string }[] | null;
  const packageName = Array.isArray(pkg) ? pkg[0]?.name : pkg?.name;

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={nav} />
      <div className="flex-1 bg-surface-muted p-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{request.title}</h1>
          <Badge>{ts.has(request.status) ? ts(request.status) : request.status}</Badge>
        </div>
        <p className="mt-1 text-muted">
          {request.location_city}
          {request.location_district ? `, ${request.location_district}` : ""}
        </p>

        <div className="mt-8 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <Card>
            <h2 className="font-semibold">{tr("projectDetails")}</h2>
            {request.description && (
              <p className="mt-3 text-sm text-muted">{request.description}</p>
            )}
            {packageName && (
              <p className="mt-3 text-sm">
                <span className="font-medium">{tr("package")}:</span> {packageName}
              </p>
            )}
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-muted">{tr("servicesRequested")}</p>
              <ul className="mt-2 space-y-1">
                {services?.map((rs, i) => (
                  <li key={i} className="text-sm">• {rs.engineering_services?.name}</li>
                ))}
              </ul>
            </div>
            {documents.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase text-muted">{tr("clientDocuments")}</p>
                <ul className="mt-2 space-y-1">
                  {documents.map((d) => (
                    <li key={d.id} className="text-sm text-muted">📎 {d.file_name}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          <SubmitQuotationForm
            context={{
              requestId: id,
              requestTitle: request.title,
              requestDescription: request.description ?? undefined,
              location: [request.location_city, request.location_district].filter(Boolean).join(", "),
              packageName,
              serviceNames,
              agencyName: agency?.name,
            }}
          />
        </div>
      </div>
    </div>
  );
}
