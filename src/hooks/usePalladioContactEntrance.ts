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

interface PalladioContactEntranceRefs {
  contactRef: RefObject<HTMLElement | null>;
  downloadsRef: RefObject<HTMLElement | null>;
}

/**
 * Palladio #contacts — form + downloads block scroll entrances.
 */
export function usePalladioContactEntrance({
  contactRef,
  downloadsRef,
}: PalladioContactEntranceRefs) {
  useEffect(() => {
    const contact = contactRef.current;
    const downloads = downloadsRef.current;
    if (!contact && !downloads) return;

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

    if (contact) {
      const anchorLabel = contact.querySelector<HTMLElement>(
        ".palladio-contact__anchor-label",
      );
      const anchorIndex = contact.querySelector<HTMLElement>(
        ".palladio-contact__anchor-index",
      );
      const anchor = contact.querySelector<HTMLElement>(".palladio-contact__anchor");
      const headline = contact.querySelector<HTMLElement>(".palladio-contact__headline");
      const headlineCol = contact.querySelector<HTMLElement>(
        ".palladio-contact__headline-col",
      );
      const formCol = contact.querySelector<HTMLElement>(".palladio-contact__form-col");
      const formFields = contact.querySelectorAll<HTMLElement>(
        ".palladio-contact__field, .palladio-contact__checkbox",
      );
      const submitWrap = contact.querySelector<HTMLElement>(
        ".palladio-contact__submit-wrap",
      );

      onceEntrance(
        anchor,
        () => gsap.set([anchorLabel, anchorIndex].filter(Boolean), { opacity: 0, y: 14 }),
        () =>
          gsap
            .timeline()
            .to(anchorLabel, { opacity: 1, y: 0, duration: 0.62, ease: "power3.out" }, 0)
            .to(anchorIndex, { opacity: 1, y: 0, duration: 0.62, ease: "power3.out" }, 0.08),
      );

      onceEntrance(
        headlineCol,
        () => gsap.set(headline, { opacity: 0, y: 24 }),
        () =>
          gsap.to(headline, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
          }),
      );

      onceEntrance(
        formCol,
        () => {
          gsap.set(formFields, { opacity: 0, y: 20 });
          if (submitWrap) gsap.set(submitWrap, { opacity: 0, y: 16 });
        },
        () => {
          const tl = gsap.timeline();
          tl.to(
            formFields,
            {
              opacity: 1,
              y: 0,
              duration: 0.62,
              stagger: 0.07,
              ease: "power2.out",
            },
            0,
          );
          if (submitWrap) {
            tl.to(
              submitWrap,
              { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" },
              0.28,
            );
          }
          return tl;
        },
      );
    }

    if (downloads) {
      const copy = downloads.querySelector<HTMLElement>(
        ".palladio-contact-downloads__copy",
      );
      const title = downloads.querySelector<HTMLElement>(
        ".palladio-contact-downloads__title",
      );
      const descriptionWords = downloads.querySelectorAll<HTMLElement>(
        ".palladio-contact-downloads__description-word",
      );
      const ctaCol = downloads.querySelector<HTMLElement>(
        ".palladio-contact-downloads__cta-col",
      );

      const markDescriptionRevealed = () => {
        downloads
          .querySelector(".palladio-contact-downloads__description")
          ?.classList.add("is-revealed");
      };

      if (prefersReducedMotion) {
        markDescriptionRevealed();
      }

      onceEntrance(
        copy,
        () => {
          gsap.set(title, { opacity: 0, y: 22 });
          gsap.set(descriptionWords, { opacity: 0, y: 8 });
        },
        () =>
          gsap
            .timeline({
              onComplete: () => {
                markDescriptionRevealed();
                gsap.set([title, ...descriptionWords], {
                  clearProps: "opacity,transform",
                });
              },
            })
            .to(title, { opacity: 1, y: 0, duration: 0.82, ease: "power3.out" }, 0)
            .to(
              descriptionWords,
              {
                opacity: 1,
                y: 0,
                duration: 0.28,
                stagger: 0.038,
                ease: "power2.out",
              },
              0.16,
            ),
      );

      onceEntrance(
        ctaCol,
        () => gsap.set(ctaCol, { opacity: 0, y: 18 }),
        () =>
          gsap.to(ctaCol, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          }),
      );
    }

    return () => {
      cleanups.forEach((fn) => fn());
      downloads
        ?.querySelector(".palladio-contact-downloads__description")
        ?.classList.remove("is-revealed");
    };
  }, [contactRef, downloadsRef]);
}
