import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ABOUT_HISTORY_LAYOUT_READY, ABOUT_HISTORY_PIN_RELEASED } from "@/hooks/useAboutHistoryTimelineScroll";
import { refreshLenis } from "@/lib/scrollControl";

gsap.registerPlugin(ScrollTrigger);

const SCROLLER = document.documentElement;
const SETTLED_CLASS = "about-page--sustain-water-settled";
const ACTIVE_CLASS = "about-page--sustain-water-traveling";
const DRIFTING_CLASS = "about-page--sustain-water-drifting";
const DRIFT_COMPLETE_CLASS = "about-page--sustain-water-drift-complete";
const DRIFT_COMPLETE_EVENT = "about-sustain-water-drift-complete";

export const MISSION_IMAGE_HANDOFF = "top 60%";
export const MISSION_IMAGE_SCROLL_END = "center center";
export { DRIFT_COMPLETE_EVENT };

const TRAVEL_START = "bottom bottom-=5%";
/** Matches vertical pipe ScrollTrigger end in useAboutHistoryTimelineScroll */
const VERTICAL_PIPE_SCROLL_END = "bottom 18%";
const VERTICAL_PIPE_EXIT_READY = 0.96;
const TRAVEL_SCRUB = 0.85;
const MIN_TRAVEL_SIZE = 52;

const P_DELAY = 0.02;
const P_EMERGE = 0.12;
/** Logical progress when approach leg (pipe → orbit → slot) finishes */
const APPROACH_LOGIC_END = 0.55;
/** Slower size ramp while droplet sits on orbit rings */
const ORBIT_GROW_EASE = 3.4;
/** Pipe exit → orbit — slow vertical descent + grow */
const PIPE_DESCENT_EASE = 2.85;
const PIPE_SIZE_EASE = 2.1;
/** Slot approach — smooth inOut, no snap (was pow > 1) */
const SLOT_DRIFT_EASE = "power2.inOut";

interface TravelRect {
  x: number;
  y: number;
  size: number;
}

interface PhaseMarkers {
  pPipe: number;
  pOrbit: number;
  pSlotArrive: number;
}

function readCenter(rect: DOMRect): TravelRect {
  return {
    x: rect.left + rect.width * 0.5,
    y: rect.top + rect.height * 0.5,
    size: Math.max(rect.width, rect.height, MIN_TRAVEL_SIZE),
  };
}

function probeScrollStart(trigger: Element, start: string): number {
  const probe = ScrollTrigger.create({
    trigger,
    scroller: SCROLLER,
    start,
    end: start,
  });
  const pos = probe.start;
  probe.kill();
  return pos;
}

function probeScrollRange(
  trigger: Element,
  start: string,
  endTrigger: Element,
  end: string,
): { start: number; end: number } {
  const probe = ScrollTrigger.create({
    trigger,
    scroller: SCROLLER,
    start,
    endTrigger,
    end,
  });
  const range = { start: probe.start, end: probe.end };
  probe.kill();
  return range;
}

/** Stretch hub motion across scroll until white entry; white leg uses rest of ST.progress */
function computeApproachShare(
  trigger: Element,
  start: string,
  missionSection: HTMLElement,
  endBlock: Element,
): number {
  const travel = probeScrollRange(trigger, start, endBlock, MISSION_IMAGE_SCROLL_END);
  const handoffAt = probeScrollStart(missionSection, MISSION_IMAGE_HANDOFF);
  const span = Math.max(travel.end - travel.start, 1);
  return gsap.utils.clamp(0.22, 0.58, (handoffAt - travel.start) / span);
}

function computePhaseMarkers(_approachShare: number): PhaseMarkers {
  const end = APPROACH_LOGIC_END;
  return {
    /** Long leg — droplet exits vertical pipe slowly */
    pPipe: end * 0.42,
    /** Grow at orbit center — then smooth move to slot */
    pOrbit: end * 0.72,
    pSlotArrive: end,
  };
}

