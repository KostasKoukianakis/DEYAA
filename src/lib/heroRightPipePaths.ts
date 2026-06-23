/** Right routed pipes — layout tokens (percent + rem). */
export const HERO_RIGHT_STATION = {
  centerX: "50%",
  centerY: "62%",
  /* Slightly squarer footprint — reads as plan / top-down pad */
  width: "clamp(8rem, 16vw, 11.5rem)",
  height: "clamp(10rem, 20vh, 14rem)",
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

/** Down pipes from station base — bend toward deksameni tank */
export const HERO_DOWN_PIPE = {
  bendY: "186svh",
  /** Below station center (62svh): +32% station h + down-stub */
  startY:
    "calc(62svh + var(--hero-station-h) * 0.32 + var(--hero-station-side-stub-w))",
  tankTop: "186svh",
  tankRight: "-7vw",
  tankSize: "43vw",
} as const;

/** Scroll timing (× viewport height) — shared by down pipes + tank fill video */
export const HERO_DOWN_PIPE_SCROLL = {
  vertDurationVh: 0.72,
  /** Fade corners in over the last stretch of vertical scroll */
  cornerRevealVh: 0.05,
  horizStartVh: 0.52,
  horizDurationVh: 0.63,
  /** Scroll distance to scrub tank frame sequence (after pipes reach stubs) */
  tankFrameScrubVh: 1,
} as const;

export function heroDownPipeHorizEndVh() {
  return HERO_DOWN_PIPE_SCROLL.horizStartVh + HERO_DOWN_PIPE_SCROLL.horizDurationVh;
}
