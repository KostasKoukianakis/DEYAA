import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Palladio footer marquee — linear GSAP loop (half scrollWidth shift).
 */
export function usePalladioMarquee<T extends HTMLElement>() {
  const marqueeRef = useRef<T>(null);

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;

    const setup = () => {
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0 });

      const distance = el.scrollWidth / 2;
      if (distance <= 0) return;

      const speed = window.innerWidth <= 768 ? 75 : 250;
      const duration = distance / speed;

      gsap.to(el, {
        x: -distance,
        duration,
        ease: "linear",
        repeat: -1,
      });
    };

    setup();

    window.addEventListener("resize", setup);
    return () => {
      window.removeEventListener("resize", setup);
      if (el) gsap.killTweensOf(el);
    };
  }, []);

  return marqueeRef;
}
