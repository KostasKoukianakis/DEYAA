import { RefObject, useEffect } from "react";
import gsap from "gsap";

export function usePalladioServicesPageEntrance(pageRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const headline = page.querySelector<HTMLElement>(".palladio-services-page__headline");
    const intro = page.querySelector<HTMLElement>(".palladio-services-page__intro");
    const icons = page.querySelectorAll<HTMLElement>(".palladio-services-page__hero-icon");
    const tabs = page.querySelectorAll<HTMLElement>(".palladio-services-page__tab");

    gsap.set([headline, intro], { opacity: 0, y: 24 });
    gsap.set(icons, { opacity: 0, scale: 0.92 });
    gsap.set(tabs, { opacity: 0, y: 12 });

    const heroTl = gsap.timeline({ delay: 0.05 });
    heroTl
      .to(headline, { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" })
      .to(intro, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, 0.1)
      .to(icons, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" }, 0.18)
      .to(tabs, { opacity: 1, y: 0, duration: 0.55, stagger: 0.06, ease: "power3.out" }, 0.28);

    return () => {
      heroTl.kill();
    };
  }, [pageRef]);
}
