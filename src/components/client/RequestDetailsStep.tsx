"use client";

import { useMemo, useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  MapPin,
  Sparkles,
  Paperclip,
  FileText,
  ImageIcon,
  Clock,
  Zap,
  Infinity,
  Globe,
  Building2,
  Search,
  Check,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { SAUDI_REGIONS } from "@/data/regions";
import { getRegionLabel } from "@/lib/regions-i18n";
import type { DistributionType, DocumentCategory, RequestUrgency } from "@/actions/requests";

type AgencyOption = { id: string; name: string; service_areas: string[] | null };

type DocumentItem = { id: string; file_name: string; category: DocumentCategory };

const QUOTATION_OPTIONS = [3, 5, 10] as const;

const UPLOAD_CONFIG: Record<
  DocumentCategory,
  { icon: typeof Paperclip; accept: string; formats: string }
> = {
  drawings: { icon: Paperclip, accept: ".dwg,.pdf,.rvt", formats: "DWG, PDF, RVT" },
  documents: { icon: FileText, accept: ".pdf,.doc,.docx,.xls,.xlsx", formats: "PDF, DOC, XLS" },
  photos: { icon: ImageIcon, accept: ".jpg,.jpeg,.png,.heic,.webp,image/*", formats: "JPG, PNG, HEIC" },
};

function DistributionCard({
  selected,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: typeof Globe;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-1 flex-col items-start rounded-xl border p-4 text-start transition-all",
        selected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border-subtle bg-surface hover:border-primary/20"
      )}
    >
      {selected && (
        <span className="absolute end-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
          <Check className="h-3 w-3" />
        </span>
      )}
      <span
        className={cn(
          "mb-3 flex h-10 w-10 items-center justify-center rounded-lg",
          selected ? "bg-primary text-white" : "bg-surface-muted text-muted-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className={cn("font-semibold", selected && "text-primary")}>{title}</span>
      <span className="mt-1 text-xs leading-relaxed text-muted">{description}</span>
    </button>
  );
}

function PillButton({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
        selected
          ? "border-primary bg-primary/5 text-primary"
          : "border-border-subtle text-muted-foreground hover:border-primary/30",
        className
      )}
    >
      {children}
    </button>
  );
}

