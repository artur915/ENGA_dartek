"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PortalShell } from "@/components/layout/PortalShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { StepWizard } from "@/components/ui/StepWizard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { cn } from "@/lib/utils";
import { ENGINEERING_SERVICES, SERVICE_PACKAGES } from "@/data/catalog";
import {
  createProjectRequest,
  floatProjectRequest,
  getApprovedAgencies,
  getRequestById,
  updateProjectRequest,
  uploadRequestDocument,
  type DistributionType,
  type DocumentCategory,
  type RequestUrgency,
} from "@/actions/requests";
import { generateRequestDescription } from "@/actions/ai";
import {
  RequestDetailsStep,
  formatLocationInput,
  parseLocationInput,
} from "@/components/client/RequestDetailsStep";
import { getClientNav } from "@/lib/nav";

type DocumentItem = { id: string; file_name: string; category: DocumentCategory };

function isSchemaMigrationError(message: string): boolean {
  return (
    message.includes("distribution_region") ||
    message.includes("distribution_type") ||
    message.includes("selected_agency_ids") ||
    message.includes("schema cache")
  );
}

export function NewRequestForm({ draftId }: { draftId: string | null }) {
  const t = useTranslations("client");
  const tf = useTranslations("client.requestForm");
  const tc = useTranslations("common");
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);

  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<RequestUrgency>("normal");
  const [requiredQuotations, setRequiredQuotations] = useState<number | null>(5);
  const [quotationDeadline, setQuotationDeadline] = useState("");
  const [distributionType, setDistributionType] = useState<DistributionType>("all");
  const [distributionRegion, setDistributionRegion] = useState("");
  const [selectedAgencyIds, setSelectedAgencyIds] = useState<string[]>([]);
  const [agencies, setAgencies] = useState<{ id: string; name: string; service_areas: string[] | null }[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [uploadingCategory, setUploadingCategory] = useState<DocumentCategory | null>(null);

  const nav = getClientNav(t, tc);
  const WIZARD_STEPS = [tf("stepServices"), tf("stepDetails"), tf("stepReview")];

  useEffect(() => {
    getApprovedAgencies().then(setAgencies);
  }, []);

  useEffect(() => {
    if (!draftId) return;
    (async () => {
      const draft = await getRequestById(draftId);
      if (!draft || draft.status !== "draft") return;
      setRequestId(draft.id);
      setDescription(draft.description ?? "");
      setLocationInput(formatLocationInput(draft.location_city ?? "", draft.location_district ?? ""));
      setUrgency((draft.urgency as RequestUrgency) ?? "normal");
      setRequiredQuotations(
        draft.required_quotations === undefined ? 5 : draft.required_quotations
      );
      setQuotationDeadline(draft.quotation_deadline ?? "");
      setDistributionType((draft.distribution_type as DistributionType) ?? "all");
      setDistributionRegion(draft.distribution_region ?? "");
      setSelectedAgencyIds(draft.selected_agency_ids ?? []);

      const pkg = draft.service_packages;
      const pkgName = Array.isArray(pkg) ? pkg[0]?.name : pkg?.name;
      if (pkgName) setSelectedPackage(pkgName);
      const svcIds = (draft.request_services ?? []).map(
        (rs: { service_id: number }) => rs.service_id
      );
      if (svcIds.length) setSelectedServices(svcIds);
      setDocuments(
        (draft.request_documents ?? []).map(
          (d: { id: string; file_name: string; category?: DocumentCategory }) => ({
            id: d.id,
            file_name: d.file_name,
            category: d.category ?? "documents",
          })
        )
      );
    })();
  }, [draftId]);

  function buildTitle(): string {
    const names = selectedServices
      .map((id) => ENGINEERING_SERVICES.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .slice(0, 2);
    const base = names.length ? names.join(" & ") : selectedPackage || "Engineering";
    const { city } = parseLocationInput(locationInput);
    return city ? `${base} тАФ ${city}` : `${base} Request`;
  }

  function buildPayload() {
    const { city, district } = parseLocationInput(locationInput);
    const pkg = SERVICE_PACKAGES.find((p) => p.name === selectedPackage);
    return {
      title: buildTitle(),
      description,
      location_city: city,
      location_district: district || undefined,
      package_id: pkg ? SERVICE_PACKAGES.indexOf(pkg) + 1 : undefined,
      service_ids: selectedServices,
      urgency,
      required_quotations: requiredQuotations,
      quotation_deadline: requiredQuotations === null ? quotationDeadline || null : null,
      distribution_type: distributionType,
      distribution_region: distributionType === "region" ? distributionRegion : null,
      selected_agency_ids: distributionType === "agencies" ? selectedAgencyIds : [],
    };
  }

  async function ensureDraft(): Promise<string | null> {
    const payload = buildPayload();
    if (!payload.location_city) return null;

    if (requestId) {
      const result = await updateProjectRequest(requestId, payload);
      if (result.error) {
        setError(isSchemaMigrationError(result.error) ? tf("migrationRequired") : result.error);
        return null;
      }
      return requestId;
    }

    const result = await createProjectRequest(payload);
    if (result.error || !result.requestId) {
      setError(
        result.error && isSchemaMigrationError(result.error)
          ? tf("migrationRequired")
          : (result.error ?? "Failed to save draft")
      );
      return null;
    }
    setRequestId(result.requestId);
    return result.requestId;
  }

  async function handleUpload(category: DocumentCategory, file: File) {
    setError("");
    setUploadingCategory(category);
    const id = await ensureDraft();
    if (!id) {
      setUploadingCategory(null);
      return;
    }
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadRequestDocument(id, formData, category);
    setUploadingCategory(null);
      if (result.error) {
        setError(isSchemaMigrationError(result.error) ? tf("migrationRequired") : result.error);
        return;
      }
    setDocuments((prev) => [
      ...prev,
      { id: `upload-${prev.length}-${file.name}`, file_name: file.name, category },
    ]);
  }

  async function handleGenerateDescription() {
    setError("");
    const serviceNames = selectedServices
      .map((id) => ENGINEERING_SERVICES.find((s) => s.id === id)?.name)
      .filter(Boolean) as string[];
    const result = await generateRequestDescription({
      serviceNames,
      location: locationInput,
      notes: description,
      urgency,
      packageName: selectedPackage || undefined,
    });
    setDescription(result.description);
  }

  function validateStep1(): string | null {
    if (selectedServices.length === 0) return tf("errorServices");
    return null;
  }

  function validateStep2(): string | null {
    const { city } = parseLocationInput(locationInput);
    if (!city) return tf("errorLocation");
    if (requiredQuotations === null && !quotationDeadline) return tf("errorDeadline");
    if (distributionType === "region" && !distributionRegion) return tf("errorRegion");
    if (distributionType === "agencies" && selectedAgencyIds.length === 0) {
      return tf("errorAgencies");
    }
    return null;
  }

  function getStepValidationError(stepNum: number): string | null {
    if (stepNum === 1) return validateStep1();
    if (stepNum === 2) return validateStep2();
    return null;
  }

  function isStepValid(stepNum: number): boolean {
    return getStepValidationError(stepNum) === null;
  }

  function isStepReachable(targetStep: number): boolean {
    if (targetStep <= step) return true;
    for (let s = 1; s < targetStep; s++) {
      if (!isStepValid(s)) return false;
    }
    return true;
  }

  function navigateToStep(targetStep: number) {
    setError("");
    if (targetStep === step) return;

    if (targetStep < step) {
      setStep(targetStep);
      return;
    }

    for (let s = 1; s < targetStep; s++) {
      const validationError = getStepValidationError(s);
      if (validationError) {
        setError(validationError);
        setStep(s);
        return;
      }
    }

    if (targetStep >= 3) {
      startTransition(async () => {
        const id = await ensureDraft();
        if (!id) return;
        setStep(targetStep);
      });
      return;
    }

    setStep(targetStep);
  }

  function handleNext() {
    navigateToStep(step + 1);
  }

  function handleSaveAndFloat() {
    setError("");
    const step1Error = validateStep1();
    if (step1Error) {
      setError(step1Error);
      setStep(1);
      return;
    }
    const step2Error = validateStep2();
    if (step2Error) {
      setError(step2Error);
      setStep(2);
      return;
    }

    startTransition(async () => {
      const id = await ensureDraft();
      if (!id) return;

      const floatResult = await floatProjectRequest(id);
      if (floatResult.error) {
        setError(
          isSchemaMigrationError(floatResult.error)
            ? tf("migrationRequired")
            : floatResult.error
        );
        return;
      }
      router.push("/client/requests");
    });
  }

  function toggleService(id: number) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function handlePackageSelect(pkgName: string) {
    setSelectedPackage(pkgName);
    setSelectedServices([]);
  }

  return (
    <PortalShell title={t("title")} nav={nav}>
      <PageHeader title={tf("pageTitle")} description={tf("pageDescription")} />

      <StepWizard
        steps={WIZARD_STEPS}
        currentStep={step}
        onStepClick={navigateToStep}
        isStepReachable={isStepReachable}
      />

      <Card className="mt-8">
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{tf("chooseServices")}</h2>
            <p className="mt-1 text-sm text-muted">{tf("chooseServicesHint")}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {SERVICE_PACKAGES.map((pkg) => (
                <button
                  key={pkg.slug}
                  type="button"
                  onClick={() => handlePackageSelect(pkg.name)}
                  className={cn(
                    "rounded-xl border p-5 text-start text-sm transition-all duration-200",
                    selectedPackage === pkg.name
                      ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20"
                      : "border-border-subtle hover:border-primary/30 hover:bg-surface-muted"
                  )}
                >
                  <p className="font-semibold text-foreground">{pkg.name}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">{pkg.description}</p>
                </button>
              ))}
            </div>

            <h3 className="mt-8 text-sm font-semibold">
              {tf("selectedServices", { count: selectedServices.length })}
            </h3>
            <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pe-1">
              {(selectedPackage
                ? ENGINEERING_SERVICES.filter((s) => s.packages.includes(selectedPackage))
                : ENGINEERING_SERVICES
              ).map((s) => (
                <label
                  key={s.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm transition-colors",
                    selectedServices.includes(s.id)
                      ? "border-primary/30 bg-primary/5"
                      : "border-border-subtle hover:border-primary/20"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(s.id)}
                    onChange={() => toggleService(s.id)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="flex-1 font-medium">{s.name}</span>
                  <span className="text-xs text-muted">{s.category}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <RequestDetailsStep
            location={locationInput}
            onLocationChange={setLocationInput}
            description={description}
            onDescriptionChange={setDescription}
            urgency={urgency}
            onUrgencyChange={setUrgency}
            requiredQuotations={requiredQuotations}
            onRequiredQuotationsChange={setRequiredQuotations}
            quotationDeadline={quotationDeadline}
            onQuotationDeadlineChange={setQuotationDeadline}
            distributionType={distributionType}
            onDistributionTypeChange={setDistributionType}
            distributionRegion={distributionRegion}
            onDistributionRegionChange={setDistributionRegion}
            selectedAgencyIds={selectedAgencyIds}
            onSelectedAgencyIdsChange={setSelectedAgencyIds}
            agencies={agencies}
            documents={documents}
            onUpload={handleUpload}
            uploadingCategory={uploadingCategory}
            onChangeServices={() => setStep(1)}
            onGenerateDescription={handleGenerateDescription}
          />
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{tf("reviewSubmit")}</h2>
            <dl className="mt-6 divide-y divide-border-subtle rounded-xl border border-border-subtle">
              {[
                [tf("reviewPackage"), selectedPackage || tf("customSelection")],
                [tf("reviewServices"), tf("servicesCount", { count: selectedServices.length })],
                [tf("reviewLocation"), locationInput || "тАФ"],
                [tf("reviewUrgency"), urgency === "urgent" ? tf("urgencyUrgent") : tf("urgencyNormal")],
                [
                  tf("reviewQuotations"),
                  requiredQuotations === null ? tf("unlimited") : String(requiredQuotations),
                ],
                ...(requiredQuotations === null && quotationDeadline
                  ? [[tf("deadline"), quotationDeadline] as [string, string]]
                  : []),
                [
                  tf("distribution"),
                  distributionType === "all"
                    ? tf("distributionAll.title")
                    : distributionType === "region"
                      ? distributionRegion
                      : tf("agenciesSelected", { count: selectedAgencyIds.length }),
                ],
                [tf("reviewDocuments"), String(documents.length)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                  <dt className="text-muted">{label}</dt>
                  <dd className="text-end font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
            {description && (
              <div className="mt-4 rounded-xl border border-border-subtle p-4">
                <p className="text-xs font-semibold uppercase text-muted">{tf("remarks")}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm">{description}</p>
              </div>
            )}
          </div>
        )}

        {error && <Alert variant="error" className="mt-4">{error}</Alert>}

        <div className="mt-8 flex items-center justify-between border-t border-border-subtle pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setError("");
              if (step > 1) setStep(step - 1);
            }}
            disabled={step === 1 || isPending}
          >
            {tf("back")}
          </Button>

          {step < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isPending || !isStepValid(step)}
            >
              {isPending ? tf("saving") : tf("nextStep")}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSaveAndFloat}
              disabled={isPending || !isStepValid(1) || !isStepValid(2)}
              size="lg"
            >
              {isPending ? tf("submitting") : tf("submitRequest")}
            </Button>
          )}
        </div>
      </Card>
    </PortalShell>
  );
}
