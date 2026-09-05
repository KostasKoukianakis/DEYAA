import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_MIN = 1025;
/** Palladio uses 0 — non-zero anticipatePin causes visible pre-pin jumps */
const PIN_ANTICIPATION = 0;
const PINNED_CLASS = "is-horizontal-pinned";

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
}

/**
 * Palladio syncAllHeights — optional extra scroll room on the wrapper.
 * When horizontal scroll uses pinSpacing:true, keep includeHorizontalExtra:false
 * (GSAP pin-spacer already allocates that distance — doubling causes dead scroll).
 */
function isDesktopViewport() {
  return window.innerWidth >= DESKTOP_MIN;
}

export function usePalladioSectionHeights(
  setRef: RefObject<HTMLElement | null>,
  readRef: RefObject<HTMLElement | null>,
  options: { fixedHeight?: boolean; includeHorizontalExtra?: boolean } = {},
  deps: unknown[] = []
) {
  const includeHorizontalExtra = options.includeHorizontalExtra ?? true;

  useEffect(() => {
    let lastHeight = -1;
    const observers: ResizeObserver[] = [];
    let readObserver: ResizeObserver | null = null;

    const clearDesktopStyles = () => {
      const setEl = setRef.current;
      if (!setEl) return;
      setEl.style.height = "";
      setEl.style.minHeight = "";
      lastHeight = -1;
    };

    const disconnectObservers = () => {
      observers.forEach((ro) => ro.disconnect());
      observers.length = 0;
      readObserver?.disconnect();
      readObserver = null;
    };

    const sync = () => {
      const setEl = setRef.current;
      const readEl = readRef.current;
      if (!setEl || !readEl) return;

      if (!isDesktopViewport()) {
        clearDesktopStyles();
        return;
      }

      let height = readEl.offsetHeight;
      if (includeHorizontalExtra) {
        readEl
          .querySelectorAll<HTMLElement>(".horizontal-scroll, .palladio-horizontal-scroll")
          .forEach((scrollEl) => {
            const extra = getHorizontalDistance(scrollEl);
            if (extra > 0) height += extra;
          });
      }

      if (Math.abs(height - lastHeight) < 1) return;
      lastHeight = height;

      if (options.fixedHeight) {
        setEl.style.height = `${height}px`;
        setEl.style.minHeight = "";
      } else {
        setEl.style.minHeight = `${height}px`;
        setEl.style.height = "";
      }
    };

    const observeScrollTracks = () => {
      disconnectObservers();
      if (!isDesktopViewport()) return;

      const readEl = readRef.current;
      if (readEl) {
        readObserver = new ResizeObserver(sync);
        readObserver.observe(readEl);
      }

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

    const onViewportChange = () => {
      sync();
      observeScrollTracks();
      ScrollTrigger.refresh();
    };

    onViewportChange();
    requestAnimationFrame(onViewportChange);

    const desktopMql = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);
    desktopMql.addEventListener("change", onViewportChange);
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("load", onViewportChange);

    return () => {
      disconnectObservers();
      desktopMql.removeEventListener("change", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("load", onViewportChange);
      clearDesktopStyles();
    };
  }, [...deps, includeHorizontalExtra, options.fixedHeight]);
}

export interface PalladioHorizontalScrollOptions {
  /** Palladio uses pinSpacing: true on every horizontal carousel */
  pinSpacing?: boolean;
  /** true = GSAP scrub (1:1 with scroll); number = scrub smoothing seconds; false = no scrub */
  scrub?: boolean | number;
  /** Re-bind when a lazily mounted section attaches its refs */
  refreshKey?: unknown;
}

/** GSAP horizontal scroll — matches palladiogroup.com setupHorizontalScrolls() */
export function usePalladioHorizontalScroll(
  sectionRef: RefObject<HTMLElement | null>,
  scrollRef: RefObject<HTMLElement | null>,
  backgroundRef?: RefObject<HTMLElement | null>,
  wrapperRef?: RefObject<HTMLElement | null>,
  options: PalladioHorizontalScrollOptions = {}
) {
  const pinSpacing = options.pinSpacing ?? true;
  const refreshKey = options.refreshKey;

  useEffect(() => {
    let tween: gsap.core.Tween | null = null;
    let refreshHandler: (() => void) | null = null;
    let onLoadHandler: (() => void) | null = null;
    let section: HTMLElement | null = null;
    let container: HTMLElement | null = null;
    let background: HTMLElement | null = null;

    const teardown = () => {
      if (refreshHandler) {
        window.removeEventListener("resize", refreshHandler);
        refreshHandler = null;
      }
      if (onLoadHandler) {
        window.removeEventListener("load", onLoadHandler);
        onLoadHandler = null;
      }
      section?.classList.remove(PINNED_CLASS);
      syncUnifiedShaderBg(background, false);
      background?.classList.remove("hero-unified-shader--pinned");
      tween?.scrollTrigger?.kill();
      tween?.kill();
      tween = null;
      if (container) {
        gsap.set(container, { clearProps: "transform,willChange" });
      }
    };

    const setup = () => {
      teardown();

      if (!isDesktopViewport()) return;

      section = sectionRef.current;
      container = scrollRef.current;
      background = backgroundRef?.current ?? null;
      if (!section || !container) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const scrubValue =
        options.scrub === false
          ? false
          : typeof options.scrub === "number"
            ? prefersReducedMotion
              ? true
              : options.scrub
            : true;

      gsap.set(container, { force3D: true, willChange: "transform" });

      tween = gsap.to(container, {
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
          invalidateOnRefresh: true,
          toggleClass: { className: PINNED_CLASS, targets: section },
          onEnter: () => syncUnifiedShaderBg(background, true),
          onEnterBack: () => syncUnifiedShaderBg(background, true),
          onLeaveBack: () => syncUnifiedShaderBg(background, false),
        },
      });

      const refresh = () => ScrollTrigger.refresh();
      refreshHandler = refresh;
      onLoadHandler = () => requestAnimationFrame(refresh);
      window.addEventListener("load", onLoadHandler);
      window.addEventListener("resize", refreshHandler);

      container.querySelectorAll("img").forEach((img) => {
        if (!img.complete) img.addEventListener("load", refresh, { once: true });
      });

      requestAnimationFrame(refresh);
    };

    setup();

    const desktopMql = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);
    desktopMql.addEventListener("change", setup);

    return () => {
      desktopMql.removeEventListener("change", setup);
      teardown();
    };
  }, [sectionRef, scrollRef, backgroundRef, wrapperRef, pinSpacing, options.scrub, refreshKey]);
}
