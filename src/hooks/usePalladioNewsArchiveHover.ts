import { RefObject, useEffect } from "react";

const HOVER_COLORS = ["#00587a", "#0098eb", "#80cdf3"] as const;

/**
 * Palladio /news/ — ONE shared .hover-bg panel:
 * - enter list / first row: slides in from the left (translateX)
 * - moving between rows: panel morphs vertically (animated top/height)
 */
export function usePalladioListHover(
  containerRef: RefObject<HTMLElement | null>,
  itemCount: number,
  isReady: boolean,
  rootClass = "palladio-news-archive",
) {
  useEffect(() => {
    const list = containerRef.current;
    if (!list || !isReady || itemCount === 0) return;

    const mq = window.matchMedia("(min-width: 768px)");

    const bind = () => {
      if (!mq.matches) return undefined;

      const bg = list.querySelector<HTMLElement>(`.${rootClass}__hover-bg`);
      if (!bg) return undefined;

      let activeItem: HTMLElement | null = null;

      const items = () =>
        list.querySelectorAll<HTMLElement>(`.${rootClass}__item`);

      const clearHovered = () => {
        items().forEach((item) => item.classList.remove("is-hovered"));
        activeItem = null;
      };

      const positionPanel = (item: HTMLElement, index: number) => {
        const { top, height, width } = item.getBoundingClientRect();
        const listTop = list.getBoundingClientRect().top;

        bg.style.top = `${top - listTop}px`;
        bg.style.height = `${height}px`;
        bg.style.width = `${width}px`;
        bg.style.left = "0";
        bg.style.backgroundColor = HOVER_COLORS[index % 3];
        bg.style.opacity = "1";
        bg.style.transform = "translateX(0)";
        bg.classList.add("is-active");
      };

      const onItemEnter = (item: HTMLElement, index: number) => {
        if (activeItem === item) return;

        clearHovered();
        item.classList.add("is-hovered");
        activeItem = item;
        positionPanel(item, index);
      };

      const onListLeave = () => {
        clearHovered();
        bg.style.transform = "translateX(-100%)";
        bg.style.width = "0";
        bg.style.opacity = "0";
        bg.classList.remove("is-active");
      };

      const reposition = () => {
        if (!activeItem) return;
        const idx = Number(activeItem.dataset.index ?? 0);
        positionPanel(activeItem, idx);
      };

      const itemCleanups: Array<() => void> = [];

      const attachItemListeners = () => {
        itemCleanups.forEach((fn) => fn());
        itemCleanups.length = 0;

        items().forEach((item, index) => {
          const handler = () => onItemEnter(item, index);
          item.addEventListener("mouseenter", handler);
          itemCleanups.push(() => item.removeEventListener("mouseenter", handler));
        });
      };

      attachItemListeners();

      list.addEventListener("mouseleave", onListLeave);
      window.addEventListener("scroll", reposition, { passive: true });
      window.addEventListener("resize", reposition, { passive: true });

      const observer = new MutationObserver(() => {
        attachItemListeners();
      });
      observer.observe(list, { childList: true });

      return () => {
        onListLeave();
        itemCleanups.forEach((fn) => fn());
        list.removeEventListener("mouseleave", onListLeave);
        window.removeEventListener("scroll", reposition);
        window.removeEventListener("resize", reposition);
        observer.disconnect();
      };
    };

    let cleanup: (() => void) | undefined;
    const raf = requestAnimationFrame(() => {
      cleanup = bind();
    });

    const onMqChange = () => {
      cleanup?.();
      cleanup = bind();
    };
    mq.addEventListener("change", onMqChange);

    return () => {
      cancelAnimationFrame(raf);
      cleanup?.();
      mq.removeEventListener("change", onMqChange);
    };
  }, [containerRef, itemCount, isReady, rootClass]);
}

/** @deprecated Use usePalladioListHover — kept for announcements archive */
export function usePalladioNewsArchiveHover(
  containerRef: RefObject<HTMLElement | null>,
  itemCount: number,
  isReady: boolean,
) {
  return usePalladioListHover(containerRef, itemCount, isReady, "palladio-news-archive");
}
