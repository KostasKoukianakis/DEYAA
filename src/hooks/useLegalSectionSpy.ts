import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getLenisInstance } from "@/lib/scrollControl";

export type LegalTocItem = {
  id: string;
  label: string;
};

function scrollToLegalSection(id: string, immediate: boolean) {
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = getLenisInstance();
  if (lenis) {
    lenis.scrollTo(el, { offset: -12, immediate, duration: immediate ? 0 : 1.05 });
    return;
  }

  el.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" });
}

export function useLegalSectionSpy(toc: readonly LegalTocItem[]) {
  const { hash } = useLocation();
  const idsKey = toc.map((item) => item.id).join("|");
  const ids = useMemo(() => idsKey.split("|").filter(Boolean), [idsKey]);
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const requested = hash.replace(/^#/, "");
    const startId = ids.includes(requested) ? requested : (ids[0] ?? "");
    if (!startId) return;

    setActive(startId);

    if (!ids.includes(requested)) return;

    const timer = window.setTimeout(() => {
      scrollToLegalSection(requested, true);
    }, 90);

    return () => window.clearTimeout(timer);
  }, [hash, ids]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-22% 0px -62% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  const select = (id: string) => {
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
    scrollToLegalSection(id, false);
  };

  return { active, select };
}
