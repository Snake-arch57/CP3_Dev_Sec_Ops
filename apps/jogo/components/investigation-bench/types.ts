import type { LucideIcon } from "lucide-react";
import type { Email, InvestigationToolId } from "@repo/shared/schemas";
import type { RevealedInvestigation } from "@repo/shared/engine";

export interface InvestigationToolProps {
  email: Email;
  isUsed: boolean;
  revealed: RevealedInvestigation | undefined;
}

export interface ToolRegistryEntry {
  id: InvestigationToolId;
  label: string;
  icon: LucideIcon;
  Component: (props: InvestigationToolProps) => React.ReactElement;
}
