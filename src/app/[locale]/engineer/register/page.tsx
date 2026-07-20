import { redirect } from "next/navigation";
import { isEngineerRegistered } from "@/actions/engineer";
import EngineerRegisterClient from "./EngineerRegisterClient";

export default async function EngineerRegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (await isEngineerRegistered()) {
    redirect(`/${locale}/engineer`);
  }

  return <EngineerRegisterClient />;
}
