import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Building2, FileCheck, Users, ArrowRight, Zap } from "lucide-react";
import {
  LandingCard,
  LandingSection,
  LandingSectionHeader,
} from "@/components/landing/LandingSection";

export function RoleCTASection() {
  const t = useTranslations("landing");

  const roles = [
    {
      title: t("ctaClient"),
      desc: "Discover services, submit requests, compare quotes, and track your project to completion.",
      href: "/auth/sign-up?role=client",
      icon: Users,
      gradient: "from-emerald-400/20 to-primary/10",
      iconColor: "text-emerald-300",
      cta: "Start as Client",
    },
    {
      title: t("ctaAgency"),
      desc: "Register your office, receive matched requests, submit quotations, and grow your business.",
      href: "/auth/sign-up?role=agency_owner",
      icon: Building2,
      gradient: "from-accent/25 to-accent/5",
      iconColor: "text-accent-light",
      cta: "Register Office",
      featured: true,
    },
    {
      title: t("ctaEngineer"),
      desc: "Verify credentials, join linked offices, accept assignments, and build your reputation.",
      href: "/auth/sign-up?role=individual_engineer",
      icon: FileCheck,
      gradient: "from-primary-light/25 to-primary/10",
      iconColor: "text-primary-light",
      cta: "Join as Engineer",
    },
  ];

  return (
    <LandingSection variant="glow" id="get-started">
      <LandingSectionHeader
        badge="Join ENGA"
        title="Get started on ENGA"
        description="Choose your role and join Saudi Arabia's engineering services marketplace today."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Link key={role.href} href={role.href} className="block h-full">
              <LandingCard
                glow={role.featured}
                className={`relative flex h-full flex-col overflow-hidden p-8 ${
                  role.featured ? "border-accent/30 ring-1 ring-accent/20" : ""
                }`}
              >
                {role.featured && (
                  <div className="absolute -end-8 -top-8 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
                )}
                <div
                  className={`relative mb-6 inline-flex w-fit rounded-2xl bg-gradient-to-br p-4 ${role.gradient}`}
                >
                  <Icon className={`h-7 w-7 ${role.iconColor}`} />
                </div>
                {role.featured && (
                  <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-light">
                    <Zap className="h-3 w-3" /> Most Active
                  </span>
                )}
                <h3 className="relative text-xl font-bold tracking-tight text-white">{role.title}</h3>
                <p className="relative mt-3 flex-1 text-sm leading-relaxed text-white/60">{role.desc}</p>
                <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-bold text-accent-light transition-all group-hover:gap-3">
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