function remapStProgress(stProgress: number, approachShare: number): number {
  const p = gsap.utils.clamp(0, 1, stProgress);
  if (p <= approachShare) {
    return gsap.utils.mapRange(0, approachShare, 0, APPROACH_LOGIC_END, p);
  }
  return gsap.utils.mapRange(approachShare, 1, APPROACH_LOGIC_END, 1, p);
}

function measureBlockCenterY(block: HTMLElement, layout: HTMLElement): number {
  const layoutTop = layout.getBoundingClientRect().top;
  const head = block.querySelector<HTMLElement>(".about-mission-areas__block-head");
  const footnote = block.querySelector<HTMLElement>(".about-mission-areas__figures-footnote");

  if (head && footnote) {
    const top = head.getBoundingClientRect().top - layoutTop;
    const bottom = footnote.getBoundingClientRect().bottom - layoutTop;
    return (top + bottom) * 0.5;
  }

  const rect = block.getBoundingClientRect();
  return rect.top - layoutTop + rect.height * 0.5;
}

function measureSlotAlignY(
  imageSlot: HTMLElement,
  blockCenterY: number,
  layout: HTMLElement,
): number {
  const layoutTop = layout.getBoundingClientRect().top;
  const currentY = Number(gsap.getProperty(imageSlot, "y")) || 0;
  const slotRect = imageSlot.getBoundingClientRect();
  const slotTopAtZero = slotRect.top - currentY - layoutTop;
  const slotCenterAtZero = slotTopAtZero + imageSlot.offsetHeight * 0.5;

  return Math.max(0, blockCenterY - slotCenterAtZero);
}

function isVerticalHistoryLayout(): boolean {
  const spine = document.querySelector<HTMLElement>(".about-history-vertical-spine");
  if (!spine) return false;
  return getComputedStyle(spine).display !== "none";
}

interface PipeExitNodes {
  exitGrow: HTMLElement;
  exitTrigger: HTMLElement;
}

function queryPipeExitNodes(): PipeExitNodes | null {
  if (isVerticalHistoryLayout()) {
    const exitGrow = document.querySelector<HTMLElement>(
      ".about-history-vertical-spine__exit-drop-grow",
    );
    if (!exitGrow) return null;

    const exitTip = document.querySelector<HTMLElement>(
      ".about-history-vertical-spine__exit-tip",
    );

    return {
      exitGrow,
      exitTrigger: exitTip ?? exitGrow,
    };
  }

  const exitGrow = document.querySelector<HTMLElement>(
    ".about-history-timeline-pipe__exit-grow",
  );
  if (!exitGrow) return null;

  const exitTip = document.querySelector<HTMLElement>(
    ".about-history-timeline-pipe__exit-tip",
  );

  return {
    exitGrow,
    exitTrigger: exitTip ?? exitGrow,
  };
}

function isVerticalPipeExitReady(): boolean {
  const exitDrop = document.querySelector<HTMLElement>(
    ".about-history-vertical-spine__exit-drop-grow",
  );
  if (!exitDrop) return false;
  const scaleY = Math.abs(Number(gsap.getProperty(exitDrop, "scaleY")) || 0);
  return scaleY >= VERTICAL_PIPE_EXIT_READY;
}

interface TravelScrollBinding {
  trigger: HTMLElement;
  start: string;
  approachAnchor: HTMLElement;
}

function resolveTravelScrollBinding(pipeExit: PipeExitNodes): TravelScrollBinding | null {
  if (isVerticalHistoryLayout()) {
    const milestonesTrack = document.querySelector<HTMLElement>(
      ".about-history__milestones-track",
    );
    if (!milestonesTrack) return null;

    return {
      trigger: milestonesTrack,
      start: VERTICAL_PIPE_SCROLL_END,
      approachAnchor: pipeExit.exitTrigger,
    };
  }

  return {
    trigger: pipeExit.exitTrigger,
    start: TRAVEL_START,
    approachAnchor: pipeExit.exitTrigger,
  };
}

