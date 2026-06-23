import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { updateAboutPageShaderOpacity } from "@/lib/aboutPageShaderOpacity";
import { refreshLenis } from "@/lib/scrollControl";

gsap.registerPlugin(ScrollTrigger);

const PINNED_CLASS = "is-horizontal-pinned";
const GSAP_MIN = 640;
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

function getHorizontalDistance(el: HTMLElement) {
  const viewport = document.documentElement.clientWidth;
  const fromScrollWidth = el.scrollWidth - viewport;
  const fromChildren = Array.from(el.children)
    .filter((child) => {
      const node = child as HTMLElement;
      return (
        !node.classList.contains("about-history__track-tail") &&
        !node.classList.contains("about-history-timeline-pipe")
      );
    })
    .reduce((sum, child) => sum + (child as HTMLElement).offsetWidth, 0);
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
 * Palladio /group/ timeline — vertical scroll scrubs horizontal track (desktop+tablet).
 * Below GSAP_MIN: native overflow-x swipe on the timeline track (CSS).
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
    let onTrackScroll: (() => void) | null = null;

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
      if (onTrackScroll) {
        track.removeEventListener("scroll", onTrackScroll);
        onTrackScroll = null;
      }
      section.classList.remove(PINNED_CLASS);
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
          ".about-history__lead, .about-history__journey-title-line1, .about-history__journey-title-line2, .about-history__chapter-slide--origin .about-history__chapter-title-line",
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
      const originLines = track.querySelectorAll<HTMLElement>(
        ".about-history__chapter-slide--origin .about-history__chapter-title-line",
      );

      const targets = [
        introLead,
        journeyLine1,
        journeyLine2,
        ...Array.from(originLines),
      ].filter(Boolean) as HTMLElement[];

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
      originLines.forEach((line) => gsap.set(line, { opacity: 0, x: 36 }));

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

      if (originLines.length) {
        const originTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            scroller: SCROLLER,
            start: "top bottom",
            end: "top top",
            scrub: 1.85,
            invalidateOnRefresh: true,
          },
        });

        let at = 0.38;
        originLines.forEach((line) => {
          originTl.to(line, { opacity: 1, x: 0, ease: "none", duration: 0.55 }, at);
          at += 0.24;
        });

        if (originTl.scrollTrigger) stepTriggers.push(originTl.scrollTrigger);
      }
    };

    const createStepCardReveals = (horizontalTween: gsap.core.Tween | gsap.core.Timeline) => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      track.querySelectorAll<HTMLElement>(".about-history__step").forEach((step) => {
        const content = step.querySelector<HTMLElement>(".about-history__step-content");
        const eyebrow = step.querySelector<HTMLElement>(".about-history__step-eyebrow");
        const title = step.querySelector<HTMLElement>(".about-history__step-title");
        const desc = step.querySelector<HTMLElement>(".about-history__step-desc");
        if (!content) return;

        const isTop = step.classList.contains("about-history__step--top");
        const driftY = isTop ? -14 : 14;

        if (reducedMotion) {
          gsap.set(content, { opacity: 1, x: 0, scale: 1, filter: "none", clipPath: "inset(0% 0% 0% 0% round 14px)" });
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

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            containerAnimation: horizontalTween,
            start: "left 90%",
            end: "left 48%",
            scrub: 0.95,
          },
        });

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
      });
    };

    const getStepCardRevealProgress = (step: HTMLElement) => {
      const pinRect = section.getBoundingClientRect();
      const focusX = pinRect.left + pinRect.width * 0.54;
      const stepRect = step.getBoundingClientRect();
      const stepCx = stepRect.left + stepRect.width * 0.42;
      const span = pinRect.width * 0.48;
      const raw = 1 - Math.min(1, Math.abs(focusX - stepCx) / span);
      return gsap.parseEase("power2.out")(Math.max(0, raw));
    };

    const applyStepCardReveal = (step: HTMLElement, progress: number, reducedMotion: boolean) => {
      const content = step.querySelector<HTMLElement>(".about-history__step-content");
      const eyebrow = step.querySelector<HTMLElement>(".about-history__step-eyebrow");
      const title = step.querySelector<HTMLElement>(".about-history__step-title");
      const desc = step.querySelector<HTMLElement>(".about-history__step-desc");
      if (!content) return;

      const isTop = step.classList.contains("about-history__step--top");
      const driftY = isTop ? -14 : 14;

      if (reducedMotion || progress >= 1) {
        gsap.set(content, { opacity: 1, x: 0, scale: 1, filter: "none", clipPath: "inset(0% 0% 0% 0% round 14px)" });
        gsap.set([eyebrow, title, desc], { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }

      if (progress <= 0) {
        gsap.set(content, {
          opacity: 0,
          x: -40,
          scale: 0.9,
          clipPath: "inset(12% 100% 12% 0% round 14px)",
          filter: "blur(5px)",
        });
        if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: driftY * 0.65 });
        if (title) gsap.set(title, { opacity: 0, y: driftY });
        if (desc) gsap.set(desc, { opacity: 0, y: driftY * 0.85, filter: "blur(8px)" });
        return;
      }

      const shellP = gsap.utils.clamp(0, 1, progress / 0.55);
      const shellEase = gsap.parseEase("power3.out")(shellP);
      const eyebrowP = gsap.parseEase("power2.out")(gsap.utils.clamp(0, 1, (progress - 0.22) / 0.38));
      const titleP = gsap.parseEase("power2.out")(gsap.utils.clamp(0, 1, (progress - 0.36) / 0.38));
      const descP = gsap.parseEase("power2.out")(gsap.utils.clamp(0, 1, (progress - 0.5) / 0.42));
      const focusP =
        progress > 0.78
          ? gsap.parseEase("sine.inOut")(gsap.utils.clamp(0, 1, (progress - 0.78) / 0.22))
          : 0;
      const focusScale = focusP < 0.5 ? focusP * 2 * 0.025 : (1 - focusP) * 2 * 0.025;

      gsap.set(content, {
        opacity: shellEase,
        x: gsap.utils.interpolate(-40, 0, shellEase),
        scale: gsap.utils.interpolate(0.9, 1, shellEase) + focusScale,
        clipPath: `inset(${gsap.utils.interpolate(12, 0, shellEase)}% ${gsap.utils.interpolate(100, 0, shellEase)}% ${gsap.utils.interpolate(12, 0, shellEase)}% 0% round 14px)`,
        filter: `blur(${gsap.utils.interpolate(5, 0, shellEase)}px)`,
      });
      if (eyebrow) {
        gsap.set(eyebrow, {
          opacity: eyebrowP,
          y: gsap.utils.interpolate(driftY * 0.65, 0, eyebrowP),
        });
      }
      if (title) {
        gsap.set(title, { opacity: titleP, y: gsap.utils.interpolate(driftY, 0, titleP) });
      }
      if (desc) {
        gsap.set(desc, {
          opacity: descP,
          y: gsap.utils.interpolate(driftY * 0.85, 0, descP),
          filter: `blur(${gsap.utils.interpolate(8, 0, descP)}px)`,
        });
      }
    };

    const updateAllStepCards = (reducedMotion: boolean) => {
      track.querySelectorAll<HTMLElement>(".about-history__step").forEach((step) => {
        const progress = reducedMotion ? 1 : getStepCardRevealProgress(step);
        applyStepCardReveal(step, progress, reducedMotion);
      });
    };

    const initMobileStepCards = () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      updateAllStepCards(reducedMotion);
    };

    const createChapterSlideReveals = (horizontalTween: gsap.core.Tween | gsap.core.Timeline) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      track
        .querySelectorAll<HTMLElement>(
          ".about-history__chapter-slide:not(.about-history__chapter-slide--origin)",
        )
        .forEach((el) => {
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

    const bindMobilePipeScroll = () => {
      const parts = getPipeParts();
      if (!parts?.grow || !parts.corner || !parts.horiz) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        parts.grow.style.transform = "scaleY(1)";
        parts.corner.style.opacity = "1";
        parts.horiz.style.transform = "scaleX(1)";
        parts.horiz.style.clipPath = HORIZ_CLIP_TO;
        if (parts.cornerEnd) parts.cornerEnd.style.opacity = "1";
        if (parts.exitGrow) parts.exitGrow.style.transform = "scaleY(1)";
        track.querySelectorAll<HTMLElement>(".about-history__step").forEach((step) => {
          setBranchPipeProgress(step, 1, true);
        });
        return;
      }

      onTrackScroll = () => {
        const max = track.scrollWidth - track.clientWidth;
        const progress = max > 0 ? track.scrollLeft / max : 0;
        const vertEnd = PIPE_VERT_SCROLL_RATIO;
        const exitShare = PIPE_EXIT_SCROLL_RATIO;
        const horizEnd = 1 - exitShare;
        const exitStart = horizEnd;

        if (progress < vertEnd * 0.72) {
          parts.grow!.style.transform = `scaleY(${progress / (vertEnd * 0.72)})`;
          parts.corner!.style.opacity = "0";
          parts.horiz!.style.transform = "scaleX(1)";
          parts.horiz!.style.clipPath = HORIZ_CLIP_FROM;
          if (parts.cornerEnd) parts.cornerEnd.style.opacity = "0";
          if (parts.exitGrow) parts.exitGrow.style.transform = "scaleY(0)";
        } else if (progress < vertEnd) {
          parts.grow!.style.transform = "scaleY(1)";
          const cornerP = (progress - vertEnd * 0.72) / (vertEnd * 0.28);
          parts.corner!.style.opacity = String(Math.min(1, cornerP));
          parts.horiz!.style.transform = "scaleX(1)";
          parts.horiz!.style.clipPath = HORIZ_CLIP_FROM;
          if (parts.cornerEnd) parts.cornerEnd.style.opacity = "0";
          if (parts.exitGrow) parts.exitGrow.style.transform = "scaleY(0)";
        } else {
          parts.grow!.style.transform = "scaleY(1)";
          parts.corner!.style.opacity = "1";

          if (progress < horizEnd) {
            const horizP = (progress - vertEnd) / (horizEnd - vertEnd);
            parts.horiz!.style.transform = "scaleX(1)";
            parts.horiz!.style.clipPath = `inset(0 ${(1 - Math.max(0, horizP)) * 100}% 0 0 round 1px)`;
            if (parts.cornerEnd) parts.cornerEnd.style.opacity = "0";
            if (parts.exitGrow) parts.exitGrow.style.transform = "scaleY(0)";
          } else {
            parts.horiz!.style.transform = "scaleX(1)";
            parts.horiz!.style.clipPath = HORIZ_CLIP_TO;
            const exitP = (progress - exitStart) / (1 - exitStart);
            if (parts.cornerEnd) {
              parts.cornerEnd.style.opacity = String(Math.min(1, exitP * 2.5));
            }
            if (parts.exitGrow) {
              parts.exitGrow.style.transform = `scaleY(${Math.max(0, Math.min(1, exitP))})`;
            }
          }
        }

        updateChapterBgsFromTrack();
        updateShaderReveal(track.scrollLeft / Math.max(track.clientWidth, 1));
        updateAllBranchPipes(false);
        updateAllStepCards(false);
      };

      track.addEventListener("scroll", onTrackScroll, { passive: true });
      onTrackScroll();
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

      if (window.innerWidth < GSAP_MIN) {
        track.setAttribute("data-lenis-prevent", "");
        layoutTimelinePipe(track);
        bindMobilePipeScroll();
        bindShaderReveal(null);
        createIntroTextReveals(true);
        initMobileStepCards();
        refreshScrollLayout();
        return;
      }

      if (createTween()) {
        return;
      }

      layoutObserver = new ResizeObserver(() => {
        if (window.innerWidth < GSAP_MIN) return;
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
    };

    setup();

    [100, 400, 900, 1600, 2800].forEach((ms) => {
      retryTimers.push(
        window.setTimeout(() => {
          if (isHistoryPinLocked()) return;
          if (!tween && window.innerWidth >= GSAP_MIN) {
            setup();
          } else if (tween) {
            refreshBoundLayout();
          }
        }, ms),
      );
    });

    const onLayoutReady = () => {
      if (isHistoryPinLocked()) return;
      if (!tween && window.innerWidth >= GSAP_MIN) {
        setup();
      } else if (tween) {
        refreshBoundLayout();
      }
    };
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (isHistoryPinLocked()) return;
        if (tween && window.innerWidth >= GSAP_MIN) {
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
        if (!tween && window.innerWidth >= GSAP_MIN) setup();
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
