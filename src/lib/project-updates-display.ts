import {
  computeProgress,
  formatProjectRef,
  getNextItem,
  needsClientReview,
  type ProjectStatusKey,
} from "@/lib/client-dashboard";
import type { ProjectMessageRow } from "@/actions/messages";
import type { MilestoneRow } from "@/lib/project-schedule";

export type ProviderUpdateKind = "deliverable" | "approval" | "discussion";

export type ProviderUpdate = {
  id: string;
  milestoneId: string;
  kind: ProviderUpdateKind;
  title: string;
  description: string;
  updatedAt: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  online: boolean;
};

export type ChatMessage = {
  id: string;
  body: string;
  senderRole: "client" | "agency";
  senderName: string;
  createdAt: string;
};

export type UpdatesProjectSummary = {
  requestId: string;
  title: string;
  agencyName: string;
  clientName: string;
  projectRef: string;
  projectRefShort: string;
  latestSnippet: string;
  statusKey: ProjectStatusKey;
  dueDate: string | null;
  progress: number;
  providerUpdates: ProviderUpdate[];
  teamMembers: TeamMember[];
  chatMessages: ChatMessage[];
};

function unwrap<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

function shortRef(projectRef: string): string {
  const parts = projectRef.split("-");
  return parts[parts.length - 1] ?? projectRef;
}

function classifyProviderUpdate(milestone: MilestoneRow): ProviderUpdateKind {
  if (milestone.status === "amber" || milestone.status === "red") return "approval";
  const message = milestone.status_update?.toLowerCase() ?? "";
  if (
    message.includes("submit") ||
    message.includes("upload") ||
    message.includes("render") ||
    message.includes("deliver")
  ) {
    return "deliverable";
  }
  return "discussion";
}

function buildProviderUpdateTitle(
  milestone: MilestoneRow,
  kind: ProviderUpdateKind,
  labels: {
    deliverable: (title: string) => string;
    approval: (title: string) => string;
    discussion: string;
  }
): string {
  if (kind === "deliverable") return labels.deliverable(milestone.title);
  if (kind === "approval") return labels.approval(milestone.title);
  return labels.discussion;
}

function buildTeamMembers(
  clientName: string,
  agencyName: string,
  clientLabel: string,
  managerLabel: string
): TeamMember[] {
  return [
    { id: "client", name: clientName, role: clientLabel, online: true },
    { id: "agency-manager", name: agencyName, role: managerLabel, online: true },
  ];
}

function buildChatMessages(
  requestId: string,
  agencyName: string,
  clientName: string,
  milestones: MilestoneRow[],
  storedMessages: ProjectMessageRow[]
): ChatMessage[] {
  const milestoneMessages: ChatMessage[] = milestones
    .filter((milestone) => milestone.status_update?.trim())
    .map((milestone) => ({
      id: `milestone-${milestone.id}`,
      body: milestone.status_update!.trim(),
      senderRole: "agency" as const,
      senderName: agencyName,
      createdAt: milestone.updated_at ?? new Date().toISOString(),
    }));

  const persistedMessages: ChatMessage[] = storedMessages.map((message) => ({
    id: message.id,
    body: message.body,
    senderRole: message.sender_role,
    senderName: message.sender_role === "client" ? clientName : agencyName,
    createdAt: message.created_at,
  }));

  return [...milestoneMessages, ...persistedMessages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function buildProviderUpdates(
  milestones: MilestoneRow[],
  labels: {
    deliverable: (title: string) => string;
    approval: (title: string) => string;
    discussion: string;
  }
): ProviderUpdate[] {
  return [...milestones]
    .sort((a, b) => a.sort_order - b.sort_order)
    .filter((milestone) => milestone.status_update?.trim())
    .map((milestone) => {
      const kind = classifyProviderUpdate(milestone);
      return {
        id: milestone.id,
        milestoneId: milestone.id,
        kind,
        title: buildProviderUpdateTitle(milestone, kind, labels),
        description: milestone.status_update!.trim(),
        updatedAt: milestone.updated_at ?? new Date().toISOString(),
      };
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function buildUpdatesProjects(input: {
  agreements: {
    id: string;
    signed_at: string | null;
    agencies?: { name: string } | { name: string }[] | null;
    profiles?: { full_name: string | null; email: string | null } | { full_name: string | null; email: string | null }[] | null;
    project_requests:
      | {
          id: string;
          title: string;
          created_at: string;
          milestones: MilestoneRow[];
        }
      | {
          id: string;
          title: string;
          created_at: string;
          milestones: MilestoneRow[];
        }[]
      | null;
  }[];
  messagesByRequest: Record<string, ProjectMessageRow[]>;
  agencyName?: string;
  clientFallback: string;
  labels: {
    clientRole: string;
    managerRole: string;
    deliverable: (title: string) => string;
    approval: (title: string) => string;
    discussion: string;
    noUpdatesYet: string;
  };
}): UpdatesProjectSummary[] {
  return input.agreements
    .map((agreement) => {
      const agency = unwrap(agreement.agencies);
      const client = unwrap(agreement.profiles);
      const request = unwrap(agreement.project_requests);
      if (!request) return null;

      const milestones = request.milestones ?? [];
      const projectRef = formatProjectRef(request.id, request.created_at);
      const agencyName = input.agencyName ?? agency?.name ?? "—";
      const clientName = client?.full_name || client?.email || input.clientFallback;
      const providerUpdates = buildProviderUpdates(milestones, {
        deliverable: input.labels.deliverable,
        approval: input.labels.approval,
        discussion: input.labels.discussion,
      });
      const nextItem = getNextItem(milestones);
      const latestSnippet =
        providerUpdates[0]?.description ??
        milestones.find((milestone) => milestone.status_update?.trim())?.status_update?.trim() ??
        input.labels.noUpdatesYet;

      let statusKey: ProjectStatusKey = "statusOnTrack";
      if (needsClientReview(milestones)) statusKey = "statusAwaitingDecision";
      else if (milestones.some((milestone) => milestone.status === "amber")) statusKey = "statusAwaitingDecision";
      else if (milestones.some((milestone) => milestone.status === "red")) statusKey = "statusAwaitingPayment";

      return {
        requestId: request.id,
        title: request.title,
        agencyName,
        clientName,
        projectRef,
        projectRefShort: shortRef(projectRef),
        latestSnippet,
        statusKey,
        dueDate: nextItem?.dueDate ?? null,
        progress: computeProgress(milestones),
        providerUpdates,
        teamMembers: buildTeamMembers(
          clientName,
          agencyName,
          input.labels.clientRole,
          input.labels.managerRole
        ),
        chatMessages: buildChatMessages(
          request.id,
          agencyName,
          clientName,
          milestones,
          input.messagesByRequest[request.id] ?? []
        ),
      };
    })
    .filter(Boolean) as UpdatesProjectSummary[];
}

export function formatRelativeTime(iso: string, locale: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return locale === "ar" ? "الآن" : "Just now";
  if (minutes < 60) return locale === "ar" ? `منذ ${minutes} د` : `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return locale === "ar" ? `منذ ${hours} س` : `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return locale === "ar" ? `منذ ${days} ي` : `${days} day${days === 1 ? "" : "s"} ago`;
}

export function formatMessageTime(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function isSameDay(a: string, b: string): boolean {
  const dateA = new Date(a);
  const dateB = new Date(b);
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export function unreadProviderCount(updates: ProviderUpdate[], readIds: Set<string>): number {
  return updates.filter((update) => !readIds.has(update.id)).length;
}
