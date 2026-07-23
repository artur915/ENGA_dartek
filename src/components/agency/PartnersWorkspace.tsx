"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Building2,
  CheckCircle2,
  Inbox,
  Link2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Shield,
  Trash2,
  User,
  X,
} from "lucide-react";
import {
  partnerStatusFromAssignments,
  requestToPartner,
  type AgencyPartner,
  type PartnerType,
  type PartnershipRequest,
  type ProjectOption,
} from "@/lib/agency-partners";
import { loadPartnersState, savePartnersState } from "@/lib/agency-partners-storage";
import { formatRelativeTime } from "@/lib/project-updates-display";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/format";

type AddPartnerForm = {
  name: string;
  type: PartnerType;
  specialty: string;
  phone: string;
  email: string;
  hourlyRate: string;
};

const emptyForm: AddPartnerForm = {
  name: "",
  type: "office",
  specialty: "",
  phone: "",
  email: "",
  hourlyRate: "",
};

export function PartnersWorkspace({ projects }: { projects: ProjectOption[] }) {
  const t = useTranslations("agency.partners");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [requests, setRequests] = useState<PartnershipRequest[]>([]);
  const [partners, setPartners] = useState<AgencyPartner[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [assignPartnerId, setAssignPartnerId] = useState<string | null>(null);
  const [form, setForm] = useState<AddPartnerForm>(emptyForm);

  useEffect(() => {
    const state = loadPartnersState();
    setRequests(state.requests);
    setPartners(state.partners);
  }, []);

  const persist = (nextRequests: PartnershipRequest[], nextPartners: AgencyPartner[]) => {
    setRequests(nextRequests);
    setPartners(nextPartners);
    savePartnersState({ requests: nextRequests, partners: nextPartners });
  };

  const sortedPartners = useMemo(
    () =>
      [...partners].sort((a, b) => {
        if (a.status === b.status) return a.name.localeCompare(b.name);
        return a.status === "engaged" ? -1 : 1;
      }),
    [partners]
  );

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    window.setTimeout(() => setSuccessMessage(null), 4000);
  };

  const acceptRequest = (request: PartnershipRequest) => {
    const nextPartners = [...partners, requestToPartner(request)];
    const nextRequests = requests.filter((item) => item.id !== request.id);
    persist(nextRequests, nextPartners);
    showSuccess(t("acceptSuccess"));
  };

  const rejectRequest = (requestId: string) => {
    persist(
      requests.filter((item) => item.id !== requestId),
      partners
    );
  };

  const removePartner = (partnerId: string) => {
    persist(requests, partners.filter((item) => item.id !== partnerId));
  };

  const assignProject = (partnerId: string, project: ProjectOption) => {
    const nextPartners = partners.map((partner) => {
      if (partner.id !== partnerId) return partner;
      if (partner.assignedProjects.some((item) => item.id === project.id)) return partner;
      const assignedProjects = [...partner.assignedProjects, project];
      return {
        ...partner,
        assignedProjects,
        status: partnerStatusFromAssignments(assignedProjects),
      };
    });
    persist(requests, nextPartners);
    setAssignPartnerId(null);
  };

  const unassignProject = (partnerId: string, projectId: string) => {
    const nextPartners = partners.map((partner) => {
      if (partner.id !== partnerId) return partner;
      const assignedProjects = partner.assignedProjects.filter((item) => item.id !== projectId);
      return {
        ...partner,
        assignedProjects,
        status: partnerStatusFromAssignments(assignedProjects),
      };
    });
    persist(requests, nextPartners);
  };

  const submitPartner = () => {
    if (!form.name.trim() || !form.specialty.trim()) return;
    const hourlyRate = form.hourlyRate.trim() ? Number(form.hourlyRate) : undefined;
    const partner: AgencyPartner = {
      id: `partner-${crypto.randomUUID()}`,
      name: form.name.trim(),
      type: form.type,
      specialty: form.specialty.trim(),
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      hourlyRate: hourlyRate && !Number.isNaN(hourlyRate) ? hourlyRate : undefined,
      status: "available",
      assignedProjects: [],
    };
    persist(requests, [...partners, partner]);
    setForm(emptyForm);
    setShowAddModal(false);
    showSuccess(t("addSuccess"));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">{t("subtitle")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/agencies"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border-subtle bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
          >
            <Shield className="h-4 w-4 text-primary" />
            {t("browseOffices")}
          </Link>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" />
            {t("addPartner")}
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-foreground">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <p>{successMessage}</p>
        </div>
      )}

      {requests.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Inbox className="h-4 w-4 text-primary" />
            <h3 className="text-lg font-bold text-foreground">{t("requestsTitle")}</h3>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-warning px-1.5 text-[10px] font-bold text-white">
              {requests.length}
            </span>
          </div>
          <p className="text-sm text-muted">{t("requestsDescription")}</p>
          <div className="grid gap-4 lg:grid-cols-2">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                locale={locale}
                onAccept={() => acceptRequest(request)}
                onReject={() => rejectRequest(request.id)}
                t={t}
              />
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        {sortedPartners.map((partner) => (
          <PartnerCard
            key={partner.id}
            partner={partner}
            currency={tc("currency")}
            onAssign={() => setAssignPartnerId(partner.id)}
            onRemove={() => removePartner(partner.id)}
            onUnassign={(projectId) => unassignProject(partner.id, projectId)}
            t={t}
          />
        ))}
      </section>

      {showAddModal && (
        <Modal title={t("addPartner")} onClose={() => setShowAddModal(false)}>
          <div className="space-y-4">
            <Field label={t("form.name")}>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-xl border border-border-subtle px-3 py-2 text-sm"
              />
            </Field>
            <Field label={t("form.type")}>
              <select
                value={form.type}
                onChange={(event) =>
                  setForm((current) => ({ ...current, type: event.target.value as PartnerType }))
                }
                className="w-full rounded-xl border border-border-subtle px-3 py-2 text-sm"
              >
                <option value="office">{t("engineeringOffice")}</option>
                <option value="individual">{t("individual")}</option>
              </select>
            </Field>
            <Field label={t("form.specialty")}>
              <input
                value={form.specialty}
                onChange={(event) => setForm((current) => ({ ...current, specialty: event.target.value }))}
                className="w-full rounded-xl border border-border-subtle px-3 py-2 text-sm"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("form.phone")}>
                <input
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  className="w-full rounded-xl border border-border-subtle px-3 py-2 text-sm"
                />
              </Field>
              <Field label={t("form.email")}>
                <input
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-xl border border-border-subtle px-3 py-2 text-sm"
                />
              </Field>
            </div>
            <Field label={t("form.hourlyRate")}>
              <input
                value={form.hourlyRate}
                onChange={(event) => setForm((current) => ({ ...current, hourlyRate: event.target.value }))}
                className="w-full rounded-xl border border-border-subtle px-3 py-2 text-sm"
                inputMode="numeric"
              />
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-muted"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={submitPartner}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
              >
                {t("savePartner")}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {assignPartnerId && (
        <Modal title={t("assignTitle")} onClose={() => setAssignPartnerId(null)}>
          {projects.length === 0 ? (
            <p className="text-sm text-muted">{t("noProjectsToAssign")}</p>
          ) : (
            <ul className="space-y-2">
              {projects.map((project) => (
                <li key={project.id}>
                  <button
                    type="button"
                    onClick={() => assignProject(assignPartnerId, project)}
                    className="flex w-full items-center justify-between rounded-xl border border-border-subtle px-4 py-3 text-start text-sm transition-colors hover:bg-surface-muted"
                  >
                    <span className="font-semibold text-foreground">{project.title}</span>
                    <Link2 className="h-4 w-4 text-primary" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </div>
  );
}

function RequestCard({
  request,
  locale,
  onAccept,
  onReject,
  t,
}: {
  request: PartnershipRequest;
  locale: string;
  onAccept: () => void;
  onReject: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <article className="rounded-2xl border border-warning/30 bg-warning/5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-muted">
            {request.type === "office" ? <Building2 className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </div>
          <div>
            <p className="font-bold text-foreground">{request.name}</p>
            <p className="mt-0.5 text-sm text-muted">{request.specialty}</p>
          </div>
        </div>
        <Badge variant="warning" size="sm">
          {t("received")}
        </Badge>
      </div>

      <div className="mt-4 space-y-1.5 text-sm text-muted">
        {request.location && (
          <p className="inline-flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            {request.location}
          </p>
        )}
        {request.email && (
          <p className="inline-flex items-center gap-2">
            <Mail className="h-3.5 w-3.5" />
            {request.email}
          </p>
        )}
        {request.phone && (
          <p className="inline-flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" />
            {request.phone}
          </p>
        )}
      </div>

      <p className="mt-3 text-xs text-muted">{formatRelativeTime(request.receivedAt, locale)}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onReject}
          className="rounded-xl border border-danger/30 px-4 py-2 text-sm font-semibold text-danger"
        >
          {t("rejectRequest")}
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          {t("acceptRequest")}
        </button>
      </div>
    </article>
  );
}

function PartnerCard({
  partner,
  currency,
  onAssign,
  onRemove,
  onUnassign,
  t,
}: {
  partner: AgencyPartner;
  currency: string;
  onAssign: () => void;
  onRemove: () => void;
  onUnassign: (projectId: string) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const locale = useLocale();
  return (
    <article className="flex flex-col rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted text-muted">
            {partner.type === "office" ? <Building2 className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </div>
          <div>
            <p className="font-bold text-foreground">{partner.name}</p>
            <p className="mt-0.5 text-sm text-muted">{partner.specialty}</p>
          </div>
        </div>
        <Badge variant={partner.status === "engaged" ? "accent" : "success"} size="sm">
          {partner.status === "engaged" ? t("engaged") : t("available")}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <Badge variant="outline" size="sm">
          {partner.type === "office" ? t("engineeringOffice") : t("individual")}
        </Badge>
        {partner.phone && (
          <span className="inline-flex items-center gap-1.5 text-muted">
            <Phone className="h-3.5 w-3.5" />
            {partner.phone}
          </span>
        )}
        {partner.email && (
          <span className="inline-flex items-center gap-1.5 text-muted">
            <Mail className="h-3.5 w-3.5" />
            {partner.email}
          </span>
        )}
        {partner.hourlyRate != null && (
          <span className="font-semibold text-foreground">
            {t("hourlyRate", {
              rate: formatNumber(partner.hourlyRate, locale),
              currency,
            })}
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{t("assignedProjects")}</p>
        {partner.assignedProjects.length === 0 ? (
          <p className="mt-2 text-sm text-muted">{t("notAssigned")}</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {partner.assignedProjects.map((project) => (
              <span
                key={project.id}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
              >
                {project.title}
                <button
                  type="button"
                  onClick={() => onUnassign(project.id)}
                  className="rounded-full p-0.5 hover:bg-primary/10"
                  aria-label={t("removeAssignment")}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <button
          type="button"
          onClick={onAssign}
          className="inline-flex items-center gap-2 rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
        >
          <Link2 className="h-4 w-4 text-primary" />
          {t("assignToProject")}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle text-muted transition-colors hover:bg-surface-muted hover:text-danger"
          aria-label={t("removePartner")}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border-subtle bg-surface p-6 shadow-elevated">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-muted hover:bg-surface-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  );
}
