import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { WireframePipeValve } from "@/components/WireframePipeValve";

gsap.registerPlugin(ScrollTrigger);

interface HeroExpandingPipeProps {
  heroRef: RefObject<HTMLElement | null>;
}

/**
 * Wireframe valve — peeks from hero bottom-left, grows into section 2 on scroll.
 */
export function HeroExpandingPipe({ heroRef }: HeroExpandingPipeProps) {
  const pipeRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const hero = heroRef.current;
    const pipe = pipeRef.current;
    if (!hero || !pipe) return;

    if (reduceMotion) {
      gsap.set(pipe, { opacity: 0.9, scale: 0.55, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(pipe, { transformOrigin: "bottom left", opacity: 0, scale: 0.2, y: 12 });

      gsap.to(pipe, {
        opacity: 0.8,
        scale: 0.26,
        y: 0,
        duration: 1,
        delay: 0.45,
        ease: "power2.out",
      });

      gsap.fromTo(
        pipe,
        { scale: 0.26, y: 0, opacity: 0.8 },
        {
          scale: 0.88,
          y: "20vh",
          opacity: 1,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        }
      );
    }, pipe);

    return () => ctx.revert();
  }, [heroRef, reduceMotion]);

  return (
    <div
      className="pointer-events-none absolute z-[6] w-[min(280px,72vw)] sm:w-[min(320px,58vw)] md:w-[min(360px,42vw)]"
      style={{
        left: "clamp(0px, 2vw, 1.5rem)",
        top: "100svh",
        transform: "translateY(-100%)",
      }}
      aria-hidden
    >
      <div ref={pipeRef} className="origin-bottom-left will-change-transform">
        <WireframePipeValve width="100%" title="" />
      </div>
    </div>
  );
}
