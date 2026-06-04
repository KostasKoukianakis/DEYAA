import { cn } from "@/lib/utils";

interface PalladioGradientLayerProps {
  imageUrl: string;
  /** CSS background-position, e.g. "bottom center" | "top center" */
  backgroundPosition: string;
  className?: string;
}

/** Palladio-style gradient — CSS only (matches palladiogroup.com rendering) */
export function PalladioGradientLayer({
  imageUrl,
  backgroundPosition,
  className,
}: PalladioGradientLayerProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 bg-white bg-cover bg-no-repeat",
        className
      )}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundPosition,
      }}
      aria-hidden
    />
  );
}
