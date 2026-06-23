import {
  HERO_TANK_FRAME_COUNT,
  heroTankFrameUrl,
} from "@/lib/heroTankFrames";

/*
 * ── tankmotion ping-pong loop (disabled) ──────────────────────────────────
export const HERO_TANK_MOTION_SRC = "/video/tankmotion.mp4";
export const HERO_TANK_MOTION_REVERSE_SRC = "/video/tankmotion_reverse.mp4";
const TANK_MOTION_ZOOM = 1.53;
const TANK_MOTION_PLAYBACK_RATE = 1;
 * ───────────────────────────────────────────────────────────────────────────
 */

/** 16:9 pre-keyed WebP — cover fit inside circular tank */
const TANK_FRAME_ZOOM = 1.13;
const MAX_RENDER_PX = 960;
const TANK_EDGE_FEATHER_CSS_PX = 11;
const PRELOAD_BATCH_SIZE = 6;

const yieldFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

/** Load a single tank frame (1-based index). */
export function loadTankFrame(index: number): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${heroTankFrameUrl(index)}`));
    img.src = heroTankFrameUrl(index);
  });
}

/** Staggered decode — pre-keyed WebP, no runtime chroma key. */
export async function preloadTankFrames(
  onFirstFrame?: (frame: HTMLImageElement) => void,
): Promise<HTMLImageElement[]> {
  const frames: HTMLImageElement[] = new Array(HERO_TANK_FRAME_COUNT);

  frames[0] = await loadTankFrame(1);
  onFirstFrame?.(frames[0]);
  await yieldFrame();

  for (let start = 1; start < HERO_TANK_FRAME_COUNT; start += PRELOAD_BATCH_SIZE) {
    const end = Math.min(start + PRELOAD_BATCH_SIZE, HERO_TANK_FRAME_COUNT);
    const batch = await Promise.all(
      Array.from({ length: end - start }, (_, offset) => loadTankFrame(start + offset + 1)),
    );
    for (let i = 0; i < batch.length; i += 1) {
      frames[start + i] = batch[i];
    }
    await yieldFrame();
  }

  return frames;
}

function resizeDisplayCanvas(canvas: HTMLCanvasElement) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (w <= 0 || h <= 0) return false;

  const scale = Math.min(1, MAX_RENDER_PX / w, MAX_RENDER_PX / h);
  const nextW = Math.max(1, Math.floor(w * scale * window.devicePixelRatio));
  const nextH = Math.max(1, Math.floor(h * scale * window.devicePixelRatio));

  if (canvas.width !== nextW || canvas.height !== nextH) {
    canvas.width = nextW;
    canvas.height = nextH;
  }
  return true;
}

function applyCircularEdgeFeather(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  featherPx: number,
) {
  const cx = width * 0.5;
  const cy = height * 0.5;
  const radius = Math.min(width, height) * 0.5;
  const inner = Math.max(0, radius - featherPx);

  ctx.save();
  ctx.globalCompositeOperation = "destination-in";
  const grad = ctx.createRadialGradient(cx, cy, inner, cx, cy, radius);
  grad.addColorStop(0, "rgba(0,0,0,1)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

/** Draw pre-keyed WebP — drawImage + edge feather only (no getImageData). */
export function paintTankFrame(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | undefined,
) {
  if (!img?.complete || !img.naturalWidth) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx || !resizeDisplayCanvas(canvas)) return;

  const width = canvas.width;
  const height = canvas.height;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  const scale = Math.max(width / iw, height / ih) * TANK_FRAME_ZOOM;
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (width - dw) * 0.5;
  const dy = (height - dh) * 0.5;

  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, dx, dy, dw, dh);

  const clientW = canvas.clientWidth || width;
  const featherPx = Math.max(1, Math.round(TANK_EDGE_FEATHER_CSS_PX * (width / clientW)));
  applyCircularEdgeFeather(ctx, width, height, featherPx);
}

// tankmotion ping-pong loop disabled (see HeroBiologicalTank commented blocks)
