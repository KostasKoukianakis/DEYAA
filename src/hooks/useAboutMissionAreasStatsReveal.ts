import { RefObject, useEffect } from "react";
import gsap from "gsap";

interface CountMeta {
  countTo: number;
  prefix: string;
  decimals: number;
}

function parseCountMeta(valueEl: HTMLElement): CountMeta | null {
  const raw = valueEl.dataset.countTo;
  if (!raw) return null;
  const countTo = Number(raw);
  if (!Number.isFinite(countTo)) return null;
  return {
    countTo,
    prefix: valueEl.dataset.countPrefix ?? "",
    decimals: Number(valueEl.dataset.countDecimals ?? "0") || 0,
  };
}

function formatCountValue(count: CountMeta, value: number) {
  const n =
    count.decimals > 0 ? value.toFixed(count.decimals) : String(Math.round(value));
  return `${count.prefix}${n}`;
}

function revealBlockInstantly(block: HTMLElement) {
  block.querySelectorAll<HTMLElement>(".about-mission-areas__block-head").forEach((el) => {
    gsap.set(el, { opacity: 1, y: 0, clearProps: "transform,opacity" });
  });
  block.querySelectorAll<HTMLElement>(".about-mission-areas__figures-footnote").forEach((el) => {
    gsap.set(el, { opacity: 1, y: 0, clearProps: "transform,opacity" });
  });
  block.querySelectorAll<HTMLElement>(".about-mission-areas__stat-row").forEach((row) => {
    row.querySelectorAll<HTMLElement>(".about-mission-areas__stat-metric").forEach((el) => {
      gsap.set(el, { opacity: 1, y: 0, scale: 1, clearProps: "transform,opacity" });
    });
    row.querySelectorAll<HTMLElement>(".about-mission-areas__stat-label").forEach((el) => {
      gsap.set(el, { opacity: 1, y: 0, clearProps: "transform,opacity" });
    });
    row.querySelectorAll<HTMLElement>(".about-mission-areas__stat-desc").forEach((el) => {
      gsap.set(el, { opacity: 1, y: 0, clearProps: "transform,opacity" });
    });
    row.querySelectorAll<HTMLElement>(".about-mission-areas__stat-metric-unit").forEach((el) => {
      gsap.set(el, { opacity: 0.3, clearProps: "opacity" });
    });

    const valueEl = row.querySelector<HTMLElement>(".about-mission-areas__stat-metric-value");
    const count = valueEl ? parseCountMeta(valueEl) : null;
    if (valueEl && count) {
      valueEl.textContent = formatCountValue(count, count.countTo);
    }
  });
}

function setBlockHidden(block: HTMLElement) {
  const head = block.querySelector<HTMLElement>(".about-mission-areas__block-head");
  const rows = block.querySelectorAll<HTMLElement>(".about-mission-areas__stat-row");
  const footnote = block.querySelector<HTMLElement>(".about-mission-areas__figures-footnote");

  if (head) gsap.set(head, { opacity: 0, y: 18, force3D: true });
  if (footnote) gsap.set(footnote, { opacity: 0, y: 10, force3D: true });

  rows.forEach((row) => {
    const metric = row.querySelector<HTMLElement>(".about-mission-areas__stat-metric");
    const label = row.querySelector<HTMLElement>(".about-mission-areas__stat-label");
    const desc = row.querySelector<HTMLElement>(".about-mission-areas__stat-desc");
    const valueEl = row.querySelector<HTMLElement>(".about-mission-areas__stat-metric-value");
    const unitEl = row.querySelector<HTMLElement>(".about-mission-areas__stat-metric-unit");

    if (metric) gsap.set(metric, { opacity: 0, y: 32, scale: 0.94, force3D: true });
    if (label) gsap.set(label, { opacity: 0, y: 16, force3D: true });
    if (desc) gsap.set(desc, { opacity: 0, y: 12, force3D: true });
    if (unitEl) gsap.set(unitEl, { opacity: 0, force3D: true });

    const count = valueEl ? parseCountMeta(valueEl) : null;
    if (valueEl && count) {
      valueEl.textContent = formatCountValue(count, 0);
    }
  });
}

function buildBlockTimeline(block: HTMLElement) {
  const head = block.querySelector<HTMLElement>(".about-mission-areas__block-head");
  const rows = block.querySelectorAll<HTMLElement>(".about-mission-areas__stat-row");
  const footnote = block.querySelector<HTMLElement>(".about-mission-areas__figures-footnote");
  const tl = gsap.timeline();

  if (head) {
    tl.to(head, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" });
  }

  rows.forEach((row, index) => {
    const metric = row.querySelector<HTMLElement>(".about-mission-areas__stat-metric");
    const label = row.querySelector<HTMLElement>(".about-mission-areas__stat-label");
    const desc = row.querySelector<HTMLElement>(".about-mission-areas__stat-desc");
    const valueEl = row.querySelector<HTMLElement>(".about-mission-areas__stat-metric-value");
    const unitEl = row.querySelector<HTMLElement>(".about-mission-areas__stat-metric-unit");
    const offset = index === 0 ? 0 : index * 0.14;

    if (metric) {
      tl.to(
        metric,
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power2.out" },
        offset,
      );
    }

    const count = valueEl ? parseCountMeta(valueEl) : null;
    if (valueEl && count) {
      const counter = { v: 0 };
      tl.to(
        counter,
        {
          v: count.countTo,
          duration: 1.15,
          ease: "power2.out",
          onUpdate: () => {
            valueEl.textContent = formatCountValue(count, counter.v);
          },
          onComplete: () => {
            valueEl.textContent = formatCountValue(count, count.countTo);
          },
        },
        "<+=0.05",
      );
    }

    if (unitEl) {
      tl.to(unitEl, { opacity: 0.3, duration: 0.45, ease: "power1.out" }, "-=0.85");
    }

    if (label) {
      tl.to(label, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.75");
    }
    if (desc) {
      tl.to(desc, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.4");
    }
  });

  if (footnote) {
    tl.to(
      footnote,
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
      "-=0.15",
    );
  }

  return tl;
}

function blockIsFullyAboveViewport(block: HTMLElement) {
  return block.getBoundingClientRect().bottom <= 0;
}

/** Scroll reveal + count-up for mission areas stat rows */
export function useAboutMissionAreasStatsReveal(
  contentRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blocks = content.querySelectorAll<HTMLElement>(".about-mission-areas__block");
    const played = new WeakSet<HTMLElement>();
    const animations = new WeakMap<HTMLElement, gsap.core.Timeline>();

    const playBlock = (block: HTMLElement) => {
      if (played.has(block)) return;
      played.add(block);
      animations.get(block)?.kill();
      setBlockHidden(block);
      animations.set(block, buildBlockTimeline(block));
    };

    blocks.forEach((block) => {
      if (reduced) {
        revealBlockInstantly(block);
        return;
      }

      setBlockHidden(block);
    });

    if (reduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          playBlock(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -12% 0px",
      },
    );

    blocks.forEach((block) => {
      if (blockIsFullyAboveViewport(block)) {
        revealBlockInstantly(block);
        played.add(block);
        return;
      }
      observer.observe(block);
    });

    return () => {
      observer.disconnect();
      blocks.forEach((block) => animations.get(block)?.kill());
    };
  }, [contentRef]);
}
