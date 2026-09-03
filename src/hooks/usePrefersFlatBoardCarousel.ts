import { useEffect, useState } from "react";

const FLAT_CAROUSEL_MAX_WIDTH = 1023;

function getPrefersFlatBoardCarousel() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(`(max-width: ${FLAT_CAROUSEL_MAX_WIDTH}px)`).matches;
}

/** VR carousel only on large viewports; flat horizontal carousel below. */
export function usePrefersFlatBoardCarousel() {
  const [prefersFlat, setPrefersFlat] = useState(getPrefersFlatBoardCarousel);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${FLAT_CAROUSEL_MAX_WIDTH}px)`);
    const update = () => setPrefersFlat(mql.matches);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return prefersFlat;
}
