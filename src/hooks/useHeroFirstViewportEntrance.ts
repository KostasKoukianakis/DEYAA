import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  HERO_ENTRANCE,
  HERO_ENTRANCE_SELECTORS as SEL,
  HERO_PIPE_GROW,
} from "@/lib/heroEntrance";

gsap.registerPlugin(ScrollTrigger);

const CORNER_SELECTORS = [
  SEL.rightSegC1,
  SEL.rightSegC2,
  SEL.leftElbowC,
] as const;

function revealEntranceEndState(root: HTMLElement) {
  gsap.set(
    [
      SEL.rightBase,
      SEL.rightSegH1,
      ...CORNER_SELECTORS,
      SEL.rightSegV,
      SEL.rightSegH2,
      SEL.leftBase,
      SEL.leftFoot,
      SEL.leftRun,
      SEL.leftElbowH,
      SEL.leftElbowV,
      SEL.station,
      SEL.stationSideStubA,
      SEL.stationSideStubB,
      SEL.stationDownStub,
      SEL.ui,
      SEL.shaderScene,
      SEL.brand,
      SEL.nav,
    ],
    {
      autoAlpha: 1,
      opacity: 1,
      visibility: "visible",
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      y: 0,
    },
  );

  root.classList.remove("hero-entrance-pending");
  root.classList.add("hero-entrance-done", "hero-entrance-brand-ripple");

  const navEl = document.querySelector<HTMLElement>(SEL.nav);
  if (navEl) gsap.set(navEl, { clearProps: "transform" });

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

/** Orchestrates first 100vh load: shader → ΔΕΥΑΑ → navbar → station → pipes → UI */
export function useHeroFirstViewportEntrance(enabled = true, onComplete?: () => void) {
  useLayoutEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let ctx: gsap.Context | undefined;
    let timeline: gsap.core.Timeline | undefined;

    const run = () => {
      if (cancelled) return;

      const root = document.querySelector<HTMLElement>(SEL.root);
      if (!root) return;

      root.classList.remove("hero-pre-entrance-hidden");

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const finish = () => {
        revealEntranceEndState(root);
        onComplete?.();
      };

      if (reduced) {
        finish();
        return;
      }

      root.classList.add("hero-entrance-pending");
      root.classList.remove("hero-entrance-done", "hero-entrance-brand-ripple");

      const nav = document.querySelector<HTMLElement>(SEL.nav);
      const brand = root.querySelector<HTMLElement>(SEL.brand);
      const station = root.querySelector<HTMLElement>(SEL.station);
      const shaderScene = root.querySelector<HTMLElement>(SEL.shaderScene);

      if (!brand || !station || !shaderScene) {
        finish();
        return;
      }

      const grow = HERO_PIPE_GROW;

      ctx = gsap.context(() => {
        gsap.set(shaderScene, { opacity: 0 });
        gsap.set(brand, { opacity: 0, scale: 0.88, transformOrigin: "50% 50%" });
        if (nav) gsap.set(nav, { opacity: 0, y: -14 });
        gsap.set(SEL.station, {
          opacity: 0,
          scale: 0.84,
          transformOrigin: "50% 50%",
        });

        gsap.set(SEL.rightBase, { autoAlpha: 0 });
        gsap.set(SEL.rightSegH1, {
          scaleX: 0,
          autoAlpha: 1,
          transformOrigin: "100% 50%",
          ...grow,
        });
        gsap.set(CORNER_SELECTORS, { autoAlpha: 0, visibility: "hidden" });
        gsap.set(SEL.rightSegV, {
          scaleY: 0,
          autoAlpha: 1,
          transformOrigin: "50% 0%",
          ...grow,
        });
        gsap.set(SEL.rightSegH2, {
          scaleX: 0,
          autoAlpha: 1,
          transformOrigin: "100% 50%",
          ...grow,
        });
        gsap.set(SEL.stationSideStubA, {
          scaleY: 0,
          opacity: 0,
          transformOrigin: "50% 100%",
          ...grow,
        });
        gsap.set(SEL.stationSideStubB, {
          scaleX: 0,
          opacity: 0,
          transformOrigin: "0% 50%",
          ...grow,
        });
        gsap.set(SEL.stationDownStub, {
          scaleY: 0,
          opacity: 0,
          transformOrigin: "50% 0%",
          ...grow,
        });
        gsap.set(SEL.leftBase, { autoAlpha: 0 });
        gsap.set(SEL.leftRun, {
          scaleY: 0,
          autoAlpha: 1,
          transformOrigin: "50% 0%",
          ...grow,
        });
        gsap.set(SEL.leftFoot, { autoAlpha: 0 });
        gsap.set(SEL.leftElbowH, {
          scaleX: 0,
          autoAlpha: 1,
          transformOrigin: "0% 50%",
          ...grow,
        });
        gsap.set(SEL.leftElbowV, {
          scaleY: 0,
          autoAlpha: 1,
          transformOrigin: "50% 0%",
          ...grow,
        });
        gsap.set(SEL.ui, { opacity: 0, y: 18 });

        const t = HERO_ENTRANCE;
        timeline = gsap.timeline({
          paused: true,
          delay: 0.06,
          onComplete: finish,
        });

        timeline
          .to(shaderScene, {
            opacity: 1,
            duration: t.shader,
            ease: "power2.out",
          })
          .to(
            brand,
            {
              opacity: 1,
              scale: 1,
              duration: t.brand,
              ease: "power2.out",
              onComplete: () => {
                root.classList.add("hero-entrance-brand-ripple");
              },
            },
            `-=0.04`,
          );

        if (nav) {
          timeline.to(
            nav,
            { opacity: 1, y: 0, duration: t.nav, ease: "power2.out" },
            `+=${t.brandToNav}`,
          );
        }

        timeline
          .to(
            SEL.station,
            { opacity: 1, scale: 1, duration: t.station, ease: "power2.out" },
            `+=${t.navToStation}`,
          )
          .to(
            SEL.stationSideStubB,
            {
              scaleX: 1,
              opacity: 1,
              duration: t.station,
              ...grow,
            },
            "<",
          )
          .to(
            SEL.stationSideStubA,
            {
              scaleY: 1,
              opacity: 1,
              duration: t.station,
              ...grow,
            },
            "<",
          )
          .to(
            SEL.stationDownStub,
            {
              scaleY: 1,
              opacity: 1,
              duration: t.station,
              stagger: 0.03,
              ...grow,
            },
            "<",
          );

        timeline.addLabel("pipes", `-=${t.pipesOverlap}`);

        timeline
          .to(
            SEL.rightBase,
            {
              autoAlpha: 1,
              duration: t.baseReveal,
              stagger: t.staggerBase,
              ease: "none",
            },
            "pipes",
          )
          .to(
            SEL.rightSegH1,
            {
              scaleX: 1,
              duration: t.rightHoriz,
              stagger: t.staggerPipe,
              ...grow,
            },
            "pipes+=0.02",
          )
          .to(
            CORNER_SELECTORS,
            {
              autoAlpha: 1,
              visibility: "visible",
              duration: t.cornerReveal,
              stagger: t.staggerPipe,
              ease: "power1.out",
            },
            "pipes+=0.08",
          )
          .to(
            SEL.rightSegV,
            {
              scaleY: 1,
              duration: t.rightVert,
              stagger: t.staggerPipe,
              ...grow,
            },
            "pipes+=0.12",
          )
          .to(
            SEL.rightSegH2,
            {
              scaleX: 1,
              duration: t.rightHoriz2,
              ...grow,
            },
            "pipes+=0.2",
          );

        timeline
          .to(
            SEL.leftBase,
            {
              autoAlpha: 1,
              duration: 0.01,
              stagger: 0.03,
              ease: "none",
            },
            "pipes",
          )
          .to(
            SEL.leftFoot,
            {
              autoAlpha: 1,
              duration: 0.01,
              stagger: 0.03,
              ease: "none",
            },
            "pipes",
          )
          .to(
            SEL.leftRun,
            {
              scaleY: 1,
              duration: t.leftRun,
              stagger: t.staggerPipe,
              ...grow,
            },
            "pipes+=0.02",
          )
          .to(
            SEL.leftElbowH,
            {
              scaleX: 1,
              duration: t.leftElbowH,
              ...grow,
            },
            "pipes+=0.02",
          )
          .to(
            SEL.leftElbowV,
            {
              scaleY: 1,
              duration: t.leftElbowV,
              ...grow,
            },
            "pipes+=0.02",
          )
          .to(
            SEL.leftElbowC,
            {
              autoAlpha: 1,
              visibility: "visible",
              duration: t.cornerReveal,
              ease: "power1.out",
            },
            `pipes+=${t.leftElbowH * 0.65}`,
          )
          .to(
            SEL.ui,
            {
              opacity: 1,
              y: 0,
              duration: t.ui,
              stagger: 0.1,
              ease: "power2.out",
            },
            "pipes+=0.28",
          );

        timeline.play(0);
      }, root);
    };

    const frame = window.requestAnimationFrame(run);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      timeline?.kill();
      ctx?.revert();
      const root = document.querySelector<HTMLElement>(SEL.root);
      root?.classList.remove(
        "hero-entrance-pending",
        "hero-entrance-done",
        "hero-entrance-brand-ripple",
        "hero-pre-entrance-hidden",
      );
    };
  }, [enabled, onComplete]);
}