function measurePipeTip(): TravelRect | null {
  const nodes = queryPipeExitNodes();
  if (!nodes) return null;

  if (isVerticalHistoryLayout() && !isVerticalPipeExitReady()) {
    return null;
  }

  const { exitGrow, exitTrigger } = nodes;
  const growRect = exitGrow.getBoundingClientRect();
  const pw = growRect.width || exitGrow.offsetWidth;
  if (pw <= 0) return null;

  const scaleY = Math.abs(Number(gsap.getProperty(exitGrow, "scaleY")) || 0);
  const tipRect = exitTrigger.getBoundingClientRect();

  if (tipRect.height > 0 && scaleY > 0.08) {
    return {
      x: growRect.left + pw * 0.5,
      y: tipRect.top + tipRect.height * 0.5,
      size: Math.max(pw, MIN_TRAVEL_SIZE),
    };
  }

  const fullHeight = exitGrow.offsetHeight;
  const visibleY =
    scaleY > 0.02
      ? growRect.top + fullHeight * scaleY
      : growRect.top + Math.min(fullHeight * 0.12, 48);

  return {
    x: growRect.left + pw * 0.5,
    y: visibleY - Math.max(pw * 0.08, 2),
    size: Math.max(pw, MIN_TRAVEL_SIZE),
  };
}

function measureOrbitCenter(): TravelRect | null {
  const frame = document.querySelector<HTMLElement>(
    ".about-mission-hub__center-frame",
  );
  if (frame) {
    const rect = frame.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return readCenter(rect);
  }

  const orbitCenter = document.querySelector<HTMLElement>(
    ".about-mission-hub__orbit-center",
  );
  if (orbitCenter) {
    const rect = orbitCenter.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return readCenter(rect);
  }

  const stage = document.querySelector<HTMLElement>(
    ".about-mission-hub__orbit-stage",
  );
  if (stage) {
    const rect = stage.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      return {
        x: rect.left + rect.width * 0.5,
        y: rect.top + rect.height * 0.5,
        size: Math.max(rect.width * 0.4, MIN_TRAVEL_SIZE),
      };
    }
  }

  return null;
}

function measureSlotAtZero(imageSlot: HTMLElement, fallback: TravelRect): TravelRect {
  const currentY = Number(gsap.getProperty(imageSlot, "y")) || 0;
  const rect = imageSlot.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);

  if (size > 0) {
    return {
      x: rect.left + rect.width * 0.5,
      y: rect.top + rect.height * 0.5 - currentY,
      size: Math.max(size, MIN_TRAVEL_SIZE),
    };
  }

  return {
    x: fallback.x - Math.min(window.innerWidth * 0.24, 300),
    y: fallback.y + Math.min(window.innerHeight * 0.22, 240),
    size: Math.max(fallback.size, MIN_TRAVEL_SIZE),
  };
}

function measureSlotLive(imageSlot: HTMLElement): TravelRect {
  const rect = imageSlot.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height, MIN_TRAVEL_SIZE);
  return {
    x: rect.left + rect.width * 0.5,
    y: rect.top + rect.height * 0.5,
    size,
  };
}

function lerpRectLinear(a: TravelRect, b: TravelRect, t: number, sizeT = t): TravelRect {
  const eased = gsap.parseEase(SLOT_DRIFT_EASE)(gsap.utils.clamp(0, 1, t));
  const easedSize = gsap.parseEase(SLOT_DRIFT_EASE)(gsap.utils.clamp(0, 1, sizeT));
  return {
    x: gsap.utils.interpolate(a.x, b.x, eased),
    y: gsap.utils.interpolate(a.y, b.y, eased),
    size: gsap.utils.interpolate(a.size, b.size, easedSize),
  };
}