export function RequestDetailsStep({
  location,
  onLocationChange,
  description,
  onDescriptionChange,
  urgency,
  onUrgencyChange,
  requiredQuotations,
  onRequiredQuotationsChange,
  quotationDeadline,
  onQuotationDeadlineChange,
  distributionType,
  onDistributionTypeChange,
  distributionRegion,
  onDistributionRegionChange,
  selectedAgencyIds,
  onSelectedAgencyIdsChange,
  agencies,
  documents,
  onUpload,
  uploadingCategory,
  onChangeServices,
  onGenerateDescription,
}: {
  location: string;
  onLocationChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  urgency: RequestUrgency;
  onUrgencyChange: (value: RequestUrgency) => void;
  requiredQuotations: number | null;
  onRequiredQuotationsChange: (value: number | null) => void;
  quotationDeadline: string;
  onQuotationDeadlineChange: (value: string) => void;
  distributionType: DistributionType;
  onDistributionTypeChange: (value: DistributionType) => void;
  distributionRegion: string;
  onDistributionRegionChange: (value: string) => void;
  selectedAgencyIds: string[];
  onSelectedAgencyIdsChange: (ids: string[]) => void;
  agencies: AgencyOption[];
  documents: DocumentItem[];
  onUpload: (category: DocumentCategory, file: File) => void;
  uploadingCategory: DocumentCategory | null;
  onChangeServices: () => void;
  onGenerateDescription: () => Promise<void>;
}) {
  const t = useTranslations("client.requestForm");
  const locale = useLocale();
  const [agencySearch, setAgencySearch] = useState("");
  const [isGenerating, startGenerate] = useTransition();

  const filteredAgencies = useMemo(() => {
    const q = agencySearch.trim().toLowerCase();
    if (!q) return agencies;
    return agencies.filter((a) => a.name.toLowerCase().includes(q));
  }, [agencies, agencySearch]);

  function toggleAgency(id: string) {
    onSelectedAgencyIdsChange(
      selectedAgencyIds.includes(id)
        ? selectedAgencyIds.filter((x) => x !== id)
        : [...selectedAgencyIds, id]
    );
  }

  function docsForCategory(category: DocumentCategory) {
    return documents.filter((d) => d.category === category);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight">{t("requestDetails")}</h2>
        <button
          type="button"
          onClick={onChangeServices}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <Pencil className="h-4 w-4" />
          {t("changeServices")}
        </button>
      </div>

      <div>
        <Label>{t("projectLocation")}</Label>
        <div className="relative mt-2">
          <MapPin className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder={t("locationPlaceholder")}
            className="ps-10"
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <Label>{t("remarks")}</Label>
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => startGenerate(() => onGenerateDescription())}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/5 disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {isGenerating ? t("generating") : t("aiAssist")}
          </button>
        </div>
        <Textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={5}
          placeholder={t("remarksPlaceholder")}
        />
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {t("aiHint")}
        </p>
      </div>

      <div>
        <Label>{t("attachmentsOptional")}</Label>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {(Object.keys(UPLOAD_CONFIG) as DocumentCategory[]).map((category) => {
            const config = UPLOAD_CONFIG[category];
            const Icon = config.icon;
            const items = docsForCategory(category);
            return (
              <div
                key={category}
                className="flex flex-col items-center rounded-xl border-2 border-dashed border-border-subtle bg-surface-muted/40 px-4 py-6 text-center"
              >
                <Icon className="mb-2 h-6 w-6 text-muted" />
                <p className="text-sm font-semibold">{t(`attachment.${category}.title`)}</p>
                <label className="mt-2 cursor-pointer text-sm font-semibold text-primary hover:underline">
                  {uploadingCategory === category ? t("uploading") : t("upload")}
                  <input
                    type="file"
                    className="hidden"
                    accept={config.accept}
                    disabled={uploadingCategory !== null}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onUpload(category, file);
                      e.target.value = "";
                    }}
                  />
                </label>
                <p className="mt-1 text-[10px] text-muted">{config.formats}</p>
                {items.length > 0 && (
                  <ul className="mt-3 w-full space-y-1 text-start text-xs text-muted-foreground">
                    {items.map((d) => (
                      <li key={d.id} className="truncate">
                        ✓ {d.file_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-subtle" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-surface px-3 text-xs font-semibold uppercase tracking-wider text-muted">
            {t("preferences")}
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <Label>{t("urgency")}</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            <PillButton selected={urgency === "normal"} onClick={() => onUrgencyChange("normal")}>
              <Clock className="h-4 w-4" />
              {t("urgencyNormal")}
            </PillButton>
            <PillButton selected={urgency === "urgent"} onClick={() => onUrgencyChange("urgent")}>
              <Zap className="h-4 w-4" />
              {t("urgencyUrgent")}
            </PillButton>
          </div>
        </div>

        <div>
          <Label>{t("requiredQuotations")}</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {QUOTATION_OPTIONS.map((n) => (
              <PillButton
                key={n}
                selected={requiredQuotations === n}
                onClick={() => onRequiredQuotationsChange(n)}
              >
                {n}
              </PillButton>
            ))}
            <PillButton
              selected={requiredQuotations === null}
              onClick={() => onRequiredQuotationsChange(null)}
            >
              <Infinity className="h-4 w-4" />
              {t("unlimited")}
            </PillButton>
          </div>

          {requiredQuotations === null && (
            <div className="mt-4">
              <Label>{t("deadline")}</Label>
              <Input
                type="date"
                value={quotationDeadline}
                onChange={(e) => onQuotationDeadlineChange(e.target.value)}
                className="mt-2"
              />
              <p className="mt-1.5 text-xs text-muted">{t("deadlineHint")}</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <Label>{t("distribution")}</Label>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row">
          <DistributionCard
            selected={distributionType === "all"}
            onClick={() => onDistributionTypeChange("all")}
            icon={Globe}
            title={t("distributionAll.title")}
            description={t("distributionAll.description")}
          />
          <DistributionCard
            selected={distributionType === "region"}
            onClick={() => onDistributionTypeChange("region")}
            icon={MapPin}
            title={t("distributionRegion.title")}
            description={t("distributionRegion.description")}
          />
          <DistributionCard
            selected={distributionType === "agencies"}
            onClick={() => onDistributionTypeChange("agencies")}
            icon={Building2}
            title={t("distributionAgencies.title")}
            description={t("distributionAgencies.description")}
          />
        </div>

        {distributionType === "region" && (
          <div className="mt-4">
            <Label>{t("selectRegion")}</Label>
            <select
              value={distributionRegion}
              onChange={(e) => onDistributionRegionChange(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm"
            >
              <option value="">{t("selectRegionPlaceholder")}</option>
              {SAUDI_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {getRegionLabel(region, locale)}
                </option>
              ))}
            </select>
          </div>
        )}

        {distributionType === "agencies" && (
          <div className="mt-4">
            <Label>{t("selectAgencies")}</Label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input
                value={agencySearch}
                onChange={(e) => setAgencySearch(e.target.value)}
                placeholder={t("agencySearchPlaceholder")}
                className="ps-10"
              />
            </div>
            <div className="mt-3 grid max-h-64 gap-2 overflow-y-auto sm:grid-cols-2">
              {filteredAgencies.map((agency) => {
                const checked = selectedAgencyIds.includes(agency.id);
                return (
                  <label
                    key={agency.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors",
                      checked ? "border-primary/30 bg-primary/5" : "border-border-subtle"
                    )}
                  >
                    <Building2 className="h-4 w-4 shrink-0 text-muted" />
                    <span className="flex-1 font-medium">{agency.name}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAgency(agency.id)}
                      className="h-4 w-4 rounded border-border text-primary"
                    />
                  </label>
                );
              })}
              {filteredAgencies.length === 0 && (
                <p className="col-span-2 text-sm text-muted">{t("noAgenciesFound")}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function parseLocationInput(value: string): { city: string; district: string } {
  const parts = value.split("—").map((p) => p.trim());
  if (parts.length >= 2) {
    return { city: parts[0], district: parts.slice(1).join(" — ") };
  }
  const commaParts = value.split(",").map((p) => p.trim());
  if (commaParts.length >= 2) {
    return { city: commaParts[0], district: commaParts.slice(1).join(", ") };
  }
  return { city: value.trim(), district: "" };
}

export function formatLocationInput(city: string, district: string): string {
  if (city && district) return `${city} — ${district}`;
  return city || district;
}
