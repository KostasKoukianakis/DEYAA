import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { drawGlassDeyaTitle, glassTitleCanvasToObjectUrl } from "@/lib/glassTitleCanvas";

interface HeroGlassDeyaTitleProps {
  className?: string;
  topVh?: number;
  maxWidthRem?: number;
  /** Called when the ripple texture bitmap is ready */
  onTextureReady?: (url: string) => void;
  /** Hide CSS version once ripple canvas is active */
  hidden?: boolean;
}

/**
 * CSS glass ΔΕΥΑ lockup — matches homepageimage.webp (ice-glass serif capitals).
 * Also rasterises to canvas for ripple refraction.
 */
export function HeroGlassDeyaTitle({
  className,
  topVh = 7,
  maxWidthRem = 36,
  onTextureReady,
  hidden = false,
}: HeroGlassDeyaTitleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !onTextureReady) return;

    let cancelled = false;
    const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const maxWidthPx = Math.min(window.innerWidth * 0.88, maxWidthRem * remPx);

    const build = async () => {
      await drawGlassDeyaTitle(canvas, maxWidthPx);
      if (cancelled) return;
      onTextureReady(glassTitleCanvasToObjectUrl(canvas));
      setReady(true);
    };

    void build();

    const onResize = () => {
      void build();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, [maxWidthRem, onTextureReady]);

  return (
    <>
      <canvas ref={canvasRef} className="sr-only" aria-hidden />
      <h1
        className={cn(
          "hero-glass-deya pointer-events-none transition-opacity duration-500",
          hidden && ready ? "opacity-0" : "opacity-100",
          className
        )}
        style={{ top: `${topVh}vh` }}
      >
        <span className="hero-glass-deya__word" aria-hidden>
          <span className="hero-glass-deya__letter" data-letter="Δ">
            Δ
          </span>
          <span className="hero-glass-deya__letter" data-letter="Ε">
            Ε
          </span>
          <span className="hero-glass-deya__letter" data-letter="Υ">
            Υ
          </span>
          <span className="hero-glass-deya__letter" data-letter="Α">
            Α
          </span>
        </span>
        <span className="sr-only">ΔΕΥΑ</span>
      </h1>
    </>
  );
}
