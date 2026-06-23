export const HERO_TANK_SCROLL_SRC = "/video/tank_filled_greennew.mp4";

export const HERO_TANK_FRAME_COUNT = 178;
export const HERO_TANK_FRAME_PAD = 4;
export const HERO_TANK_FRAME_EXT = "webp";
export const HERO_TANK_FRAMES_BASE = "/hero/tank-frames";

/** 1-based frame index → pre-keyed WebP with alpha (frame_0001.webp … frame_0178.webp) */
export function heroTankFrameUrl(frameIndex: number) {
  const clamped = Math.max(1, Math.min(HERO_TANK_FRAME_COUNT, frameIndex));
  return `${HERO_TANK_FRAMES_BASE}/frame_${String(clamped).padStart(HERO_TANK_FRAME_PAD, "0")}.${HERO_TANK_FRAME_EXT}`;
}

/** Scroll progress 0–1 → frame index 1…count (bidirectional with scrub) */
export function heroTankFrameFromProgress(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  return Math.round(p * (HERO_TANK_FRAME_COUNT - 1)) + 1;
}
