"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PortalShell } from "@/components/layout/PortalShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { StepWizard } from "@/components/ui/StepWizard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Textarea } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { cn } from "@/lib/utils";
import { ENGINEERING_SERVICES, SERVICE_PACKAGES } from "@/data/catalog";
import { createProjectRequest, floatProjectRequest, getRequestById, uploadRequestDocument } from "@/actions/requests";
import { getClientNav } from "@/lib/nav";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function NewRequestPage() {
  const t = useTranslations("client");
  const tc = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draft");
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);

  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [location, setLocation] = useState({ city: "", district: "" });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [documents, setDocuments] = useState<{ id: string; file_name: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  const nav = getClientNav(t, tc);

  useEffect(() => {
    if (!draftId) return;
    (async () => {
      const draft = await getRequestById(draftId);
      if (!draft || draft.status !== "draft") return;
      setRequestId(draft.id);
      setTitle(draft.title ?? "");
      setDescription(draft.description ?? "");
      setLocation({
        city: draft.location_city ?? "",
        district: draft.location_district ?? "",
      });
      const pkg = draft.service_packages;
      const pkgName = Array.isArray(pkg) ? pkg[0]?.name : pkg?.name;
      if (pkgName) setSelectedPackage(pkgName);
      const svcIds = (draft.request_services ?? []).map(
        (rs: { service_id: number }) => rs.service_id
      );
      if (svcIds.length) setSelectedServices(svcIds);
      setDocuments((draft.request_documents ?? []).map((d: { id: string; file_name: string }) => ({
        id: d.id,
        file_name: d.file_name,
      })));
    })();
  }, [draftId]);

  async function ensureDraft(): Promise<string | null> {
    if (requestId) return requestId;
    if (!location.city || !title) return null;

    const pkg = SERVICE_PACKAGES.find((p) => p.name === selectedPackage);
    const result = await createProjectRequest({
      title,
      description,
      location_city: location.city,
      location_district: location.district,
      package_id: pkg ? SERVICE_PACKAGES.indexOf(pkg) + 1 : undefined,
      service_ids: selectedServices,
    });
    if (result.error || !result.requestId) {
      setError(result.error ?? "Failed to save draft");
      return null;
    }
    setRequestId(result.requestId);
    return result.requestId;
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    const id = await ensureDraft();
    if (!id) {
      setUploading(false);
      return;
    }
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadRequestDocument(id, formData);
    setUploading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setDocuments((prev) => [...prev, { id: crypto.randomUUID(), file_name: file.name }]);
    e.target.value = "";
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

  function handleSaveAndFloat() {
    setError("");
    if (selectedServices.length === 0) {
      setError("Select at least one service before floating your request.");
      return;
    }
    startTransition(async () => {
      const pkg = SERVICE_PACKAGES.find((p) => p.name === selectedPackage);

      let id = requestId;
      if (!id) {
        const result = await createProjectRequest({
          title: title || `${selectedPackage || "Engineering"} Request`,
          description,
          location_city: location.city,
          location_district: location.district,
          package_id: pkg ? SERVICE_PACKAGES.indexOf(pkg) + 1 : undefined,
          service_ids: selectedServices,
        });
        if (result.error) {
          setError(result.error);
          return;
        }
        id = result.requestId!;
        setRequestId(id);
      }

      if (!id) {
        setError("Failed to create request");
        return;
      }

      const floatResult = await floatProjectRequest(id);
      if (floatResult.error) {
        setError(floatResult.error);
        return;
      }

      router.push("/client/requests");
    });
  }

  const WIZARD_STEPS = ["Package", "Services", "Location", "Documents", "Review"];

  return (
    <PortalShell title={t("title")} nav={nav}>
      <PageHeader
        title={t("newRequest")}
        description="Build your project request step by step, then float it to licensed engineering offices."
      />

      <StepWizard steps={WIZARD_STEPS} currentStep={step} onStepClick={setStep} />

      <Card className="mt-8">
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Select Package</h2>
              <p className="mt-1 text-sm text-muted">Choose a homeowner journey package or skip to select individual services</p>
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
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Select Services ({selectedServices.length} selected)
              </h2>
              <div className="mt-6 max-h-96 space-y-2 overflow-y-auto pe-1">
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

          {step === 3 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="City" required className="sm:col-span-1">
                <Input
                  required
                  value={location.city}
                  onChange={(e) => setLocation({ ...location, city: e.target.value })}
                  placeholder="Riyadh"
                />
              </FormField>
              <FormField label="District" className="sm:col-span-1">
                <Input
                  value={location.district}
                  onChange={(e) => setLocation({ ...location, district: e.target.value })}
                  placeholder="Al Olaya"
                />
              </FormField>
              <FormField label="Project title" required className="sm:col-span-2">
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Villa structural design"
                />
              </FormField>
              <FormField label="Description" className="sm:col-span-2">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe your project requirements..."
                />
              </FormField>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight">Upload Documents</h2>
              <p className="text-sm text-muted">PDF, images, or DWG files (max 50MB)</p>
              <div className="rounded-xl border-2 border-dashed border-border-subtle bg-surface-muted/50 p-8 text-center">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.dwg,application/pdf,image/*"
                  onChange={handleFileUpload}
                  disabled={uploading || isPending}
                  className="mx-auto block text-sm"
                />
              </div>
              {uploading && <p className="text-sm text-muted">Uploading…</p>}
              {documents.length > 0 && (
                <ul className="space-y-2 text-sm">
                  {documents.map((d) => (
                    <li key={d.id} className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-success">✓</span> {d.file_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Review & Float Request</h2>
              <dl className="mt-6 divide-y divide-border-subtle rounded-xl border border-border-subtle">
                {[
                  ["Package", selectedPackage || "Custom selection"],
                  ["Services", `${selectedServices.length} selected`],
                  ["Location", `${location.city}${location.district ? `, ${location.district}` : ""}`],
                  ["Documents", `${documents.length} uploaded`],
                  ["Title", title],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                    <dt className="text-muted">{label}</dt>
                    <dd className="font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
              {error && <Alert variant="error" className="mt-4">{error}</Alert>}
              <Button
                type="button"
                onClick={handleSaveAndFloat}
                disabled={isPending || !location.city || !title}
                className="mt-6"
                size="lg"
              >
                {isPending ? "Floating…" : "Float Request to Agencies"}
              </Button>
            </div>
          )}

          {error && step !== 5 && <Alert variant="error" className="mt-4">{error}</Alert>}

          {step < 5 && (
            <Button
              type="button"
              onClick={() => {
                if (step === 2 && selectedServices.length === 0) {
                  setError("Select at least one service to continue.");
                  return;
                }
                setError("");
                setStep(step + 1);
              }}
              disabled={step === 2 && selectedServices.length === 0}
              className="mt-6"
            >
              Continue
            </Button>
          )}
      </Card>
    </PortalShell>
  );
}
