import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AgencyProfile } from "@/components/agencies/AgencyProfile";
import { createClient } from "@/lib/supabase/server";
import { getSuggestedServicesForAgency } from "@/lib/agency-profile-display";

export default async function AgencyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: agency } = await supabase
    .from("agencies")
    .select("*")
    .eq("id", id)
    .eq("status", "approved")
    .maybeSingle();

  if (!agency) notFound();

  const services = getSuggestedServicesForAgency(agency.disciplines);

  return (
    <>
      <Header />
      <main className="container-app flex-1 py-8 sm:py-10 lg:py-12">
        <AgencyProfile agency={agency} services={services} />
      </main>
      <Footer />
    </>
  );
}
