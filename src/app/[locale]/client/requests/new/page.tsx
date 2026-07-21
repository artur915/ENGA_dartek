import { setRequestLocale } from "next-intl/server";
import { NewRequestForm } from "@/components/client/NewRequestForm";

export default async function NewRequestPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ draft?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { draft } = await searchParams;

  return <NewRequestForm draftId={draft ?? null} />;
}
