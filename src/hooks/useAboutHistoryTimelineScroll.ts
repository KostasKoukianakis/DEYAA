import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { updateAboutPageShaderOpacity } from "@/lib/aboutPageShaderOpacity";
import { refreshLenis } from "@/lib/scrollControl";

gsap.registerPlugin(ScrollTrigger);

const PINNED_CLASS = "is-horizontal-pinned";
const VERTICAL_CLASS = "about-history__pin--vertical";
/** Horizontal pin + pipe scrub only at lg+; smaller viewports use normal vertical scroll */
const HISTORY_HORIZONTAL_MIN = 1024;
const SCROLLER = document.documentElement;
/** Share of pinned scroll used for vertical drop + elbow before horizontal scrub */
const PIPE_VERT_SCROLL_RATIO = 0.24;
/** Last share of pinned scroll for exit bend + vertical drop into next section */
const PIPE_EXIT_SCROLL_RATIO = 0.14;
/** Overlap: horiz begins before vertical fully completes (smoother elbow) */
const PIPE_HORIZ_OVERLAP = 0.1;
/** Track waits until horiz has started growing — avoids elbow twitch */
const PIPE_TRACK_START_IN_HORIZ = 0.06;
/** Smoother scrub on pinned horizontal section — true = locked to scroll (no elbow desync) */
const HISTORY_SCRUB = true;

function parseHorizClipReveal(horiz: HTMLElement): number {
  const clip = String(
    gsap.getProperty(horiz, "clipPath") ||
      gsap.getProperty(horiz, "webkitClipPath") ||
      getComputedStyle(horiz).clipPath ||
      "",
  );
  if (!clip || clip === "none") return 1;

  const insetMatch = clip.match(/inset\(([^)]+)\)/i);
  if (!insetMatch) return 0;

  const tokens = insetMatch[1]
    .replace(/\s+round\s+[^)]*$/i, "")
    .trim()
    .split(/\s+/);
  const right = tokens.length >= 4 ? tokens[1] : tokens.length >= 2 ? tokens[1] : tokens[0];

  if (right.endsWith("%")) return gsap.utils.clamp(0, 1, 1 - parseFloat(right) / 100);
  if (right.endsWith("px")) {
    const w = horiz.offsetWidth || 1;
    return gsap.utils.clamp(0, 1, 1 - parseFloat(right) / w);
  }
  return right === "0" || right === "0px" ? 1 : 0;
}

const HORIZ_CLIP_FROM = "inset(0 100% 0 0 round 1px)";
const HORIZ_CLIP_TO = "inset(0 0% 0 0 round 1px)";
export const ABOUT_HISTORY_LAYOUT_READY = "about-history-layout-ready";
export const ABOUT_HISTORY_PIN_RELEASED = "about-history-pin-released";

/** How far past a branch base the main trunk must travel before the branch grows */
const BRANCH_REACH_RATIO = 0.4;
/** Sequential branch build: base → vert → elbow → feed (equal shares of progress 0–1) */
const BRANCH_BUILD_PARTS = 4;

function branchBuildPhase(progress: number, index: number) {
  return Math.min(1, Math.max(0, progress * BRANCH_BUILD_PARTS - index));
}

type VerticalBranchMetric = {
  junction: HTMLElement;
  feedGrow: HTMLElement;
  reach: number;
  feedSpan: number;
};

type VerticalPipeMetrics = {
  growTop: number;
  growHeight: number;
  exitHorizSpan: number;
  exitDropHeight: number;
  totalLength: number;
  branches: VerticalBranchMetric[];
};

function getOffsetTopIn(container: HTMLElement, el: HTMLElement): number {
  let top = 0;
  let node: HTMLElement | null = el;

  while (node && node !== container) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }

  if (node !== container) {
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return elRect.top + elRect.height * 0.5 - containerRect.top;
  }

  return top;
}

function measureVerticalPipeMetrics(
  milestonesTrack: HTMLElement,
  grow: HTMLElement,
): VerticalPipeMetrics {
  const growTop = getOffsetTopIn(milestonesTrack, grow);
  const growHeight = grow.offsetHeight;

  const exitFeedGrow = milestonesTrack.querySelector<HTMLElement>(
    ".about-history-vertical-spine__exit-feed-grow",
  );
  const exitDropGrow = milestonesTrack.querySelector<HTMLElement>(
    ".about-history-vertical-spine__exit-drop-grow",
  );

  const exitHorizSpan = exitFeedGrow?.offsetWidth ?? 0;
  const exitDropHeight = exitDropGrow?.offsetHeight ?? 0;
  const totalLength = Math.max(growHeight + exitHorizSpan + exitDropHeight, 1);

  const branches: VerticalBranchMetric[] = [];
  milestonesTrack.querySelectorAll<HTMLElement>(".about-history__step").forEach((step) => {
    const junction = step.querySelector<HTMLElement>(".about-history-vertical-branch__junction");
    const feedGrow = step.querySelector<HTMLElement>(
      ".about-history-vertical-branch__feed-grow",
    );
    if (!junction || !feedGrow) return;

    const stepCenterY = getOffsetTopIn(milestonesTrack, step) + step.offsetHeight * 0.5;
    branches.push({
      junction,
      feedGrow,
      reach: stepCenterY - growTop,
      feedSpan: Math.max(feedGrow.offsetWidth, 1),
    });
  });

  return { growTop, growHeight, exitHorizSpan, exitDropHeight, totalLength, branches };
}

