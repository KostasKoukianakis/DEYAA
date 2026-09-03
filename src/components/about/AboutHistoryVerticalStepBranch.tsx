import { PipeSurface } from "@/components/HeroPipeParts";

/** Horizontal feed from vertical trunk into milestone card (mobile/tablet). */
export function AboutHistoryVerticalStepBranch() {
  return (
    <div className="about-history-vertical-branch" aria-hidden>
      <div className="about-history-vertical-branch__junction">
        <PipeSurface />
      </div>
      <div className="about-history-vertical-branch__feed-grow">
        <div className="about-history-vertical-branch__feed">
          <PipeSurface flowClassName="hero-water-spine__flow--horizontal" />
        </div>
      </div>
    </div>
  );
}
