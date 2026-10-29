import * as Progress from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  max = 100,
  className,
  indicatorClassName,
}: {
  value: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <Progress.Root
      value={value}
      max={max}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-surface-3", className)}
    >
      <Progress.Indicator
        className={cn("h-full bg-primary transition-transform duration-300 ease-out", indicatorClassName)}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </Progress.Root>
  );
}
