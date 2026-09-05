import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

const SUSTAIN_WATER_SRC = "/hero/sustain_water.webp";
const SUSTAIN_REVEAL_SRC = "/hero/koyrnas.webp";
const FALL_DURATION = 2.35;
const FALL_GAP_PX = 32;

interface ContentBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

type RevealPhase = "idle" | "falling" | "revealed";

interface SustainWaterRevealProps {
  className?: string;
}

const MOBILE_FILL_MAX_WIDTH = 1024;

function useMobileFillStage() {
  const [fillStage, setFillStage] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${MOBILE_FILL_MAX_WIDTH}px)`).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_FILL_MAX_WIDTH}px)`);
    const onChange = () => setFillStage(mql.matches);
    mql.addEventListener("change", onChange);
    setFillStage(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return fillStage;
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

function getMobileStageBox(root: HTMLElement): ContentBox {
  const width = root.clientWidth || root.getBoundingClientRect().width;
  const height = root.clientHeight || root.getBoundingClientRect().height;
  const size = Math.max(width, height, 1);
  return { x: 0, y: 0, width: size, height: size };
}

/** Start above the section top so koyrnas can fall into place. */
function measureFallOffset(root: HTMLElement) {
  const section = root.closest("section");
  if (!section) return "-100vh";

  const previousDrop = root.style.getPropertyValue("--sustain-water-drop-y");
  root.style.setProperty("--sustain-water-drop-y", "0px");

  const sectionTop = section.getBoundingClientRect().top;
  const rootRect = root.getBoundingClientRect();
  const liftPx = Math.ceil(rootRect.bottom - sectionTop + FALL_GAP_PX);

  root.style.setProperty("--sustain-water-drop-y", previousDrop || "0px");

  return liftPx > 0 ? `-${liftPx}px` : "-100vh";
}

/** koyrnas falls from the top of the section on scroll. */
export function SustainWaterReveal({ className }: SustainWaterRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const naturalSizeRef = useRef({ width: 1920, height: 1080 });
  const frontRef = useRef<HTMLImageElement>(null);
  const backRef = useRef<HTMLImageElement>(null);
  const fallTweenRef = useRef<gsap.core.Tween | null>(null);
  const playedRef = useRef(false);
  const pendingRevealRef = useRef(false);
  const phaseRef = useRef<RevealPhase>("idle");

  const [phase, setPhase] = useState<RevealPhase>("idle");
  const fillMobileStage = useMobileFillStage();
  const [contentBox, setContentBox] = useState<ContentBox>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const lockRevealedState = useCallback(() => {
    const front = frontRef.current;
    const back = backRef.current;

    if (back) {
      back.style.transform = "";
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
    if (!root) return false;

    const next = fillMobileStage
      ? getMobileStageBox(root)
      : (() => {
          const rootRect = root.getBoundingClientRect();
          return getContainedRect(
            rootRect.width,
            rootRect.height,
            naturalSizeRef.current.width,
            naturalSizeRef.current.height,
          );
        })();

    setContentBox(next);
    return next.width > 0 && next.height > 0;
  }, [fillMobileStage]);

  const completeReveal = useCallback(() => {
    lockRevealedState();

    requestAnimationFrame(() => {
      phaseRef.current = "revealed";
      setPhase("revealed");
    });
  }, [lockRevealedState]);

  const startKoyrnasFall = useCallback(() => {
    const root = rootRef.current;
    const back = backRef.current;
    const front = frontRef.current;
    if (!root || !back) return;

    const fallOffset = measureFallOffset(root);

    phaseRef.current = "falling";
    setPhase("falling");

    if (front) {
      front.style.opacity = "0";
      front.style.visibility = "hidden";
    }

    fallTweenRef.current?.kill();
    gsap.set(root, {
      "--sustain-water-drop-y": fallOffset,
      opacity: 1,
    });
    gsap.set(back, { y: 0, clearProps: "transform" });

    fallTweenRef.current = gsap.to(root, {
      "--sustain-water-drop-y": "0px",
      opacity: 1,
      duration: FALL_DURATION,
      ease: "power3.out",
      onComplete: completeReveal,
    });
  }, [completeReveal]);

  const runReveal = useCallback(() => {
    if (playedRef.current) return;
    playedRef.current = true;
    pendingRevealRef.current = false;

    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(root, { "--sustain-water-drop-y": "0px", opacity: 1 });
      requestAnimationFrame(() => completeReveal());
      return;
    }

    const preload = new Image();
    preload.src = SUSTAIN_REVEAL_SRC;
    preload.onload = () => requestAnimationFrame(startKoyrnasFall);
    preload.onerror = () => requestAnimationFrame(startKoyrnasFall);
  }, [completeReveal, startKoyrnasFall]);

  const requestReveal = useCallback(() => {
    if (playedRef.current) return;
    if (!syncContentBox()) {
      pendingRevealRef.current = true;
      return;
    }
    requestAnimationFrame(runReveal);
  }, [runReveal, syncContentBox]);

  useEffect(() => {
    const reveal = new Image();
    reveal.src = SUSTAIN_REVEAL_SRC;

    const sizer = new Image();
    sizer.src = SUSTAIN_WATER_SRC;
    const onSizerReady = () => {
      if (sizer.naturalWidth && sizer.naturalHeight) {
        naturalSizeRef.current = {
          width: sizer.naturalWidth,
          height: sizer.naturalHeight,
        };
      }
      syncContentBox();
      if (pendingRevealRef.current) requestReveal();
    };
    if (sizer.complete && sizer.naturalWidth) onSizerReady();
    else {
      sizer.onload = onSizerReady;
      sizer.onerror = onSizerReady;
    }
  }, [requestReveal, syncContentBox]);

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
    syncContentBox();
  }, [fillMobileStage, syncContentBox]);

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

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.set(root, {
      "--sustain-water-drop-y": "0px",
      opacity: 0,
    });
  }, []);

  useEffect(
    () => () => {
      fallTweenRef.current?.kill();
    },
    [],
  );

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
        fillMobileStage && "sustain-water-reveal--mobile-fill",
        phase === "falling" && "is-falling",
        phase === "revealed" && "is-revealed",
        className,
      )}
      aria-hidden
    >
      <div className="sustain-water-reveal__sizer" aria-hidden />

      <div className="sustain-water-reveal__stage" style={stageStyle}>
        <img
          ref={backRef}
          src={SUSTAIN_REVEAL_SRC}
          alt=""
          className="sustain-water-reveal__back"
          decoding="async"
          draggable={false}
        />
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
