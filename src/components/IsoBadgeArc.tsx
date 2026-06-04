import { useId } from "react";

/** Curved ISO label on the top arc of the medal — no ribbon. */
export function IsoBadgeArc() {
  const uid = useId().replace(/:/g, "");
  const arcId = `iso-badge-arc-${uid}`;

  return (
    <svg
      className="sustain-environment__badge-arc"
      viewBox="0 0 300 300"
      aria-hidden
      role="presentation"
    >
      <defs>
        <path id={arcId} d="M 52 118 A 98 98 0 0 1 248 118" fill="none" />
      </defs>
      <text className="sustain-environment__badge-arc-text">
        <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
          ISO · 14001
        </textPath>
      </text>
    </svg>
  );
}
