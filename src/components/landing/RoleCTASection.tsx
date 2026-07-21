import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Building2, ClipboardList, Users } from "lucide-react";
import { LandingSection, LandingSectionHeader } from "@/components/landing/LandingSection";

export function RoleCTASection() {
  const t = useTranslations("landing");

  return (
    <LandingSection variant="brand" id="get-started">
      <LandingSectionHeader
        badge={t("getStartedBadge")}
        title={t("getStartedTitle")}
        description={t("getStartedDescription")}
        inverted
      />
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href="/client/requests/new"
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90"
          >
            <ClipboardList className="h-4 w-4" />
            {t("ctaSubmitRequest")}
          </ButtonLink>
          <ButtonLink
            href="/auth/sign-up?role=agency_owner"
            size="lg"
            variant="outline"
            className="border-white/30 bg-transparent text-white hover:bg-white/10"
          >
            <Building2 className="h-4 w-4" />
            {t("ctaJoinProvider")}
          </ButtonLink>
        </div>
        <p className="mt-6 flex items-center gap-2 text-sm text-white/75">
          <Users className="h-4 w-4" />
          {t("roleClientDesc")}
        </p>
      </div>
    </LandingSection>
  );
}
