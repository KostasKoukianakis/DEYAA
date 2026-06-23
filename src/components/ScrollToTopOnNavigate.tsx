import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTop } from "@/lib/scrollControl";

/** Reset scroll position on every route change (e.g. archive card → detail page). */
export function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    scrollToTop({ immediate: true });
  }, [pathname]);

  return null;
}
