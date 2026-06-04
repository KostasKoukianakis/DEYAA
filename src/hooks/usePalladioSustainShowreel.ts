import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_MIN = 768;
const SCRUB_SMOOTHING = 1.15;
const SHOWREEL_MAX_WIDTH = 610;
const SHOWREEL_ASPECT = 16 / 9;

function getShowreelStartSize() {
  const width = Math.min(window.innerWidth * 0.32, SHOWREEL_MAX_WIDTH);
  return { width, height: width / SHOWREEL_ASPECT };
}

/** Full-bleed without 100vw — avoids scrollbar overflow vs clientWidth. */
function getShowreelEndSize() {
  return {
    width: document.documentElement.clientWidth,
    height: window.innerHeight,
  };
}

interface PalladioSustainShowreelRefs {
  contentContainerRef: RefObject<HTMLElement | null>;
  mediaFrameRef: RefObject<HTMLElement | null>;
  beforeRef: RefObject<HTMLElement | null>;
  afterRef: RefObject<HTMLElement | null>;
}

/**
 * Palladio showreel — video stays horizontally centered (left 50% + xPercent -50),
 * only width / height / top animate — no relative→absolute jump.
 */
export function usePalladioSustainShowreel({
  contentContainerRef,
  mediaFrameRef,
  beforeRef,
  afterRef,
}: PalladioSustainShowreelRefs) {
  useEffect(() => {
    if (window.innerWidth < DESKTOP_MIN) return;

    const contentContainer = contentContainerRef.current;
    const mediaFrame = mediaFrameRef.current;
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!contentContainer || !mediaFrame || !before || !after) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scrollConfig = {
      trigger: contentContainer,
      start: "top top",
      end: "bottom top",
      scrub: prefersReducedMotion ? true : SCRUB_SMOOTHING,
      invalidateOnRefresh: true,
    };

    const applyStartLayout = () => {
      const { width, height } = getShowreelStartSize();
      gsap.set(mediaFrame, {
        position: "absolute",
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        zIndex: 15,
        width,
        maxWidth: width,
        height,
        overflow: "hidden",
      });
    };

    applyStartLayout();

    const timeline = gsap.timeline({
      scrollTrigger: scrollConfig,
    });

    timeline.fromTo(
      mediaFrame,
      {
        width: () => getShowreelStartSize().width,
        maxWidth: () => getShowreelStartSize().width,
        height: () => getShowreelStartSize().height,
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
      },
      {
        width: () => getShowreelEndSize().width,
        maxWidth: () => getShowreelEndSize().width,
        height: () => getShowreelEndSize().height,
        top: "0%",
        left: "50%",
        xPercent: -50,
        yPercent: 0,
        ease: "none",
      },
      0,
    );

    timeline.to(before, { opacity: 0, ease: "none" }, 0);
    timeline.to(after, { opacity: 0, ease: "none" }, 0);

    const refresh = () => {
      applyStartLayout();
      ScrollTrigger.refresh();
    };
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      timeline.scrollTrigger?.kill();
      timeline.kill();
      gsap.set(mediaFrame, {
        clearProps:
          "width,height,maxWidth,top,left,xPercent,yPercent,transform,position,zIndex",
      });
      gsap.set(before, { clearProps: "opacity" });
      gsap.set(after, { clearProps: "opacity" });
    };
  }, [contentContainerRef, mediaFrameRef, beforeRef, afterRef]);
}
