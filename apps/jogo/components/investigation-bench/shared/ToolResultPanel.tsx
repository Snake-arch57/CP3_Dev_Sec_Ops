"use client";

import { Lightbulb, Lock } from "lucide-react";
import type { RevealedInvestigation } from "@repo/shared/engine";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function ToolNotUsedPlaceholder({ onRun }: { onRun: () => void }) {
  const { t } = useLocale();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center text-text-muted">
      <Lock className="h-8 w-8" />
      <p className="text-sm">{t("investigation.runToolPrompt")}</p>
      <button
        onClick={onRun}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
      >
        {t("investigation.runButton")}
      </button>
    </div>
  );
}

export function InsightCallout({ revealed }: { revealed: RevealedInvestigation | undefined }) {
  if (!revealed) return null;
  return (
    <div className="flex gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-text">
      <Lightbulb className="h-4 w-4 shrink-0 text-warning" />
      <p>{revealed.hint.summaryText}</p>
    </div>
  );
}

export function ToolField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border py-2 text-sm last:border-0">
      <span className="text-xs uppercase tracking-wide text-text-muted">{label}</span>
      <span className="font-mono text-text break-all">{value}</span>
    </div>
  );
}
