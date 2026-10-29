"use client";

import type { InvestigationToolProps } from "../types";
import { ToolField, InsightCallout } from "../shared/ToolResultPanel";
import { Badge } from "@/components/ui/Badge";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const STATUS_LABEL_KEY: Record<string, { key: string; variant: "success" | "danger" | "warning" | "neutral" }> = {
  trusted_vendor: { key: "investigation.statusTrustedVendor", variant: "success" },
  never_used: { key: "investigation.statusNeverUsed", variant: "warning" },
  recently_created_domain: { key: "investigation.statusRecentDomain", variant: "danger" },
  previously_reported: { key: "investigation.statusPreviouslyReported", variant: "danger" },
};

export function InternalDbLookupTool({ email, revealed }: InvestigationToolProps) {
  const { t } = useLocale();

  if (!email.internalDbRecord) {
    return <p className="text-sm text-text-muted">{t("investigation.noRecordFound")}</p>;
  }

  const record = email.internalDbRecord;
  const status = STATUS_LABEL_KEY[record.senderStatus];

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between py-2 text-sm">
        <span className="text-xs uppercase tracking-wide text-text-muted">
          {t("investigation.internalStatusLabel")}
        </span>
        <Badge variant={status?.variant ?? "neutral"}>{status ? t(status.key) : record.senderStatus}</Badge>
      </div>
      {record.notes && <ToolField label={t("investigation.observationsLabel")} value={record.notes} />}
      <div className="mt-3">
        <InsightCallout revealed={revealed} />
      </div>
    </div>
  );
}
