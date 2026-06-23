import { RefObject, useEffect } from "react";
import gsap from "gsap";

export function usePaymentDashEntrance(pageRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const crumbs = page.querySelector<HTMLElement>(".dash-board__crumbs");
    const title = page.querySelector<HTMLElement>(
      ".dash-board__head .palladio-eservices__dash-hero-title",
    );
    const lead = page.querySelector<HTMLElement>(
      ".dash-board__head .palladio-eservices__dash-hero-lead",
    );
    const centerArt = page.querySelector<HTMLElement>(
      ".dash-board__center-art, .dash-board__backdrop-art",
    );
    const asideCards = page.querySelectorAll<HTMLElement>(
      ".pe-payment-dash__side-cards .pe-payment-dash__card",
    );
    const leftCards = page.querySelectorAll<HTMLElement>(
      ".pe-payment-dash__col--left .pe-payment-dash__card",
    );

    const finish = () => {
      page.classList.remove("pe-payment-entrance-pending");
      page.classList.add("pe-payment-entrance-done");
    };

    if (prefersReducedMotion) {
      finish();
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(crumbs, { opacity: 0, y: -14 });
      gsap.set(title, { opacity: 0, y: 28 });
      gsap.set(lead, { opacity: 0, y: 22 });
      gsap.set(centerArt, {
        opacity: 0,
        scale: 0.86,
        y: 32,
        transformOrigin: "50% 55%",
      });
      gsap.set(asideCards, { opacity: 0, y: 28 });
      gsap.set(leftCards, { opacity: 0, y: 24 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: finish,
      });

      tl.to(crumbs, { opacity: 1, y: 0, duration: 0.52 }, 0)
        .to(title, { opacity: 1, y: 0, duration: 0.82 }, 0.06)
        .to(lead, { opacity: 1, y: 0, duration: 0.72 }, 0.16)
        .to(
          centerArt,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.15,
            ease: "power2.out",
          },
          0.1,
        )
        .to(asideCards, { opacity: 1, y: 0, duration: 0.64, stagger: 0.09 }, 0.26)
        .to(leftCards, { opacity: 1, y: 0, duration: 0.64, stagger: 0.1 }, 0.34);

      if (centerArt) {
        tl.add(() => {
          gsap.to(centerArt, {
            y: -10,
            duration: 3.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        }, 1.05);
      }
    }, page);

    return () => {
      ctx.revert();
      page.classList.remove("pe-payment-entrance-pending", "pe-payment-entrance-done");
    };
  }, [pageRef]);
}
