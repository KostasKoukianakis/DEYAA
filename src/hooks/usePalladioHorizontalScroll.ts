import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_MIN = 998;
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
export function usePalladioSectionHeights(
  setRef: RefObject<HTMLElement | null>,
  readRef: RefObject<HTMLElement | null>,
  options: { fixedHeight?: boolean; includeHorizontalExtra?: boolean } = {},
  deps: unknown[] = []
) {
  const includeHorizontalExtra = options.includeHorizontalExtra ?? true;

  useEffect(() => {
    if (window.innerWidth < DESKTOP_MIN) return;

    let lastHeight = -1;

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

      if (Math.abs(height - lastHeight) < 1) return;
      lastHeight = height;

      if (options.fixedHeight) {
        setEl.style.height = `${height}px`;
        setEl.style.minHeight = "";
      } else {
        setEl.style.minHeight = `${height}px`;
      }
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

    const onResize = () => {
      sync();
      ScrollTrigger.refresh();
    };
    const onLoad = () => {
      sync();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onLoad);
    return () => {
      observers.forEach((ro) => ro.disconnect());
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onLoad);
    };
  }, [...deps, includeHorizontalExtra, options.fixedHeight]);
}

export interface PalladioHorizontalScrollOptions {
  /** Palladio uses pinSpacing: true on every horizontal carousel */
  pinSpacing?: boolean;
  /** true = GSAP scrub (1:1 with scroll); number = scrub smoothing seconds; false = no scrub */
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
  const pinSpacing = options.pinSpacing ?? true;

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
      options.scrub === false
        ? false
        : typeof options.scrub === "number"
          ? prefersReducedMotion
            ? true
            : options.scrub
          : true;

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
        invalidateOnRefresh: true,
        toggleClass: { className: PINNED_CLASS, targets: section },
        onEnter: () => syncUnifiedShaderBg(background, true),
        onEnterBack: () => syncUnifiedShaderBg(background, true),
        onLeaveBack: () => syncUnifiedShaderBg(background, false),
      },
    });

    const refresh = () => ScrollTrigger.refresh();
    const onLoad = () => requestAnimationFrame(refresh);
    window.addEventListener("load", onLoad);
    window.addEventListener("resize", refresh);

    container.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", refresh, { once: true });
    });

    requestAnimationFrame(refresh);

    return () => {
      window.removeEventListener("load", onLoad);
      window.removeEventListener("resize", refresh);
      section.classList.remove(PINNED_CLASS);
      syncUnifiedShaderBg(background, false);
      background?.classList.remove("hero-unified-shader--pinned");
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(container, { clearProps: "transform,willChange" });
    };
  }, [sectionRef, scrollRef, backgroundRef, wrapperRef, pinSpacing, options.scrub]);
}
