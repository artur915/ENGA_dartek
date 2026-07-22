import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { ServiceDiscoverySection } from "@/components/landing/ServiceDiscoverySection";
import { PackagesSection } from "@/components/landing/PackagesSection";
import { ClientBenefitsSection } from "@/components/landing/ClientBenefitsSection";
import { ProviderBenefitsSection } from "@/components/landing/ProviderBenefitsSection";
import { AgenciesPreviewSection } from "@/components/landing/AgenciesPreviewSection";
import { RoleCTASection } from "@/components/landing/RoleCTASection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main className="flex-1 overflow-x-hidden bg-landing-bg">
        <HeroSection />
        <TrustSection />
        <WorkflowSection />
        <ServiceDiscoverySection />
        <PackagesSection />
        <ClientBenefitsSection />
        <ProviderBenefitsSection />
        <AgenciesPreviewSection />
        <RoleCTASection />
      </main>
      <Footer />
    </>
  );
}
