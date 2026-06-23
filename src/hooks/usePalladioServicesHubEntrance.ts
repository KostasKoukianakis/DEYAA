import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playServicesHubClosingBg } from "@/hooks/useServicesHubClosingBg";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_MIN = 998;
const ENTER_START = "top 86%";

function getHorizontalDistance(el: HTMLElement) {
  const viewport = document.documentElement.clientWidth;
  return Math.max(0, el.scrollWidth - viewport);
}

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

interface PalladioServicesHubEntranceRefs {
  sectionRef: RefObject<HTMLElement | null>;
  pinSectionRef?: RefObject<HTMLElement | null>;
  scrollRef?: RefObject<HTMLElement | null>;
}

/**
 * Palladio #innovation-hub — scroll-triggered intro, carousel, closing, mobile accordion.
 */
export function usePalladioServicesHubEntrance({
  sectionRef,
  pinSectionRef,
  scrollRef,
}: PalladioServicesHubEntranceRefs) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

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
          const top = triggerEl.getBoundingClientRect().top;
          if (top < window.innerHeight * 0.86) play();
        },
      });

      playIfAlreadyVisible(triggerEl, 0.86, play);

      cleanups.push(() => {
        st.kill();
        animation?.kill();
      });
    };

    const taglineEl = section.querySelector<HTMLElement>(
      ".palladio-services-hub__tagline",
    );

    if (prefersReducedMotion) {
      taglineEl?.classList.add("is-revealed");
      section.classList.add("is-entrance-ready");
      return;
    }

    /* ── Intro: anchor ── */
    const anchorBlock = section.querySelector<HTMLElement>(
      ".palladio-services-hub__intro-block--anchor",
    );
    const anchorLabel = section.querySelector<HTMLElement>(
      ".palladio-services-hub__anchor-label",
    );
    const anchorIndex = section.querySelector<HTMLElement>(
      ".palladio-services-hub__anchor-index",
    );

    onceEntrance(
      anchorBlock,
      () => gsap.set([anchorLabel, anchorIndex].filter(Boolean), { opacity: 0, y: 16 }),
      () =>
        gsap
          .timeline()
          .to(anchorLabel, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, 0)
          .to(anchorIndex, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, 0.08),
    );

    /* ── Intro: wordmark ── */
    const brandBlock = section.querySelector<HTMLElement>(
      ".palladio-services-hub__intro-block--brand",
    );
    const wordmarkLeft = section.querySelector<HTMLElement>(
      ".palladio-services-hub__wordmark-line:first-child",
    );
    const wordmarkRight = section.querySelector<HTMLElement>(
      ".palladio-services-hub__wordmark-line:last-child",
    );
    const wordmarkMark = section.querySelector<HTMLElement>(
      ".palladio-services-hub__wordmark-mark",
    );

    onceEntrance(
      brandBlock,
      () => {
        gsap.set(wordmarkLeft, { opacity: 0, x: -36 });
        gsap.set(wordmarkRight, { opacity: 0, x: 36 });
        gsap.set(wordmarkMark, {
          opacity: 0,
          scale: 0.72,
          transformOrigin: "center center",
        });
      },
      () =>
        gsap
          .timeline()
          .to(wordmarkLeft, { opacity: 1, x: 0, duration: 0.95, ease: "power3.out" }, 0)
          .to(
            wordmarkMark,
            { opacity: 1, scale: 1, duration: 0.75, ease: "back.out(1.6)" },
            0.12,
          )
          .to(wordmarkRight, { opacity: 1, x: 0, duration: 0.95, ease: "power3.out" }, 0.2),
    );

    /* ── Intro: tagline (word-by-word) ── */
    const taglineBlock = section.querySelector<HTMLElement>(
      ".palladio-services-hub__intro-block--tagline",
    );
    const taglineIcon = section.querySelector<HTMLElement>(
      ".palladio-services-hub__tagline-icon",
    );
    const taglineWords = section.querySelectorAll<HTMLElement>(
      ".palladio-services-hub__tagline-word",
    );

    onceEntrance(
      taglineBlock,
      () => {
        gsap.set(taglineIcon, { opacity: 0, y: -12 });
        gsap.set(taglineWords, { opacity: 0, y: 8 });
      },
      () =>
        gsap
          .timeline({
            onComplete: () => {
              taglineEl?.classList.add("is-revealed");
              gsap.set([taglineIcon, ...taglineWords], {
                clearProps: "opacity,transform",
              });
            },
          })
          .to(taglineIcon, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0)
          .to(
            taglineWords,
            {
              opacity: 1,
              y: 0,
              duration: 0.3,
              stagger: 0.045,
              ease: "power2.out",
            },
            0.12,
          ),
    );

    /* ── Intro: copy grid ── */
    const copyBlock = section.querySelector<HTMLElement>(
      ".palladio-services-hub__intro-block--copy",
    );
    const infoTexts = section.querySelectorAll<HTMLElement>(
      ".palladio-services-hub__info-text",
    );
    const infoCta = section.querySelector<HTMLElement>(
      ".palladio-services-hub__info-cta",
    );

    onceEntrance(
      copyBlock,
      () => {
        gsap.set(infoTexts, { opacity: 0, y: 22 });
        gsap.set(infoCta, { opacity: 0, y: 16 });
      },
      () =>
        gsap
          .timeline()
          .to(
            infoTexts,
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.14,
              ease: "power3.out",
            },
            0,
          )
          .to(infoCta, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, 0.35),
    );

    /* ── Desktop carousel lead + cards ── */
    if (window.innerWidth >= DESKTOP_MIN) {
      const pinSection = pinSectionRef?.current;
      const scrollContainer = scrollRef?.current;
      const scrollLead = section.querySelector<HTMLElement>(
        ".palladio-services-hub__scroll-lead",
      );
      const scrollLabel = section.querySelector<HTMLElement>(
        ".palladio-services-hub__scroll-label",
      );
      const cards = section.querySelectorAll<HTMLElement>(
        ".palladio-services-hub__card",
      );
      const closingPanel = section.querySelector<HTMLElement>(
        ".palladio-services-hub__scroll-closing.palladio-services-hub__closing-panel",
      );
      const closingInner = closingPanel?.querySelector<HTMLElement>(
        ".palladio-services-hub__closing-inner",
      );

      if (pinSection && scrollContainer && scrollLead && scrollLabel) {
        let carouselPlayed = false;
        let closingPlayed = false;

        gsap.set(scrollLabel, { opacity: 0, y: 18 });
        gsap.set(cards, { opacity: 0.55, scale: 0.97, transformOrigin: "center center" });
        if (closingInner) {
          gsap.set(closingInner, { opacity: 0, y: 28 });
        }

        const playCarousel = () => {
          if (carouselPlayed) return;
          carouselPlayed = true;
          gsap
            .timeline()
            .to(scrollLabel, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0)
            .to(
              cards,
              {
                opacity: 1,
                scale: 1,
                duration: 0.65,
                stagger: 0.07,
                ease: "power2.out",
              },
              0.08,
            );
        };

        const playClosing = () => {
          if (closingPlayed || !closingInner) return;
          closingPlayed = true;
          playServicesHubClosingBg(closingPanel);
          gsap.to(closingInner, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
          });
        };

        const carouselSt = ScrollTrigger.create({
          trigger: pinSection,
          start: "top top",
          end: () => `+=${getHorizontalDistance(scrollContainer)}`,
          onEnter: playCarousel,
          onUpdate(self) {
            if (self.progress >= 0.78) playClosing();
          },
          onRefresh(self) {
            if (self.progress > 0) {
              gsap.set(scrollLabel, { opacity: 1, y: 0 });
              gsap.set(cards, { opacity: 1, scale: 1 });
              carouselPlayed = true;
            }
            if (closingInner && self.progress >= 0.78) {
              playServicesHubClosingBg(closingPanel);
              gsap.set(closingInner, { opacity: 1, y: 0 });
              closingPlayed = true;
            }
          },
        });

        cleanups.push(() => {
          carouselSt.kill();
          gsap.set([scrollLabel, ...cards, closingInner].filter(Boolean), {
            clearProps: "opacity,transform",
          });
        });
      }
    }

    /* ── Mobile accordion ── */
    if (window.innerWidth < DESKTOP_MIN) {
      const accordion = section.querySelector<HTMLElement>(
        ".palladio-services-hub__accordion",
      );
      const accItems = section.querySelectorAll<HTMLElement>(
        ".palladio-services-hub__acc-item",
      );
      const accFooterInner = section.querySelector<HTMLElement>(
        ".palladio-services-hub__acc-footer .palladio-services-hub__closing-inner",
      );

      onceEntrance(
        accordion,
        () => {
          gsap.set(accItems, { opacity: 0, x: -18 });
          if (accFooterInner) {
            gsap.set(accFooterInner, { opacity: 0, y: 20 });
          }
        },
        () => {
          const tl = gsap.timeline().to(
            accItems,
            {
              opacity: 1,
              x: 0,
              duration: 0.55,
              stagger: 0.08,
              ease: "power2.out",
            },
            0,
          );
          if (accFooterInner) {
            tl.to(
              accFooterInner,
              { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" },
              0.25,
            );
          }
          return tl;
        },
      );
    }

    return () => {
      cleanups.forEach((fn) => fn());
      section.classList.remove("is-entrance-ready");
      taglineEl?.classList.remove("is-revealed");
    };
  }, [sectionRef, pinSectionRef, scrollRef]);
}
