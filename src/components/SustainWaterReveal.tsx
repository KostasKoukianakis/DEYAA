import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

const SUSTAIN_WATER_SRC = "/hero/sustain_water.webp";
const SUSTAIN_REVEAL_SRC = "/hero/koyrnas.webp";
const RISE_DURATION = 5;
const WAVE_SEGMENTS = 16;
const WAVE_AMP = 0.03;

interface ContentBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

type RevealPhase = "idle" | "animating" | "revealed";

interface SustainWaterRevealProps {
  className?: string;
}

function getContainedRect(
  containerWidth: number,
  containerHeight: number,
  naturalWidth: number,
  naturalHeight: number,
): ContentBox {
  if (!naturalWidth || !naturalHeight || !containerWidth || !containerHeight) {
    return { x: 0, y: 0, width: containerWidth, height: containerHeight };
  }

  const imageRatio = naturalWidth / naturalHeight;
  const containerRatio = containerWidth / containerHeight;

  if (imageRatio > containerRatio) {
    const width = containerWidth;
    const height = containerWidth / imageRatio;
    return { x: 0, y: (containerHeight - height) / 2, width, height };
  }

  const height = containerHeight;
  const width = containerHeight * imageRatio;
  return { x: (containerWidth - width) / 2, y: 0, width, height };
}

function waveY(x: number, level: number, phase: number) {
  const base = 1 - level;
  const amp = WAVE_AMP * (1 - level);
  return Math.min(1, Math.max(0, base + amp * Math.sin(x * Math.PI * 4 + phase)));
}

