"use client";

import type { InvestigationToolProps } from "../types";
import { ToolField, InsightCallout } from "../shared/ToolResultPanel";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function SenderAddressTool({ email, revealed }: InvestigationToolProps) {
  const { t } = useLocale();
  return (
    <div className="flex flex-col gap-1">
      <ToolField label={t("investigation.displayNameLabel")} value={email.sender.displayName} />
      <ToolField label={t("investigation.fullAddressLabel")} value={email.sender.emailAddressRaw} />
      <ToolField label={t("investigation.domainLabel")} value={email.sender.domain} />
      <div className="mt-3">
        <InsightCallout revealed={revealed} />
      </div>
    </div>
  );
}
