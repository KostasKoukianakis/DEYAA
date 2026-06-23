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
    const contentContainer = contentContainerRef.current;
    const mediaFrame = mediaFrameRef.current;
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!contentContainer || !before || !after) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let entrancePlayed = false;
    let entranceTween: gsap.core.Timeline | null = null;

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

    if (window.innerWidth < DESKTOP_MIN || !mediaFrame) {
      return () => {
        entranceTrigger.kill();
        entranceTween?.kill();
        after.classList.remove("is-cycle-ready");
        gsap.set([before, after], { clearProps: "opacity,transform" });
        clearLineProps();
      };
    }

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
      entranceTrigger.kill();
      entranceTween?.kill();
      timeline.scrollTrigger?.kill();
      timeline.kill();
      after.classList.remove("is-cycle-ready");
      gsap.set(mediaFrame, {
        clearProps:
          "width,height,maxWidth,top,left,xPercent,yPercent,transform,position,zIndex",
      });
      gsap.set([before, after], { clearProps: "opacity,transform" });
      clearLineProps();
    };
  }, [contentContainerRef, mediaFrameRef, beforeRef, afterRef]);
}
