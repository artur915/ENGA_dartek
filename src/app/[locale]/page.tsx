import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { PackagesSection } from "@/components/landing/PackagesSection";
import { CatalogSection } from "@/components/landing/CatalogSection";
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
      <main className="flex-1">
        <HeroSection />
        <WorkflowSection />
        <PackagesSection />
        <CatalogSection />
        <RoleCTASection />
      </main>
      <Footer />
    </>
  );
}