function applyVerticalPipeProgress(
  metrics: VerticalPipeMetrics,
  progress: number,
  elements: {
    grow: HTMLElement;
    exitCorner: HTMLElement | null;
    exitCornerEnd: HTMLElement | null;
    exitFeedGrow: HTMLElement | null;
    exitDropGrow: HTMLElement | null;
    exitDropCoupling: HTMLElement | null;
  },
) {
  const traveled = gsap.utils.clamp(0, 1, progress) * metrics.totalLength;
  const vertTraveled = Math.min(traveled, metrics.growHeight);
  const vertProgress = metrics.growHeight > 0 ? vertTraveled / metrics.growHeight : 1;

  gsap.set(elements.grow, { scaleY: vertProgress, transformOrigin: "top center", force3D: true });

  metrics.branches.forEach(({ junction, feedGrow, reach, feedSpan }) => {
    if (vertTraveled + 0.5 < reach) {
      gsap.set(junction, { opacity: 0 });
      gsap.set(feedGrow, { scaleX: 0, transformOrigin: "left center", force3D: true });
      return;
    }

    gsap.set(junction, { opacity: 1 });
    const feedProgress = gsap.utils.clamp(0, 1, (vertTraveled - reach) / feedSpan);
    gsap.set(feedGrow, { scaleX: feedProgress, transformOrigin: "left center", force3D: true });
  });

  let exitTraveled = traveled - metrics.growHeight;

  if (elements.exitCorner) {
    gsap.set(elements.exitCorner, { opacity: exitTraveled > 0 ? 1 : 0 });
  }

  if (elements.exitFeedGrow) {
    const horizProgress =
      exitTraveled <= 0
        ? 0
        : gsap.utils.clamp(0, 1, exitTraveled / Math.max(metrics.exitHorizSpan, 1));
    gsap.set(elements.exitFeedGrow, {
      scaleX: horizProgress,
      transformOrigin: "left center",
      force3D: true,
    });
  }

  exitTraveled -= metrics.exitHorizSpan;

  if (elements.exitCornerEnd) {
    gsap.set(elements.exitCornerEnd, { opacity: exitTraveled > 0 ? 1 : 0 });
  }

  if (elements.exitDropGrow) {
    const dropProgress =
      exitTraveled <= 0
        ? 0
        : gsap.utils.clamp(0, 1, exitTraveled / Math.max(metrics.exitDropHeight, 1));
    gsap.set(elements.exitDropGrow, {
      scaleY: dropProgress,
      transformOrigin: "top center",
      force3D: true,
    });
    if (elements.exitDropCoupling) {
      gsap.set(elements.exitDropCoupling, { opacity: dropProgress >= 0.92 ? 1 : 0 });
    }
  } else if (elements.exitDropCoupling) {
    gsap.set(elements.exitDropCoupling, { opacity: 0 });
  }
}

function getHorizontalDistance(el: HTMLElement) {
  const viewport = document.documentElement.clientWidth;
  const fromScrollWidth = el.scrollWidth - viewport;
  const intro = el.querySelector<HTMLElement>(".about-history__intro-panel");
  const slideGroups = el.querySelectorAll<HTMLElement>(".about-history__slide-group");
  const tail = el.querySelector<HTMLElement>(".about-history__track-tail");
  const fromChildren =
    (intro?.offsetWidth ?? 0) +
    Array.from(slideGroups).reduce((sum, group) => sum + group.offsetWidth, 0) +
    (tail?.offsetWidth ?? 0);
  return Math.max(0, fromScrollWidth, fromChildren - viewport);
}

function getVertScrollBudget(totalDistance: number) {
  return Math.min(totalDistance * PIPE_VERT_SCROLL_RATIO, window.innerHeight * 0.32);
}

function layoutTimelinePipe(track: HTMLElement) {
  const pipe = track.querySelector<HTMLElement>(".about-history-timeline-pipe");
  const intro = track.querySelector<HTMLElement>(".about-history__intro-panel");
  if (!pipe || !intro) return;

  const viewport = document.documentElement.clientWidth;
  const pw =
    parseFloat(getComputedStyle(pipe).getPropertyValue("--ahtp-pw")) ||
    parseFloat(getComputedStyle(intro).getPropertyValue("--ahtp-pw")) ||
    40;
  const bleed =
    parseFloat(getComputedStyle(pipe).getPropertyValue("--ahtp-origin-bleed")) || 0;
  /** Vertical trunk drops from horizontal center of intro viewport (not origin chapter slide) */
  const introCenterX = intro.offsetLeft + viewport * 0.5;
  const start = introCenterX - pw * 0.5 - bleed;

  const elbowSize =
    parseFloat(getComputedStyle(pipe).getPropertyValue("--ahtp-elbow-size")) || 40;
  const cornerEnd = pipe.querySelector<HTMLElement>(
    ".about-history-timeline-pipe__corner-end",
  );
  const horiz = pipe.querySelector<HTMLElement>(".about-history-timeline-pipe__horiz");
  const measuredElbow = cornerEnd?.offsetWidth ?? elbowSize;
  const measuredPw = horiz?.offsetHeight ?? measuredElbow / 1.54;
  /** exit-grow left = corner-end right − pw → tube center = corner-end left + elbow − pw/2 */
  const exitVertCenterOffset = measuredElbow - measuredPw * 0.5;
  const scrollMax = Math.max(0, track.scrollWidth - viewport);
  /** Align exit vertical tube center (not elbow box) with viewport center */
  const bendCenterX = scrollMax + viewport * 0.5 - exitVertCenterOffset;
  const horizSpan = Math.max(0, bendCenterX - start - (measuredElbow - 1));

  pipe.style.left = `${start}px`;
  pipe.style.setProperty("--ahtp-horiz-span", `${horizSpan}px`);
}

