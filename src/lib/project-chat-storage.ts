import type { ChatMessage } from "@/lib/project-updates-display";

const STORAGE_KEY = "enga-project-chat-messages";

type StoredMessages = Record<string, ChatMessage[]>;

function readAll(): StoredMessages {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredMessages;
  } catch {
    return {};
  }
}

function writeAll(data: StoredMessages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadLocalChatMessages(requestId: string): ChatMessage[] {
  return readAll()[requestId] ?? [];
}

export function loadAllLocalChatMessages(): StoredMessages {
  return readAll();
}

export function appendLocalChatMessage(requestId: string, message: ChatMessage) {
  const all = readAll();
  all[requestId] = [...(all[requestId] ?? []), message];
  writeAll(all);
}

export function replaceLocalChatMessage(
  requestId: string,
  tempId: string,
  message: ChatMessage
) {
  const all = readAll();
  all[requestId] = (all[requestId] ?? []).map((item) => (item.id === tempId ? message : item));
  writeAll(all);
}

export function mergeChatMessages(
  serverMessages: ChatMessage[],
  localMessages: ChatMessage[]
): ChatMessage[] {
  const seen = new Set(serverMessages.map((message) => message.id));
  const merged = [...serverMessages];

  for (const message of localMessages) {
    if (seen.has(message.id)) continue;
    const duplicateBody = merged.some(
      (existing) =>
        existing.body === message.body &&
        existing.senderRole === message.senderRole &&
        Math.abs(new Date(existing.createdAt).getTime() - new Date(message.createdAt).getTime()) < 5000
    );
    if (!duplicateBody) merged.push(message);
  }

  return merged.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}
