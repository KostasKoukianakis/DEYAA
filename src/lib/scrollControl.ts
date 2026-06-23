import type Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type ScrollDirection = -1 | 0 | 1;

export interface ScrollPayload {
  scrollY: number;
  direction: ScrollDirection;
}

let lenisInstance: Lenis | null = null;
const scrollListeners = new Set<(payload: ScrollPayload) => void>();

let lastNativeScrollY = 0;
let nativeScrollBound = false;

function notifyScroll(payload: ScrollPayload) {
  scrollListeners.forEach((listener) => listener(payload));
}

function bindNativeScrollFallback() {
  if (nativeScrollBound || lenisInstance) return;

  nativeScrollBound = true;
  lastNativeScrollY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      if (lenisInstance) return;

      const scrollY = window.scrollY;
      const direction: ScrollDirection =
        scrollY > lastNativeScrollY ? 1 : scrollY < lastNativeScrollY ? -1 : 0;
      lastNativeScrollY = scrollY;
      notifyScroll({ scrollY, direction });
    },
    { passive: true },
  );
}

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
  if (!instance) {
    bindNativeScrollFallback();
  }
}

export function getLenisInstance() {
  return lenisInstance;
}

export function subscribeScroll(listener: (payload: ScrollPayload) => void) {
  scrollListeners.add(listener);
  bindNativeScrollFallback();

  const scrollY = lenisInstance?.scroll ?? window.scrollY;
  listener({ scrollY, direction: 0 });

  return () => {
    scrollListeners.delete(listener);
  };
}

/** @deprecated Use subscribeScroll — kept for callers passing scrollY only */
export function subscribeScrollY(listener: (scrollY: number) => void) {
  return subscribeScroll(({ scrollY }) => listener(scrollY));
}

export function notifyLenisScroll(scrollY: number, direction: number) {
  const normalizedDirection: ScrollDirection =
    direction > 0 ? 1 : direction < 0 ? -1 : 0;
  notifyScroll({ scrollY, direction: normalizedDirection });
}

export function refreshLenis() {
  lenisInstance?.resize();
}

/** Scroll to page top — works with Lenis (announcements/home) and native scroll. */
export function scrollToTop(options?: { immediate?: boolean; refreshScrollTrigger?: boolean }) {
  const immediate = options?.immediate ?? true;

  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate, force: true });
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: immediate ? "auto" : "smooth" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  if (options?.refreshScrollTrigger !== false) {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }
}
