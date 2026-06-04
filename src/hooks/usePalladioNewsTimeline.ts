import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_MIN = 768;

interface PalladioNewsTimelineRefs {
  sectionRef: RefObject<HTMLElement | null>;
  endRef: RefObject<HTMLElement | null>;
  lineRef: RefObject<HTMLElement | null>;
  postRefs: RefObject<HTMLElement | null>[];
}

/** Palladio #news — scrub timeline widens each post panel on scroll */
export function usePalladioNewsTimeline({
  sectionRef,
  endRef,
  lineRef,
  postRefs,
}: PalladioNewsTimelineRefs) {
  useEffect(() => {
    if (window.innerWidth < DESKTOP_MIN) return;

    const section = sectionRef.current;
    const end = endRef.current;
    const line = lineRef.current;
    const posts = postRefs
      .map((ref) => ref.current)
      .filter((post): post is HTMLElement => Boolean(post));

    if (!section || !end || !line || posts.length < 3) return;

    gsap.set(posts[0], { width: "75%" });
    gsap.set(posts[1], { width: "20%" });
    gsap.set(posts[2], { width: "5%" });

    const scrollConfig = {
      trigger: section,
      start: "top top",
      endTrigger: end,
      end: "top bottom",
      scrub: true,
    };

    const timeline = gsap.timeline({ scrollTrigger: scrollConfig });

    timeline.to(posts[0], { width: "0%", ease: "none", duration: 0.5 }, 0);
    timeline.to(posts[1], { width: "75%", ease: "none", duration: 0.5 }, 0);
    timeline.to(posts[2], { width: "25%", ease: "none", duration: 0.5 }, 0);

    timeline.to(posts[0], { width: "0%", ease: "none", duration: 0.5 }, 0.5);
    timeline.to(posts[1], { width: "0%", ease: "none", duration: 0.5 }, 0.5);
    timeline.to(posts[2], { width: "75%", ease: "none", duration: 0.5 }, 0.5);

    const lineTween = gsap.fromTo(
      line,
      { width: "0%" },
      {
        width: "100%",
        ease: "none",
        scrollTrigger: scrollConfig,
      },
    );

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      window.removeEventListener("load", refresh);
      timeline.scrollTrigger?.kill();
      timeline.kill();
      lineTween.scrollTrigger?.kill();
      lineTween.kill();
      posts.forEach((post) => gsap.set(post, { clearProps: "width" }));
      gsap.set(line, { clearProps: "width" });
    };
  }, [sectionRef, endRef, lineRef, postRefs]);
}
