"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Lightbulb } from "lucide-react";
import type { Email, InvestigationToolId } from "@repo/shared/schemas";
import { useInvestigation } from "@/lib/hooks/useInvestigation";
import { INVESTIGATION_TOOL_REGISTRY } from "./registry";
import { ToolCard } from "./shared/ToolCard";
import { ToolNotUsedPlaceholder } from "./shared/ToolResultPanel";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function InvestigationBench({
  email,
  open,
  onOpenChange,
}: {
  email: Email;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useLocale();
  const { toolsUsed, runTool, getRevealed } = useInvestigation(email);
  const [selectedToolId, setSelectedToolId] = useState<InvestigationToolId>(
    INVESTIGATION_TOOL_REGISTRY[0]!.id,
  );

  const selectedEntry = INVESTIGATION_TOOL_REGISTRY.find((t) => t.id === selectedToolId)!;
  const isSelectedUsed = toolsUsed.includes(selectedToolId);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex h-[85vh] w-[95vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-border bg-bg shadow-2xl">
          <div className="flex items-center justify-between border-b border-border bg-surface px-5 py-4">
            <Dialog.Title className="flex items-center gap-2 font-stencil font-semibold uppercase tracking-wide">
              <Lightbulb className="h-5 w-5 text-primary" />
              {t("investigation.benchTitle")}
            </Dialog.Title>
            <Dialog.Close className="rounded-lg p-1.5 text-text-muted hover:bg-surface-2 hover:text-text">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="w-64 shrink-0 space-y-1 overflow-y-auto border-r border-border p-3">
              {INVESTIGATION_TOOL_REGISTRY.map((tool) => (
                <ToolCard
                  key={tool.id}
                  icon={tool.icon}
                  label={tool.label}
                  isUsed={toolsUsed.includes(tool.id)}
                  isSelected={tool.id === selectedToolId}
                  onClick={() => setSelectedToolId(tool.id)}
                />
              ))}
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto p-6">
              <h3 className="mb-4 font-semibold text-text">{selectedEntry.label}</h3>
              {isSelectedUsed ? (
                <selectedEntry.Component
                  email={email}
                  isUsed
                  revealed={getRevealed(selectedEntry.id)}
                />
              ) : (
                <ToolNotUsedPlaceholder
                  onRun={() => runTool(selectedEntry.id)}
                />
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
