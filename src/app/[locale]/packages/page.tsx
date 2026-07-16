import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SERVICE_PACKAGES } from "@/data/catalog";
import { Card } from "@/components/ui/Card";
import { Package } from "lucide-react";

export default async function PackagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">{t("packagesTitle")}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t("packagesSubtitle")}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {SERVICE_PACKAGES.map((pkg) => (
            <Card key={pkg.slug}>
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
                <Package className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">{pkg.name}</h2>
              <p className="mt-3 text-muted">{pkg.description}</p>
              <p className="mt-4 rounded-lg bg-surface-muted px-4 py-3 text-sm font-medium text-primary">
                {pkg.categories}
              </p>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
