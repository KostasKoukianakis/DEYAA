import { useLayoutEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { notifyLenisScroll, setLenisInstance } from "@/lib/scrollControl";

gsap.registerPlugin(ScrollTrigger);

/** Palladio-style smooth scroll — lerp wheel input, sync GSAP ScrollTrigger */
export function useLenisScroll(enabled = true) {
  /* useLayoutEffect so scrollerProxy runs before section useEffect ScrollTriggers */
  useLayoutEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
      smoothWheel: true,
      syncTouch: false,
    });

    document.documentElement.classList.add("lenis", "lenis-smooth");
    setLenisInstance(lenis);
    notifyLenisScroll(lenis.scroll, 0);

    const root = document.documentElement;

    ScrollTrigger.scrollerProxy(root, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      /* fixed pins avoid subpixel translateY jitter on text/borders during horizontal scrub */
      pinType: "fixed",
    });

    ScrollTrigger.defaults({ scroller: root });

    lenis.on("scroll", (event: { scroll: number; direction: number }) => {
      notifyLenisScroll(event.scroll, event.direction);
      ScrollTrigger.update();
    });

    const onLenisResize = () => lenis.resize();
    window.addEventListener("resize", onLenisResize);
    window.addEventListener("load", onLenisResize);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("resize", onLenisResize);
      window.removeEventListener("load", onLenisResize);
      ScrollTrigger.defaults({ scroller: window });
      ScrollTrigger.scrollerProxy(root, {});
      gsap.ticker.remove(onTick);
      lenis.destroy();
      setLenisInstance(null);
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, [enabled]);
}
