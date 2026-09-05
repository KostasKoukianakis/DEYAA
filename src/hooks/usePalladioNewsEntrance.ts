import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_MIN = 1025;
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

/**
 * Palladio #news — scroll-triggered anchor, intro, tabs, post copy/media entrance.
 */
export function usePalladioNewsEntrance(
  sectionRef: RefObject<HTMLElement | null>,
  postsKey = "",
) {
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

    const anchorLabel = section.querySelector<HTMLElement>(
      ".palladio-news__anchor-label",
    );
    const anchorIndex = section.querySelector<HTMLElement>(
      ".palladio-news__anchor-index",
    );
    const anchor = section.querySelector<HTMLElement>(".palladio-news__anchor");
    const intro = section.querySelector<HTMLElement>(".palladio-news__intro");
    const headline = section.querySelector<HTMLElement>(".palladio-news__headline");
    const descriptionWords = section.querySelectorAll<HTMLElement>(
      ".palladio-news__description-word",
    );
    const timelineUi = section.querySelector<HTMLElement>(
      ".palladio-news__timeline-ui",
    );
    const tabs = section.querySelectorAll<HTMLElement>(".palladio-news__tab");
    const posts = section.querySelectorAll<HTMLElement>(".palladio-news__post");
    const postCopies = section.querySelectorAll<HTMLElement>(
      ".palladio-news__post-copy",
    );
    const postImages = section.querySelectorAll<HTMLElement>(
      ".palladio-news__post-image",
    );

    const markDescriptionRevealed = () => {
      section
        .querySelector(".palladio-news__description")
        ?.classList.add("is-revealed");
    };

    if (prefersReducedMotion) {
      markDescriptionRevealed();
      return;
    }

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
      intro,
      () => {
        gsap.set(headline, { opacity: 0, y: 22 });
        gsap.set(descriptionWords, { opacity: 0, y: 8 });
      },
      () =>
        gsap
          .timeline({
            onComplete: () => {
              markDescriptionRevealed();
              gsap.set([headline, ...descriptionWords], {
                clearProps: "opacity,transform",
              });
            },
          })
          .to(headline, { opacity: 1, y: 0, duration: 0.82, ease: "power3.out" }, 0)
          .to(
            descriptionWords,
            {
              opacity: 1,
              y: 0,
              duration: 0.28,
              stagger: 0.04,
              ease: "power2.out",
            },
            0.18,
          ),
    );

    if (window.innerWidth >= DESKTOP_MIN && timelineUi && tabs.length) {
      onceEntrance(
        timelineUi,
        () => gsap.set(tabs, { opacity: 0, y: 16 }),
        () =>
          gsap.to(tabs, {
            opacity: 1,
            y: 0,
            duration: 0.58,
            stagger: 0.12,
            ease: "power3.out",
          }),
      );

      onceEntrance(
        section,
        () => {
          gsap.set(postCopies, { opacity: 0, y: 24 });
          gsap.set(postImages, { opacity: 0, scale: 1.04 });
        },
        () =>
          gsap
            .timeline()
            .to(
              postCopies,
              {
                opacity: 1,
                y: 0,
                duration: 0.72,
                stagger: 0.14,
                ease: "power3.out",
              },
              0.35,
            )
            .to(
              postImages,
              {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.14,
                ease: "power2.out",
              },
              0.42,
            ),
      );
    }

    if (window.innerWidth < DESKTOP_MIN) {
      posts.forEach((post, index) => {
        const copy = post.querySelector<HTMLElement>(".palladio-news__post-copy");
        const image = post.querySelector<HTMLElement>(".palladio-news__post-image");

        onceEntrance(
          post,
          () => {
            if (copy) gsap.set(copy, { opacity: 0, y: 28 });
            if (image) gsap.set(image, { opacity: 0, y: 20 });
          },
          () => {
            const tl = gsap.timeline();
            if (copy) {
              tl.to(copy, { opacity: 1, y: 0, duration: 0.72, ease: "power3.out" }, 0);
            }
            if (image) {
              tl.to(
                image,
                { opacity: 1, y: 0, duration: 0.78, ease: "power2.out" },
                0.12,
              );
            }
            return tl;
          },
        );
      });
    }

    return () => {
      cleanups.forEach((fn) => fn());
      section
        .querySelector(".palladio-news__description")
        ?.classList.remove("is-revealed");
    };
  }, [sectionRef, postsKey]);
}
