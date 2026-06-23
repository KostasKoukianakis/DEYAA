import { type RefObject } from "react";
import {
  aboutHistoryIntro,
  aboutTimelineMilestones,
  getAboutTimelineChapterScenes,
} from "@/data/aboutContent";
import { AboutHistoryTimelinePipe } from "@/components/about/AboutHistoryTimelinePipe";
import { AboutHistoryStepBranch } from "@/components/about/AboutHistoryStepBranch";
import { cn } from "@/lib/utils";

interface AboutHistorySectionProps {
  sectionRef?: RefObject<HTMLElement | null>;
  scrollRef?: RefObject<HTMLDivElement | null>;
  className?: string;
}

/** Palladio /group/ #timeline — intro panel + horizontal scrub timeline */
export function AboutHistorySection({
  sectionRef,
  scrollRef,
  className,
}: AboutHistorySectionProps) {
  const slides = aboutTimelineMilestones.reduce<
    Array<{ milestone: (typeof aboutTimelineMilestones)[number]; showChapter: boolean }>
  >((acc, milestone) => {
    const showChapter = Boolean(
      milestone.chapter && acc.every((item) => item.milestone.chapter !== milestone.chapter),
    );
    acc.push({ milestone, showChapter });
    return acc;
  }, []);

  const originChapter = aboutTimelineMilestones.find((m) => m.chapter)?.chapter;
  const originChapterId = aboutTimelineMilestones.find((m) => m.chapter)?.id;
  const chapterScenes = getAboutTimelineChapterScenes();

  return (
    <section id="about-history" className="about-history" aria-label="Ιστορία">
      <div
        ref={sectionRef}
        className={cn(
          "about-history__pin palladio-about horizontal-scroll-container",
          className,
        )}
      >
        <div className="about-history__milestone-bgs" aria-hidden>
          {chapterScenes.map((scene) => (
            <div
              key={scene.chapterId}
              className="about-history__milestone-bg"
              data-chapter-bg={scene.chapterId}
              style={{ backgroundImage: `url(${scene.image})` }}
            />
          ))}
        </div>

        <div
          ref={scrollRef}
          className="about-history__timeline palladio-horizontal-scroll horizontal-scroll"
        >
          <div className="about-history__intro-panel">
          <div className="about-history__intro-anchor palladio-about__anchor-row">
            <span className="palladio-about__anchor-label">Ιστορία</span>
            <span className="palladio-about__anchor-index">[01]</span>
          </div>

          <div className="about-history__intro-body">
            <div className="about-history__intro-copy">
              <p className="about-history__lead">{aboutHistoryIntro}</p>

              <div className="about-history__gradient-title">
                <h3 className="about-history__journey-title">
                  <span className="about-history__journey-title-line1">Το ταξίδι</span>
                  <br />
                  <span className="about-history__journey-title-line2">μας μέχρι σήμερα.</span>
                </h3>
              </div>
            </div>
          </div>

          {originChapter ? (
            <div
              className="about-history__chapter-slide about-history__chapter-slide--origin"
              data-chapter-trigger={originChapterId}
            >
              <h3 className="about-history__chapter-title">
                {originChapter.split("\n").map((line, i) => (
                  <span key={i} className="about-history__chapter-title-line">
                    {i > 0 ? <br /> : null}
                    {line}
                  </span>
                ))}
              </h3>
            </div>
          ) : null}
        </div>

        <AboutHistoryTimelinePipe />

        {slides.map(({ milestone, showChapter }) => (
          <div key={milestone.id} className="about-history__slide-group">
            {showChapter && milestone.chapter && milestone.id !== "long-effort" ? (
              <div
                className="about-history__chapter-slide"
                data-chapter-trigger={milestone.id}
              >
                <h3 className="about-history__chapter-title">
                  {milestone.chapter.split("\n").map((line, i) => (
                    <span key={i}>
                      {i > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </h3>
              </div>
            ) : null}

            <article
              className={cn(
                "about-history__step",
                milestone.align === "top" ? "about-history__step--top" : "about-history__step--bottom",
              )}
            >
              <div className="about-history__step-marker" aria-hidden>
                <AboutHistoryStepBranch direction={milestone.align} />
              </div>
              <div className="about-history__step-content">
                <span className="about-history__step-eyebrow">{milestone.year}</span>
                <h4 className="about-history__step-title">{milestone.title}</h4>
                <p className="about-history__step-desc">{milestone.description}</p>
              </div>
            </article>
          </div>
        ))}
          <div className="about-history__track-tail" aria-hidden />
        </div>
      </div>
    </section>
  );
}
