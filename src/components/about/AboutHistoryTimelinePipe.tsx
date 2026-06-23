import { PipeElbowDownRight, PipeSurface } from "@/components/HeroPipeParts";

/** L-pipe on timeline axis — vertical ↓ → right → horizontal; exit ↓ at end. */
export function AboutHistoryTimelinePipe() {
  return (
    <div className="about-history-timeline-pipe" aria-hidden>
      <div className="about-history-timeline-pipe__grow">
        <div className="about-history-timeline-pipe__vert">
          <PipeSurface />
        </div>
      </div>
      <div className="about-history-timeline-pipe__corner">
        <PipeElbowDownRight />
      </div>
      <div className="about-history-timeline-pipe__horiz">
        <PipeSurface flowClassName="hero-water-spine__flow--horizontal" />
      </div>
      <div className="about-history-timeline-pipe__corner-end">
        <PipeElbowDownRight className="about-history-timeline-pipe__elbow-end-glyph" />
        <div className="about-history-timeline-pipe__exit-grow">
          <div className="about-history-timeline-pipe__exit-vert">
            <PipeSurface />
          </div>
          <div className="about-history-timeline-pipe__exit-base" aria-hidden>
            <div className="about-history-timeline-pipe__exit-coupling">
              <PipeSurface />
            </div>
          </div>
          <span className="about-history-timeline-pipe__exit-tip" aria-hidden />
        </div>
      </div>
    </div>
  );
}
