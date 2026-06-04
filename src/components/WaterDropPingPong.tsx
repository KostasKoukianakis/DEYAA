import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Internal canvas resolution cap — CSS size stays large, GPU upscales. */
const MAX_RENDER_PX = 720;

interface WaterDropPingPongProps {
  src?: string;
  className?: string;
  keyColor?: [number, number, number];
  keyThreshold?: number;
  keyFeather?: number;
  removeBackground?: boolean;
}

interface BorderStats {
  key: [number, number, number];
  minLum: number;
  maxLum: number;
}

type PlateMode = "black" | "white" | "studio";

function luminance(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function sampleBorderStats(data: Uint8ClampedArray, w: number, h: number): BorderStats {
  const strip = 3;
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  let minLum = 255;
  let maxLum = 0;

  const sample = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    const pr = data[i];
    const pg = data[i + 1];
    const pb = data[i + 2];
    r += pr;
    g += pg;
    b += pb;
    count += 1;
    const lum = luminance(pr, pg, pb);
    minLum = Math.min(minLum, lum);
    maxLum = Math.max(maxLum, lum);
  };

  for (let x = 0; x < w; x += 2) {
    for (let y = 0; y < strip; y += 1) {
      sample(x, y);
      sample(x, h - 1 - y);
    }
  }
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < strip; x += 1) {
      sample(x, y);
      sample(w - 1 - x, y);
    }
  }

  return {
    key: [r / count, g / count, b / count],
    minLum: minLum - 18,
    maxLum: maxLum + 18,
  };
}

function detectPlateMode(stats: BorderStats): PlateMode {
  const bgLum = luminance(stats.key[0], stats.key[1], stats.key[2]);
  if (bgLum < 45) return "black";
  if (bgLum > 200) return "white";
  return "studio";
}

function removeBlackPlate(data: Uint8ClampedArray, threshold = 16, feather = 12) {
  for (let i = 0; i < data.length; i += 4) {
    const peak = Math.max(data[i], data[i + 1], data[i + 2]);
    if (peak <= threshold) {
      data[i + 3] = 0;
    } else if (peak <= threshold + feather) {
      data[i + 3] = Math.round(data[i + 3] * ((peak - threshold) / feather));
    }
  }
}

/** Fast O(n) white key — no flood fill. */
function removeWhitePlate(data: Uint8ClampedArray, threshold = 232, feather = 14) {
  for (let i = 0; i < data.length; i += 4) {
    const floor = Math.min(data[i], data[i + 1], data[i + 2]);
    if (floor >= threshold) {
      data[i + 3] = 0;
    } else if (floor >= threshold - feather) {
      data[i + 3] = Math.round(data[i + 3] * ((threshold - floor) / feather));
    }
  }
}

function isAlphaVideoSource(src: string) {
  return /\.webm(?:$|\?)/i.test(src) || src.includes("-alpha.");
}

function usesPlateKey(src: string) {
  return src.includes("Timeline") || src.includes("timeline");
}

/** DaVinci export — flat plate (MP4 has no alpha; keyed at runtime). */
export const WATER_DROP_SRC = "/video/Timeline%202.mp4";

/**
 * Palladio-style water bubble: native `<video autoplay loop>`.
 * Draws on video frames only (~30fps), capped internal resolution.
 */
export function WaterDropPingPong({
  src = WATER_DROP_SRC,
  className,
  keyColor,
  keyThreshold = 48,
  keyFeather = 32,
  removeBackground,
}: WaterDropPingPongProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameHandleRef = useRef<number>(0);
  const keyColorRef = useRef<[number, number, number] | null>(keyColor ?? null);
  const plateModeRef = useRef<PlateMode | null>(null);
  const shouldKey =
    removeBackground ?? (usesPlateKey(src) || !isAlphaVideoSource(src));

  useEffect(() => {
    keyColorRef.current = keyColor ?? null;
    plateModeRef.current = null;
  }, [keyColor, src]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: shouldKey });
    if (!ctx) return;

    let active = true;
    let visible = true;
    let started = false;
    let canvasW = 0;
    let canvasH = 0;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return false;

      const scale = Math.min(1, MAX_RENDER_PX / w);
      const nextW = Math.max(1, Math.floor(w * scale));
      const nextH = Math.max(1, Math.floor(h * scale));

      if (nextW !== canvasW || nextH !== canvasH) {
        canvas.width = nextW;
        canvas.height = nextH;
        canvasW = nextW;
        canvasH = nextH;
        plateModeRef.current = null;
      }
      return true;
    };

    const applyPlateKey = (data: Uint8ClampedArray, w: number, h: number) => {
      if (!plateModeRef.current) {
        const stats = sampleBorderStats(data, w, h);
        plateModeRef.current = detectPlateMode(stats);
      }

      if (plateModeRef.current === "black") {
        removeBlackPlate(data);
      } else {
        removeWhitePlate(data);
      }
    };

    const draw = () => {
      if (!visible || video.readyState < 2 || !video.videoWidth) return;
      if (!resize()) return;

      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      ctx.clearRect(0, 0, w, h);

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      const scale = Math.min(w / vw, h / vh);
      const dw = vw * scale;
      const dh = vh * scale;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;

      ctx.drawImage(video, dx, dy, dw, dh);

      if (!shouldKey) return;

      const imageData = ctx.getImageData(0, 0, w, h);
      applyPlateKey(imageData.data, w, h);
      ctx.putImageData(imageData, 0, 0);
    };

    const cancelScheduledFrame = () => {
      if (frameHandleRef.current) {
        cancelAnimationFrame(frameHandleRef.current);
        frameHandleRef.current = 0;
      }
    };

    const scheduleFrame = () => {
      if (!active || !visible) return;

      const rvfc = (
        video as HTMLVideoElement & {
          requestVideoFrameCallback?: (cb: () => void) => number;
        }
      ).requestVideoFrameCallback;

      if (rvfc) {
        rvfc.call(video, () => {
          if (!active || !visible) return;
          draw();
          scheduleFrame();
        });
      } else {
        cancelScheduledFrame();
        frameHandleRef.current = requestAnimationFrame(() => {
          draw();
          scheduleFrame();
        });
      }
    };

    const start = () => {
      if (started) return;
      started = true;
      plateModeRef.current = null;
      resize();
      draw();
      void video.play().catch(() => {});
      scheduleFrame();
    };

    const onCanPlay = () => {
      if (video.readyState >= 2) start();
    };

    const onError = () => {
      console.warn("[WaterDropPingPong] Failed to load video:", src);
    };

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onError);

    if (video.readyState >= 2) start();

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          void video.play().catch(() => {});
          scheduleFrame();
        } else {
          cancelScheduledFrame();
          video.pause();
        }
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    return () => {
      active = false;
      cancelScheduledFrame();
      video.pause();
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
      ro.disconnect();
      io.disconnect();
    };
  }, [src, keyColor, keyThreshold, keyFeather, shouldKey]);

  return (
    <div className={cn("water-drop-pingpong", className)}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="sr-only"
        aria-hidden
      />
      <canvas ref={canvasRef} className="water-drop-pingpong__canvas" aria-hidden />
    </div>
  );
}
