"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { LandingSection, LandingSectionHeader } from "@/components/landing/LandingSection";
import { Reveal } from "@/components/motion/Reveal";

export function RoleCTASection() {
  const t = useTranslations("landing");

  return (
    <LandingSection variant="light" id="get-started" className="border-t border-border-subtle">
      <div className="mx-auto max-w-3xl text-center">
        <LandingSectionHeader
          badge={t("getStartedBadge")}
          title={t("getStartedTitle")}
          description={t("getStartedDescription")}
        />
        <Reveal className="flex flex-col items-center justify-center gap-3 sm:flex-row" delay={0.15}>
          <ButtonLink href="/client/requests/new" size="lg" variant="primary">
            {t("ctaSubmitRequest")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </ButtonLink>
          <ButtonLink href="/services" size="lg" variant="outline">
            {t("ctaBrowseServices")}
          </ButtonLink>
        </Reveal>
      </div>
    </LandingSection>
  );
}
