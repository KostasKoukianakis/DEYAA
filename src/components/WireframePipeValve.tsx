import { useId } from "react";
import { cn } from "@/lib/utils";

interface WireframePipeValveProps {
  className?: string;
  width?: number | string;
  title?: string;
}

/**
 * Clean front-facing water valve — white technical illustration with mesh filter section.
 */
export function WireframePipeValve({
  className,
  width = "100%",
  title = "Industrial water valve",
}: WireframePipeValveProps) {
  const uid = useId().replace(/:/g, "");
  const stroke = "rgba(160, 172, 188, 0.55)";
  const strokeLight = "rgba(190, 198, 210, 0.45)";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 500"
      width={width}
      className={cn("h-auto select-none", className)}
      role="img"
      aria-label={title || undefined}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={`${uid}-white`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#eef1f5" />
          <stop offset="35%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d8dfe8" />
        </linearGradient>
        <linearGradient id={`${uid}-pipe`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f2f4f7" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8ef" />
        </linearGradient>
        <linearGradient id={`${uid}-gold`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f2cc7a" />
          <stop offset="100%" stopColor="#d9a84a" />
        </linearGradient>
        <pattern id={`${uid}-grid`} width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M 14 0 L 0 0 0 14" fill="none" stroke="rgba(170,180,195,0.35)" strokeWidth="0.6" />
        </pattern>
      </defs>

      {/* Side valve — top-down circular hatch */}
      <g transform="translate(52 168)">
        <circle r="38" fill={`url(#${uid}-white)`} stroke={stroke} strokeWidth="0.75" />
        <circle r="30" fill="none" stroke={strokeLight} strokeWidth="0.55" />
        <circle r="22" fill="none" stroke={strokeLight} strokeWidth="0.45" />
        <circle r="9" fill="#f6f8fa" stroke={stroke} strokeWidth="0.6" />
        <line x1="-28" y1="0" x2="28" y2="0" stroke={stroke} strokeWidth="0.55" />
        <line x1="0" y1="-28" x2="0" y2="28" stroke={stroke} strokeWidth="0.55" />
        <line x1="-20" y1="-20" x2="20" y2="20" stroke={strokeLight} strokeWidth="0.4" />
        <line x1="20" y1="-20" x2="-20" y2="20" stroke={strokeLight} strokeWidth="0.4" />
        <rect x="34" y="-5" width="14" height="10" rx="2" fill="#eef2f6" stroke={stroke} strokeWidth="0.55" />
      </g>

      {/* Top vertical pipe */}
      <rect x="142" y="28" width="36" height="72" rx="2" fill={`url(#${uid}-pipe)`} stroke={stroke} strokeWidth="0.75" />
      <ellipse cx="160" cy="28" rx="20" ry="7" fill="#fafbfc" stroke={stroke} strokeWidth="0.65" />

      {/* Elbow + outlet flange */}
      <path
        d="M 178 52 Q 228 52 228 82 L 228 96 Q 228 112 244 112 L 272 112 L 272 132 L 244 132 Q 212 132 212 100 L 212 82 Q 212 62 178 62 Z"
        fill={`url(#${uid}-white)`}
        stroke={stroke}
        strokeWidth="0.75"
      />
      <ellipse cx="272" cy="122" rx="8" ry="18" fill="#f4f7fa" stroke={stroke} strokeWidth="0.6" />

      {/* Upper flange */}
      <ellipse cx="160" cy="108" rx="46" ry="12" fill={`url(#${uid}-white)`} stroke={stroke} strokeWidth="0.75" />
      {[124, 142, 160, 178, 196].map((x) => (
        <circle key={x} cx={x} cy="108" r="3.5" fill="#eef2f6" stroke={strokeLight} strokeWidth="0.5" />
      ))}

      {/* Gauge */}
      <rect x="155" y="118" width="10" height="22" rx="2" fill="#eef2f6" stroke={stroke} strokeWidth="0.55" />
      <circle cx="160" cy="108" r="11" fill="#ffffff" stroke={stroke} strokeWidth="0.65" />
      <circle cx="160" cy="108" r="7" fill="none" stroke={strokeLight} strokeWidth="0.45" />
      <line x1="160" y1="108" x2="166" y2="102" stroke="#a8b4c4" strokeWidth="1" strokeLinecap="round" />

      {/* Main body — upper solid */}
      <path
        d="M 128 148 L 192 148 L 200 228 L 120 228 Z"
        fill={`url(#${uid}-white)`}
        stroke={stroke}
        strokeWidth="0.75"
      />

      {/* Main body — lower mesh */}
      <path
        d="M 120 228 L 200 228 L 212 318 L 108 318 Z"
        fill={`url(#${uid}-grid)`}
        stroke={stroke}
        strokeWidth="0.75"
      />
      <path d="M 120 228 L 200 228 L 212 318 L 108 318 Z" fill="rgba(255,255,255,0.72)" />

      {/* Perforation row */}
      {[118, 134, 150, 166, 182, 198].map((x) => (
        <circle key={x} cx={x} cy="318" r="3" fill="#eef2f6" stroke={strokeLight} strokeWidth="0.45" />
      ))}

      {/* Lower flange */}
      <ellipse cx="160" cy="332" rx="50" ry="13" fill={`url(#${uid}-white)`} stroke={stroke} strokeWidth="0.75" />
      {[118, 136, 154, 166, 184, 202].map((x) => (
        <circle key={x} cx={x} cy="332" r="3.5" fill="#eef2f6" stroke={strokeLight} strokeWidth="0.5" />
      ))}

      {/* Gold outlet pipe */}
      <rect x="134" y="344" width="52" height="56" rx="2" fill={`url(#${uid}-gold)`} stroke="rgba(180,140,60,0.35)" strokeWidth="0.65" />
      <ellipse cx="160" cy="344" rx="28" ry="9" fill="#f5d48a" stroke="rgba(180,140,60,0.3)" strokeWidth="0.55" />
      <ellipse cx="160" cy="400" rx="30" ry="10" fill="#c89438" stroke="rgba(140,100,40,0.35)" strokeWidth="0.55" />

      {/* Subtle vertical highlight */}
      <rect x="148" y="148" width="6" height="170" rx="3" fill="rgba(255,255,255,0.35)" />
    </svg>
  );
}