function refreshScrollLayout() {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    refreshLenis();
  });
}

function dispatchLayoutReady() {
  window.dispatchEvent(new CustomEvent(ABOUT_HISTORY_LAYOUT_READY));
}

function dispatchPinReleased() {
  window.dispatchEvent(new CustomEvent(ABOUT_HISTORY_PIN_RELEASED));
}

/**
 * Palladio /group/ timeline — vertical page scroll scrubs horizontal track (lg+).
 * Below HISTORY_HORIZONTAL_MIN: stacked vertical timeline (normal document scroll).
 */
export function useAboutHistoryTimelineScroll(
  sectionRef: RefObject<HTMLElement | null>,
  scrollRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const section = sectionRef.current;
    const track = scrollRef.current;
    if (!section || !track) return;

    let tween: gsap.core.Tween | gsap.core.Timeline | null = null;
    const stepTriggers: ScrollTrigger[] = [];
    let resizeTimer: ReturnType<typeof setTimeout>;
    let layoutObserver: ResizeObserver | null = null;
    const retryTimers: number[] = [];

    const getPipeParts = () => {
      const root = track.querySelector<HTMLElement>(".about-history-timeline-pipe");
      if (!root) return null;
      return {
        grow: root.querySelector<HTMLElement>(".about-history-timeline-pipe__grow"),
        corner: root.querySelector<HTMLElement>(".about-history-timeline-pipe__corner"),
        horiz: root.querySelector<HTMLElement>(".about-history-timeline-pipe__horiz"),
        cornerEnd: root.querySelector<HTMLElement>(
          ".about-history-timeline-pipe__corner-end",
        ),
        exitGrow: root.querySelector<HTMLElement>(
          ".about-history-timeline-pipe__exit-grow",
        ),
      };
    };

    const aboutPage = section.closest<HTMLElement>(".about-page");
    let visionShaderTrigger: ScrollTrigger | null = null;

    const teardown = () => {
      stepTriggers.splice(0).forEach((st) => st.kill());
      tween?.scrollTrigger?.kill();
      tween?.kill();
      tween = null;
      section.classList.remove(PINNED_CLASS, VERTICAL_CLASS);
      track.removeAttribute("data-lenis-prevent");
      gsap.set(track, { clearProps: "transform,willChange" });
      const parts = getPipeParts();
      if (parts?.grow) parts.grow.style.removeProperty("transform");
      if (parts?.horiz) {
        parts.horiz.style.removeProperty("transform");
        parts.horiz.style.removeProperty("clip-path");
      }
      if (parts?.corner) parts.corner.style.removeProperty("opacity");
      if (parts?.cornerEnd) parts.cornerEnd.style.removeProperty("opacity");
      if (parts?.exitGrow) parts.exitGrow.style.removeProperty("transform");
      const verticalSpineGrow = track.querySelector<HTMLElement>(
        ".about-history-vertical-spine__grow",
      );
      if (verticalSpineGrow) gsap.set(verticalSpineGrow, { clearProps: "transform" });
      const verticalSpineExitFeed = track.querySelector<HTMLElement>(
        ".about-history-vertical-spine__exit-feed-grow",
      );
      if (verticalSpineExitFeed) gsap.set(verticalSpineExitFeed, { clearProps: "transform" });
      const verticalSpineExitDrop = track.querySelector<HTMLElement>(
        ".about-history-vertical-spine__exit-drop-grow",
      );
      if (verticalSpineExitDrop) gsap.set(verticalSpineExitDrop, { clearProps: "transform" });
      track.querySelectorAll<HTMLElement>(".about-history-vertical-branch__feed-grow").forEach((el) => {
        gsap.set(el, { clearProps: "transform" });
      });
      track
        .querySelectorAll<HTMLElement>(".about-history-vertical-branch__junction")
        .forEach((el) => {
          gsap.set(el, { clearProps: "opacity" });
        });
      track
        .querySelectorAll<HTMLElement>(
          ".about-history-vertical-spine__exit-corner, .about-history-vertical-spine__exit-corner-end, .about-history-vertical-spine__coupling--bottom",
        )
        .forEach((el) => {
          gsap.set(el, { clearProps: "opacity" });
        });
      track
        .querySelectorAll<HTMLElement>(".about-history__step, .about-history__chapter-slide")
        .forEach((el) => {
          gsap.set(el, { clearProps: "opacity,transform" });
        });
      track.querySelectorAll<HTMLElement>(".about-history__step").forEach((step) => {
        const vertGrow = step.querySelector<HTMLElement>(".about-history__step-branch-vert-grow");
        const elbow = step.querySelector<HTMLElement>(".about-history__step-branch-elbow");
        const feedGrow = step.querySelector<HTMLElement>(".about-history__step-branch-feed-grow");
        const base = step.querySelector<HTMLElement>(".about-history__step-branch-base");
        const content = step.querySelector<HTMLElement>(".about-history__step-content");
        if (vertGrow) gsap.set(vertGrow, { clearProps: "transform" });
        if (elbow) gsap.set(elbow, { clearProps: "opacity" });
        if (feedGrow) gsap.set(feedGrow, { clearProps: "transform" });
        if (base) gsap.set(base, { clearProps: "opacity" });
        if (content) gsap.set(content, { clearProps: "opacity,transform,scale,filter,clipPath" });
        const eyebrow = step.querySelector<HTMLElement>(".about-history__step-eyebrow");
        const title = step.querySelector<HTMLElement>(".about-history__step-title");
        const desc = step.querySelector<HTMLElement>(".about-history__step-desc");
        if (eyebrow) gsap.set(eyebrow, { clearProps: "opacity,transform,filter" });
        if (title) gsap.set(title, { clearProps: "opacity,transform,filter" });
        if (desc) gsap.set(desc, { clearProps: "opacity,transform,filter" });
      });
      section
        .querySelectorAll<HTMLElement>(
          ".about-history__lead, .about-history__journey-title-line1, .about-history__journey-title-line2",
        )
        .forEach((el) => {
          gsap.set(el, { clearProps: "opacity,transform,scale,filter" });
        });
      section.querySelectorAll<HTMLElement>("[data-chapter-bg]").forEach((el) => {
        el.style.removeProperty("opacity");
      });
      section.style.removeProperty("--history-shader-reveal");
      aboutPage?.style.removeProperty("--about-sky-shader-opacity");
      visionShaderTrigger?.kill();
      visionShaderTrigger = null;
    };

    const updatePageShaderOpacity = () => {
      updateAboutPageShaderOpacity();
    };

    const bindVisionShaderVisibility = () => {
      if (!aboutPage) return;

      visionShaderTrigger?.kill();
      visionShaderTrigger = ScrollTrigger.create({
        trigger: aboutPage,
        scroller: SCROLLER,
        start: "top top",
        end: "bottom bottom",
        onUpdate: updatePageShaderOpacity,
        onRefresh: updatePageShaderOpacity,
      });
      updatePageShaderOpacity();
    };

    const getChapterTriggers = () =>
      Array.from(
        track.querySelectorAll<HTMLElement>("[data-chapter-trigger]"),
      );

    const updateShaderReveal = (progress: number) => {
      const clamped = Math.min(1, Math.max(0, progress));
      section.style.setProperty("--history-shader-reveal", clamped.toFixed(4));
      updatePageShaderOpacity();
    };

    const bindShaderReveal = (horizontalTween: gsap.core.Tween | gsap.core.Timeline | null) => {
      const intro = track.querySelector<HTMLElement>(".about-history__intro-panel");
      if (!intro) return;

      if (!horizontalTween) {
        updateShaderReveal(track.scrollLeft / Math.max(track.clientWidth, 1));
        return;
      }

      const st = ScrollTrigger.create({
        trigger: intro,
        containerAnimation: horizontalTween,
        start: "left left",
        end: "right left",
        scrub: 0.4,
        onUpdate: (self) => updateShaderReveal(self.progress),
      });
      stepTriggers.push(st);
      updateShaderReveal(st.progress);
    };

    const updateChapterBgsFromTrack = () => {
      const pinRect = section.getBoundingClientRect();
      const focusX = pinRect.left + pinRect.width * 0.52;

      section.querySelectorAll<HTMLElement>("[data-chapter-bg]").forEach((bgEl) => {
        const id = bgEl.dataset.chapterBg;
        const trigger = track.querySelector<HTMLElement>(`[data-chapter-trigger="${id}"]`);
        if (!trigger) return;

        const triggerCx = trigger.getBoundingClientRect().left + trigger.offsetWidth * 0.5;
        const span = pinRect.width * 0.42;
        const t = 1 - Math.min(1, Math.abs(focusX - triggerCx) / span);
        bgEl.style.opacity = String(t * t * 0.96);
      });
    };

    const createChapterBgReveals = (horizontalTween: gsap.core.Tween | gsap.core.Timeline) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const triggers = getChapterTriggers();

      triggers.forEach((triggerEl, index) => {
        const id = triggerEl.dataset.chapterTrigger;
        if (!id) return;

        const bgEl = section.querySelector<HTMLElement>(`[data-chapter-bg="${id}"]`);
        if (!bgEl) return;

        const nextTrigger = triggers[index + 1];

        const st = ScrollTrigger.create({
          trigger: triggerEl,
          endTrigger: nextTrigger ?? triggerEl,
          containerAnimation: horizontalTween,
          start: "left 92%",
          end: nextTrigger ? "left 92%" : "left 8%",
          scrub: 0.75,
          onUpdate: (self) => {
            const p = self.progress;
            let peak: number;
            if (nextTrigger) {
              if (p < 0.12) peak = p / 0.12;
              else if (p > 0.88) peak = (1 - p) / 0.12;
              else peak = 1;
            } else {
              peak = p < 0.5 ? p * 2 : (1 - p) * 2;
            }
            bgEl.style.opacity = String(Math.max(0, Math.min(1, peak)) * 0.96);
          },
        });
        stepTriggers.push(st);
      });
    };

    const setBranchPipeProgress = (
      step: HTMLElement,
      progress: number,
      reducedMotion: boolean,
    ) => {
      const vertGrow = step.querySelector<HTMLElement>(".about-history__step-branch-vert-grow");
      const elbow = step.querySelector<HTMLElement>(".about-history__step-branch-elbow");
      const feedGrow = step.querySelector<HTMLElement>(".about-history__step-branch-feed-grow");
      const base = step.querySelector<HTMLElement>(".about-history__step-branch-base");
      const content = step.querySelector<HTMLElement>(".about-history__step-content");
      if (!vertGrow || !elbow || !feedGrow) return;

      if (reducedMotion || progress >= 1) {
        vertGrow.style.transform = "scaleY(1)";
        elbow.style.opacity = "1";
        feedGrow.style.transform = "scaleX(1)";
        if (base) base.style.opacity = "1";
        if (content) content.style.opacity = "1";
        return;
      }

      if (progress <= 0) {
        vertGrow.style.transform = "scaleY(0)";
        elbow.style.opacity = "0";
        feedGrow.style.transform = "scaleX(0)";
        if (base) base.style.opacity = "0";
        if (content) content.style.opacity = "0.3";
        return;
      }

      const baseP = branchBuildPhase(progress, 0);
      const vertP = branchBuildPhase(progress, 1);
      const elbowP = branchBuildPhase(progress, 2);
      const feedP = branchBuildPhase(progress, 3);

      if (base) base.style.opacity = String(baseP);
      vertGrow.style.transform = `scaleY(${vertP})`;
      elbow.style.opacity = String(elbowP);
      feedGrow.style.transform = `scaleX(${feedP})`;
      if (content) content.style.opacity = String(0.35 + feedP * 0.65);
    };

    const getBranchProgress = (step: HTMLElement) => {
      const horiz = track.querySelector<HTMLElement>(".about-history-timeline-pipe__horiz");
      const marker =
        step.querySelector<HTMLElement>(".about-history__step-marker") ?? step;
      if (!horiz) return 0;

      let reveal = parseHorizClipReveal(horiz);
      if (reveal <= 0) {
        reveal = Math.abs(Number(gsap.getProperty(horiz, "scaleX")) || 0);
      }
      if (reveal < 0.04) return 0;

      const horizRect = horiz.getBoundingClientRect();
      const pipeFront = horizRect.left + horizRect.width * reveal;
      const baseLeft = marker.getBoundingClientRect().left;
      const reach = Math.max(step.offsetWidth * BRANCH_REACH_RATIO, 140);

      if (pipeFront <= baseLeft) return 0;
      return Math.min(1, (pipeFront - baseLeft) / reach);
    };

    const updateAllBranchPipes = (reducedMotion: boolean) => {
      track.querySelectorAll<HTMLElement>(".about-history__step").forEach((step) => {
        const progress = reducedMotion ? 1 : getBranchProgress(step);
        setBranchPipeProgress(step, progress, reducedMotion);
      });
    };

    const bindBranchRevealsToPipe = (_scrub: boolean | number) => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      updateAllBranchPipes(reducedMotion);
    };

    const createIntroTextReveals = (scrub: boolean | number) => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const introLead = track.querySelector<HTMLElement>(".about-history__lead");
      const journeyLine1 = track.querySelector<HTMLElement>(
        ".about-history__journey-title-line1",
      );
      const journeyLine2 = track.querySelector<HTMLElement>(
        ".about-history__journey-title-line2",
      );

      const targets = [introLead, journeyLine1, journeyLine2].filter(Boolean) as HTMLElement[];

      if (!targets.length) return;

      if (reducedMotion) {
        gsap.set(targets, { opacity: 1, x: 0, y: 0, filter: "blur(0px)" });
        return;
      }

      if (introLead) {
        gsap.set(introLead, { opacity: 0, filter: "blur(10px)", y: 18 });
      }
      if (journeyLine1) {
        gsap.set(journeyLine1, { opacity: 0, y: 56, scale: 0.9, transformOrigin: "left bottom" });
      }
      if (journeyLine2) {
        gsap.set(journeyLine2, { opacity: 0, y: 48, scale: 0.92, transformOrigin: "left bottom" });
      }

      if (introLead || journeyLine1 || journeyLine2) {
        const journeyReveal = {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "power3.out",
          duration: 1.28,
        };

        const journeyTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            scroller: SCROLLER,
            start: "top bottom",
            end: "top top",
            scrub: 1.85,
            invalidateOnRefresh: true,
          },
        });

        if (introLead) {
          journeyTl.to(
            introLead,
            {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              ease: "power2.out",
              duration: 1.12,
            },
            0,
          );
        }
        if (journeyLine1) {
          journeyTl.to(journeyLine1, journeyReveal, introLead ? 0.42 : 0);
        }
        if (journeyLine2) {
          journeyTl.to(
            journeyLine2,
            { ...journeyReveal, duration: 1.18 },
            introLead ? 0.76 : 0.38,
          );
        }

        if (journeyTl.scrollTrigger) stepTriggers.push(journeyTl.scrollTrigger);
      }
    };

    const createStepCardReveals = (horizontalTween: gsap.core.Tween | gsap.core.Timeline) => {
      track.querySelectorAll<HTMLElement>(".about-history__step").forEach((step) => {
        buildStepCardRevealTimeline(step, {
          trigger: step,
          containerAnimation: horizontalTween,
          start: "left 90%",
          end: "left 48%",
          scrub: 0.95,
        });
      });
    };

    const buildStepCardRevealTimeline = (
      step: HTMLElement,
      scrollTriggerConfig: ScrollTrigger.Vars,
    ) => {
      const content = step.querySelector<HTMLElement>(".about-history__step-content");
      const eyebrow = step.querySelector<HTMLElement>(".about-history__step-eyebrow");
      const title = step.querySelector<HTMLElement>(".about-history__step-title");
      const desc = step.querySelector<HTMLElement>(".about-history__step-desc");
      if (!content) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isTop = step.classList.contains("about-history__step--top");
      const driftY = isTop ? -14 : 14;

      if (reducedMotion) {
        gsap.set(content, {
          opacity: 1,
          x: 0,
          scale: 1,
          filter: "none",
          clipPath: "inset(0% 0% 0% 0% round 14px)",
        });
        gsap.set([eyebrow, title, desc], { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }

      gsap.set(content, {
        opacity: 0,
        x: -40,
        scale: 0.9,
        transformOrigin: "left center",
        clipPath: "inset(12% 100% 12% 0% round 14px)",
        filter: "blur(5px)",
        force3D: true,
      });
      if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: driftY * 0.65, force3D: true });
      if (title) gsap.set(title, { opacity: 0, y: driftY, force3D: true });
      if (desc) gsap.set(desc, { opacity: 0, y: driftY * 0.85, filter: "blur(8px)", force3D: true });

      const tl = gsap.timeline({ scrollTrigger: scrollTriggerConfig });

      tl.to(
        content,
        {
          opacity: 1,
          x: 0,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0% round 14px)",
          filter: "blur(0px)",
          ease: "power3.out",
          duration: 0.52,
        },
        0,
      );

      if (eyebrow) {
        tl.to(eyebrow, { opacity: 1, y: 0, ease: "power2.out", duration: 0.28 }, 0.24);
      }
      if (title) {
        tl.to(title, { opacity: 1, y: 0, ease: "power2.out", duration: 0.32 }, 0.38);
      }
      if (desc) {
        tl.to(
          desc,
          { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 0.36 },
          0.52,
        );
      }

      tl.to(content, { scale: 1.025, ease: "sine.inOut", duration: 0.22 }, 0.78).to(
        content,
        { scale: 1, ease: "sine.inOut", duration: 0.24 },
        0.88,
      );

      if (tl.scrollTrigger) stepTriggers.push(tl.scrollTrigger);
    };

    const showVerticalIntroContent = () => {
      track
        .querySelectorAll<HTMLElement>(
          ".about-history__lead, .about-history__journey-title-line1, .about-history__journey-title-line2, .about-history__chapter-title-line",
        )
        .forEach((el) => {
          gsap.set(el, { clearProps: "opacity,transform,scale,filter,clipPath,x,y" });
        });
    };

    const createVerticalStepReveals = () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      track.querySelectorAll<HTMLElement>(".about-history__step").forEach((step) => {
        const content = step.querySelector<HTMLElement>(".about-history__step-content");
        const eyebrow = step.querySelector<HTMLElement>(".about-history__step-eyebrow");
        const title = step.querySelector<HTMLElement>(".about-history__step-title");
        const desc = step.querySelector<HTMLElement>(".about-history__step-desc");
        if (!content) return;

        if (reducedMotion) {
          gsap.set(content, { opacity: 1, y: 0, scale: 1, filter: "none" });
          gsap.set([eyebrow, title, desc], { opacity: 1, y: 0, filter: "blur(0px)" });
          return;
        }

        gsap.set(content, {
          opacity: 0,
          y: 24,
          scale: 0.98,
          transformOrigin: "left center",
          filter: "blur(4px)",
        });
        if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 8 });
        if (title) gsap.set(title, { opacity: 0, y: 10 });
        if (desc) gsap.set(desc, { opacity: 0, y: 12, filter: "blur(6px)" });

        const reveal = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            scroller: SCROLLER,
            start: "top 84%",
            toggleActions: "play none none reverse",
          },
        });

        reveal.to(
          content,
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.52, ease: "power3.out" },
          0,
        );
        if (eyebrow) {
          reveal.to(eyebrow, { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" }, 0.22);
        }
        if (title) {
          reveal.to(title, { opacity: 1, y: 0, duration: 0.36, ease: "power2.out" }, 0.3);
        }
        if (desc) {
          reveal.to(
            desc,
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power2.out" },
            0.38,
          );
        }

        if (reveal.scrollTrigger) stepTriggers.push(reveal.scrollTrigger);
      });
    };

    const createVerticalChapterReveals = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      track.querySelectorAll<HTMLElement>(".about-history__chapter-slide").forEach((el) => {
          gsap.set(el, { opacity: 0, y: 20 });

          const anim = gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.58,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              scroller: SCROLLER,
              start: "top 86%",
              toggleActions: "play none none reverse",
            },
          });
          if (anim.scrollTrigger) stepTriggers.push(anim.scrollTrigger);
        });
    };

    const bindVerticalPipeScroll = () => {
      const milestonesTrack = track.querySelector<HTMLElement>(".about-history__milestones-track");
      const grow = track.querySelector<HTMLElement>(".about-history-vertical-spine__grow");
      const exitCorner = track.querySelector<HTMLElement>(
        ".about-history-vertical-spine__exit-corner",
      );
      const exitCornerEnd = track.querySelector<HTMLElement>(
        ".about-history-vertical-spine__exit-corner-end",
      );
      const exitFeedGrow = track.querySelector<HTMLElement>(
        ".about-history-vertical-spine__exit-feed-grow",
      );
      const exitDropGrow = track.querySelector<HTMLElement>(
        ".about-history-vertical-spine__exit-drop-grow",
      );
      const exitDropCoupling = track.querySelector<HTMLElement>(
        ".about-history-vertical-spine__coupling--bottom",
      );
      if (!milestonesTrack || !grow) return;

      const elements = {
        grow,
        exitCorner,
        exitCornerEnd,
        exitFeedGrow,
        exitDropGrow,
        exitDropCoupling,
      };
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        let metrics = measureVerticalPipeMetrics(milestonesTrack, grow);
        applyVerticalPipeProgress(metrics, 1, elements);
        return;
      }

      let metrics = measureVerticalPipeMetrics(milestonesTrack, grow);
      applyVerticalPipeProgress(metrics, 0, elements);

      const st = ScrollTrigger.create({
        trigger: milestonesTrack,
        scroller: SCROLLER,
        start: "top 82%",
        end: "bottom 18%",
        scrub: 0.42,
        invalidateOnRefresh: true,
        onUpdate: (self) => applyVerticalPipeProgress(metrics, self.progress, elements),
        onRefresh: (self) => {
          metrics = measureVerticalPipeMetrics(milestonesTrack, grow);
          applyVerticalPipeProgress(metrics, self.progress, elements);
        },
      });
      stepTriggers.push(st);
      applyVerticalPipeProgress(metrics, st.progress, elements);
      ScrollTrigger.refresh();
    };

    const createVerticalChapterBgReveals = () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const triggers = getChapterTriggers();

      triggers.forEach((triggerEl, index) => {
        const id = triggerEl.dataset.chapterTrigger;
        if (!id) return;

        const bgEl = section.querySelector<HTMLElement>(`[data-chapter-bg="${id}"]`);
        if (!bgEl) return;

        const slideGroup =
          triggerEl.closest<HTMLElement>(".about-history__slide-group") ??
          triggerEl.closest<HTMLElement>(".about-history__intro-panel") ??
          triggerEl;
        const nextTrigger = triggers[index + 1];
        const endTarget =
          nextTrigger?.closest<HTMLElement>(".about-history__slide-group") ??
          nextTrigger?.closest<HTMLElement>(".about-history__intro-panel") ??
          slideGroup;

        if (reducedMotion) {
          bgEl.style.opacity = "0.55";
          return;
        }

        bgEl.style.opacity = "0";

        const st = ScrollTrigger.create({
          trigger: slideGroup,
          endTrigger: endTarget,
          scroller: SCROLLER,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 0.55,
          onUpdate: (self) => {
            const p = self.progress;
            const peak = p < 0.5 ? p * 2 : (1 - p) * 2;
            bgEl.style.opacity = String(Math.max(0, Math.min(1, peak)) * 0.9);
          },
        });
        stepTriggers.push(st);
      });
    };

    const bindVerticalShaderReveal = () => {
      const st = ScrollTrigger.create({
        trigger: section,
        scroller: SCROLLER,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.35,
        onUpdate: (self) => {
          const p = self.progress;
          const inView = p > 0.08 && p < 0.92 ? 1 : p <= 0.08 ? p / 0.08 : (1 - p) / 0.08;
          updateShaderReveal(Math.min(1, Math.max(0, inView)));
        },
      });
      stepTriggers.push(st);
      updateShaderReveal(0);
    };

    const initVerticalMode = () => {
      section.classList.add(VERTICAL_CLASS);
      gsap.set(track, { clearProps: "transform,willChange", x: 0 });

      const parts = getPipeParts();
      if (parts?.grow) parts.grow.style.removeProperty("transform");
      if (parts?.horiz) {
        parts.horiz.style.removeProperty("transform");
        parts.horiz.style.removeProperty("clip-path");
      }
      if (parts?.corner) parts.corner.style.removeProperty("opacity");
      if (parts?.cornerEnd) parts.cornerEnd.style.removeProperty("opacity");
      if (parts?.exitGrow) parts.exitGrow.style.removeProperty("transform");

      showVerticalIntroContent();

      bindVerticalShaderReveal();
      bindVerticalPipeScroll();
      createVerticalChapterReveals();
      createVerticalStepReveals();
      createVerticalChapterBgReveals();
      dispatchLayoutReady();
      refreshScrollLayout();
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    const createChapterSlideReveals = (horizontalTween: gsap.core.Tween | gsap.core.Timeline) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      track.querySelectorAll<HTMLElement>(".about-history__chapter-slide").forEach((el) => {
        const anim = gsap.fromTo(
          el,
          { opacity: 0.2, y: 12 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              containerAnimation: horizontalTween,
              start: "left 92%",
              end: "left 62%",
              scrub: 0.6,
            },
          },
        );
        if (anim.scrollTrigger) stepTriggers.push(anim.scrollTrigger);
      });
    };

    const createTween = () => {
      layoutTimelinePipe(track);
      const distance = getHorizontalDistance(track);
      if (distance <= 0) return false;

      const lockedDistance = distance;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const scrub = prefersReducedMotion ? true : HISTORY_SCRUB;
      const parts = getPipeParts();

      gsap.set(track, { force3D: true, willChange: "transform", x: 0 });

      if (parts?.grow && parts.corner && parts.horiz) {
        gsap.set(parts.grow, { scaleY: 0, transformOrigin: "top center", force3D: true });
        gsap.set(parts.corner, { opacity: 0, force3D: true });
        gsap.set(parts.horiz, {
          scaleX: 1,
          transformOrigin: "left center",
          clipPath: HORIZ_CLIP_FROM,
          force3D: true,
        });
        if (parts.cornerEnd) gsap.set(parts.cornerEnd, { opacity: 0 });
        if (parts.exitGrow) gsap.set(parts.exitGrow, { scaleY: 0, transformOrigin: "top center", force3D: true });
      }

      const total = Math.max(lockedDistance, 1);
      const vertShare = getVertScrollBudget(total) / total;
      const exitShare = PIPE_EXIT_SCROLL_RATIO;
      const horizShare = Math.max(0.001, 1 - vertShare - exitShare);
      const exitStart = vertShare + horizShare;

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          scroller: SCROLLER,
          start: "top top",
          end: `+=${lockedDistance}`,
          scrub,
          pin: true,
          pinSpacing: true,
          anticipatePin: 0,
          invalidateOnRefresh: false,
          toggleClass: { className: PINNED_CLASS, targets: section },
          onUpdate: () => {
            if (!prefersReducedMotion) {
              updateAllBranchPipes(false);
              updateChapterBgsFromTrack();
            }
          },
          onLeave: () => {
            requestAnimationFrame(() => {
              ScrollTrigger.refresh();
              refreshLenis();
              dispatchPinReleased();
            });
          },
        },
      });

      if (parts?.grow && parts.corner && parts.horiz) {
        master
          .to(parts.grow, { scaleY: 1, ease: "none", duration: vertShare }, 0)
          .to(
            parts.corner,
            { opacity: 1, ease: "none", duration: vertShare * 0.22 },
            vertShare * 0.72,
          )
          .set(parts.corner, { opacity: 1 }, vertShare)
          .to(
            parts.horiz,
            { clipPath: HORIZ_CLIP_TO, ease: "none", duration: horizShare, force3D: true },
            vertShare,
          );

        if (parts.cornerEnd && parts.exitGrow) {
          master
            .to(
              parts.cornerEnd,
              { opacity: 1, ease: "none", duration: exitShare * 0.22 },
              exitStart,
            )
            .to(
              parts.exitGrow,
              { scaleY: 1, ease: "none", duration: exitShare * 0.78 },
              exitStart + exitShare * 0.1,
            );
        }
      }

      master.to(
        track,
        {
          x: -lockedDistance,
          ease: "none",
          duration: horizShare,
          force3D: true,
        },
        vertShare,
      );

      tween = master;

      bindShaderReveal(master);
      createIntroTextReveals(scrub);
      bindBranchRevealsToPipe(scrub);
      createChapterSlideReveals(master);
      createChapterBgReveals(master);
      createStepCardReveals(master);

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        refreshLenis();
      });
      dispatchLayoutReady();
      return true;
    };

    const isHistoryPinLocked = () =>
      section.classList.contains(PINNED_CLASS) || Boolean(tween?.scrollTrigger?.isActive);

    const refreshBoundLayout = () => {
      if (isHistoryPinLocked()) return;
      layoutTimelinePipe(track);
      refreshScrollLayout();
    };

    const setup = () => {
      teardown();
      layoutObserver?.disconnect();
      layoutObserver = null;
      layoutTimelinePipe(track);
      bindVisionShaderVisibility();

      if (window.innerWidth < HISTORY_HORIZONTAL_MIN) {
        initVerticalMode();
        return;
      }

      if (createTween()) {
        return;
      }

      layoutObserver = new ResizeObserver(() => {
        if (window.innerWidth < HISTORY_HORIZONTAL_MIN) return;
        if (tween) return;
        if (createTween()) {
          layoutObserver?.disconnect();
          layoutObserver = null;
        }
      });
      layoutObserver.observe(track);
      Array.from(track.children).forEach((child) => {
        layoutObserver?.observe(child);
      });
      const milestonesTrack = track.querySelector<HTMLElement>(".about-history__milestones-track");
      if (milestonesTrack) {
        layoutObserver.observe(milestonesTrack);
        milestonesTrack.querySelectorAll<HTMLElement>(".about-history__slide-group").forEach((group) => {
          layoutObserver?.observe(group);
        });
      }
    };

    setup();

    [100, 400, 900, 1600, 2800].forEach((ms) => {
      retryTimers.push(
        window.setTimeout(() => {
          if (isHistoryPinLocked()) return;
          if (!tween && window.innerWidth >= HISTORY_HORIZONTAL_MIN) {
            setup();
          } else if (tween) {
            refreshBoundLayout();
          }
        }, ms),
      );
    });

    const onLayoutReady = () => {
      if (isHistoryPinLocked()) return;
      if (!tween && window.innerWidth >= HISTORY_HORIZONTAL_MIN) {
        setup();
      } else if (tween) {
        refreshBoundLayout();
      }
    };
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (isHistoryPinLocked()) return;
        if (tween && window.innerWidth >= HISTORY_HORIZONTAL_MIN) {
          refreshBoundLayout();
          return;
        }
        setup();
      }, 200);
    };

    window.addEventListener(ABOUT_HISTORY_LAYOUT_READY, onLayoutReady);
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onLayoutReady);
    document.fonts?.ready
      ?.then(() => {
        if (isHistoryPinLocked()) return;
        if (!tween && window.innerWidth >= HISTORY_HORIZONTAL_MIN) setup();
        else if (tween) refreshBoundLayout();
      })
      .catch(() => undefined);

    track.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", onLayoutReady, { once: true });
    });

    return () => {
      clearTimeout(resizeTimer);
      retryTimers.forEach((id) => window.clearTimeout(id));
      layoutObserver?.disconnect();
      window.removeEventListener(ABOUT_HISTORY_LAYOUT_READY, onLayoutReady);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onLayoutReady);
      teardown();
    };
  }, [sectionRef, scrollRef]);
}
