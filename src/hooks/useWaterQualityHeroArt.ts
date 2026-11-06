import { type RefObject, useEffect } from "react";
import gsap from "gsap";

export function useWaterQualityHeroArt(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const flask = root.querySelector<SVGGeometryElement>(".wq-hero__flask");
    const shine = root.querySelector<SVGElement>(".wq-hero__shine");
    const ticks = root.querySelectorAll<SVGElement>(".wq-hero__tick");
    const water = root.querySelector<SVGElement>(".wq-hero__water");
    const meniscus = root.querySelector<SVGElement>(".wq-hero__meniscus");
    const drop = root.querySelector<SVGElement>(".wq-hero__drop-g");
    const rings = root.querySelectorAll<SVGElement>(".wq-hero__ring");
    const ripples = root.querySelectorAll<SVGElement>(".wq-hero__ripple");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const flaskLength = flask?.getTotalLength() ?? 0;

    if (prefersReducedMotion) {
      if (flask) {
        gsap.set(flask, { strokeDasharray: flaskLength, strokeDashoffset: 0, opacity: 1 });
      }
      gsap.set([shine, meniscus, water, ...ticks, ...rings], { opacity: 1 });
      gsap.set(drop, { opacity: 0, y: 0 });
      gsap.set(water, { y: 0 });
      gsap.set(ripples, { opacity: 0.16 });
      return;
    }

    if (flask) {
      gsap.set(flask, {
        strokeDasharray: flaskLength,
        strokeDashoffset: flaskLength,
        opacity: 1,
      });
    }
    gsap.set(shine, { opacity: 0 });
    gsap.set(ticks, { opacity: 0 });
    gsap.set(water, { y: 148, opacity: 0.85 });
    gsap.set(meniscus, { opacity: 0 });
    gsap.set(drop, { opacity: 0, y: -72 });
    gsap.set(rings, { opacity: 0 });
    gsap.set(ripples, { opacity: 0 });

    const tl = gsap.timeline({ delay: 0.18, defaults: { ease: "power3.out" } });

    tl.to(rings, { opacity: 0.5, duration: 0.55, stagger: 0.07 }, 0)
      .to(flask, { strokeDashoffset: 0, duration: 1.05 }, 0.06)
      .to(shine, { opacity: 0.72, duration: 0.4 }, 0.62)
      .to(ticks, { opacity: 0.88, duration: 0.35, stagger: 0.05 }, 0.7)
      .to(drop, { opacity: 1, duration: 0.22 }, 0.48)
      .to(drop, { y: 168, duration: 0.78, ease: "power2.in" }, 0.52)
      .to(drop, { opacity: 0, duration: 0.2, ease: "none" }, 1.18)
      .to(water, { y: 0, opacity: 1, duration: 0.7 }, 1.12)
      .to(meniscus, { opacity: 0.95, duration: 0.35 }, 1.28)
      .to(ripples, { opacity: 0.34, duration: 0.45, stagger: 0.08 }, 1.24)
      .to(ripples, { opacity: 0.12, duration: 0.65 }, 1.66);

    return () => {
      tl.kill();
    };
  }, [rootRef]);
}
