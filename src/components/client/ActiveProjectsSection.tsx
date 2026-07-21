import { getTranslations, getLocale } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/navigation";
import {
  FolderKanban,
  Calendar,
  ExternalLink,
  AlertCircle,
  LayoutGrid,
} from "lucide-react";
import {
  computeProgress,
  formatPoRef,
  formatProjectRef,
  getCurrentPhase,
  getNextItem,
  getPaymentLabel,
  getProjectStatusBadge,
  needsClientReview,
  PROJECT_KICKOFF,
} from "@/lib/client-dashboard";
import { formatCurrency } from "@/lib/format";

type AgreementRow = {
  id: string;
  signed_at: string | null;
  created_at: string;
  agencies: { name: string } | { name: string }[] | null;
  project_requests:
    | {
        id: string;
        title: string;
        status: string;
        location_city: string | null;
        created_at: string;
        milestones: {
          title: string;
          status: string;
          sort_order: number;
          due_date: string | null;
          status_update: string | null;
        }[];
        payments: { amount: number; status: string }[];
      }
    | {
        id: string;
        title: string;
        status: string;
        location_city: string | null;
        created_at: string;
        milestones: {
          title: string;
          status: string;
          sort_order: number;
          due_date: string | null;
          status_update: string | null;
        }[];
        payments: { amount: number; status: string }[];
      }[]
    | null;
  quotations: { price: number } | { price: number }[] | null;
};

function unwrap<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export async function ActiveProjectsSection({
  projects,
}: {
  projects: AgreementRow[];
}) {
  const t = await getTranslations("client.dashboard");
  const ts = await getTranslations("status");
  const tc = await getTranslations("common");
  const locale = await getLocale();

  return (
    <section className="mt-10">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant="accent" size="sm" className="mb-2">
            {t("deliveryManagement")}
          </Badge>
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">{t("activeProjectsTitle")}</h2>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-muted">{t("activeProjectsDescription")}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-border-subtle bg-surface px-4 py-1.5 text-sm font-medium text-muted-foreground">
            {t("activeProjectsCount", { count: projects.length })}
          </span>
          <div className="flex rounded-lg border border-border-subtle bg-surface p-1">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <LayoutGrid className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      {!projects.length ? (
        <Card className="text-center">
          <p className="text-muted">{t("noActiveProjects")}</p>
          <Link
            href="/client/quotations"
            className="mt-4 inline-block text-sm font-semibold text-primary"
          >
            {t("browseQuotations")} →
          </Link>
        </Card>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {projects.map((agreement) => {
            const agency = unwrap(agreement.agencies);
            const request = unwrap(agreement.project_requests);
            const quote = unwrap(agreement.quotations);
            if (!request) return null;

            const milestones = request.milestones ?? [];
            const payments = request.payments ?? [];
            const contractValue = Number(quote?.price ?? 0);
            const progress = computeProgress(milestones);
            const statusBadge = getProjectStatusBadge(milestones, payments, contractValue);
            const payment = getPaymentLabel(payments, contractValue);
            const statusLabel = t(statusBadge.key);
            const paymentLabel = t(payment.key);
            const currentPhaseRaw = getCurrentPhase(milestones);
            const currentPhase =
              currentPhaseRaw === PROJECT_KICKOFF ? ts("projectKickoff") : currentPhaseRaw;
            const nextItem = getNextItem(milestones);
            const showAlert = needsClientReview(milestones);

            return (
              <Card key={agreement.id} padding="none" className="overflow-hidden">
                <div className="border-b border-border-subtle px-6 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          statusBadge.variant === "success"
                            ? "success"
                            : statusBadge.variant === "warning"
                              ? "warning"
                              : "accent"
                        }
                      >
                        {statusLabel}
                      </Badge>
                      <span className="text-xs text-muted">
                        {formatProjectRef(request.id, request.created_at)} ·{" "}
                        {formatPoRef(agreement.id, agreement.signed_at)}
                      </span>
                    </div>
                    <div className="text-end">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                        {t("contractValue")}
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(contractValue, tc("currency"), locale)}
                      </p>
                    </div>
                  </div>

                  <h3 className="mt-4 text-lg font-bold">{request.title}</h3>
                  <p className="text-sm text-muted">{agency?.name}</p>
                </div>

                {showAlert && (
                  <div className="mx-6 mt-4 flex items-start gap-2 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-primary-dark">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{t("reviewNextItem")}</span>
                  </div>
                )}

                <div className="grid gap-4 px-6 py-5 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                      {t("currentPhase")}
                    </p>
                    <p className="mt-1 text-sm font-medium">{currentPhase}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                      {t("nextItem")}
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {nextItem ? (
                        <>
                          {nextItem.title}
                          {nextItem.dueDate && (
                            <span className="mt-0.5 block text-xs text-muted">
                              {t("due")}: {nextItem.dueDate}
                            </span>
                          )}
                        </>
                      ) : (
                        t("allMilestonesComplete")
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                      {t("paymentStatus")}
                    </p>
                    <p
                      className={`mt-1 text-sm font-medium ${
                        payment.variant === "warning" ? "text-warning" : "text-success"
                      }`}
                    >
                      {paymentLabel}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border-subtle px-6 py-4">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted">
                    <span>{t("overallProgress")}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap justify-end gap-2">
                    <Link
                      href={`/client/projects/${request.id}`}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-border-subtle bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/20"
                    >
                      <Calendar className="h-4 w-4" />
                      {t("viewSchedule")}
                    </Link>
                    <Link
                      href={`/client/projects/${request.id}`}
                      className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t("openWorkspace")}
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
