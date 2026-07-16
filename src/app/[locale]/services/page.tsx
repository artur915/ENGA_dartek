import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">{t("services")}</h1>
        <p className="mt-2 text-muted">147 engineering services across 10 categories</p>
        <ServicesBrowser initialCategory={category} initialQuery={q} />
      </main>
      <Footer />
    </>
  );
}
