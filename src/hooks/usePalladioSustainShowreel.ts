import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Palladio tablet type range is max-width 1024px — no showreel expand there. */
const DESKTOP_MIN = 1025;
const SCRUB_SMOOTHING = 1.15;
const SHOWREEL_MAX_WIDTH = 610;
const SHOWREEL_ASPECT = 16 / 9;
const MEDIA_CLEAR_PROPS =
  "width,height,maxWidth,top,left,xPercent,yPercent,transform,position,zIndex,overflow";

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
 * Palladio showreel — desktop (>=1025px) video stays horizontally centered
 * (left 50% + xPercent -50), only width / height / top animate.
 * At 1024px and below the frame stays in document flow at its CSS size (no scroll expand).
 */
export function usePalladioSustainShowreel({
  contentContainerRef,
  mediaFrameRef,
  beforeRef,
  afterRef,
}: PalladioSustainShowreelRefs) {
  useEffect(() => {
    const contentContainer = contentContainerRef.current;
    const mediaFrame = mediaFrameRef.current;
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!contentContainer || !before || !after) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const desktopMql = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);

    let entrancePlayed = false;
    let entranceTween: gsap.core.Timeline | null = null;
    let timeline: gsap.core.Timeline | null = null;

    const leftLine = before.querySelector<HTMLElement>(
      ".palladio-sustain__line--desktop",
    );
    const rightLines = after.querySelectorAll<HTMLElement>(
      ".palladio-sustain__line--desktop",
    );

    const finishEntrance = () => {
      after.classList.add("is-cycle-ready");
    };

    const resetLines = () => {
      if (leftLine) {
        gsap.set(leftLine, { scaleX: 0, transformOrigin: "left center" });
      }
      rightLines.forEach((line) => {
        gsap.set(line, { scaleX: 0, transformOrigin: "right center" });
      });
    };

    const showLines = () => {
      if (leftLine) {
        gsap.set(leftLine, { scaleX: 1, transformOrigin: "left center" });
      }
      rightLines.forEach((line) => {
        gsap.set(line, { scaleX: 1, transformOrigin: "right center" });
      });
    };

    const playEntrance = () => {
      if (entrancePlayed) return;
      entrancePlayed = true;
      entranceTween?.kill();

      if (prefersReducedMotion) {
        gsap.set([before, after], { opacity: 1, y: 0 });
        showLines();
        finishEntrance();
        return;
      }

      resetLines();

      entranceTween = gsap.timeline({ onComplete: finishEntrance });
      entranceTween.fromTo(
        before,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        0,
      );
      if (leftLine) {
        entranceTween.to(
          leftLine,
          { scaleX: 1, duration: 1.05, ease: "power3.out" },
          0.16,
        );
      }
      entranceTween.fromTo(
        after,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        0.28,
      );
      if (rightLines.length) {
        entranceTween.to(
          rightLines,
          { scaleX: 1, duration: 1.05, ease: "power3.out" },
          0.35,
        );
      }
    };

    gsap.set([before, after], {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 22,
    });
    if (!prefersReducedMotion) {
      resetLines();
    }

    const entranceTrigger = ScrollTrigger.create({
      trigger: contentContainer,
      start: "top 85%",
      once: true,
      onEnter: playEntrance,
      onRefresh() {
        if (entrancePlayed) return;
        const top = contentContainer.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.85) playEntrance();
      },
    });

    requestAnimationFrame(() => {
      if (entrancePlayed) return;
      const rect = contentContainer.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh * 0.85 && rect.bottom > 0) playEntrance();
    });

    const clearLineProps = () => {
      if (leftLine) gsap.set(leftLine, { clearProps: "transform" });
      rightLines.forEach((line) => gsap.set(line, { clearProps: "transform" }));
    };

    const teardownExpand = () => {
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
      timeline = null;
      if (mediaFrame) {
        gsap.set(mediaFrame, { clearProps: MEDIA_CLEAR_PROPS });
      }
    };

    const applyStartLayout = () => {
      if (!mediaFrame) return;
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

    const setupExpand = () => {
      teardownExpand();
      if (!desktopMql.matches || !mediaFrame) {
        if (entrancePlayed) {
          gsap.set([before, after], { opacity: 1, y: 0 });
        }
        return;
      }

      const scrollConfig = {
        trigger: contentContainer,
        start: "top top",
        end: "bottom top",
        scrub: prefersReducedMotion ? true : SCRUB_SMOOTHING,
        invalidateOnRefresh: true,
      };

      applyStartLayout();

      timeline = gsap.timeline({
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
    };

    const refresh = () => {
      if (!desktopMql.matches) return;
      applyStartLayout();
      ScrollTrigger.refresh();
    };

    setupExpand();
    desktopMql.addEventListener("change", setupExpand);
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      desktopMql.removeEventListener("change", setupExpand);
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      entranceTrigger.kill();
      entranceTween?.kill();
      teardownExpand();
      after.classList.remove("is-cycle-ready");
      gsap.set([before, after], { clearProps: "opacity,transform" });
      clearLineProps();
    };
  }, [contentContainerRef, mediaFrameRef, beforeRef, afterRef]);
}
