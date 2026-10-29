"use client";

import type { InvestigationToolProps } from "../types";
import { ToolField, InsightCallout } from "../shared/ToolResultPanel";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function AttachmentAnalysisTool({ email, revealed }: InvestigationToolProps) {
  const { t } = useLocale();

  if (email.attachments.length === 0) {
    return <p className="text-sm text-text-muted">{t("investigation.noAttachments")}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {email.attachments.map((att) => (
        <div key={att.id} className="rounded-lg border border-border p-3">
          <ToolField label={t("investigation.fileNameLabel")} value={att.fileName} />
          <ToolField label={t("investigation.declaredExtensionLabel")} value={att.declaredExtension} />
          <ToolField label={t("investigation.actualTypeLabel")} value={att.actualType} />
          <ToolField label={t("investigation.sizeLabel")} value={`${att.sizeKB} KB`} />
          <ToolField
            label={t("investigation.hasMacroLabel")}
            value={att.hasMacro ? t("investigation.yes") : t("investigation.no")}
          />
        </div>
      ))}
      <InsightCallout revealed={revealed} />
    </div>
  );
}
