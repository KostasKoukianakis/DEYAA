import { PipeAnchor, PipeSurface } from "@/components/HeroPipeParts";
import { cn } from "@/lib/utils";

interface HeroRightPipeNetworkProps {
  className?: string;
  scrollTriggerId?: string;
}

function HorizontalWaterPipe({ variant }: { variant: "a" | "b" }) {
  const className =
    variant === "a" ? "hero-right-pipes__pipe--a" : "hero-right-pipes__pipe--b";

  return (
    <div className={cn("hero-right-pipes__pipe", className)}>
      <div className="hero-right-pipes__mount hero-entrance-right-base">
        <div className="hero-right-pipes__mount-inner">
          <PipeAnchor />
        </div>
      </div>
      <div className="hero-right-pipes__flange hero-entrance-right-base" aria-hidden>
        <div className="hero-right-pipes__flange-inner">
          <div className="hero-water-spine__pipe-foot">
            <div className="hero-water-spine__pipe-foot-ring" />
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="hero-water-spine__pipe-foot-bolt" />
            ))}
          </div>
        </div>
      </div>

      {variant === "b" ? (
        <>
          <div className="hero-right-pipes__seg hero-right-pipes__seg--h1 hero-entrance-right-seg hero-entrance-right-seg--h1">
            <PipeSurface flowClassName="hero-water-spine__flow--horizontal" />
          </div>
          <div className="hero-right-pipes__seg hero-right-pipes__seg--c1 hero-entrance-right-seg hero-entrance-right-seg--c1">
            <PipeSurface />
          </div>
          <div className="hero-right-pipes__seg hero-right-pipes__seg--v hero-entrance-right-seg hero-entrance-right-seg--v">
            <PipeSurface />
          </div>
          <div className="hero-right-pipes__seg hero-right-pipes__seg--c2 hero-entrance-right-seg hero-entrance-right-seg--c2">
            <PipeSurface />
          </div>
          <div className="hero-right-pipes__seg hero-right-pipes__seg--h2 hero-entrance-right-seg hero-entrance-right-seg--h2">
            <PipeSurface flowClassName="hero-water-spine__flow--horizontal" />
          </div>
        </>
      ) : (
        <>
          <div className="hero-right-pipes__seg hero-right-pipes__seg--h1 hero-entrance-right-seg hero-entrance-right-seg--h1">
            <PipeSurface flowClassName="hero-water-spine__flow--horizontal" />
          </div>
          <div className="hero-right-pipes__seg hero-right-pipes__seg--c1 hero-entrance-right-seg hero-entrance-right-seg--c1">
            <PipeSurface />
          </div>
          <div className="hero-right-pipes__seg hero-right-pipes__seg--v hero-entrance-right-seg hero-entrance-right-seg--v">
            <PipeSurface />
          </div>
        </>
      )}
    </div>
  );
}

function RightHorizontalPipeCluster() {
  return (
    <div className="hero-right-pipes__cluster">
      <div className="hero-right-pipes__pipe-slot">
        <HorizontalWaterPipe variant="a" />
      </div>
      <div className="hero-right-pipes__pipe-slot">
        <HorizontalWaterPipe variant="b" />
      </div>
    </div>
  );
}

/** Right twin pipes (horizontal) — no scroll parallax. Station lives in shader layer. */
export function HeroRightPipeNetwork({ className }: HeroRightPipeNetworkProps) {
  return (
    <div className={cn("hero-right-pipes", className)} aria-hidden>
      <RightHorizontalPipeCluster />
    </div>
  );
}
