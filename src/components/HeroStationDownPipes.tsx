import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PipeElbowDownRight, PipeSurface } from "@/components/HeroPipeParts";
import { HERO_DOWN_PIPE_SCROLL } from "@/lib/heroRightPipePaths";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface HeroStationDownPipesProps {
  className?: string;
  scrollTriggerId?: string;
}

/** Vertical from yellow base → 90° right at ~190svh → tank inlet stubs. */
export function HeroStationDownPipes({
  className,
  scrollTriggerId = "section-01",
}: HeroStationDownPipesProps) {
  const grow1Ref = useRef<HTMLDivElement>(null);
  const grow2Ref = useRef<HTMLDivElement>(null);
  const corner1Ref = useRef<HTMLDivElement>(null);
  const corner2Ref = useRef<HTMLDivElement>(null);
  const horiz1Ref = useRef<HTMLDivElement>(null);
  const horiz2Ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const grows = [grow1Ref.current, grow2Ref.current].filter(Boolean) as HTMLDivElement[];
    const corners = [corner1Ref.current, corner2Ref.current].filter(Boolean) as HTMLDivElement[];
    const horizs = [horiz1Ref.current, horiz2Ref.current].filter(Boolean) as HTMLDivElement[];
    if (grows.length !== 2 || corners.length !== 2 || horizs.length !== 2) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(grows, { scaleY: 1 });
      gsap.set(corners, { autoAlpha: 1 });
      gsap.set(horizs, { scaleX: 1 });
      return;
    }

    gsap.set(grows, {
      scaleY: 0,
      xPercent: -50,
      transformOrigin: "top center",
      force3D: true,
    });
    gsap.set(corners, { autoAlpha: 0 });
    gsap.set(horizs, {
      scaleX: 0,
      transformOrigin: "left center",
      force3D: true,
    });
  }, []);

  useEffect(() => {
    const trigger = document.getElementById(scrollTriggerId);
    const grows = [grow1Ref.current, grow2Ref.current].filter(Boolean) as HTMLDivElement[];
    const corners = [corner1Ref.current, corner2Ref.current].filter(Boolean) as HTMLDivElement[];
    const horizs = [horiz1Ref.current, horiz2Ref.current].filter(Boolean) as HTMLDivElement[];
    if (!trigger || grows.length !== 2 || corners.length !== 2 || horizs.length !== 2) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const vh = () => window.innerHeight;

    const vertTween = gsap.to(grows, {
      scaleY: 1,
      xPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger,
        start: "top top",
        end: () => `+=${vh() * HERO_DOWN_PIPE_SCROLL.vertDurationVh}`,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    const cornerTween = gsap.to(corners, {
      autoAlpha: 1,
      ease: "none",
      scrollTrigger: {
        trigger,
        start: () =>
          `top+=${vh() * (HERO_DOWN_PIPE_SCROLL.vertDurationVh - HERO_DOWN_PIPE_SCROLL.cornerRevealVh)} top`,
        end: () => `top+=${vh() * HERO_DOWN_PIPE_SCROLL.vertDurationVh} top`,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    const horizTween = gsap.to(horizs, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger,
        start: () => `top+=${vh() * HERO_DOWN_PIPE_SCROLL.horizStartVh} top`,
        end: () => `+=${vh() * HERO_DOWN_PIPE_SCROLL.horizDurationVh}`,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);
    window.addEventListener("resize", refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      window.removeEventListener("load", refresh);
      vertTween.scrollTrigger?.kill();
      vertTween.kill();
      cornerTween.scrollTrigger?.kill();
      cornerTween.kill();
      horizTween.scrollTrigger?.kill();
      horizTween.kill();
    };
  }, [scrollTriggerId]);

  return (
    <div className={cn("hero-station-down-pipes", className)} aria-hidden>
      <div className="hero-station-down-pipes__run hero-station-down-pipes__run--1">
        <div ref={grow1Ref} className="hero-station-down-pipes__grow">
          <div className="hero-station-down-pipes__vert">
            <PipeSurface />
          </div>
        </div>
        <div ref={corner1Ref} className="hero-station-down-pipes__corner" aria-hidden>
          <PipeElbowDownRight />
        </div>
        <div ref={horiz1Ref} className="hero-station-down-pipes__horiz">
          <PipeSurface flowClassName="hero-water-spine__flow--horizontal" />
        </div>
      </div>

      <div className="hero-station-down-pipes__run hero-station-down-pipes__run--2">
        <div ref={grow2Ref} className="hero-station-down-pipes__grow">
          <div className="hero-station-down-pipes__vert">
            <PipeSurface />
          </div>
        </div>
        <div ref={corner2Ref} className="hero-station-down-pipes__corner" aria-hidden>
          <PipeElbowDownRight />
        </div>
        <div ref={horiz2Ref} className="hero-station-down-pipes__horiz">
          <PipeSurface flowClassName="hero-water-spine__flow--horizontal" />
        </div>
      </div>
    </div>
  );
}
