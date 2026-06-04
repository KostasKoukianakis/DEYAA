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

/** Top mount: coupling → elbow into flat back plane (Z), not toward viewer */
export function PipeAnchor() {
  return (
    <div className="hero-water-spine__pipe-anchor">
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
