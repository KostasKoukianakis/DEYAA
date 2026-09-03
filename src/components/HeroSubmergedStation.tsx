import { PipeSurface } from "@/components/HeroPipeParts";
import { cn } from "@/lib/utils";
import { HERO_RIGHT_STATION } from "@/lib/heroRightPipePaths";

/** Submerged station — C-notch top (8 vertices) + base rect + pipe stub on right spine. */
export function HeroSubmergedStation({ className }: { className?: string }) {
  return (
    <div
      className={cn("hero-submerged-station", className)}
      aria-hidden
      style={{
        left: HERO_RIGHT_STATION.centerX,
        top: HERO_RIGHT_STATION.centerY,
      }}
    >
      <span className="hero-submerged-station__body hero-entrance-station" />

      <span
        className="hero-submerged-station__down-stub hero-submerged-station__down-stub--y1"
        aria-hidden
      >
        <span className="hero-submerged-station__stub-grow hero-entrance-station-down-stub">
          <PipeSurface />
        </span>
      </span>

      <span
        className="hero-submerged-station__down-stub hero-submerged-station__down-stub--y2"
        aria-hidden
      >
        <span className="hero-submerged-station__stub-grow hero-entrance-station-down-stub">
          <PipeSurface />
        </span>
      </span>

      <span
        className="hero-submerged-station__stub hero-submerged-station__stub--a"
        aria-hidden
      >
        <span className="hero-submerged-station__stub-grow hero-entrance-station-side-stub hero-entrance-station-side-stub--a">
          <PipeSurface />
        </span>
      </span>

      <span
        className="hero-submerged-station__stub hero-submerged-station__stub--b"
        aria-hidden
      >
        <span className="hero-submerged-station__stub-grow hero-entrance-station-side-stub hero-entrance-station-side-stub--b">
          <PipeSurface flowClassName="hero-water-spine__flow--horizontal" />
        </span>
      </span>
    </div>
  );
}
