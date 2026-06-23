import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ENTER_START = "top 86%";

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

export function useEServicesHubEntrance(
  pageRef: RefObject<HTMLElement | null>,
  listId = "eservices-list",
) {
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const cleanups: Array<() => void> = [];

    const onceEntrance = (
      triggerEl: HTMLElement | null,
      setup: () => void,
      build: () => gsap.core.Animation,
    ) => {
      if (!triggerEl) return;

      let played = false;
      let animation: gsap.core.Animation | null = null;

      const play = () => {
        if (played) return;
        played = true;
        animation?.kill();
        animation = build();
      };

      setup();

      if (prefersReducedMotion) {
        play();
        return;
      }

      const st = ScrollTrigger.create({
        trigger: triggerEl,
        start: ENTER_START,
        once: true,
        onEnter: play,
        onRefresh() {
          if (played) return;
          if (triggerEl.getBoundingClientRect().top < window.innerHeight * 0.86) play();
        },
      });

      playIfAlreadyVisible(triggerEl, 0.86, play);

      cleanups.push(() => {
        st.kill();
        animation?.kill();
      });
    };

    const hero = page.querySelector<HTMLElement>(".palladio-eservices__hero");
    const headline = page.querySelector<HTMLElement>(".palladio-eservices__headline");
    const banner = page.querySelector<HTMLElement>(".palladio-eservices__banner");
    const statement = page.querySelector<HTMLElement>(".palladio-eservices__statement");
    const listItems = page.querySelectorAll<HTMLElement>(".palladio-eservices__list-item");

    if (prefersReducedMotion) {
      return;
    }

    onceEntrance(
      hero,
      () => {
        gsap.set(headline, { opacity: 0, y: 28 });
        gsap.set(banner, { opacity: 0, y: 16 });
        gsap.set(statement, { opacity: 0, y: 20 });
      },
      () =>
        gsap
          .timeline()
          .to(headline, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0)
          .to(banner, { opacity: 1, y: 0, duration: 0.72, ease: "power3.out" }, 0.12)
          .to(statement, { opacity: 1, y: 0, duration: 0.78, ease: "power3.out" }, 0.24),
    );

    onceEntrance(
      page.querySelector(`#${listId}`),
      () => gsap.set(listItems, { opacity: 0, y: 24 }),
      () =>
        gsap.to(listItems, {
          opacity: 1,
          y: 0,
          duration: 0.68,
          stagger: 0.1,
          ease: "power3.out",
        }),
    );

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [listId, pageRef]);
}
