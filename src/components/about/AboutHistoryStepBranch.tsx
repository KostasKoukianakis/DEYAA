import { PipeElbowDownRight, PipeSurface } from "@/components/HeroPipeParts";
import { cn } from "@/lib/utils";

interface AboutHistoryStepBranchProps {
  direction: "top" | "bottom";
}

/** Trunk socket → vertical riser → elbow → horizontal feed into milestone card */
export function AboutHistoryStepBranch({ direction }: AboutHistoryStepBranchProps) {
  const isUp = direction === "top";

  return (
    <div
      className={cn(
        "about-history__step-branch",
        isUp ? "about-history__step-branch--up" : "about-history__step-branch--down",
      )}
    >
      <div className="about-history__step-branch-base" aria-hidden>
        <PipeSurface />
      </div>
      <div className="about-history__step-branch-vert-grow" aria-hidden>
        <div className="about-history__step-branch-vert">
          <PipeSurface />
        </div>
      </div>
      <div className="about-history__step-branch-elbow" aria-hidden>
        <PipeElbowDownRight
          className={cn(isUp && "about-history__step-branch-elbow__glyph--flip")}
        />
      </div>
      <div className="about-history__step-branch-feed-grow" aria-hidden>
        <div className="about-history__step-branch-feed">
          <PipeSurface flowClassName="hero-water-spine__flow--horizontal" />
        </div>
      </div>
    </div>
  );
}