function lerpPipeToOrbit(pipe: TravelRect, orbit: TravelRect, t: number): TravelRect {
  const clamped = gsap.utils.clamp(0, 1, t);
  const moveT = gsap.parseEase("power2.inOut")(Math.pow(clamped, PIPE_DESCENT_EASE));
  const sizeT = gsap.parseEase("power2.inOut")(Math.pow(clamped, PIPE_SIZE_EASE));
  return {
    x: gsap.utils.interpolate(pipe.x, orbit.x, moveT),
    y: gsap.utils.interpolate(pipe.y, orbit.y, moveT),
    size: gsap.utils.interpolate(pipe.size, orbit.size, sizeT),
  };
}

function paintTravel(travelEl: HTMLElement, rect: TravelRect, opacity = 1) {
  const size = Math.max(rect.size, MIN_TRAVEL_SIZE);
  travelEl.style.left = `${rect.x}px`;
  travelEl.style.top = `${rect.y}px`;
  travelEl.style.width = `${size}px`;
  travelEl.style.height = `${size}px`;
  travelEl.style.opacity = String(gsap.utils.clamp(0, 1, opacity));
  travelEl.style.visibility = opacity > 0.02 ? "visible" : "hidden";
}

function hideTravel(travelEl: HTMLElement) {
  travelEl.style.opacity = "0";
  travelEl.style.visibility = "hidden";
}

const MOBILE_MISSION_MAX_WIDTH = 899;

function isMobileMissionLayout(): boolean {
  return window.innerWidth <= MOBILE_MISSION_MAX_WIDTH;
}

interface UseAboutSustainWaterTravelOptions {
  travelRef: RefObject<HTMLElement | null>;
}

