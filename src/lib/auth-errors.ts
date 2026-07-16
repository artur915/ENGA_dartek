export function formatAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("email not confirmed")) {
    return "Please confirm your email first. Check your inbox (and spam folder), then try signing in again.";
  }

  if (lower.includes("invalid login credentials") || lower.includes("invalid credentials")) {
    return "Invalid email or password. If you just signed up, confirm your email first or use the exact password from signup.";
  }

  if (lower.includes("user already registered")) {
    return "This email is already registered. Try signing in instead.";
  }

  if (lower.includes("password")) {
    return message;
  }

  return message;
}
