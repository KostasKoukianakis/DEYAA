import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  DRIFT_COMPLETE_EVENT,
  MISSION_IMAGE_HANDOFF,
  MISSION_IMAGE_SCROLL_END,
} from "@/hooks/useAboutSustainWaterTravel";

gsap.registerPlugin(ScrollTrigger);

const SCROLLER = document.documentElement;
const DESKTOP_MIN = 900;
const DRIFT_COMPLETE_CLASS = "about-page--sustain-water-drift-complete";
const ACTIVE_CLASS = "about-page--sustain-water-traveling";
const DRIFTING_CLASS = "about-page--sustain-water-drifting";
const MISSION_SCRUB = 1.15;

interface UseAboutMissionAreasImageScrollOptions {
  layoutRef: RefObject<HTMLDivElement | null>;
  visualRef: RefObject<HTMLElement | null>;
  imageSlotRef: RefObject<HTMLDivElement | null>;
  endBlockRef: RefObject<HTMLElement | null>;
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

function measureAlignY(imageSlot: HTMLElement, blockCenterY: number, layout: HTMLElement): number {
  const layoutTop = layout.getBoundingClientRect().top;
  const currentY = Number(gsap.getProperty(imageSlot, "y")) || 0;
  const slotRect = imageSlot.getBoundingClientRect();
  const slotTopAtZero = slotRect.top - currentY - layoutTop;
  const slotCenterAtZero = slotTopAtZero + imageSlot.offsetHeight * 0.5;

  return Math.max(0, blockCenterY - slotCenterAtZero);
}

/** Slot Y after travel handoff — travel hook owns motion until drift-complete */
export function useAboutMissionAreasImageScroll({
  layoutRef,
  visualRef,
  imageSlotRef,
  endBlockRef,
}: UseAboutMissionAreasImageScrollOptions) {
  useEffect(() => {
    const layout = layoutRef.current;
    const visual = visualRef.current;
    const imageSlot = imageSlotRef.current;
    const endBlock = endBlockRef.current;
    const section = document.getElementById("about-mission-areas");
    const aboutPage = document.querySelector<HTMLElement>(".about-page");
    if (!layout || !visual || !imageSlot || !endBlock || !section) return;

    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let st: ScrollTrigger | null = null;

    const travelOwnsSlot = () =>
      aboutPage?.classList.contains(ACTIVE_CLASS) === true ||
      aboutPage?.classList.contains(DRIFTING_CLASS) === true;

    const isHandoffActive = () =>
      reduced.matches ||
      aboutPage?.classList.contains(DRIFT_COMPLETE_CLASS) === true;

    const measureEndY = () => {
      const blockCenterY = measureBlockCenterY(endBlock, layout);
      return measureAlignY(imageSlot, blockCenterY, layout);
    };

    const applyY = (progress: number) => {
      if (travelOwnsSlot()) return;

      if (!isHandoffActive()) {
        gsap.set(imageSlot, { y: 0, force3D: true });
        return;
      }

      const endY = measureEndY();
      const y = gsap.utils.clamp(0, endY, progress * endY);
      gsap.set(imageSlot, { y, force3D: true });
    };

    const syncFromScroll = () => {
      requestAnimationFrame(() => {
        if (st) applyY(st.progress);
      });
    };

    const bind = () => {
      st?.kill();
      st = null;

      if (!mq.matches) {
        gsap.set(imageSlot, { clearProps: "transform" });
        return;
      }

      st = ScrollTrigger.create({
        id: "about-mission-areas-image-scroll",
        trigger: section,
        scroller: SCROLLER,
        start: MISSION_IMAGE_HANDOFF,
        endTrigger: endBlock,
        end: MISSION_IMAGE_SCROLL_END,
        scrub: MISSION_SCRUB,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          applyY(self.progress);
        },
      });

      syncFromScroll();
    };

    bind();

    window.addEventListener(DRIFT_COMPLETE_EVENT, syncFromScroll);
    mq.addEventListener("change", bind);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(syncFromScroll, 200);
    };
    window.addEventListener("resize", onResize);

    const retry = window.setTimeout(syncFromScroll, 400);

    return () => {
      st?.kill();
      window.clearTimeout(retry);
      window.clearTimeout(resizeTimer);
      window.removeEventListener(DRIFT_COMPLETE_EVENT, syncFromScroll);
      mq.removeEventListener("change", bind);
      window.removeEventListener("resize", onResize);
      gsap.set(imageSlot, { clearProps: "transform" });
    };
  }, [layoutRef, visualRef, imageSlotRef, endBlockRef]);
}
