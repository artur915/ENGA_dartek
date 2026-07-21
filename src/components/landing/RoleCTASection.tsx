import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Building2, Users } from "lucide-react";
import { LandingCard, LandingSection, LandingSectionHeader } from "@/components/landing/LandingSection";

export function RoleCTASection() {
  const t = useTranslations("landing");

  const roles = [
    {
      title: t("ctaClient"),
      description: t("roleClientDesc"),
      href: "/auth/sign-up?role=client",
      cta: t("roleClientCta"),
      icon: Users,
      featured: false,
    },
    {
      title: t("ctaAgency"),
      description: t("roleAgencyDesc"),
      href: "/auth/sign-up?role=agency_owner",
      cta: t("roleAgencyCta"),
      icon: Building2,
      featured: true,
    },
  ];

  return (
    <LandingSection variant="brand" id="get-started">
      <LandingSectionHeader
        badge={t("getStartedBadge")}
        title={t("getStartedTitle")}
        description={t("getStartedDescription")}
        inverted
      />
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Link key={role.href} href={role.href} className="block h-full">
              <LandingCard
                className={`flex h-full flex-col border-white/15 bg-white/95 p-8 hover:bg-white ${
                  role.featured ? "ring-2 ring-accent/40" : ""
                }`}
              >
                <div className="mb-5 inline-flex w-fit rounded-xl bg-primary/10 p-3 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-navy">{role.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{role.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {role.cta}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </LandingCard>
            </Link>
          );
        })}
      </div>
    </LandingSection>
  );
}
