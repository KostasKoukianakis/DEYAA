import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WORD_SELECTOR = ".sustain-environment__lead-word";

/**
 * Reveals the sustain lead paragraph word-by-word in reading order.
 */
export function useSustainLeadReveal(
  sectionRef: RefObject<HTMLElement | null>,
  leadRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const section = sectionRef.current;
    const lead = leadRef.current;
    if (!section || !lead) return;

    const words = lead.querySelectorAll<HTMLElement>(WORD_SELECTOR);
    if (!words.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(words, { clearProps: "opacity,transform" });
      lead.classList.add("is-revealed");
      return;
    }

    gsap.set(words, { opacity: 0, y: 8 });

    const tween = gsap.to(words, {
      opacity: 1,
      y: 0,
      duration: 0.32,
      stagger: 0.055,
      ease: "power2.out",
      scrollTrigger: {
        trigger: lead,
        start: "top 86%",
        once: true,
        invalidateOnRefresh: true,
      },
      onComplete: () => {
        lead.classList.add("is-revealed");
        gsap.set(words, { clearProps: "opacity,transform" });
      },
    });

    const syncIfVisible = () => {
      const rect = lead.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.86 && rect.bottom > 0) {
        tween.progress(1);
      }
    };

    requestAnimationFrame(syncIfVisible);

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      lead.classList.remove("is-revealed");
    };
  }, [sectionRef, leadRef]);
}
