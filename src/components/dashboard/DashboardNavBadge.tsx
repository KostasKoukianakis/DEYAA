import { cn } from "@/lib/utils";

interface DashboardNavBadgeProps {
  count: number;
  className?: string;
}

export function DashboardNavBadge({ count, className }: DashboardNavBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        "ml-auto inline-flex min-h-[1.25rem] min-w-[1.25rem] shrink-0 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold leading-none tabular-nums",
        className,
      )}
      aria-label={`${count} νέα / εκκρεμή`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
