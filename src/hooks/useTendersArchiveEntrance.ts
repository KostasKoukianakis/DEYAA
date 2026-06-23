import { RefObject, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseTendersArchiveEntranceOptions {
  mastheadRef: RefObject<HTMLElement | null>;
  toolbarRef: RefObject<HTMLElement | null>;
  listRef: RefObject<HTMLElement | null>;
  listReady: boolean;
  listAnimationKey: string;
}

/**
 * Tenders procurement page — masthead on load, toolbar on scroll, cards/table on scroll.
 */
export function useTendersArchiveEntrance({
  mastheadRef,
  toolbarRef,
  listRef,
  listReady,
  listAnimationKey,
}: UseTendersArchiveEntranceOptions) {
  const mastheadPlayedRef = useRef(false);
  const toolbarPlayedRef = useRef(false);
  const lastListKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const cleanups: Array<() => void> = [];

    const masthead = mastheadRef.current;
    if (masthead && !mastheadPlayedRef.current) {
      mastheadPlayedRef.current = true;

      const targets = masthead.querySelectorAll<HTMLElement>(
        ".deyaa-procurement__masthead-eyebrow, .deyaa-procurement__masthead-title, .deyaa-procurement__masthead-desc, .deyaa-procurement__kpi-strip, .deyaa-procurement__howto, .deyaa-procurement__portal-card",
      );

      if (prefersReducedMotion) {
        gsap.set(targets, { clearProps: "all" });
      } else {
        gsap.set(targets, { opacity: 0, y: 20 });
        const tl = gsap.timeline({ delay: 0.08, defaults: { ease: "power3.out" } });
        tl.to(targets, { opacity: 1, y: 0, duration: 0.65, stagger: 0.06 });
        cleanups.push(() => tl.kill());
      }
    }

    const toolbar = toolbarRef.current;
    if (toolbar && !toolbarPlayedRef.current) {
      toolbarPlayedRef.current = true;

      const search = toolbar.querySelector<HTMLElement>(".deyaa-procurement__search");
      const filters = toolbar.querySelector<HTMLElement>(".deyaa-procurement__toolbar-filters");
      const results = toolbar.querySelector<HTMLElement>(".deyaa-procurement__results-bar");

      if (prefersReducedMotion) {
        gsap.set([search, filters, results].filter(Boolean), { clearProps: "all" });
      } else {
        if (search) gsap.set(search, { opacity: 0, y: 10 });
        if (filters) gsap.set(filters, { opacity: 0, y: 10 });
        if (results) gsap.set(results, { opacity: 0 });

        let played = false;
        let tl: gsap.core.Timeline | null = null;

        const play = () => {
          if (played) return;
          played = true;
          tl?.kill();
          tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          if (search) tl.to(search, { opacity: 1, y: 0, duration: 0.45 });
          if (filters) tl.to(filters, { opacity: 1, y: 0, duration: 0.45 }, "-=0.3");
          if (results) tl.to(results, { opacity: 1, duration: 0.4 }, "-=0.25");
        };

        const st = ScrollTrigger.create({
          trigger: toolbar,
          start: "top 95%",
          once: true,
          onEnter: play,
        });

        requestAnimationFrame(() => {
          const rect = toolbar.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.95) play();
        });

        cleanups.push(() => {
          st.kill();
          tl?.kill();
        });
      }
    }

    if (listReady && listRef.current && lastListKeyRef.current !== listAnimationKey) {
      lastListKeyRef.current = listAnimationKey;

      const inners = listRef.current.querySelectorAll<HTMLElement>(
        ".deyaa-procurement__card-inner, .deyaa-procurement__table-row-inner",
      );

      if (!inners.length) return () => cleanups.forEach((fn) => fn());

      if (prefersReducedMotion) {
        gsap.set(inners, { clearProps: "all" });
      } else {
        gsap.set(inners, { opacity: 0, y: 16 });

        let played = false;
        let tl: gsap.core.Timeline | null = null;

        const play = () => {
          if (played) return;
          played = true;
          tl?.kill();
          tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(inners, { opacity: 1, y: 0, duration: 0.5, stagger: 0.04 });
        };

        const st = ScrollTrigger.create({
          trigger: listRef.current,
          start: "top 88%",
          once: true,
          onEnter: play,
        });

        requestAnimationFrame(() => {
          const rect = listRef.current!.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.88) play();
        });

        cleanups.push(() => {
          st.kill();
          tl?.kill();
        });
      }
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [mastheadRef, toolbarRef, listRef, listReady, listAnimationKey]);
}
