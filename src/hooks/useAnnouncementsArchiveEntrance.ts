import { RefObject, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseAnnouncementsArchiveEntranceOptions {
  heroRef: RefObject<HTMLElement | null>;
  filtersRef: RefObject<HTMLElement | null>;
}

/**
 * Announcements archive — hero copy on load, filters + list on scroll.
 */
export function useAnnouncementsArchiveEntrance({
  heroRef,
  filtersRef,
}: UseAnnouncementsArchiveEntranceOptions) {
  const heroPlayedRef = useRef(false);
  const filtersPlayedRef = useRef(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const title = hero.querySelector<HTMLElement>(".palladio-news-archive__title");
    const desc = hero.querySelector<HTMLElement>(".palladio-news-archive__hero-desc");

    const cleanups: Array<() => void> = [];

    if (!heroPlayedRef.current) {
      heroPlayedRef.current = true;

      if (prefersReducedMotion) {
        gsap.set([title, desc].filter(Boolean), { clearProps: "all" });
      } else {
        const heroTargets = [title, desc].filter(Boolean) as HTMLElement[];
        gsap.set(heroTargets, { opacity: 0, y: 36 });

        const heroTl = gsap.timeline({ delay: 0.14, defaults: { ease: "power3.out" } });

        if (title) {
          heroTl.to(title, { opacity: 1, y: 0, duration: 0.95 });
        }
        if (desc) {
          heroTl.to(desc, { opacity: 1, y: 0, duration: 0.75 }, "-=0.55");
        }

        cleanups.push(() => {
          heroTl.kill();
        });
      }
    }

    const filters = filtersRef.current;
    const filtersLabel = filters?.querySelector<HTMLElement>(
      ".palladio-news-archive__filters-label",
    );
    const pills = filters?.querySelectorAll<HTMLElement>(
      ".palladio-news-archive__pill",
    );

    if (filters && !filtersPlayedRef.current) {
      filtersPlayedRef.current = true;

      if (prefersReducedMotion) {
        gsap.set([filtersLabel, ...(pills ?? [])].filter(Boolean), { clearProps: "all" });
      } else {
        if (filtersLabel) gsap.set(filtersLabel, { opacity: 0, x: -16 });
        if (pills?.length) gsap.set(pills, { opacity: 0, y: 14 });

        let filtersTl: gsap.core.Timeline | null = null;

        let filtersAnimated = false;

        const playFilters = () => {
          if (filtersAnimated) return;
          filtersAnimated = true;
          filtersTl?.kill();
          filtersTl = gsap.timeline({ defaults: { ease: "power3.out" } });
          if (filtersLabel) {
            filtersTl.to(filtersLabel, { opacity: 1, x: 0, duration: 0.55 });
          }
          if (pills?.length) {
            filtersTl.to(
              pills,
              { opacity: 1, y: 0, duration: 0.48, stagger: 0.055 },
              filtersLabel ? "-=0.3" : 0,
            );
          }
        };

        const filtersSt = ScrollTrigger.create({
          trigger: filters,
          start: "top 92%",
          once: true,
          onEnter: playFilters,
        });

        requestAnimationFrame(() => {
          const rect = filters.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.92) playFilters();
        });

        cleanups.push(() => {
          filtersSt.kill();
          filtersTl?.kill();
        });
      }
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [heroRef, filtersRef]);
}
