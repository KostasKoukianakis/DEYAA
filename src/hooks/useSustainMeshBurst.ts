import { RefObject, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type SustainMeshBurstProgress = { value: number };

/**
 * Scrubs mesh color burst (0 → 1) as the sustain environment section enters view.
 */
export function useSustainMeshBurst(
  sectionRef: RefObject<HTMLElement | null>,
  heroWordRef?: RefObject<HTMLElement | null>,
) {
  const burstRef = useRef<SustainMeshBurstProgress>({ value: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const applyBurst = (value: number) => {
      burstRef.current.value = value;
      section.style.setProperty("--sustain-burst", String(value));

      const fadeRaw = gsap.utils.clamp(0, 1, (value - 0.1) / 0.65);
      const fade = gsap.parseEase("power2.out")(fadeRaw);
      section.style.setProperty("--sustain-hero-opacity", String(fade));
      section.style.setProperty(
        "--sustain-hero-shift",
        `${(1 - fade) * 1.75}rem`,
      );
    };

    const resetHeroVars = () => {
      section.style.removeProperty("--sustain-hero-opacity");
      section.style.removeProperty("--sustain-hero-shift");
    };

    if (prefersReducedMotion) {
      applyBurst(1);
      return;
    }

    applyBurst(0);

    const tween = gsap.to(burstRef.current, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        /* Full viewport+ of scroll: section enters → hero word settles */
        start: "top bottom",
        end: "top -18%",
        scrub: 2.8,
        invalidateOnRefresh: true,
        onUpdate() {
          applyBurst(burstRef.current.value);
        },
      },
    });

    const syncIfAlreadyVisible = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollSpan = vh * 1.18;
      if (rect.top < vh && rect.bottom > 0) {
        const progress = gsap.utils.clamp(0, 1, (vh - rect.top) / scrollSpan);
        applyBurst(progress);
      }
    };

    requestAnimationFrame(syncIfAlreadyVisible);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      window.removeEventListener("load", refresh);
      tween.scrollTrigger?.kill();
      tween.kill();
      section.style.removeProperty("--sustain-burst");
      resetHeroVars();
      burstRef.current.value = 0;
    };
  }, [sectionRef, heroWordRef]);

  return burstRef;
}
