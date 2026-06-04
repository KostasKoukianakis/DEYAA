import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { PipeAnchor, PipeSurface } from "@/components/HeroPipeParts";
import { cn } from "@/lib/utils";
import { HERO_RIGHT_STATION } from "@/lib/heroRightPipePaths";

/** Knee on bottom right pipe — px from mount side (right edge). */
export const HERO_RIGHT_PIPE_B_KNEE_X = 800;

/** Ruler step on horizontal run (px from right / mount side). */
export const HERO_RIGHT_PIPE_RULER_STEP = 100;

export function buildHeroRightPipeRulerMarks(
  lengthPx: number,
  step = HERO_RIGHT_PIPE_RULER_STEP,
) {
  const count = Math.max(0, Math.floor(lengthPx / step));
  return Array.from({ length: count }, (_, i) => (i + 1) * step);
}

interface HeroRightPipeNetworkProps {
  className?: string;
  scrollTriggerId?: string;
}

function PipeRunRuler({ maxPx }: { maxPx?: number }) {
  const [marks, setMarks] = useState<number[]>([]);

  useEffect(() => {
    const update = () => {
      const length = maxPx ?? window.innerWidth;
      setMarks(buildHeroRightPipeRulerMarks(length));
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [maxPx]);

  return (
    <div className="hero-right-pipes__ruler" aria-hidden>
      {marks.map((px) => (
        <span
          key={px}
          className="hero-right-pipes__ruler-mark"
          style={{ right: `${px}px` }}
        >
          {px}
        </span>
      ))}
    </div>
  );
}

function HorizontalWaterPipe({ variant }: { variant: "a" | "b" }) {
  const className =
    variant === "a" ? "hero-right-pipes__pipe--a" : "hero-right-pipes__pipe--b";

  const bStyle =
    variant === "b"
      ? ({
          "--r-knee-x": `${HERO_RIGHT_PIPE_B_KNEE_X}px`,
        } as CSSProperties)
      : undefined;

  return (
    <div className={cn("hero-right-pipes__pipe", className)} style={bStyle}>
      <PipeAnchor />
      <div className="hero-water-spine__pipe-foot" aria-hidden>
        <div className="hero-water-spine__pipe-foot-ring" />
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="hero-water-spine__pipe-foot-bolt" />
        ))}
      </div>

      {variant === "b" ? (
        <>
          <div className="hero-right-pipes__seg hero-right-pipes__seg--h1">
            <PipeSurface flowClassName="hero-water-spine__flow--horizontal" />
            <PipeRunRuler maxPx={HERO_RIGHT_PIPE_B_KNEE_X} />
          </div>
          <div className="hero-right-pipes__seg hero-right-pipes__seg--c1">
            <PipeSurface />
          </div>
          <div className="hero-right-pipes__seg hero-right-pipes__seg--v">
            <PipeSurface />
          </div>
          <div className="hero-right-pipes__seg hero-right-pipes__seg--c2">
            <svg
              className="hero-right-pipes__elbow-svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                className="hero-right-pipes__elbow-halo"
                d="M75 0 V25 Q75 75 25 75 H0"
              />
              <path
                className="hero-right-pipes__elbow-tube"
                d="M75 0 V25 Q75 75 25 75 H0"
              />
            </svg>
          </div>
          <div className="hero-right-pipes__seg hero-right-pipes__seg--h2">
            <PipeSurface flowClassName="hero-water-spine__flow--horizontal" />
          </div>
        </>
      ) : (
        <div className="hero-right-pipes__pipe-run">
          <PipeSurface flowClassName="hero-water-spine__flow--horizontal" />
          <PipeRunRuler />
        </div>
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

/** Right twin pipes (horizontal) + center station — no scroll parallax. */
export function HeroRightPipeNetwork({ className }: HeroRightPipeNetworkProps) {
  return (
    <div className={cn("hero-right-pipes", className)} aria-hidden>
      <RightHorizontalPipeCluster />

      <div
        className="hero-right-pipes__station"
        style={{
          left: HERO_RIGHT_STATION.centerX,
          top: HERO_RIGHT_STATION.centerY,
          width: HERO_RIGHT_STATION.width,
          height: HERO_RIGHT_STATION.height,
        }}
      />
    </div>
  );
}
