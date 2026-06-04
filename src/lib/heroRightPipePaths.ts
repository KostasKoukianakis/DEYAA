/** Right routed pipes — layout tokens (percent + rem). */
export const HERO_RIGHT_STATION = {
  centerX: "50%",
  centerY: "62%",
  width: "clamp(3.25rem, 6.5vw, 4.75rem)",
  height: "clamp(5.5rem, 11vh, 7.5rem)",
} as const;

export const HERO_RIGHT_ROUTE_A = {
  startX: "96%",
  startY: "52%",
  knee1X: "56%",
  endX: "50%",
} as const;

export const HERO_RIGHT_ROUTE_B = {
  startX: "96%",
  startY: "70%",
  knee1X: "57%",
  endX: "50%",
} as const;

export const HERO_RIGHT_DROP = "clamp(3.25rem, 5.5vh, 4.75rem)";
