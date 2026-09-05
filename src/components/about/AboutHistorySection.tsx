import { type RefObject } from "react";
import { getAboutTimelineChapterScenes } from "@/data/aboutContent";
import { AboutHistoryTimelinePipe } from "@/components/about/AboutHistoryTimelinePipe";
import { AboutHistoryStepBranch } from "@/components/about/AboutHistoryStepBranch";
import { AboutHistoryVerticalSpine } from "@/components/about/AboutHistoryVerticalSpine";
import { AboutHistoryVerticalStepBranch } from "@/components/about/AboutHistoryVerticalStepBranch";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { getLocalizedTimeline } from "@/i18n/localized";

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
  const { t } = useI18n();
  const milestones = getLocalizedTimeline();
  const slides = milestones.reduce<
    Array<{ milestone: (typeof milestones)[number]; showChapter: boolean }>
  >((acc, milestone) => {
    const showChapter = Boolean(
      milestone.chapter && acc.every((item) => item.milestone.chapter !== milestone.chapter),
    );
    acc.push({ milestone, showChapter });
    return acc;
  }, []);

  const chapterScenes = getAboutTimelineChapterScenes();

  return (
    <section id="about-history" className="about-history" aria-label={t("about.history.aria")}>
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
            <span className="palladio-about__anchor-label">{t("about.history.label")}</span>
            <span className="palladio-about__anchor-index">[01]</span>
          </div>

          <div className="about-history__intro-body">
            <div className="about-history__intro-copy">
              <p className="about-history__lead">{t("about.history.intro")}</p>

              <div className="about-history__gradient-title">
                <h3 className="about-history__journey-title">
                  <span className="about-history__journey-title-line1">{t("about.history.journeyLine1")}</span>
                  <br />
                  <span className="about-history__journey-title-line2">{t("about.history.journeyLine2")}</span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        <AboutHistoryTimelinePipe />

        <div className="about-history__milestones-track">
          <AboutHistoryVerticalSpine />

          {slides.map(({ milestone, showChapter }) => (
            <div key={milestone.id} className="about-history__slide-group">
              {showChapter && milestone.chapter ? (
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
                  <AboutHistoryVerticalStepBranch />
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
      </div>
    </section>
  );
}
