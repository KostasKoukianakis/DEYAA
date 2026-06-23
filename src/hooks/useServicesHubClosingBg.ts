import { RefObject, useEffect } from "react";
import gsap from "gsap";

const POP_DURATION = 0.68;
const POP_SCALE_END = 0.75;
const POP_SCALE_START = 1.05;
const POP_OPACITY = 1;
const POP_GAP = 0.38;
const REVEAL_DURATION = 1.15;
const REVEAL_CLIP_START = "inset(50% 50% 50% 50%)";
const REVEAL_CLIP_END = "inset(0% 0% 0% 0%)";

const SLOT_SELECTOR = ".palladio-services-hub__closing-bg-slot";
const REVEAL_SLOT_SELECTOR = ".palladio-services-hub__closing-bg-slot--reveal";
const REVEALED_CLASS = "is-revealed";

type ClosingBgController = {
  play: () => void;
  stop: () => void;
};

const controllers = new WeakMap<HTMLElement, ClosingBgController>();

/** Start closing background pop-in (e.g. when horizontal scroll reaches closing). */
export function playServicesHubClosingBg(root: HTMLElement | null | undefined) {
  if (!root) return;
  controllers.get(root)?.play();
}

function finishReveal(revealSlot: HTMLElement, popSlots: HTMLElement[]) {
  gsap.set(revealSlot, {
    clipPath: "none",
    webkitClipPath: "none",
    opacity: POP_OPACITY,
    scale: POP_SCALE_END,
  });
  revealSlot.classList.add(REVEALED_CLASS);
  popSlots.forEach((slot) => slot.classList.add(REVEALED_CLASS));
}

function createPopIn(slots: HTMLElement[]): ClosingBgController {
  let timeline: gsap.core.Timeline | null = null;
  let playing = false;
  let finished = false;

  const revealSlot =
    slots.find((slot) => slot.matches(REVEAL_SLOT_SELECTOR)) ??
    slots[slots.length - 1];
  const popSlots = slots.filter((slot) => slot !== revealSlot);

  const reset = () => {
    popSlots.forEach((slot) => slot.classList.remove(REVEALED_CLASS));
    revealSlot.classList.remove(REVEALED_CLASS);

    gsap.set(popSlots, {
      opacity: 0,
      scale: POP_SCALE_START,
      zIndex: 0,
      transformOrigin: "center center",
      clipPath: "none",
      webkitClipPath: "none",
    });

    gsap.set(revealSlot, {
      opacity: POP_OPACITY,
      scale: POP_SCALE_END,
      zIndex: slots.length,
      transformOrigin: "center center",
      clipPath: REVEAL_CLIP_START,
      webkitClipPath: REVEAL_CLIP_START,
    });
  };

  return {
    play() {
      if (finished || playing) return;
      playing = true;
      timeline?.kill();
      reset();

      popSlots.forEach((slot, index) => {
        gsap.set(slot, { zIndex: index + 1 });
      });

      timeline = gsap.timeline({
        onComplete: () => {
          playing = false;
          finished = true;
          finishReveal(revealSlot, popSlots);
        },
      });

      if (popSlots.length) {
        timeline.fromTo(
          popSlots,
          { opacity: 0, scale: POP_SCALE_START },
          {
            opacity: POP_OPACITY,
            scale: POP_SCALE_END,
            duration: POP_DURATION,
            stagger: POP_GAP,
            ease: "power3.out",
          },
          0,
        );
      }

      const revealAt = popSlots.length * POP_GAP;

      timeline.fromTo(
        revealSlot,
        {
          clipPath: REVEAL_CLIP_START,
          webkitClipPath: REVEAL_CLIP_START,
        },
        {
          clipPath: REVEAL_CLIP_END,
          webkitClipPath: REVEAL_CLIP_END,
          duration: REVEAL_DURATION,
          ease: "power3.inOut",
        },
        revealAt,
      );
    },
    stop() {
      if (finished) return;
      playing = false;
      timeline?.kill();
      timeline = null;
      reset();
    },
  };
}

/**
 * 03_e–03_b: staggered pop. 03_a: center-out clip reveal (no pop).
 */
export function useServicesHubClosingBg(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const slots = Array.from(
      root.querySelectorAll<HTMLElement>(SLOT_SELECTOR),
    );
    if (!slots.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const revealSlot =
      slots.find((slot) => slot.matches(REVEAL_SLOT_SELECTOR)) ??
      slots[slots.length - 1];
    const popSlots = slots.filter((slot) => slot !== revealSlot);

    if (prefersReducedMotion) {
      slots.forEach((slot, index) => {
        gsap.set(slot, {
          opacity: POP_OPACITY,
          scale: POP_SCALE_END,
          zIndex: index + 1,
          clipPath: "none",
          webkitClipPath: "none",
        });
      });
      finishReveal(revealSlot, popSlots);
      return;
    }

    const controller = createPopIn(slots);
    controllers.set(root, controller);
    controller.stop();

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          controller.play();
        }
      },
      { threshold: [0, 0.15, 0.35] },
    );

    observer.observe(root);

    return () => {
      observer.disconnect();
      controller.stop();
      controllers.delete(root);
      slots.forEach((slot) => slot.classList.remove(REVEALED_CLASS));
    };
  }, [rootRef]);
}
