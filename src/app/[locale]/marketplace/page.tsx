import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarketplaceBrowser } from "@/components/marketplace/MarketplaceBrowser";

export default async function MarketplacePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("marketplacePage");

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="container-app py-10 sm:py-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-3xl text-base text-gray-500 sm:text-lg">{t("subtitle")}</p>
          <div className="mt-8">
            <MarketplaceBrowser />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
