import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import type { ProjectUpdateEntry } from "@/lib/project-schedule";

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "default"> = {
  green: "success",
  amber: "warning",
  red: "danger",
};

export async function ProjectUpdatesFeed({ updates }: { updates: ProjectUpdateEntry[] }) {
  const t = await getTranslations("client.updates");
  const ts = await getTranslations("status.traffic");
  const locale = await getLocale();

  if (!updates.length) {
    return (
      <Card className="text-center">
        <p className="text-muted">{t("empty")}</p>
        <Link href="/client/schedule" className="mt-4 inline-block text-sm font-semibold text-primary">
          {t("viewSchedule")} →
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {updates.map((update) => (
        <Card key={update.id} padding="md" className="transition-shadow hover:shadow-card-hover">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {update.projectTitle}
              </p>
              <h3 className="mt-1 text-base font-bold text-foreground">{update.milestoneTitle}</h3>
              <p className="mt-1 text-sm text-muted">{update.agencyName}</p>
            </div>
            <Badge variant={STATUS_VARIANT[update.status] ?? "default"} size="sm">
              {ts.has(update.status) ? ts(update.status) : update.status}
            </Badge>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground">{update.message}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
            <span>{formatDate(update.updatedAt, locale)}</span>
            <Link
              href={`/client/schedule?project=${update.requestId}`}
              className="font-semibold text-primary hover:text-primary-dark"
            >
              {t("viewSchedule")} →
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
