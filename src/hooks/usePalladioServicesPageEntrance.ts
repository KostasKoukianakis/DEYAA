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
    const art = page.querySelector<HTMLElement>(".palladio-water-quality__hero-art");
    const tabs = page.querySelectorAll<HTMLElement>(".palladio-services-page__tab");

    gsap.set([headline, intro], { opacity: 0, y: 24, filter: "blur(6px)" });
    if (icons.length) gsap.set(icons, { opacity: 0, scale: 0.92 });
    if (art) gsap.set(art, { opacity: 0, y: 18, filter: "blur(8px)" });
    gsap.set(tabs, { opacity: 0, y: 12 });

    const heroTl = gsap.timeline({ delay: 0.05 });
    heroTl
      .to(headline, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85, ease: "power3.out" })
      .to(intro, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65, ease: "power3.out" }, 0.1)
      .to(tabs, { opacity: 1, y: 0, duration: 0.55, stagger: 0.06, ease: "power3.out" }, 0.28);

    if (icons.length) {
      heroTl.to(icons, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" }, 0.18);
    }
    if (art) {
      heroTl.to(art, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }, 0.16);
    }

    return () => {
      heroTl.kill();
    };
  }, [pageRef]);
}
