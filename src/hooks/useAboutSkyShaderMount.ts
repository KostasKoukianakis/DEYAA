import { useEffect, useState } from "react";

const SKY_SHADER_SECTION_IDS = [
  "about-hero",
  "about-history",
  "about-vision",
  "about-mission-areas",
  "about-mission-hub",
] as const;

/** Mount the sky shader from page load — hero + history share one fixed surface. */
export function useAboutSkyShaderMount(hash: string) {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const hashId = hash.replace(/^#/, "");
    if (hashId && SKY_SHADER_SECTION_IDS.some((id) => hashId === id || hashId.startsWith(id))) {
      setMounted(true);
      return;
    }

    const targets = SKY_SHADER_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean,
    ) as HTMLElement[];

    if (!targets.length) {
      setMounted(true);
      return;
    }

    const preloadPx = () => Math.max(window.innerHeight * 0.55, 320);

    const isNear = () =>
      targets.some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight + preloadPx();
      });

    if (isNear()) {
      setMounted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "55vh 0px 0px 0px", threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));

    const onScroll = () => {
      if (!isNear()) return;
      setMounted(true);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [hash]);

  return mounted;
}
