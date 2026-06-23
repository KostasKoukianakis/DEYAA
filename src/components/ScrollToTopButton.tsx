import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { subscribeScroll, scrollToTop } from "@/lib/scrollControl";
import { cn } from "@/lib/utils";

const SHOW_AFTER_PX = 280;

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return subscribeScroll(({ scrollY }) => {
      setVisible(scrollY > SHOW_AFTER_PX);
    });
  }, []);

  return (
    <button
      type="button"
      aria-label="Μετάβαση στην κορυφή της σελίδας"
      title="Πάνω"
      onClick={() => scrollToTop({ immediate: false, refreshScrollTrigger: false })}
      className={cn("site-scroll-top-btn", visible && "site-scroll-top-btn--visible")}
    >
      <ChevronUp className="site-scroll-top-btn__icon" aria-hidden strokeWidth={2.25} />
    </button>
  );
}
