"use client";

import { useEffect, useMemo, useState, useTransition, type KeyboardEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Bell,
  CheckCheck,
  CheckSquare,
  Clock3,
  FileText,
  MessageSquare,
  Send,
  Users,
} from "lucide-react";
import { sendProjectMessage } from "@/actions/messages";
import type { ProjectMessageRow } from "@/actions/messages";
import {
  formatMessageTime,
  formatRelativeTime,
  isSameDay,
  unreadProviderCount,
  type ChatMessage,
  type ProviderUpdate,
  type UpdatesProjectSummary,
} from "@/lib/project-updates-display";
import {
  appendLocalChatMessage,
  loadAllLocalChatMessages,
  mergeChatMessages,
  replaceLocalChatMessage,
} from "@/lib/project-chat-storage";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";

const READ_STORAGE_KEY = "enga-project-update-reads";

const STATUS_VARIANT: Record<string, "success" | "warning" | "accent"> = {
  statusOnTrack: "success",
  statusAwaitingDecision: "warning",
  statusAwaitingPayment: "warning",
};

const UPDATE_ICON: Record<ProviderUpdate["kind"], typeof FileText> = {
  deliverable: FileText,
  approval: CheckSquare,
  discussion: MessageSquare,
};

export function ProjectUpdatesWorkspace({
  projects,
  initialProjectId,
}: {
  projects: UpdatesProjectSummary[];
  initialProjectId?: string;
}) {
  const t = useTranslations("client.updates");
  const td = useTranslations("client.dashboard");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [messageDraft, setMessageDraft] = useState("");
  const [extraMessages, setExtraMessages] = useState<Record<string, ChatMessage[]>>({});

  const selectedId =
    initialProjectId && projects.some((project) => project.requestId === initialProjectId)
      ? initialProjectId
      : projects[0]?.requestId;

  const selected = useMemo(
    () => projects.find((project) => project.requestId === selectedId) ?? projects[0] ?? null,
    [projects, selectedId]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(READ_STORAGE_KEY);
      if (raw) setReadIds(new Set(JSON.parse(raw) as string[]));
    } catch {
      setReadIds(new Set());
    }
    setExtraMessages(loadAllLocalChatMessages());
  }, []);

  const persistReadIds = (next: Set<string>) => {
    setReadIds(next);
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...next]));
  };

  const markRead = (updateId: string) => {
    persistReadIds(new Set(readIds).add(updateId));
  };

  const markAllRead = (updates: ProviderUpdate[]) => {
    const next = new Set(readIds);
    for (const update of updates) next.add(update.id);
    persistReadIds(next);
  };

  const handleSend = () => {
    if (!selected || !messageDraft.trim() || isPending) return;
    const body = messageDraft.trim();
    const tempId = `local-${crypto.randomUUID()}`;
    const optimistic: ChatMessage = {
      id: tempId,
      body,
      senderRole: "client",
      senderName: t("you"),
      createdAt: new Date().toISOString(),
    };

    setMessageDraft("");
    appendLocalChatMessage(selected.requestId, optimistic);
    setExtraMessages((current) => ({
      ...current,
      [selected.requestId]: [...(current[selected.requestId] ?? []), optimistic],
    }));

    startTransition(async () => {
      const result = await sendProjectMessage(selected.requestId, body);
      if (!result.message) return;

      const row = result.message as ProjectMessageRow;
      const persisted: ChatMessage = {
        id: row.id,
        body: row.body,
        senderRole: row.sender_role,
        senderName: t("you"),
        createdAt: row.created_at,
      };

      replaceLocalChatMessage(selected.requestId, tempId, persisted);
      setExtraMessages((current) => ({
        ...current,
        [selected.requestId]: (current[selected.requestId] ?? []).map((item) =>
          item.id === tempId ? persisted : item
        ),
      }));
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    handleSend();
  };

  if (!projects.length || !selected) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface p-8 text-center">
        <p className="text-muted">{t("empty")}</p>
        <Link href="/client/quotations" className="mt-4 inline-block text-sm font-semibold text-primary">
          {t("browseProjects")} →
        </Link>
      </div>
    );
  }

  const selectedMessages = mergeChatMessages(
    selected.chatMessages,
    extraMessages[selected.requestId] ?? []
  );
  const selectedUnread = unreadProviderCount(selected.providerUpdates, readIds);

  return (
    <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <aside className="rounded-2xl border border-border-subtle bg-surface p-3">
          <p className="px-2 py-2 text-xs font-bold uppercase tracking-wide text-muted">{t("activeProjects")}</p>
          <p className="px-2 pb-3 text-[11px] leading-relaxed text-muted">{t("activeProjectsHint")}</p>
          <ul className="space-y-2">
            {projects.map((project) => {
              const active = project.requestId === selected.requestId;
              const unread = unreadProviderCount(project.providerUpdates, readIds);
              return (
                <li key={project.requestId}>
                  <Link
                    href={`/client/updates?project=${project.requestId}`}
                    className={cn(
                      "block rounded-xl border px-3 py-3 transition-colors",
                      active
                        ? "border-primary/20 bg-primary/5 shadow-sm"
                        : "border-transparent hover:border-border-subtle hover:bg-surface-muted"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                          active ? "bg-primary text-white" : "bg-surface-muted text-foreground"
                        )}
                      >
                        {project.projectRefShort}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold leading-snug text-foreground">{project.title}</p>
                          {unread > 0 && (
                            <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-warning px-1.5 text-[10px] font-bold text-white">
                              {unread}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-muted">{project.agencyName}</p>
                        <p className="mt-2 line-clamp-2 text-[11px] text-muted-foreground">{project.latestSnippet}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                          <StatusDot statusKey={project.statusKey} label={td(project.statusKey)} />
                          {project.dueDate && (
                            <span className="inline-flex items-center gap-1 text-muted">
                              <Clock3 className="h-3 w-3" />
                              {t("due", { date: formatDate(project.dueDate, locale) })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="flex min-h-[640px] flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface">
          <div className="border-b border-border-subtle px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-sm font-bold text-white">
                  {selected.projectRefShort}
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">{selected.title}</p>
                  <p className="text-xs text-muted">
                    {selected.agencyName} · {selected.projectRef}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={STATUS_VARIANT[selected.statusKey] ?? "default"} size="sm">
                  {td(selected.statusKey)}
                </Badge>
                {selected.dueDate && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border-subtle px-2.5 py-1 text-[11px] text-muted">
                    <Clock3 className="h-3 w-3" />
                    {t("due", { date: formatDate(selected.dueDate, locale) })}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-border-subtle bg-surface-muted/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  {t("projectTeam", { agency: selected.agencyName })}
                </div>
                <span className="text-xs text-success">{t("online")}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface px-3 py-2"
                  >
                    <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {member.name.slice(0, 1)}
                      {member.online && (
                        <span className="absolute -bottom-0.5 -end-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success" />
                      )}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{member.name}</p>
                      <p className="text-[10px] text-muted">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {selectedMessages.length === 0 ? (
              <p className="text-center text-sm text-muted">{t("chatEmpty")}</p>
            ) : (
              selectedMessages.map((message, index) => {
                const showDate =
                  index === 0 || !isSameDay(message.createdAt, selectedMessages[index - 1].createdAt);
                const isClient = message.senderRole === "client";

                return (
                  <div key={message.id}>
                    {showDate && (
                      <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted">
                        {t("today")}
                      </p>
                    )}
                    <div className={cn("flex", isClient ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[85%]", isClient ? "text-end" : "text-start")}>
                        {!isClient && (
                          <p className="mb-1 text-[11px] font-semibold text-muted">{message.senderName}</p>
                        )}
                        <div
                          className={cn(
                            "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                            isClient
                              ? "rounded-ee-md bg-primary text-white"
                              : "rounded-es-md border border-border-subtle bg-surface-muted text-foreground"
                          )}
                        >
                          {message.body.split("\n").map((line, lineIndex, lines) => (
                            <span key={lineIndex}>
                              {line}
                              {lineIndex < lines.length - 1 && <br />}
                            </span>
                          ))}
                        </div>
                        <p className="mt-1 text-[10px] text-muted">
                          {formatMessageTime(message.createdAt, locale)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-border-subtle p-4">
            <div className="flex gap-2">
              <textarea
                value={messageDraft}
                onChange={(event) => setMessageDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("messagePlaceholder", { agency: selected.agencyName })}
                rows={2}
                className="min-h-[72px] flex-1 resize-none rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm outline-none ring-primary/20 focus:ring-2"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isPending || !messageDraft.trim()}
                className="inline-flex h-[72px] w-[72px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl bg-primary text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span className="text-[10px] font-semibold">{t("send")}</span>
              </button>
            </div>
          </div>
        </section>

        <aside className="rounded-2xl border border-border-subtle bg-surface p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <p className="text-sm font-bold text-foreground">{t("providerRequests")}</p>
              {selectedUnread > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-warning px-1.5 text-[10px] font-bold text-white">
                  {selectedUnread}
                </span>
              )}
            </div>
            {selectedUnread > 0 && (
              <button
                type="button"
                onClick={() => markAllRead(selected.providerUpdates)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-dark"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                {t("readAll")}
              </button>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {selected.providerUpdates.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border-subtle px-4 py-6 text-center text-sm text-muted">
                {t("noProviderRequests")}
              </p>
            ) : (
              selected.providerUpdates.map((update) => {
                const Icon = UPDATE_ICON[update.kind];
                const unread = !readIds.has(update.id);
                return (
                  <div
                    key={update.id}
                    className={cn(
                      "rounded-xl border p-4 transition-colors",
                      unread ? "border-warning/30 bg-warning/5" : "border-border-subtle bg-surface-muted/30"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          update.kind === "deliverable" && "bg-info/10 text-info",
                          update.kind === "approval" && "bg-primary/10 text-primary",
                          update.kind === "discussion" && "bg-accent/10 text-accent"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground">{update.title}</p>
                          {unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-warning" />}
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-muted">{update.description}</p>
                        <p className="mt-2 text-[10px] text-muted">
                          {formatRelativeTime(update.updatedAt, locale)}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-semibold">
                          {unread && (
                            <button
                              type="button"
                              onClick={() => markRead(update.id)}
                              className="text-primary hover:text-primary-dark"
                            >
                              {t("markRead")}
                            </button>
                          )}
                          <Link
                            href={`/client/projects/${selected.requestId}`}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {t("view")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
    </div>
  );
}

function StatusDot({ statusKey, label }: { statusKey: string; label: string }) {
  const tone =
    statusKey === "statusOnTrack"
      ? "bg-success"
      : statusKey === "statusAwaitingDecision"
        ? "bg-warning"
        : "bg-info";

  return (
    <span className="inline-flex items-center gap-1.5 text-muted">
      <span className={cn("h-2 w-2 rounded-full", tone)} />
      {label}
    </span>
  );
}
