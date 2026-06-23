import { RefObject, useEffect } from "react";
import gsap from "gsap";

export function useReportStudioEntrance(pageRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const crumbs = page.querySelector<HTMLElement>(".pe-report-studio__crumbs");
    const glass = page.querySelector<HTMLElement>(".pe-report-studio__glass");

    const finish = () => {
      page.classList.remove("pe-report-studio-entrance-pending");
      page.classList.add("pe-report-studio-entrance-done");
    };

    if (prefersReducedMotion) {
      finish();
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(crumbs, { opacity: 0, y: -12 });
      gsap.set(glass, { opacity: 0, scale: 0.98, y: 24 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: finish,
      });

      tl.to(crumbs, { opacity: 1, y: 0, duration: 0.5 }, 0).to(
        glass,
        { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "power2.out" },
        0.1,
      );
    }, page);

    return () => {
      ctx.revert();
      page.classList.remove("pe-report-studio-entrance-pending", "pe-report-studio-entrance-done");
    };
  }, [pageRef]);
}
