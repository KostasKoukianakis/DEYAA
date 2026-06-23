import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ENTER_START = "top 88%";

function playIfAlreadyVisible(
  triggerEl: HTMLElement,
  threshold: number,
  play: () => void,
) {
  requestAnimationFrame(() => {
    const rect = triggerEl.getBoundingClientRect();
    if (rect.top < window.innerHeight * threshold && rect.bottom > 0) {
      play();
    }
  });
}

/**
 * Palladio footer — marquee band, logo, menus, social, legal scroll entrance.
 */
export function usePalladioFooterEntrance(
  footerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const marqueeWrap = footer.querySelector<HTMLElement>(
      ".palladio-footer__marquee-wrap",
    );
    const logoLink = footer.querySelector<HTMLElement>(".palladio-footer__logo-link");
    const infoTitle = footer.querySelector<HTMLElement>(".palladio-footer__info-title");
    const infoTexts = footer.querySelectorAll<HTMLElement>(".palladio-footer__info-text");
    const menuCols = footer.querySelectorAll<HTMLElement>(".palladio-footer__menu-col");
    const socialRow = footer.querySelector<HTMLElement>(".palladio-footer__social-row");
    const legal = footer.querySelector<HTMLElement>(".palladio-footer__legal");

    const setupHidden = () => {
      if (marqueeWrap) gsap.set(marqueeWrap, { opacity: 0, y: 18 });
      if (logoLink) gsap.set(logoLink, { opacity: 0, scale: 0.9 });
      if (infoTitle) gsap.set(infoTitle, { opacity: 0, y: 16 });
      gsap.set(infoTexts, { opacity: 0, y: 14 });
      gsap.set(menuCols, { opacity: 0, y: 20 });
      if (socialRow) gsap.set(socialRow, { opacity: 0, y: 16 });
      if (legal) gsap.set(legal, { opacity: 0, y: 12 });
    };

    const showAll = () => {
      gsap.set(
        [marqueeWrap, logoLink, infoTitle, socialRow, legal, ...infoTexts, ...menuCols].filter(
          Boolean,
        ),
        { opacity: 1, y: 0, scale: 1, clearProps: "transform" },
      );
    };

    if (prefersReducedMotion) {
      showAll();
      return;
    }

    setupHidden();

    let played = false;
    let timeline: gsap.core.Timeline | null = null;

    const play = () => {
      if (played) return;
      played = true;
      timeline?.kill();

      timeline = gsap.timeline();

      if (marqueeWrap) {
        timeline.to(
          marqueeWrap,
          { opacity: 1, y: 0, duration: 0.72, ease: "power3.out" },
          0,
        );
      }

      if (logoLink) {
        timeline.to(
          logoLink,
          { opacity: 1, scale: 1, duration: 0.78, ease: "power3.out" },
          0.1,
        );
      }

      if (infoTitle) {
        timeline.to(
          infoTitle,
          { opacity: 1, y: 0, duration: 0.62, ease: "power3.out" },
          0.2,
        );
      }

      if (infoTexts.length) {
        timeline.to(
          infoTexts,
          {
            opacity: 1,
            y: 0,
            duration: 0.58,
            stagger: 0.08,
            ease: "power2.out",
          },
          0.28,
        );
      }

      if (menuCols.length) {
        timeline.to(
          menuCols,
          {
            opacity: 1,
            y: 0,
            duration: 0.62,
            stagger: 0.1,
            ease: "power3.out",
          },
          0.38,
        );
      }

      if (socialRow) {
        timeline.to(
          socialRow,
          { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" },
          0.55,
        );
      }

      if (legal) {
        timeline.to(
          legal,
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          0.65,
        );
      }
    };

    const st = ScrollTrigger.create({
      trigger: footer,
      start: ENTER_START,
      once: true,
      onEnter: play,
      onRefresh() {
        if (played) return;
        const top = footer.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.88) play();
      },
    });

    playIfAlreadyVisible(footer, 0.88, play);

    return () => {
      st.kill();
      timeline?.kill();
    };
  }, [footerRef]);
}
