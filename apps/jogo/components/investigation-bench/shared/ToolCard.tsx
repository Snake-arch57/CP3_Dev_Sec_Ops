import { type LucideIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToolCard({
  icon: Icon,
  label,
  isUsed,
  isSelected,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  isUsed: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-2",
        isSelected && "border-primary/50 bg-primary/10",
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", isUsed ? "text-success" : "text-text-muted")} />
      <span className="flex-1 font-medium text-text">{label}</span>
      {/* O selo de custo ("-3s") saiu com a mecânica de tempo: conferir é livre. */}
      {isUsed && <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />}
    </button>
  );
}
