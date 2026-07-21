import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PublicPageHeader } from "@/components/ui/PublicPageHeader";
import { ServicesBrowser } from "@/components/services/ServicesBrowser";

export default async function ServicesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { category, q } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("common");
  const tl = await getTranslations("landing");

  return (
    <>
      <Header />
      <main className="container-app flex-1 py-10 sm:py-12">
        <PublicPageHeader
          eyebrow={tl("catalogBadge")}
          title={t("services")}
          description={tl("catalogSubtitle")}
        />
        <div className="mt-10">
          <ServicesBrowser initialCategory={category} initialQuery={q} />
        </div>
      </main>
      <Footer />
    </>
  );
}
