import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Building2, FileCheck, Users } from "lucide-react";

export function RoleCTASection() {
  const t = useTranslations("landing");

  const roles = [
    {
      title: t("ctaClient"),
      desc: "Discover services, submit requests, compare quotes",
      href: "/auth/sign-up?role=client",
      icon: Users,
      color: "bg-primary/10 text-primary",
    },
    {
      title: t("ctaAgency"),
      desc: "Register office, receive requests, submit quotations",
      href: "/auth/sign-up?role=agency_owner",
      icon: Building2,
      color: "bg-accent/10 text-accent",
    },
    {
      title: t("ctaEngineer"),
      desc: "Verify credentials, join offices, deliver tasks",
      href: "/auth/sign-up?role=individual_engineer",
      icon: FileCheck,
      color: "bg-primary-light/10 text-primary-light",
    },
  ];

  return (
    <section className="bg-surface-muted py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.href}
                href={role.href}
                className="group rounded-2xl border border-border bg-surface p-8 shadow-sm transition-all hover:border-primary hover:shadow-md"
              >
                <div className={`mb-4 inline-flex rounded-xl p-3 ${role.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary">
                  {role.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{role.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
