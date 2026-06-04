import { useId } from "react";
import { cn } from "@/lib/utils";

interface HeroPipeValveWheelProps {
  className?: string;
}

/** Side handwheel + short hub stem to pipe exterior (no floating). */
export function HeroPipeValveWheel({ className }: HeroPipeValveWheelProps) {
  const uid = useId().replace(/:/g, "");
  const stroke = "rgba(255, 255, 255, 0.54)";
  const strokeSoft = "rgba(200, 235, 255, 0.36)";

  const padL = 5;
  const padV = 4;
  const rimRx = 10.5;
  const rimRy = 27.5;
  const hubRx = 3.1;
  const hubRy = 4.5;
  const rimStroke = 1.75;
  const rimBand = 1.55;

  const mountX = padL + rimRx * 2;
  const wheelCx = padL + rimRx;
  const wheelCy = padV + rimRy;
  const viewW = mountX;
  const viewH = padV * 2 + rimRy * 2;

  const stemH = hubRy * 2;
  const stemStartX = wheelCx;

  const rimPoint = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: wheelCx + Math.cos(rad) * rimRx,
      y: wheelCy + Math.sin(rad) * rimRy,
    };
  };

  const hubPoint = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: wheelCx + Math.cos(rad) * hubRx,
      y: wheelCy + Math.sin(rad) * hubRy,
    };
  };

  const spokes = [0, 90, 180, 270] as const;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${viewW} ${viewH}`}
      fill="none"
      className={cn("block h-full w-auto select-none", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${uid}-stem`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.34)" />
          <stop offset="100%" stopColor="rgba(180, 230, 255, 0.28)" />
        </linearGradient>
      </defs>

      {/* Hub stem — same thickness as center hub, center to pipe */}
      <rect
        x={stemStartX}
        y={wheelCy - hubRy}
        width={Math.max(mountX - stemStartX, 2)}
        height={stemH}
        rx={hubRy}
        fill={`url(#${uid}-stem)`}
        stroke={strokeSoft}
        strokeWidth="0.55"
      />
      <ellipse
        cx={mountX}
        cy={wheelCy}
        rx={1.35}
        ry={hubRy}
        fill="rgba(200, 235, 255, 0.18)"
        stroke={strokeSoft}
        strokeWidth="0.55"
      />

      <g strokeLinecap="round">
        {spokes.map((deg) => {
          const from = hubPoint(deg);
          const to = rimPoint(deg);
          return (
            <line
              key={deg}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={stroke}
              strokeWidth="1.15"
            />
          );
        })}

        <ellipse cx={wheelCx} cy={wheelCy} rx={rimRx} ry={rimRy} stroke={stroke} strokeWidth={rimStroke} />
        <ellipse
          cx={wheelCx}
          cy={wheelCy}
          rx={rimRx - rimBand}
          ry={rimRy - rimBand}
          stroke={strokeSoft}
          strokeWidth="0.52"
          opacity="0.7"
        />
        <ellipse cx={wheelCx} cy={wheelCy} rx={hubRx} ry={hubRy} stroke={stroke} strokeWidth="0.9" />
      </g>
    </svg>
  );
}
