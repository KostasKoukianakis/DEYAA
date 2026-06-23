import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { PipeElbowDownLeft, PipeSurface } from "@/components/HeroPipeParts";
import { ANNOUNCEMENTS_PIPE_ENTRANCE } from "@/lib/announcementsPipeEntrance";
import { cn } from "@/lib/utils";

interface PipeRunProps {
  className?: string;
  growRef: React.RefObject<HTMLDivElement | null>;
  cornerRef: React.RefObject<HTMLDivElement | null>;
  horizRef: React.RefObject<HTMLDivElement | null>;
}

/** Twin glass pipes: navbar → vertical → 90° left → horizontal along hero base */
function PipeRun({ className, growRef, cornerRef, horizRef }: PipeRunProps) {
  return (
    <div className={cn("announcements-hero-pipes__run", className)}>
      <div ref={growRef} className="announcements-hero-pipes__grow">
        <div className="announcements-hero-pipes__vert">
          <PipeSurface />
        </div>
      </div>
      <div ref={cornerRef} className="announcements-hero-pipes__corner" aria-hidden>
        <PipeElbowDownLeft />
      </div>
      <div ref={horizRef} className="announcements-hero-pipes__horiz">
        <PipeSurface flowClassName="hero-water-spine__flow--horizontal" />
      </div>
    </div>
  );
}

function buildPipeRunTimeline(
  grow: HTMLDivElement,
  corner: HTMLDivElement,
  horiz: HTMLDivElement,
  refGrowHeight: number,
) {
  const { vertDuration, horizDuration, horizOverlap } = ANNOUNCEMENTS_PIPE_ENTRANCE;
  const vertScale = refGrowHeight > 0 ? grow.offsetHeight / refGrowHeight : 1;
  const vertDur = vertDuration * vertScale;
  const horizScale = 0.85 + Math.min(horiz.offsetWidth / 900, 0.25);
  const horizDur = horizDuration * horizScale;

  const tl = gsap.timeline();
  tl.to(grow, {
    scaleY: 1,
    duration: vertDur,
    ease: "power1.inOut",
  })
    .set(corner, { autoAlpha: 1, visibility: "visible" }, `-=${horizOverlap}`)
    .to(
      horiz,
      {
        scaleX: 1,
        duration: horizDur,
        ease: "power1.inOut",
      },
      `-=${horizOverlap}`,
    );

  return tl;
}

export function AnnouncementsHeroPipes() {
  const rootRef = useRef<HTMLDivElement>(null);
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
    if (!grows.length || !corners.length || !horizs.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(grows, { scaleY: 1 });
      gsap.set(corners, { autoAlpha: 1, visibility: "visible" });
      gsap.set(horizs, { scaleX: 1 });
      return;
    }

    gsap.set(grows, { scaleY: 0, transformOrigin: "top center", force3D: true });
    gsap.set(corners, { autoAlpha: 0, visibility: "hidden" });
    gsap.set(horizs, {
      scaleX: 0,
      transformOrigin: "right center",
      force3D: true,
    });
  }, []);

  useEffect(() => {
    const grow1 = grow1Ref.current;
    const grow2 = grow2Ref.current;
    const corner1 = corner1Ref.current;
    const corner2 = corner2Ref.current;
    const horiz1 = horiz1Ref.current;
    const horiz2 = horiz2Ref.current;
    if (!grow1 || !corner1 || !horiz1) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const refHeight = grow2?.offsetHeight ?? grow1.offsetHeight;
    const master = gsap.timeline({ delay: ANNOUNCEMENTS_PIPE_ENTRANCE.delay });

    master.add(buildPipeRunTimeline(grow1, corner1, horiz1, refHeight), 0);

    if (grow2 && corner2 && horiz2) {
      master.add(
        buildPipeRunTimeline(grow2, corner2, horiz2, refHeight),
        ANNOUNCEMENTS_PIPE_ENTRANCE.run2Stagger,
      );
    }

    return () => {
      master.kill();
    };
  }, []);

  return (
    <div ref={rootRef} className="announcements-hero-pipes" aria-hidden>
      <PipeRun
        className="announcements-hero-pipes__run--1"
        growRef={grow1Ref}
        cornerRef={corner1Ref}
        horizRef={horiz1Ref}
      />
      <PipeRun
        className="announcements-hero-pipes__run--2"
        growRef={grow2Ref}
        cornerRef={corner2Ref}
        horizRef={horiz2Ref}
      />
    </div>
  );
}
