import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MeterBadge({
  icon: Icon,
  label,
  value,
  colorClassName,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  colorClassName?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm">
      <Icon className={cn("h-4 w-4", colorClassName)} />
      <span className="text-text-muted">{label}</span>
      <span className="font-pixel text-[11px] text-text">{value}</span>
    </div>
  );
}
