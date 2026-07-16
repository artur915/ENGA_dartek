export type UserRole =
  | "client"
  | "agency_owner"
  | "agency_employee"
  | "individual_engineer"
  | "finance_user"
  | "admin";

export type RequestStatus =
  | "draft"
  | "submitted"
  | "floating"
  | "quoted"
  | "accepted"
  | "in_progress"
  | "completed"
  | "archived"
  | "cancelled";

export type MilestoneStatus = "green" | "amber" | "red";
export type PaymentStatus = "pending" | "processing" | "confirmed" | "failed";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  locale: "en" | "ar";
  avatar_url: string | null;
}

export const ROLE_PORTAL: Record<UserRole, string> = {
  client: "/client",
  agency_owner: "/agency",
  agency_employee: "/agency",
  individual_engineer: "/engineer",
  finance_user: "/agency/finance",
  admin: "/admin",
};
