import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PipeAnchor, PipeSurface } from "@/components/HeroPipeParts";
import { HeroPipeValveWheel } from "@/components/HeroPipeValveWheel";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface HeroWaterSpineProps {
  className?: string;
  scrollTriggerId?: string;
}

interface WaterPipeProps {
  pipeRef: RefObject<HTMLDivElement | null>;
  className?: string;
}

function WaterPipe({ pipeRef, className }: WaterPipeProps) {
  return (
    <div ref={pipeRef} className={cn("hero-water-spine__pipe", className)}>
      <PipeAnchor className="hero-entrance-left-base" />
      <div className="hero-water-spine__pipe-foot hero-entrance-left-foot" aria-hidden>
        <div className="hero-water-spine__pipe-foot-ring" />
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="hero-water-spine__pipe-foot-bolt" />
        ))}
      </div>
      <div className="hero-water-spine__pipe-run hero-entrance-left-run">
        <PipeSurface />
      </div>
    </div>
  );
}

interface PipeClusterProps {
  className?: string;
  pipeARef: RefObject<HTMLDivElement | null>;
  pipeBRef: RefObject<HTMLDivElement | null>;
}

function PipeCluster({ className, pipeARef, pipeBRef }: PipeClusterProps) {
  return (
    <div className={cn("hero-water-spine__cluster", className)}>
      <WaterPipe pipeRef={pipeARef} className="hero-water-spine__pipe--a" />
      <WaterPipe pipeRef={pipeBRef} className="hero-water-spine__pipe--b" />
    </div>
  );
}

function ElbowPipe({ motionRef }: { motionRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div className="hero-water-spine__elbow">
      <div ref={motionRef} className="hero-water-spine__elbow-motion">
        <div className="hero-water-spine__elbow-arm hero-water-spine__elbow-arm--h hero-entrance-left-elbow-h">
          <PipeSurface flowClassName="hero-water-spine__flow--horizontal" />
        </div>
        <div className="hero-water-spine__elbow-corner hero-entrance-left-elbow-c">
          <PipeSurface />
        </div>
        <div className="hero-water-spine__elbow-arm hero-water-spine__elbow-arm--v hero-entrance-left-elbow-v">
          <div className="hero-water-spine__elbow-arm-inner">
            <PipeSurface />
          </div>
          <div className="hero-water-spine__valve hero-water-spine__valve--side">
            <HeroPipeValveWheel />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Twin vertical pipes (Z-mount cap + run) + foreground L-pipe */
export function HeroWaterSpine({
  className,
  scrollTriggerId = "section-01",
}: HeroWaterSpineProps) {
  const pipeARef = useRef<HTMLDivElement>(null);
  const pipeBRef = useRef<HTMLDivElement>(null);
  const elbowMotionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = document.getElementById(scrollTriggerId);
    const pipeA = pipeARef.current;
    const pipeB = pipeBRef.current;
    const elbow = elbowMotionRef.current;
    if (!trigger || !pipeA || !pipeB || !elbow) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const vh = () => window.innerHeight;
    const scrollConfig = {
      trigger,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
    };

    const pipeScroll = (
      el: HTMLDivElement,
      speed: number,
      scrub: number,
    ) =>
      gsap.fromTo(
        el,
        { y: 0 },
        {
          y: () => -vh() * speed,
          ease: "none",
          scrollTrigger: { ...scrollConfig, scrub },
        },
      );

    const tweenA = pipeScroll(pipeA, 0.24, 1.1);
    const tweenB = pipeScroll(pipeB, 0.42, 1.45);
    const tweenElbow = gsap.fromTo(
      elbow,
      { y: 0 },
      {
        y: () => -vh() * 0.14,
        ease: "none",
        scrollTrigger: { ...scrollConfig, scrub: 0.75 },
      },
    );

    return () => {
      tweenA.scrollTrigger?.kill();
      tweenA.kill();
      tweenB.scrollTrigger?.kill();
      tweenB.kill();
      tweenElbow.scrollTrigger?.kill();
      tweenElbow.kill();
    };
  }, [scrollTriggerId]);

  return (
    <>
      <div className={cn("hero-water-spine", className)} aria-hidden>
        <PipeCluster
          className="hero-water-spine__cluster--left"
          pipeARef={pipeARef}
          pipeBRef={pipeBRef}
        />
        <ElbowPipe motionRef={elbowMotionRef} />
      </div>
    </>
  );
}
