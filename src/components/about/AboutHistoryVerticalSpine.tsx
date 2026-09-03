import { PipeElbowDownRight, PipeSurface } from "@/components/HeroPipeParts";

/** Vertical trunk for mobile/tablet timeline — grows downward on scroll. */
export function AboutHistoryVerticalSpine() {
  return (
    <div className="about-history-vertical-spine" aria-hidden>
      <div className="about-history-vertical-spine__coupling about-history-vertical-spine__coupling--top">
        <PipeSurface />
      </div>
      <div className="about-history-vertical-spine__grow">
        <div className="about-history-vertical-spine__tube">
          <PipeSurface />
        </div>
      </div>
      <div className="about-history-vertical-spine__exit">
        <div className="about-history-vertical-spine__exit-corner">
          <PipeElbowDownRight />
        </div>
        <div className="about-history-vertical-spine__exit-feed-grow">
          <div className="about-history-vertical-spine__exit-feed">
            <PipeSurface flowClassName="hero-water-spine__flow--horizontal" />
          </div>
        </div>
        <div className="about-history-vertical-spine__exit-corner-end">
          <PipeElbowDownRight className="about-history-vertical-spine__exit-elbow-end-glyph" />
          <div className="about-history-vertical-spine__exit-drop-wrap">
            <div className="about-history-vertical-spine__exit-drop-grow">
              <div className="about-history-vertical-spine__exit-drop-vert">
                <PipeSurface />
              </div>
              <span className="about-history-vertical-spine__exit-tip" aria-hidden />
            </div>
            <div className="about-history-vertical-spine__coupling about-history-vertical-spine__coupling--bottom">
              <PipeSurface />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
