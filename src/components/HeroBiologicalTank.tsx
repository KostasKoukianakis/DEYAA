import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  HERO_DOWN_PIPE_SCROLL,
  heroDownPipeHorizEndVh,
} from "@/lib/heroRightPipePaths";
import {
  HERO_TANK_FRAME_COUNT,
  HERO_TANK_LIGHT_MAX_WIDTH,
  HERO_TANK_STATIC_IMAGE,
  heroTankFrameFromProgress,
  heroTankFrameUrl,
} from "@/lib/heroTankFrames";
import { paintTankFrame, preloadTankFrames } from "@/lib/heroTankFrameRenderer";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface HeroBiologicalTankProps {
  className?: string;
  scrollTriggerId?: string;
  onFirstFrameReady?: () => void;
}

function useHeroTankLightViewport() {
  const [useLightTank, setUseLightTank] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${HERO_TANK_LIGHT_MAX_WIDTH}px)`).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${HERO_TANK_LIGHT_MAX_WIDTH}px)`);
    const onChange = () => setUseLightTank(mql.matches);
    mql.addEventListener("change", onChange);
    setUseLightTank(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return useLightTank;
}

/** Biological clarifier tank — scroll-scrubbed frames on desktop, static image on phone/tablet. */
export function HeroBiologicalTank({
  className,
  scrollTriggerId = "section-01",
  onFirstFrameReady,
}: HeroBiologicalTankProps) {
  const useLightTank = useHeroTankLightViewport();
  const tankRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const activeFrameRef = useRef(1);
  const scrollReadyRef = useRef(false);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [framesReady, setFramesReady] = useState(false);

  useEffect(() => {
    setFirstFrameReady(false);
    setFramesReady(false);
    activeFrameRef.current = 1;
    framesRef.current = [];
  }, [useLightTank]);

  const paintFirstFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const frame = framesRef.current[0];
    if (!canvas || !frame) return;
    paintTankFrame(canvas, frame);
  }, []);

  useEffect(() => {
    if (!useLightTank) return;

    let cancelled = false;
    const img = new Image();
    img.decoding = "async";

    img.onload = () => {
      if (cancelled) return;
      setFirstFrameReady(true);
      setFramesReady(true);
      onFirstFrameReady?.();
    };

    img.onerror = () => {
      if (cancelled) return;
      setFirstFrameReady(true);
      setFramesReady(true);
      onFirstFrameReady?.();
    };

    img.src = HERO_TANK_STATIC_IMAGE;

    return () => {
      cancelled = true;
    };
  }, [useLightTank, onFirstFrameReady]);

  useEffect(() => {
    if (useLightTank) return;

    let cancelled = false;

    preloadTankFrames((frame1) => {
      if (cancelled) return;
      framesRef.current[0] = frame1;
      paintFirstFrame();
      setFirstFrameReady(true);
      onFirstFrameReady?.();
    })
      .then((frames) => {
        if (cancelled) return;
        framesRef.current = frames;
        setFramesReady(true);
        paintFirstFrame();
      })
      .catch(() => {
        if (!cancelled) setFramesReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [paintFirstFrame, onFirstFrameReady, useLightTank]);

  useEffect(() => {
    if (useLightTank) return;

    const canvas = canvasRef.current;
    const tank = tankRef.current;
    if (!canvas || !tank || !firstFrameReady) return;

    const ro = new ResizeObserver(() => {
      paintTankFrame(canvas, framesRef.current[activeFrameRef.current - 1] ?? framesRef.current[0]);
    });
    ro.observe(tank);

    return () => ro.disconnect();
  }, [firstFrameReady, framesReady, useLightTank]);

  useEffect(() => {
    if (useLightTank) return;

    const trigger = document.getElementById(scrollTriggerId);
    const canvas = canvasRef.current;
    if (!trigger || !canvas || !framesReady) return;

    const vh = () => window.innerHeight;
    const horizEndVh = heroDownPipeHorizEndVh();

    let paintRaf = 0;
    let pendingFrame = 1;

    const paintFrame = (index: number, force = false) => {
      const clamped = Math.max(1, Math.min(HERO_TANK_FRAME_COUNT, index));
      if (!force && activeFrameRef.current === clamped) return;
      activeFrameRef.current = clamped;
      paintTankFrame(canvas, framesRef.current[clamped - 1]);
    };

    const schedulePaint = (index: number) => {
      pendingFrame = index;
      if (paintRaf) return;
      paintRaf = requestAnimationFrame(() => {
        paintRaf = 0;
        paintFrame(pendingFrame);
      });
    };

    const applyScroll = (self: ScrollTrigger) => {
      if (!scrollReadyRef.current) return;

      if (self.isActive) {
        schedulePaint(heroTankFrameFromProgress(self.progress));
        return;
      }

      if (self.progress <= 0) {
        schedulePaint(1);
        return;
      }

      if (self.progress >= 1) {
        schedulePaint(HERO_TANK_FRAME_COUNT);
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paintFrame(HERO_TANK_FRAME_COUNT, true);
      return;
    }

    paintFrame(1, true);

    const scrollTrigger = ScrollTrigger.create({
      trigger,
      start: () => `top+=${vh() * horizEndVh} top`,
      end: () => `+=${vh() * HERO_DOWN_PIPE_SCROLL.tankFrameScrubVh}`,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => applyScroll(self),
    });

    const syncScroll = () => {
      ScrollTrigger.refresh();
      applyScroll(scrollTrigger);
    };

    scrollReadyRef.current = false;
    requestAnimationFrame(() => {
      syncScroll();
      scrollReadyRef.current = true;
      applyScroll(scrollTrigger);
    });

    window.addEventListener("resize", syncScroll);
    window.addEventListener("load", syncScroll);

    return () => {
      scrollReadyRef.current = false;
      if (paintRaf) cancelAnimationFrame(paintRaf);
      window.removeEventListener("resize", syncScroll);
      window.removeEventListener("load", syncScroll);
      scrollTrigger.kill();
    };
  }, [scrollTriggerId, framesReady, useLightTank]);

  return (
    <div
      ref={tankRef}
      className={cn(
        "hero-bio-tank",
        firstFrameReady && "hero-bio-tank--has-frame",
        useLightTank && "hero-bio-tank--static",
        className,
      )}
      aria-hidden
    >
      <img
        src={useLightTank ? HERO_TANK_STATIC_IMAGE : heroTankFrameUrl(1)}
        alt=""
        className="hero-bio-tank__frame-hold"
        decoding="async"
        fetchPriority="high"
        draggable={false}
        aria-hidden
      />
      {!useLightTank && (
        <canvas
          ref={canvasRef}
          className={cn("hero-bio-tank__canvas", firstFrameReady && "is-live")}
          aria-hidden
        />
      )}
    </div>
  );
}
