import { cn } from "@/lib/utils";

/** Concentric-ring bullet — matches Palladio footer marquee icon */
export function PalladioFooterBulletIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={cn("palladio-footer-bullet-icon", className)}
    >
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}
