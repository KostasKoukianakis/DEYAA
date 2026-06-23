import { useEffect, useRef } from "react";
import { HOME_LOADER_MIN_MS } from "@/lib/homeLoaderTiming";
import { cn } from "@/lib/utils";

interface WaterLoaderProps {
  /** Wall-clock start — fill progresses over durationMs */
  startedAt?: number;
  durationMs?: number;
  /** Transparent wrapper — parent supplies backdrop (homepage loader) */
  overlay?: boolean;
}

const DEYA_PATH =
  "m221.34 41.22c-11.59 12.26-26.36 28.36-32.83 35.78-6.47 7.42-17.01 20.03-23.41 28-6.41 7.97-15.9 20.35-21.09 27.5-5.2 7.15-14.89 21.1-21.53 31-6.65 9.9-15.95 24.53-20.68 32.5-4.73 7.97-11.17 19.22-14.32 25-3.14 5.78-8.08 15.22-10.97 21-2.89 5.78-7.85 16.35-11.01 23.5-3.17 7.15-7.55 17.5-9.73 23-2.18 5.5-6.19 16.52-8.91 24.5-2.71 7.98-6.48 20.35-8.36 27.5-1.88 7.15-4.54 18.63-5.9 25.5-1.36 6.88-3.18 18.01-4.04 24.75-1.01 7.96-1.56 20.22-1.55 35 0 15.19 0.5 26.07 1.51 32.75 0.83 5.5 2.7 14.5 4.14 20 1.45 5.5 4.16 14.05 6.04 19 1.88 4.95 5.45 13.05 7.93 18 2.49 4.95 7.83 13.95 11.87 20 4.04 6.05 10.94 15.05 15.32 20 4.38 4.95 11.05 11.74 14.82 15.08 3.77 3.34 10.46 8.75 14.86 12.02 4.4 3.26 12.05 8.26 17 11.1 4.95 2.84 13.72 7.19 19.5 9.65 5.78 2.47 15 5.82 20.5 7.44 5.5 1.63 14.5 3.8 20 4.83 7.89 1.48 14.64 1.88 32 1.86 16.95-0.02 24.3-0.44 32-1.86 5.5-1 14.95-3.32 21-5.14 6.05-1.83 15.27-5.18 20.5-7.45 5.23-2.26 13.1-6.19 17.5-8.72 4.4-2.53 12.95-8.3 19-12.84 6.05-4.53 15.73-13.13 21.52-19.11 5.78-5.97 13.01-14.23 16.07-18.36 3.05-4.13 7.15-10.2 9.11-13.5 1.96-3.3 4.35-7.58 5.31-9.5 0.96-1.92 1.91-4.29 2.12-5.25 0.23-1.08-0.11-1.57-0.88-1.27-0.69 0.26-1.85 1.72-2.59 3.25-0.73 1.52-3.63 6.14-6.42 10.27-2.8 4.13-7.42 10.42-10.26 14-2.84 3.58-8.72 9.82-13.07 13.87-4.35 4.05-11.06 9.72-14.91 12.61-3.85 2.88-11.05 7.54-16 10.35-4.95 2.8-13.27 6.89-18.5 9.08-5.23 2.19-14.68 5.32-21 6.96-6.32 1.64-16.45 3.52-22.5 4.18-6.6 0.73-16.4 0.97-24.5 0.61-7.43-0.33-17.1-1.3-21.5-2.16-4.4-0.86-10.7-2.27-14-3.13-3.3-0.86-10.5-3.35-16-5.53-5.5-2.18-14.05-6.25-19-9.05-4.95-2.79-12.38-7.55-16.5-10.57-4.13-3.02-12.47-10.49-18.55-16.61-7.35-7.38-13.51-14.8-18.37-22.11-4.02-6.05-9.26-15.05-11.65-20-2.39-4.95-5.68-13.05-7.33-18-1.64-4.95-4-13.73-5.24-19.5-1.94-9.01-2.26-13.49-2.27-31.5-0.01-15.15 0.48-24.2 1.76-32.5 0.97-6.32 3.31-18.48 5.19-27 1.88-8.52 5.68-22.81 8.44-31.75 2.76-8.94 7.43-22.66 10.38-30.5 2.94-7.84 8.21-21 11.71-29.25 3.5-8.25 12.31-26.93 19.59-41.5 7.27-14.57 17.12-33.47 21.88-42 4.77-8.53 12.97-22.7 18.23-31.5 5.26-8.8 15.42-25.22 22.57-36.5 7.15-11.28 13.83-21.51 14.83-22.75q1.84-2.27 2.29-1c0.25 0.69 2.1 6.42 4.11 12.75 2 6.32 5.56 16.22 7.91 22 2.35 5.78 7.02 16.01 10.39 22.75 3.37 6.74 9.14 17.31 12.81 23.5 3.68 6.19 9.59 15.75 13.15 21.25 3.56 5.5 10.76 15.85 16.01 23 5.24 7.15 15.44 20.65 22.66 30 7.22 9.35 19.16 24.65 26.54 34 7.38 9.35 17.03 21.97 21.44 28.03 4.41 6.07 10.5 14.7 13.52 19.18 3.1 4.59 6.05 7.96 6.75 7.72 0.83-0.29-0.67-3.56-4.42-9.68-3.11-5.09-16.09-25-28.83-44.25-12.74-19.25-27.26-41.52-32.25-49.5-5-7.97-12.3-20.35-16.24-27.5-3.93-7.15-9.99-18.85-13.48-26-3.48-7.15-8.23-17.72-10.55-23.5-2.32-5.78-5.54-14.32-7.14-19-1.61-4.68-4.24-13.68-5.86-20-1.61-6.32-3.87-16.9-5.01-23.5-1.15-6.67-2.33-19.1-2.65-28-0.39-10.84 0-24.34 1.23-41.86 1.17-16.78 1.46-26.18 0.83-26.77-0.62-0.58-8.79 7.33-22.04 21.35z";

const ORIGINAL_W = 421;
const ORIGINAL_H = 657;
const CANVAS_SCALE = 0.8;
const WATER_BOTTOM = 640;
const FILL_RANGE = 620;

export function WaterLoader({
  startedAt,
  durationMs = HOME_LOADER_MIN_MS,
  overlay = false,
}: WaterLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveOffsetRef = useRef(0);
  const startedAtRef = useRef(startedAt ?? Date.now());
  const durationMsRef = useRef(durationMs);
  const fillRef = useRef(0);

  startedAtRef.current = startedAt ?? startedAtRef.current;
  durationMsRef.current = durationMs;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = ORIGINAL_W * CANVAS_SCALE;
    canvas.height = ORIGINAL_H * CANVAS_SCALE;

    const deyaPath = new Path2D(DEYA_PATH);
    let frame = 0;

    const animate = () => {
      const elapsed = Date.now() - startedAtRef.current;
      fillRef.current = Math.min(1, elapsed / durationMsRef.current);

      const progress = fillRef.current * 100;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(CANVAS_SCALE, CANVAS_SCALE);
      ctx.strokeStyle = "#f1f5f9";
      ctx.lineWidth = 1;
      ctx.stroke(deyaPath);
      ctx.clip(deyaPath);

      const currentLevel = WATER_BOTTOM - fillRef.current * FILL_RANGE;
      const waveHeight = progress > 0 && progress < 100 ? 10 : 0;

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

      waveOffsetRef.current += 0.08;
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
        <canvas ref={canvasRef} className="h-auto max-w-full" />
      </div>
    </div>
  );
}
