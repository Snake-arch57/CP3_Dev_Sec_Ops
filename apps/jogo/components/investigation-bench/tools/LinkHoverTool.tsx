"use client";

import type { InvestigationToolProps } from "../types";
import { ToolField, InsightCallout } from "../shared/ToolResultPanel";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function LinkHoverTool({ email, revealed }: InvestigationToolProps) {
  const { t } = useLocale();

  if (email.links.length === 0) {
    return <p className="text-sm text-text-muted">{t("investigation.noLinks")}</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      {email.links.map((link) => (
        <ToolField
          key={link.id}
          label={t("investigation.linkPointsTo", { text: link.displayText })}
          value={link.actualUrl}
        />
      ))}
      <div className="mt-3">
        <InsightCallout revealed={revealed} />
      </div>
    </div>
  );
}