function pct(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

function belowWaveClip(level: number, phase: number) {
  const points = [`0% 100%`, `0% ${pct(waveY(0, level, phase))}`];

  for (let i = 1; i <= WAVE_SEGMENTS; i += 1) {
    const x = i / WAVE_SEGMENTS;
    points.push(`${pct(x)} ${pct(waveY(x, level, phase))}`);
  }

  points.push("100% 100%");
  return `polygon(${points.join(", ")})`;
}

function aboveWaveClip(level: number, phase: number) {
  const points = [`0% 0%`, `0% ${pct(waveY(0, level, phase))}`];

  for (let i = 1; i <= WAVE_SEGMENTS; i += 1) {
    const x = i / WAVE_SEGMENTS;
    points.push(`${pct(x)} ${pct(waveY(x, level, phase))}`);
  }

  points.push("100% 0%");
  return `polygon(${points.join(", ")})`;
}

/** sustain_water first, then wavy koyrnas rises from below on scroll. */
export function SustainWaterReveal({ className }: SustainWaterRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sizerRef = useRef<HTMLImageElement>(null);
  const frontRef = useRef<HTMLImageElement>(null);
  const backRef = useRef<HTMLImageElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const progressRef = useRef({ t: 0 });
  const playedRef = useRef(false);
  const timelineStartedRef = useRef(false);
  const pendingRevealRef = useRef(false);
  const phaseRef = useRef<RevealPhase>("idle");

  const [phase, setPhase] = useState<RevealPhase>("idle");
  const [showBack, setShowBack] = useState(false);
  const [contentBox, setContentBox] = useState<ContentBox>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const applyWaveClips = useCallback((t: number) => {
    const front = frontRef.current;
    const back = backRef.current;
    if (!front || !back) return;

    const level = t;
    const wavePhase = t * Math.PI * 8;

    if (level <= 0.001) {
      back.style.clipPath = "inset(100% 0 0 0)";
      back.style.webkitClipPath = "inset(100% 0 0 0)";
      front.style.clipPath = "none";
      front.style.webkitClipPath = "none";
      return;
    }

    const below = belowWaveClip(level, wavePhase);
    const above = aboveWaveClip(level, wavePhase);
    back.style.clipPath = below;
    back.style.webkitClipPath = below;
    front.style.clipPath = above;
    front.style.webkitClipPath = above;
  }, []);

  const lockRevealedState = useCallback(() => {
    const front = frontRef.current;
    const back = backRef.current;

    if (back) {
      back.style.clipPath = "none";
      back.style.webkitClipPath = "none";
    }

    if (front) {
      front.style.clipPath = "inset(100% 0 0 0)";
      front.style.webkitClipPath = "inset(100% 0 0 0)";
      front.style.opacity = "0";
      front.style.visibility = "hidden";
    }
  }, []);

  const syncContentBox = useCallback(() => {
    const root = rootRef.current;
    const img = sizerRef.current;
    if (!root || !img) return false;

    const rootRect = root.getBoundingClientRect();
    const next = getContainedRect(
      rootRect.width,
      rootRect.height,
      img.naturalWidth,
      img.naturalHeight,
    );

    setContentBox(next);
    return next.width > 0 && next.height > 0;
  }, []);

  const completeReveal = useCallback(() => {
    applyWaveClips(1);
    lockRevealedState();

    requestAnimationFrame(() => {
      phaseRef.current = "revealed";
      setPhase("revealed");
    });
  }, [applyWaveClips, lockRevealedState]);

  const startTimeline = useCallback(() => {
    if (timelineStartedRef.current) return;
    if (!backRef.current || !frontRef.current || phaseRef.current !== "animating") return;

    timelineStartedRef.current = true;
    progressRef.current.t = 0;
    applyWaveClips(0);

    tweenRef.current?.kill();
    tweenRef.current = gsap.to(progressRef.current, {
      t: 1,
      duration: RISE_DURATION,
      ease: "power2.inOut",
      onUpdate: () => applyWaveClips(progressRef.current.t),
      onComplete: completeReveal,
    });
  }, [applyWaveClips, completeReveal]);

  const tryStartTimeline = useCallback(() => {
    if (timelineStartedRef.current || phaseRef.current !== "animating") return;

    const back = backRef.current;
    if (!back) return;

    if (back.complete && back.naturalWidth > 0) {
      requestAnimationFrame(() => requestAnimationFrame(startTimeline));
      return;
    }

    const onReady = () => {
      back.removeEventListener("load", onReady);
      back.removeEventListener("error", onReady);
      requestAnimationFrame(() => requestAnimationFrame(startTimeline));
    };

    back.addEventListener("load", onReady);
    back.addEventListener("error", onReady);
  }, [startTimeline]);

  const beginReveal = useCallback(() => {
    if (phaseRef.current !== "idle") return;
    phaseRef.current = "animating";
    setShowBack(true);
    setPhase("animating");
  }, []);

  const runReveal = useCallback(() => {
    if (playedRef.current) return;
    playedRef.current = true;
    pendingRevealRef.current = false;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      phaseRef.current = "revealed";
      setShowBack(true);
      setPhase("revealed");
      return;
    }

    beginReveal();
  }, [beginReveal]);

  const requestReveal = useCallback(() => {
    if (playedRef.current) return;
    if (!syncContentBox()) {
      pendingRevealRef.current = true;
      return;
    }
    requestAnimationFrame(runReveal);
  }, [runReveal, syncContentBox]);

  const handleSizerLoad = useCallback(() => {
    syncContentBox();
    if (pendingRevealRef.current) requestReveal();
  }, [requestReveal, syncContentBox]);

  useEffect(() => {
    const img = new Image();
    img.src = SUSTAIN_REVEAL_SRC;
  }, []);

  useEffect(() => {
    if (!showBack || phase !== "animating") return;
    tryStartTimeline();
  }, [phase, showBack, tryStartTimeline]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    syncContentBox();
    const ro = new ResizeObserver(syncContentBox);
    ro.observe(root);
    window.addEventListener("resize", syncContentBox);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncContentBox);
    };
  }, [syncContentBox]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const section = root.closest("section") ?? root;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          pendingRevealRef.current = true;
          requestReveal();
          observer.disconnect();
        }
      },
      { threshold: 0.22, rootMargin: "0px 0px -4% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [requestReveal]);

  useEffect(() => () => tweenRef.current?.kill(), []);

  const stageStyle = {
    left: `${contentBox.x}px`,
    top: `${contentBox.y}px`,
    width: `${contentBox.width}px`,
    height: `${contentBox.height}px`,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={cn(
        "sustain-water-reveal",
        phase === "animating" && "is-animating",
        phase === "revealed" && "is-revealed",
        className,
      )}
      aria-hidden
    >
      <img
        ref={sizerRef}
        src={SUSTAIN_WATER_SRC}
        alt=""
        className="sustain-water-reveal__sizer"
        decoding="async"
        draggable={false}
        onLoad={handleSizerLoad}
        aria-hidden
      />

      <div className="sustain-water-reveal__stage" style={stageStyle}>
        {showBack ? (
          <img
            ref={backRef}
            src={SUSTAIN_REVEAL_SRC}
            alt=""
            className="sustain-water-reveal__back"
            decoding="async"
            draggable={false}
          />
        ) : null}
        <img
          ref={frontRef}
          src={SUSTAIN_WATER_SRC}
          alt=""
          className="sustain-water-reveal__front"
          decoding="async"
          draggable={false}
        />
      </div>
    </div>
  );
}
