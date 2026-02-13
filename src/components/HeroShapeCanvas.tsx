import { useEffect, useRef, useCallback, useState } from "react";

/** Bounds of the "empty" content area (bottom-left L of the shape). Same as overlay in the reference HTML. */
export type HeroContentBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

interface HeroShapeCanvasProps {
  src: string;
  className?: string;
  children?: React.ReactNode;
}

// Σταθερές αναλογίες όπως στο reference HTML: 60% πλάτος αριστερά, 65% ύψος σχήματος
const SHAPE_X_PERCENT = 0.6;
const SHAPE_Y_PERCENT = 0.65;

/**
 * Renders the hero image inside a custom clipped shape and positions children
 * in the "empty" content area (bottom-left) via dynamic overlay bounds.
 */
export function HeroShapeCanvas({ src, className = "", children }: HeroShapeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const resizeRef = useRef<number | null>(null);
  const [contentBounds, setContentBounds] = useState<HeroContentBounds | null>(null);

  const render = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const img = imgRef.current;

    if (!container) return;

    const w = container.offsetWidth;
    const h = container.offsetHeight;
    if (w <= 0 || h <= 0) return;

    const radius = 40;
    const paddingTop = 120;
    const paddingSides = 40;
    const paddingBottom = 40;
    const xLeft = paddingSides;
    const xRight = w - paddingSides;
    const yTop = paddingTop;
    const yBottom = h - paddingBottom;
    const usableWidth = xRight - xLeft;
    const usableHeight = yBottom - yTop;
    const xSplit = xLeft + usableWidth * SHAPE_X_PERCENT;
    const ySplit = yTop + usableHeight * SHAPE_Y_PERCENT;

    // Δυναμικό overlay: κενό χώρο από (xLeft,ySplit) έως (xSplit,yBottom) – όπως στο reference HTML
    setContentBounds({
      left: xLeft,
      top: ySplit,
      width: xSplit - xLeft,
      height: yBottom - ySplit,
    });

    if (!canvas || !img?.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, h);
    ctx.save();

    ctx.beginPath();
    ctx.moveTo(xLeft + radius, yTop);
    ctx.arcTo(xRight, yTop, xRight, yBottom, radius);
    ctx.arcTo(xRight, yBottom, xSplit, yBottom, radius);
    ctx.arcTo(xSplit, yBottom, xSplit, ySplit, radius);
    ctx.arcTo(xSplit, ySplit, xLeft, ySplit, radius);
    ctx.arcTo(xLeft, ySplit, xLeft, yTop, radius);
    ctx.arcTo(xLeft, yTop, xRight, yTop, radius);
    ctx.closePath();
    ctx.clip();

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = w / h;
    let renderW: number, renderH: number, x: number, y: number;

    if (imgAspect > canvasAspect) {
      renderH = h;
      renderW = h * imgAspect;
      x = (w - renderW) / 2;
      y = 0;
    } else {
      renderW = w;
      renderH = w / imgAspect;
      x = 0;
      y = (h - renderH) / 2;
    }

    ctx.drawImage(img, x, y, renderW, renderH);
    ctx.restore();
  }, []);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    imgRef.current = img;

    img.onload = () => {
      render();
    };
  }, [src, render]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      if (resizeRef.current != null) cancelAnimationFrame(resizeRef.current);
      resizeRef.current = requestAnimationFrame(() => {
        render();
        resizeRef.current = null;
      });
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
      if (resizeRef.current != null) cancelAnimationFrame(resizeRef.current);
    };
  }, [render]);

  // Run layout once on mount so overlay has bounds before image loads
  useEffect(() => {
    const t = requestAnimationFrame(() => render());
    return () => cancelAnimationFrame(t);
  }, [render]);

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="block w-full h-full object-cover"
        style={{ objectPosition: "center top" }}
        aria-hidden
      />
      {children && contentBounds && (
        <div
          className="pointer-events-auto flex flex-col justify-end items-start box-border overflow-hidden"
          style={{
            position: "absolute",
            left: contentBounds.left,
            top: contentBounds.top,
            width: contentBounds.width,
            height: contentBounds.height,
            padding: "2rem",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
