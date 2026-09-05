import { RefObject, useEffect } from "react";
import gsap from "gsap";

const POP_DURATION = 0.68;
const POP_SCALE_END = 0.75;
const POP_SCALE_START = 1.05;
const POP_OPACITY = 1;
const POP_OPACITY_MOBILE = 0.4;
const POP_SCALE_END_MOBILE = 1.5;
const POP_SCALE_START_MOBILE = 2.1;
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

const MOBILE_MAX = 1024;

type PopInConfig = {
  stackOpacity?: number;
  scaleEnd?: number;
  scaleStart?: number;
};

function finishReveal(
  revealSlot: HTMLElement,
  popSlots: HTMLElement[],
  opacity = POP_OPACITY,
  scaleEnd = POP_SCALE_END,
) {
  gsap.set(revealSlot, {
    clipPath: "none",
    webkitClipPath: "none",
    opacity,
    scale: scaleEnd,
  });
  revealSlot.classList.add(REVEALED_CLASS);
  popSlots.forEach((slot) => slot.classList.add(REVEALED_CLASS));
}

function createPopIn(
  slots: HTMLElement[],
  {
    stackOpacity = POP_OPACITY,
    scaleEnd = POP_SCALE_END,
    scaleStart = POP_SCALE_START,
  }: PopInConfig = {},
): ClosingBgController {
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
      scale: scaleStart,
      zIndex: 0,
      transformOrigin: "center center",
      clipPath: "none",
      webkitClipPath: "none",
    });

    gsap.set(revealSlot, {
      opacity: stackOpacity,
      scale: scaleEnd,
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
          finishReveal(revealSlot, popSlots, stackOpacity, scaleEnd);
        },
      });

      if (popSlots.length) {
        timeline.fromTo(
          popSlots,
          { opacity: 0, scale: scaleStart },
          {
            opacity: stackOpacity,
            scale: scaleEnd,
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

    const isMobile = window.innerWidth <= MOBILE_MAX;
    const stackOpacity = isMobile ? POP_OPACITY_MOBILE : POP_OPACITY;
    const scaleEnd = isMobile ? POP_SCALE_END_MOBILE : POP_SCALE_END;
    const scaleStart = isMobile ? POP_SCALE_START_MOBILE : POP_SCALE_START;
    const popInConfig = { stackOpacity, scaleEnd, scaleStart };

    if (prefersReducedMotion) {
      slots.forEach((slot, index) => {
        gsap.set(slot, {
          opacity: stackOpacity,
          scale: scaleEnd,
          zIndex: index + 1,
          clipPath: "none",
          webkitClipPath: "none",
        });
      });
      finishReveal(revealSlot, popSlots, stackOpacity, scaleEnd);
      return;
    }

    const controller = createPopIn(slots, popInConfig);
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
