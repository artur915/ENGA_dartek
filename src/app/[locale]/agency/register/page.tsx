import { redirect } from "next/navigation";
import { getMyAgency } from "@/actions/agency";
import AgencyRegisterClient from "./AgencyRegisterClient";

export default async function AgencyRegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const agency = await getMyAgency();

  if (agency) {
    redirect(`/${locale}/agency`);
  }

  return <AgencyRegisterClient />;
}
