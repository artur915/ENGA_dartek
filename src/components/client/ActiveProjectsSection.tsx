import { getTranslations, getLocale } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/navigation";
import { FolderKanban, LayoutGrid } from "lucide-react";
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
import { ActiveProjectCard } from "@/components/client/ActiveProjectCard";

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
            const currentPhaseRaw = getCurrentPhase(milestones);
            const currentPhase =
              currentPhaseRaw === PROJECT_KICKOFF ? ts("projectKickoff") : currentPhaseRaw;
            const nextItem = getNextItem(milestones);

            return (
              <ActiveProjectCard
                key={agreement.id}
                scheduleHref={`/client/projects/${request.id}`}
                workspaceHref={`/client/projects/${request.id}`}
                title={request.title}
                contractValueLabel={t("contractValue")}
                contractValueFormatted={formatCurrency(contractValue, tc("currency"), locale)}
                progressLabel={t("overallProgress")}
                progress={progress}
                viewScheduleLabel={t("viewSchedule")}
                openWorkspaceLabel={t("openWorkspace")}
                showDetailsLabel={t("showDetails")}
                hideDetailsLabel={t("hideDetails")}
                expanded={{
                  statusLabel: t(statusBadge.key),
                  statusVariant: statusBadge.variant,
                  projectRef: `${formatProjectRef(request.id, request.created_at)} · ${formatPoRef(agreement.id, agreement.signed_at)}`,
                  subtitle: agency?.name ?? null,
                  showAlert: needsClientReview(milestones),
                  reviewNextItemLabel: t("reviewNextItem"),
                  currentPhaseLabel: t("currentPhase"),
                  currentPhase,
                  nextItemLabel: t("nextItem"),
                  nextItemTitle: nextItem?.title ?? null,
                  nextItemDue: nextItem?.dueDate ?? null,
                  dueLabel: t("due"),
                  allMilestonesCompleteLabel: t("allMilestonesComplete"),
                  paymentStatusLabel: t("paymentStatus"),
                  paymentLabel: t(payment.key),
                  paymentVariant: payment.variant,
                }}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
