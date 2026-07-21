import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PublicPageHeader } from "@/components/ui/PublicPageHeader";
import { AgenciesBrowser } from "@/components/agencies/AgenciesBrowser";
import { getApprovedAgencies } from "@/actions/agency";

export default async function AgenciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("common");
  const tl = await getTranslations("landing");
  const agencies = await getApprovedAgencies();

  return (
    <>
      <Header />
      <main className="container-app flex-1 py-10 sm:py-12">
        <PublicPageHeader
          eyebrow={tl("agenciesBadge")}
          title={t("agencies")}
          description={tl("agenciesDescription")}
        />
        <div className="mt-10">
          <AgenciesBrowser agencies={agencies} />
        </div>
      </main>
      <Footer />
    </>
  );
}
