import { useState, useEffect } from "react";

/**
 * Returns scroll progress 0–1 based on page scroll position.
 * 0 = top of page, 1 = scrolled to bottom.
 * Uses throttle via requestAnimationFrame for smooth performance.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number;

    const updateProgress = () => {
      const scrollTop = window.scrollY ?? document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight <= 0) {
        setProgress(1);
        return;
      }

      const value = Math.min(Math.max(scrollTop / docHeight, 0), 1);
      setProgress(value);
    };

    const handleScroll = () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return progress;
}

/**
 * Returns 0–1 for water reveal based on scroll pixels, not full page.
 * Animation completes after maxScrollPx (default 5000px) so it doesn't finish too early.
 */
export function useWaterRevealProgress(maxScrollPx: number = 5000): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number;

    const updateProgress = () => {
      const scrollTop = window.scrollY ?? document.documentElement.scrollTop;
      const value = maxScrollPx <= 0 ? 1 : Math.min(scrollTop / maxScrollPx, 1);
      setProgress(value);
    };

    const handleScroll = () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [maxScrollPx]);

  return progress;
}
