import { useEffect, useRef } from "react";
import {
  DEYAA_DROP_PATH,
  DEYAA_DROP_VIEWBOX_H,
  DEYAA_DROP_VIEWBOX_W,
} from "@/lib/deyaaDropPath";
import { HOME_LOADER_MIN_MS } from "@/lib/homeLoaderTiming";
import { cn } from "@/lib/utils";

interface WaterLoaderProps {
  /** Wall-clock start — fill progresses over durationMs */
  startedAt?: number;
  durationMs?: number;
  /** Transparent wrapper — parent supplies backdrop (homepage loader) */
  overlay?: boolean;
  /**
   * Hero photos / shaders are ready. Fill holds just below full until then,
   * then completes so the drop never sits empty or finishes before the scene.
   */
  sceneReady?: boolean;
}

const ORIGINAL_W = DEYAA_DROP_VIEWBOX_W;
const ORIGINAL_H = DEYAA_DROP_VIEWBOX_H;
const CANVAS_SCALE = 0.8;
const WATER_BOTTOM = 640;
const FILL_RANGE = 620;
const HOLD_FILL = 0.92;
const COMPLETE_MS = 220;

export function WaterLoader({
  startedAt,
  durationMs = HOME_LOADER_MIN_MS,
  overlay = false,
  sceneReady = false,
}: WaterLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveOffsetRef = useRef(0);
  const startedAtRef = useRef(startedAt ?? Date.now());
  const durationMsRef = useRef(durationMs);
  const fillRef = useRef(0);
  const sceneReadyRef = useRef(sceneReady);
  const sceneReadyAtRef = useRef<number | null>(null);
  const reduceMotionRef = useRef(false);

  startedAtRef.current = startedAt ?? startedAtRef.current;
  durationMsRef.current = durationMs;

  useEffect(() => {
    sceneReadyRef.current = sceneReady;
    if (sceneReady && sceneReadyAtRef.current === null) {
      sceneReadyAtRef.current = Date.now();
    }
    if (!sceneReady) {
      sceneReadyAtRef.current = null;
    }
  }, [sceneReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = ORIGINAL_W * CANVAS_SCALE;
    canvas.height = ORIGINAL_H * CANVAS_SCALE;

    const deyaPath = new Path2D(DEYAA_DROP_PATH);
    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const animate = () => {
      const elapsed = Date.now() - startedAtRef.current;
      const timeFill = Math.min(HOLD_FILL, elapsed / durationMsRef.current);
      let nextFill = timeFill;

      if (reduceMotionRef.current) {
        nextFill = sceneReadyRef.current ? 1 : HOLD_FILL;
      } else if (sceneReadyRef.current) {
        const readyAt = sceneReadyAtRef.current ?? Date.now();
        const completeT = Math.min(1, (Date.now() - readyAt) / COMPLETE_MS);
        nextFill = HOLD_FILL + (1 - HOLD_FILL) * completeT;
      }

      fillRef.current = nextFill;

      const progress = fillRef.current * 100;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(CANVAS_SCALE, CANVAS_SCALE);
      ctx.strokeStyle = "#f1f5f9";
      ctx.lineWidth = 1;
      ctx.stroke(deyaPath);
      ctx.clip(deyaPath);

      const currentLevel = WATER_BOTTOM - fillRef.current * FILL_RANGE;
      const waveHeight = !reduceMotionRef.current && progress > 0 && progress < 100 ? 10 : 0;

      ctx.fillStyle = "#004aad";
      ctx.beginPath();
      ctx.moveTo(0, currentLevel);

      for (let i = 0; i <= ORIGINAL_W; i++) {
        const angle = i / 50 + waveOffsetRef.current;
        ctx.lineTo(i, currentLevel + Math.sin(angle) * waveHeight);
      }

      ctx.lineTo(ORIGINAL_W, ORIGINAL_H);
      ctx.lineTo(0, ORIGINAL_H);
      ctx.fill();
      ctx.restore();

      if (!reduceMotionRef.current) {
        waveOffsetRef.current += 0.08;
      }
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        overlay ? "min-h-0 bg-transparent" : "min-h-screen bg-white",
      )}
    >
      <div className="flex flex-col items-center justify-center">
        <canvas ref={canvasRef} className="home-initial-loader__canvas h-auto max-w-full" />
      </div>
    </div>
  );
}
