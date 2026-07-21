export type AuthErrorCode =
  | "emailNotConfirmed"
  | "invalidCredentials"
  | "alreadyRegistered"
  | "engineerUnavailable"
  | "authUnavailable"
  | "unknown";

const AUTH_ERROR_CODES = new Set<string>([
  "emailNotConfirmed",
  "invalidCredentials",
  "alreadyRegistered",
  "engineerUnavailable",
  "authUnavailable",
]);

export function getAuthErrorCode(message: string): AuthErrorCode {
  const lower = message.toLowerCase();

  if (lower.includes("email not confirmed")) {
    return "emailNotConfirmed";
  }

  if (lower.includes("invalid login credentials") || lower.includes("invalid credentials")) {
    return "invalidCredentials";
  }

  if (lower.includes("user already registered")) {
    return "alreadyRegistered";
  }

  return "unknown";
}

/** Returns a translation key under auth.errors, or the raw message for unknown errors. */
export function resolveAuthError(message: string): string {
  const code = getAuthErrorCode(message);
  if (code === "unknown") return message;
  return code;
}

export function translateAuthError(
  error: string,
  t: (key: string) => string,
  has: (key: string) => boolean
): string {
  if (AUTH_ERROR_CODES.has(error) && has(`errors.${error}`)) {
    return t(`errors.${error}`);
  }
  return error;
}