/** sustain_water: pipe → orbit → slot → white column (single traveler, handoff at end only) */
export function useAboutSustainWaterTravel({ travelRef }: UseAboutSustainWaterTravelOptions) {
  useEffect(() => {
    const travelEl = travelRef.current;
    const aboutPage = document.querySelector<HTMLElement>(".about-page");
    const historySection = document.getElementById("about-history");
    const missionSection = document.getElementById("about-mission-areas");
    const missionHubSection = document.getElementById("about-vision");
    if (!travelEl || !aboutPage || !historySection || !missionSection) return;

    hideTravel(travelEl);

    let st: ScrollTrigger | null = null;
    let hasSettledOrbit = false;
    let cachedPipe: TravelRect | null = null;
    let cachedOrbit: TravelRect | null = null;
    let handoffDone = false;
    let travelEnabled = false;
    let approachShare = 0.32;
    let phases: PhaseMarkers = computePhaseMarkers(approachShare);
    let resizeTimer: ReturnType<typeof setTimeout>;

    const getMissionNodes = () => {
      const imageSlot = document.querySelector<HTMLElement>(".about-mission-areas__image-slot");
      const layout = document.querySelector<HTMLElement>(".about-mission-areas__layout");
      const visionBlock = document.querySelector<HTMLElement>(
        ".about-mission-areas__content .about-mission-areas__block:first-child",
      );
      const endBlock = document.querySelector<HTMLElement>(
        ".about-mission-areas__content .about-mission-areas__block:last-child",
      );
      return { imageSlot, layout, visionBlock, endBlock };
    };

    const resetSlotY = () => {
      const { imageSlot } = getMissionNodes();
      if (imageSlot) gsap.set(imageSlot, { y: 0, force3D: true });
    };

    const markOrbitSettled = () => {
      if (hasSettledOrbit) return;
      hasSettledOrbit = true;
      aboutPage.classList.add(SETTLED_CLASS);
    };

    const unmarkOrbitSettled = () => {
      if (!hasSettledOrbit) return;
      hasSettledOrbit = false;
      aboutPage.classList.remove(SETTLED_CLASS);
    };

    const setHandoff = (complete: boolean) => {
      handoffDone = complete;
      const was = aboutPage.classList.contains(DRIFT_COMPLETE_CLASS);
      aboutPage.classList.toggle(DRIFT_COMPLETE_CLASS, complete);
      if (complete && !was) {
        window.dispatchEvent(new CustomEvent(DRIFT_COMPLETE_EVENT));
      }
    };

    const completeHandoff = () => {
      if (handoffDone) return;
      hideTravel(travelEl);
      markOrbitSettled();
      aboutPage.classList.remove(ACTIVE_CLASS, DRIFTING_CLASS);
      if (isMobileMissionLayout()) {
        const { imageSlot } = getMissionNodes();
        if (imageSlot) gsap.set(imageSlot, { y: 0, clearProps: "transform" });
      }
      setHandoff(true);
    };

    const fullReset = () => {
      handoffDone = false;
      unmarkOrbitSettled();
      aboutPage.classList.remove(ACTIVE_CLASS, DRIFTING_CLASS, DRIFT_COMPLETE_CLASS);
      hideTravel(travelEl);
      resetSlotY();
    };

    const resolveOrbit = (): TravelRect | null => {
      const live = measureOrbitCenter();
      if (live) {
        cachedOrbit = live;
        return live;
      }
      return cachedOrbit;
    };

    const resolvePipe = (orbit: TravelRect): TravelRect => {
      const live = measurePipeTip();
      if (live) {
        cachedPipe = live;
        return live;
      }
      if (cachedPipe) return cachedPipe;
      return {
        x: orbit.x,
        y: orbit.y + Math.min(window.innerHeight * 0.16, 160),
        size: Math.max(orbit.size * 0.12, MIN_TRAVEL_SIZE),
      };
    };

    const applyWhiteSectionDrift = (progress: number): TravelRect | null => {
      const { imageSlot, layout, endBlock } = getMissionNodes();
      if (!imageSlot || !layout || !endBlock) return null;

      if (isMobileMissionLayout()) {
        gsap.set(imageSlot, { y: 0, force3D: true });
        return cachedOrbit
          ? {
              x: cachedOrbit.x,
              y: cachedOrbit.y,
              size: cachedOrbit.size * 1.04,
            }
          : resolveOrbit();
      }

      const endY = measureSlotAlignY(
        imageSlot,
        measureBlockCenterY(endBlock, layout),
        layout,
      );
      const whiteT = gsap.utils.mapRange(phases.pSlotArrive, 1, 0, 1, progress);
      const y = endY * gsap.utils.clamp(0, 1, gsap.parseEase("power2.inOut")(whiteT));
      gsap.set(imageSlot, { y, force3D: true });

      return measureSlotLive(imageSlot);
    };

    const rectAtProgress = (progress: number): TravelRect | null => {
      const orbit = resolveOrbit();
      if (!orbit) return null;

      const { imageSlot } = getMissionNodes();
      const slotZero = imageSlot ? measureSlotAtZero(imageSlot, orbit) : null;

      if (progress <= P_DELAY) return null;

      if (progress <= phases.pPipe) {
        const t = gsap.utils.mapRange(P_DELAY, phases.pPipe, 0, 1, progress);
        const pipeLive = resolvePipe(orbit);
        const orbitNow = resolveOrbit() ?? orbit;
        return lerpPipeToOrbit(pipeLive, orbitNow, t);
      }

      if (progress <= phases.pOrbit) {
        const t = gsap.utils.mapRange(phases.pPipe, phases.pOrbit, 0, 1, progress);
        const growT = Math.pow(t, ORBIT_GROW_EASE);
        const orbitNow = resolveOrbit() ?? orbit;
        return {
          x: orbitNow.x,
          y: orbitNow.y,
          size: gsap.utils.interpolate(orbitNow.size, orbitNow.size * 1.04, growT),
        };
      }

      if (progress <= phases.pSlotArrive) {
        const driftRaw = gsap.utils.mapRange(phases.pOrbit, phases.pSlotArrive, 0, 1, progress);
        const t = gsap.utils.clamp(0, 1, driftRaw);
        if (isMobileMissionLayout()) {
          return cachedOrbit
            ? {
                x: cachedOrbit.x,
                y: cachedOrbit.y,
                size: cachedOrbit.size * 1.04,
              }
            : resolveOrbit();
        }
        if (!slotZero) return null;
        const orbitNow = resolveOrbit() ?? orbit;
        const orbitEnd = {
          x: orbitNow.x,
          y: orbitNow.y,
          size: orbitNow.size * 1.04,
        };
        return lerpRectLinear(orbitEnd, slotZero, t, t);
      }

      return applyWhiteSectionDrift(progress);
    };

    const emergeOpacity = (progress: number): number => {
      if (progress <= P_DELAY) return 0;
      if (progress >= phases.pPipe * 0.35) return 1;
      const t = gsap.utils.mapRange(P_DELAY, phases.pPipe * 0.35, 0, 1, progress);
      const fade = gsap.utils.clamp(0, 1, t / P_EMERGE);
      return gsap.parseEase("power2.out")(fade);
    };

    const applyProgress = (stProgress: number, options?: { allowComplete?: boolean }) => {
      const p = remapStProgress(stProgress, approachShare);
      const allowComplete = options?.allowComplete === true;

      if (p < 0.985 && handoffDone && !isMobileMissionLayout()) {
        handoffDone = false;
        setHandoff(false);
      }

      if (isMobileMissionLayout() && handoffDone && p < phases.pOrbit * 0.92) {
        handoffDone = false;
        setHandoff(false);
      }

      if (handoffDone) {
        hideTravel(travelEl);
        return;
      }

      if (isVerticalHistoryLayout() && !isVerticalPipeExitReady()) {
        hideTravel(travelEl);
        aboutPage.classList.remove(ACTIVE_CLASS, DRIFTING_CLASS);
        return;
      }

      if (p <= 0.001 || p <= P_DELAY) {
        hideTravel(travelEl);
        aboutPage.classList.remove(ACTIVE_CLASS, DRIFTING_CLASS);
        setHandoff(false);
        if (p <= P_DELAY) {
          unmarkOrbitSettled();
          resetSlotY();
        }
        return;
      }

      if (p > phases.pOrbit + 0.01 && !isMobileMissionLayout()) {
        aboutPage.classList.add(DRIFTING_CLASS);
      } else {
        aboutPage.classList.remove(DRIFTING_CLASS);
      }

      /* Mobile: hand off to static hub image once orbit is reached — no scroll tracking */
      if (isMobileMissionLayout() && p >= phases.pOrbit) {
        if (p >= phases.pPipe * 0.55) {
          markOrbitSettled();
        }
        completeHandoff();
        return;
      }

      if (stProgress >= 0.999 && allowComplete) {
        applyWhiteSectionDrift(1);
        const rect = rectAtProgress(1);
        if (rect) paintTravel(travelEl, rect, 1);
        completeHandoff();
        return;
      }

      const rect = rectAtProgress(p);
      if (!rect) return;

      aboutPage.classList.add(ACTIVE_CLASS);
      setHandoff(false);
      paintTravel(travelEl, rect, emergeOpacity(p));

      if (p < phases.pPipe * 0.45) {
        unmarkOrbitSettled();
      } else if (p >= phases.pPipe * 0.55) {
        markOrbitSettled();
      }
    };

    const bindScrollTrigger = () => {
      const { imageSlot, endBlock, visionBlock } = getMissionNodes();
      const pipeExit = queryPipeExitNodes();
      const scrollBinding = pipeExit ? resolveTravelScrollBinding(pipeExit) : null;
      const scrollEndBlock = isMobileMissionLayout()
        ? (missionHubSection ?? visionBlock ?? endBlock)
        : endBlock;
      if (!imageSlot || !scrollEndBlock || !pipeExit || !scrollBinding || !travelEnabled) return false;

      approachShare = computeApproachShare(
        scrollBinding.trigger,
        scrollBinding.start,
        missionSection,
        scrollEndBlock,
      );
      phases = computePhaseMarkers(approachShare);
      cachedOrbit = measureOrbitCenter();
      cachedPipe = measurePipeTip();

      st?.kill();
      st = ScrollTrigger.create({
        id: "about-sustain-water-travel",
        trigger: scrollBinding.trigger,
        scroller: SCROLLER,
        start: scrollBinding.start,
        endTrigger: scrollEndBlock,
        end: MISSION_IMAGE_SCROLL_END,
        scrub: TRAVEL_SCRUB,
        invalidateOnRefresh: true,
        onUpdate: (self) => applyProgress(self.progress, { allowComplete: true }),
        onEnter: (self) => applyProgress(self.progress, { allowComplete: true }),
        onEnterBack: () => {
          if (handoffDone) {
            handoffDone = false;
            setHandoff(false);
          }
          if (st) applyProgress(st.progress, { allowComplete: true });
        },
        onLeaveBack: () => {
          fullReset();
        },
      });

      syncTravelFromTrigger(false);
      return true;
    };

    const syncTravelFromTrigger = (allowComplete: boolean) => {
      if (!st) return;
      const animP = remapStProgress(st.progress, approachShare);
      if (st.isActive || (animP > P_DELAY && st.progress < 0.999)) {
        applyProgress(st.progress, { allowComplete });
      } else if (st.progress <= 0.001 && !handoffDone) {
        fullReset();
      }
    };

    const refreshTravelTrigger = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!travelEnabled) return;

      if (!bindScrollTrigger()) return;

      cachedOrbit = measureOrbitCenter();
      cachedPipe = measurePipeTip();
      const { endBlock, visionBlock } = getMissionNodes();
      const scrollEndBlock = isMobileMissionLayout()
        ? (missionHubSection ?? visionBlock ?? endBlock)
        : endBlock;
      const pipeExit = queryPipeExitNodes();
      const scrollBinding = pipeExit ? resolveTravelScrollBinding(pipeExit) : null;
      if (scrollBinding && scrollEndBlock) {
        approachShare = computeApproachShare(
          scrollBinding.trigger,
          scrollBinding.start,
          missionSection,
          scrollEndBlock,
        );
        phases = computePhaseMarkers(approachShare);
      }
      st?.refresh();
      ScrollTrigger.refresh();
      refreshLenis();
      syncTravelFromTrigger(false);
    };

    const setup = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        markOrbitSettled();
        setHandoff(true);
        hideTravel(travelEl);
        return;
      }

      if (bindScrollTrigger()) {
        ScrollTrigger.refresh();
        refreshLenis();
        syncTravelFromTrigger(false);
      }
    };

    const enableTravel = () => {
      if (travelEnabled) {
        refreshTravelTrigger();
        return;
      }
      travelEnabled = true;
      setup();
    };

    const onLayoutReady = () => {
      const historyPinActive = historySection.classList.contains("is-horizontal-pinned");
      if (!travelEnabled && !historyPinActive) {
        enableTravel();
        return;
      }
      if (travelEnabled) refreshTravelTrigger();
    };
    const onHistoryPinReleased = () => enableTravel();

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(refreshTravelTrigger, 200);
    };

    window.addEventListener(ABOUT_HISTORY_LAYOUT_READY, onLayoutReady);
    window.addEventListener(ABOUT_HISTORY_PIN_RELEASED, onHistoryPinReleased);
    window.addEventListener("resize", onResize);

    return () => {
      st?.kill();
      window.clearTimeout(resizeTimer);
      window.removeEventListener(ABOUT_HISTORY_LAYOUT_READY, onLayoutReady);
      window.removeEventListener(ABOUT_HISTORY_PIN_RELEASED, onHistoryPinReleased);
      window.removeEventListener("resize", onResize);
      travelEnabled = false;
      aboutPage.classList.remove(
        ACTIVE_CLASS,
        SETTLED_CLASS,
        DRIFTING_CLASS,
        DRIFT_COMPLETE_CLASS,
      );
      resetSlotY();
      travelEl.removeAttribute("style");
    };
  }, [travelRef]);
}
