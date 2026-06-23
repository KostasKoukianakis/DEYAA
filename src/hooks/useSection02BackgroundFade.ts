import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scrubs a white overlay over the hero blue gradient as section-02 enters the viewport.
 */
export function useSection02BackgroundFade(
  sectionRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      section.style.setProperty("--s02-white-fade", "1");
      return;
    }

    gsap.set(section, { "--s02-white-fade": 0 });

    const tween = gsap.to(section, {
      "--s02-white-fade": 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "top top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      window.removeEventListener("load", refresh);
      tween.scrollTrigger?.kill();
      tween.kill();
      section.style.removeProperty("--s02-white-fade");
    };
  }, [sectionRef]);
}
