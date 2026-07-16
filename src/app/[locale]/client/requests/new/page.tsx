"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
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

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={nav} />
      <div className="flex-1 bg-surface-muted p-8">
        <h1 className="text-2xl font-bold">{t("newRequest")}</h1>

        <div className="mt-6 flex gap-2">
          {["Package", "Services", "Location", "Documents", "Review"].map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(i + 1)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                step === i + 1 ? "bg-primary text-white" : "border border-border bg-surface text-muted"
              }`}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-border bg-surface p-6">
          {step === 1 && (
            <div>
              <h2 className="font-semibold">Select Package</h2>
              <p className="mt-1 text-sm text-muted">Choose a homeowner journey package or skip to select individual services</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {SERVICE_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.slug}
                    type="button"
                    onClick={() => handlePackageSelect(pkg.name)}
                    className={`rounded-lg border p-4 text-start text-sm ${
                      selectedPackage === pkg.name
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold">{pkg.name}</p>
                    <p className="mt-1 text-xs text-muted">{pkg.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-semibold">Select Services ({selectedServices.length} selected)</h2>
              <div className="mt-4 max-h-96 space-y-2 overflow-y-auto">
                {(selectedPackage
                  ? ENGINEERING_SERVICES.filter((s) => s.packages.includes(selectedPackage))
                  : ENGINEERING_SERVICES
                ).map((s) => (
                  <label key={s.id} className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(s.id)}
                      onChange={() => toggleService(s.id)}
                    />
                    <span className="flex-1">{s.name}</span>
                    <span className="text-xs text-muted">{s.category}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold">Project Location & Details</h2>
              <input
                placeholder="City *"
                required
                value={location.city}
                onChange={(e) => setLocation({ ...location, city: e.target.value })}
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
              />
              <input
                placeholder="District"
                value={location.district}
                onChange={(e) => setLocation({ ...location, district: e.target.value })}
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
              />
              <input
                placeholder="Project title *"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
              />
              <textarea
                placeholder="Project description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm"
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-semibold">Upload Documents</h2>
              <p className="text-sm text-muted">PDF, images, or DWG files (max 50MB)</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.dwg,application/pdf,image/*"
                onChange={handleFileUpload}
                disabled={uploading || isPending}
                className="block w-full text-sm"
              />
              {uploading && <p className="text-sm text-muted">Uploading...</p>}
              {documents.length > 0 && (
                <ul className="space-y-1 text-sm">
                  {documents.map((d) => (
                    <li key={d.id} className="text-muted">✓ {d.file_name}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="font-semibold">Review & Float Request</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div><dt className="text-muted">Package</dt><dd className="font-medium">{selectedPackage || "Custom selection"}</dd></div>
                <div><dt className="text-muted">Services</dt><dd className="font-medium">{selectedServices.length} selected</dd></div>
                <div><dt className="text-muted">Location</dt><dd className="font-medium">{location.city}{location.district ? `, ${location.district}` : ""}</dd></div>
                <div><dt className="text-muted">Documents</dt><dd className="font-medium">{documents.length} uploaded</dd></div>
                <div><dt className="text-muted">Title</dt><dd className="font-medium">{title}</dd></div>
              </dl>
              {error && <p className="mt-4 text-sm text-danger">{error}</p>}
              <button
                type="button"
                onClick={handleSaveAndFloat}
                disabled={isPending || !location.city || !title}
                className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
              >
                {isPending ? "Floating..." : "Float Request to Agencies"}
              </button>
            </div>
          )}

          {step < 5 && (
            <button
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
              className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
