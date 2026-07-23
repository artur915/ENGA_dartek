export type PortalRole = "client" | "agency" | "engineer" | "admin";

export function getClientNav(t: (key: string) => string, tc?: (key: string) => string) {
  const dash = tc ? tc("dashboard") : "Dashboard";
  return [
    { href: "/client", label: dash, icon: "LayoutDashboard" },
    { href: "/client/requests", label: t("myRequests"), icon: "ClipboardList" },
    { href: "/client/requests/new", label: t("newRequest"), icon: "Plus" },
    { href: "/client/quotations", label: t("compareQuotes"), icon: "FileText" },
    { href: "/client/projects", label: t("activeProjects"), icon: "FolderKanban" },
    { href: "/client/schedule", label: t("projectSchedule"), icon: "Calendar" },
    { href: "/client/updates", label: t("projectUpdates"), icon: "Bell" },
  ];
}

export function getAgencyNav(t: (key: string) => string, tc: (key: string) => string) {
  return [
    { href: "/agency", label: tc("dashboard"), icon: "LayoutDashboard" },
    { href: "/agency/register", label: t("register"), icon: "Building2" },
    { href: "/agency/requests", label: t("incomingRequests"), icon: "ClipboardList" },
    { href: "/agency/quotations", label: tc("quotations"), icon: "FileText" },
    { href: "/agency/projects", label: t("activeProjects"), icon: "FolderKanban" },
    { href: "/agency/schedule", label: t("projectSchedule"), icon: "Calendar" },
    { href: "/agency/updates", label: t("projectUpdates"), icon: "Bell" },
    { href: "/agency/partners", label: t("partners"), icon: "Handshake" },
    { href: "/agency/finance", label: t("financeLite"), icon: "DollarSign" },
  ];
}

export function getEngineerNav(t: (key: string) => string, tc: (key: string) => string) {
  return [
    { href: "/engineer", label: tc("dashboard"), icon: "LayoutDashboard" },
    { href: "/engineer/register", label: t("register"), icon: "UserPlus" },
    { href: "/engineer/profile", label: t("profile"), icon: "User" },
    { href: "/engineer/invitations", label: t("invitations"), icon: "Briefcase" },
    { href: "/engineer/assignments", label: t("assignments"), icon: "Star" },
  ];
}

export function getAdminNav(tc: (key: string) => string) {
  return [
    { href: "/admin", label: tc("admin"), icon: "LayoutDashboard" },
    { href: "/admin/agencies", label: tc("agencies"), icon: "Building2" },
  ];
}
