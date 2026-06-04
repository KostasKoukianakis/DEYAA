import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_MIN = 998;
/** Horizontal scrub lag (seconds) — pairs with Lenis for Palladio-style drift */
const SCRUB_SMOOTHING = 1.15;
/** Must stay 0 — anticipatePin causes a visible jump before lock */
const PIN_ANTICIPATION = 0;

function getHorizontalDistance(el: HTMLElement) {
  const viewport = document.documentElement.clientWidth;
  const fromScrollWidth = el.scrollWidth - viewport;
  const fromChildren = Array.from(el.children).reduce(
    (sum, child) => sum + (child as HTMLElement).offsetWidth,
    0,
  );
  return Math.max(0, fromScrollWidth, fromChildren - viewport);
}

function syncUnifiedShaderBg(
  bg: HTMLElement | null,
  pinned: boolean
) {
  if (!bg) return;
  const wasPinned = bg.classList.contains("hero-unified-shader--pinned");
  if (wasPinned === pinned) return;
  bg.classList.toggle("hero-unified-shader--pinned", pinned);
  if (!pinned) {
    requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
  }
}

/** Palladio syncAllHeights — extra scroll room for pinned horizontal sections */
export function usePalladioSectionHeights(
  setRef: RefObject<HTMLElement | null>,
  readRef: RefObject<HTMLElement | null>,
  options: { fixedHeight?: boolean; includeHorizontalExtra?: boolean } = {},
  deps: unknown[] = []
) {
  const includeHorizontalExtra = options.includeHorizontalExtra ?? true;

  useEffect(() => {
    if (window.innerWidth < DESKTOP_MIN) return;

    const sync = () => {
      const setEl = setRef.current;
      const readEl = readRef.current;
      if (!setEl || !readEl) return;

      let height = readEl.offsetHeight;
      if (includeHorizontalExtra) {
        readEl.querySelectorAll<HTMLElement>(".horizontal-scroll, .palladio-horizontal-scroll").forEach((scrollEl) => {
          const extra = getHorizontalDistance(scrollEl);
          if (extra > 0) height += extra;
        });
      }

      if (options.fixedHeight) {
        setEl.style.height = `${height}px`;
        setEl.style.minHeight = "";
      } else {
        setEl.style.minHeight = `${height}px`;
      }
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    sync();

    const observers: ResizeObserver[] = [];
    const observeScrollTracks = () => {
      readRef.current
        ?.querySelectorAll<HTMLElement>(".horizontal-scroll, .palladio-horizontal-scroll")
        .forEach((scrollEl) => {
          const ro = new ResizeObserver(sync);
          ro.observe(scrollEl);
          scrollEl.querySelectorAll("img").forEach((img) => {
            if (!img.complete) img.addEventListener("load", sync, { once: true });
          });
          observers.push(ro);
        });
    };

    observeScrollTracks();
    requestAnimationFrame(observeScrollTracks);

    window.addEventListener("resize", sync);
    window.addEventListener("load", sync);
    return () => {
      observers.forEach((ro) => ro.disconnect());
      window.removeEventListener("resize", sync);
      window.removeEventListener("load", sync);
    };
  }, [...deps, includeHorizontalExtra, options.fixedHeight]);
}

export interface PalladioHorizontalScrollOptions {
  /** Hero #data uses false + pre-allocated height; Innovation Hub uses true */
  pinSpacing?: boolean;
  /** Innovation Hub uses scrub: true (Palladio default) */
  scrub?: boolean | number;
}

/** GSAP horizontal scroll — matches palladiogroup.com setupHorizontalScrolls() */
export function usePalladioHorizontalScroll(
  sectionRef: RefObject<HTMLElement | null>,
  scrollRef: RefObject<HTMLElement | null>,
  backgroundRef?: RefObject<HTMLElement | null>,
  wrapperRef?: RefObject<HTMLElement | null>,
  options: PalladioHorizontalScrollOptions = {}
) {
  const pinSpacing = options.pinSpacing ?? false;

  useEffect(() => {
    if (window.innerWidth < DESKTOP_MIN) return;

    const section = sectionRef.current;
    const container = scrollRef.current;
    const background = backgroundRef?.current ?? null;
    if (!section || !container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scrubValue =
      options.scrub === true
        ? true
        : typeof options.scrub === "number"
          ? prefersReducedMotion
            ? true
            : options.scrub
          : pinSpacing
            ? true
            : prefersReducedMotion
              ? true
              : SCRUB_SMOOTHING;

    gsap.set(container, { force3D: true, willChange: "transform" });

    const tween = gsap.to(container, {
      x: () => -getHorizontalDistance(container),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getHorizontalDistance(container)}`,
        scrub: scrubValue,
        pin: true,
        pinSpacing,
        anticipatePin: PIN_ANTICIPATION,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        onEnter: () => syncUnifiedShaderBg(background, true),
        onEnterBack: () => syncUnifiedShaderBg(background, true),
        /* Stay pinned after section 02 — only unpin back on section 01 (onLeaveBack) */
        onLeaveBack: () => syncUnifiedShaderBg(background, false),
      },
    });

    const refresh = () => {
      tween.scrollTrigger?.refresh();
      ScrollTrigger.refresh();
    };
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    const scrollObserver = new ResizeObserver(refresh);
    scrollObserver.observe(container);
    container.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", refresh, { once: true });
    });

    return () => {
      scrollObserver.disconnect();
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      syncUnifiedShaderBg(background, false);
      background?.classList.remove("hero-unified-shader--pinned");
      gsap.set(container, { clearProps: "transform,willChange" });
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [sectionRef, scrollRef, backgroundRef, wrapperRef, pinSpacing, options.scrub]);
}
