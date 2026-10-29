"use client";

import { QrCode } from "lucide-react";
import type { InvestigationToolProps } from "../types";
import { ToolField, InsightCallout } from "../shared/ToolResultPanel";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function QrCodeTool({ email, revealed }: InvestigationToolProps) {
  const { t } = useLocale();

  if (!email.qrCode) {
    return <p className="text-sm text-text-muted">{t("investigation.noQrCode")}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-center rounded-lg border border-border bg-surface-2 py-6">
        <QrCode className="h-16 w-16 text-text-muted" />
      </div>
      <ToolField label={t("investigation.qrDestinationLabel")} value={email.qrCode.decodedUrl} />
      <InsightCallout revealed={revealed} />
    </div>
  );
}
