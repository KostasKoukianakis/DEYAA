import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function usePalladioServicesTabPanelEffects(
  panelRef: RefObject<HTMLElement | null>,
  iconColRef: RefObject<HTMLElement | null>,
  isActive: boolean,
) {
  useEffect(() => {
    const panel = panelRef.current;
    if (!isActive || !panel) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let enterTween: gsap.core.Tween | undefined;

    if (!prefersReducedMotion) {
      const enterTargets = panel.querySelectorAll<HTMLElement>(
        ".palladio-services-page__service-heros, .palladio-services-page__accordion, .palladio-services-page__docs",
      );

      enterTween = gsap.fromTo(
        enterTargets,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: "power3.out",
          clearProps: "transform",
          onComplete: () => ScrollTrigger.refresh(),
        },
      );
    }

    const spinEl = iconColRef.current?.querySelector<HTMLElement>(
      ".palladio-services-page__panel-icon-spin",
    );

    let rotationTween: gsap.core.Tween | undefined;

    if (spinEl && !prefersReducedMotion) {
      gsap.set(spinEl, { transformOrigin: "50% 50%", opacity: 1 });
      rotationTween = gsap.to(spinEl, {
        rotation: 360,
        ease: "none",
        scrollTrigger: {
          trigger: panel,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    return () => {
      enterTween?.kill();
      rotationTween?.scrollTrigger?.kill();
      rotationTween?.kill();
      if (spinEl) {
        gsap.set(spinEl, { clearProps: "rotation" });
      }
    };
  }, [isActive, panelRef, iconColRef]);
}
