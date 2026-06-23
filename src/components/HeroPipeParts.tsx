import { cn } from "@/lib/utils";

export function PipeSurface({ flowClassName }: { flowClassName?: string }) {
  return (
    <>
      <div className="hero-water-spine__halo" />
      <div className="hero-water-spine__tube">
        <div className={cn("hero-water-spine__flow", flowClassName)} />
        <div className="hero-water-spine__highlight" />
      </div>
    </>
  );
}

/**
 * 90° elbow — concentric arcs (annulus). Original path mirrored via SVG transform
 * (preserves inner/outer radii; manual point flip breaks the inner arc).
 */
export function PipeElbowDownRight({ className }: { className?: string }) {
  return (
    <svg
      className={cn("hero-pipe-elbow-down-right", className)}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <g transform="translate(100, 0) scale(-1, 1)">
        <path
          className="hero-pipe-elbow-down-right__fill"
          d="M 35 0 L 100 0 A 100 100 0 0 1 0 100 L 0 35 A 35 35 0 0 0 35 0 Z"
        />
      </g>
    </svg>
  );
}

/** 90° elbow — vertical inlet at top, horizontal outlet to the left */
export function PipeElbowDownLeft({ className }: { className?: string }) {
  return (
    <svg
      className={cn("hero-pipe-elbow-down-left", className)}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        className="hero-pipe-elbow-down-left__fill"
        d="M 35 0 L 100 0 A 100 100 0 0 1 0 100 L 0 35 A 35 35 0 0 0 35 0 Z"
      />
    </svg>
  );
}

/** Top mount: coupling → elbow into flat back plane (Z), not toward viewer */
export function PipeAnchor({ className }: { className?: string }) {
  return (
    <div className={cn("hero-water-spine__pipe-anchor", className)}>
      <div className="hero-water-spine__pipe-anchor-indepth">
        <div className="hero-water-spine__pipe-anchor-wall" aria-hidden />
        <div className="hero-water-spine__pipe-anchor-elbow">
          <PipeSurface />
        </div>
      </div>
      <div className="hero-water-spine__pipe-anchor-coupling">
        <PipeSurface />
      </div>
    </div>
  );
}
