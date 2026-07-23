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
  const tc = await getTranslations("common");

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-muted/40">
        <div className="border-b border-border-subtle bg-surface">
          <div className="container-app py-10 sm:py-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              {tc("appName")}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div className="container-app py-8 sm:py-10">
          <MarketplaceBrowser />
        </div>
      </main>
      <Footer />
    </>
  );
}
