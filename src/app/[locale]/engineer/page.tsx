import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";

export default async function EngineerDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("engineer");
  const tc = await getTranslations("common");

  const nav = [
    { href: "/engineer", label: tc("dashboard"), icon: "LayoutDashboard" },
    { href: "/engineer/profile", label: t("profile"), icon: "User" },
    { href: "/engineer/invitations", label: t("invitations"), icon: "Briefcase" },
    { href: "/engineer/assignments", label: t("assignments"), icon: "Star" },
  ];

  return (
    <div className="flex min-h-screen">
      <PortalSidebar title={t("title")} items={nav} />
      <div className="flex-1 bg-surface-muted p-8">
        <h1 className="text-2xl font-bold">{tc("dashboard")}</h1>
        <p className="mt-1 text-muted">Engineer journey: Verify → Position → Deliver → Build Reputation</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            { label: "Pending Invitations", value: "0" },
            { label: "Active Assignments", value: "0" },
            { label: "Completed Tasks", value: "0" },
          ].map((stat) => (
            <Card key={stat.label}>
              <p className="text-sm text-muted">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-primary">{stat.value}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="font-semibold">{t("profile")}</h2>
            <p className="mt-2 text-sm text-muted">
              Complete specialization, experience, council membership, portfolio, and service location.
            </p>
            <Link href="/engineer/profile" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
              {t("profile")} →
            </Link>
          </Card>
          <Card>
            <h2 className="font-semibold">Join Engineering Office</h2>
            <p className="mt-2 text-sm text-muted">
              Optionally link to a licensed office or offer individual services where regulation permits.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
