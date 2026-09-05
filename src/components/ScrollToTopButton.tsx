import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { subscribeScroll, scrollToTop } from "@/lib/scrollControl";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

const SHOW_AFTER_PX = 280;

export function ScrollToTopButton() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return subscribeScroll(({ scrollY }) => {
      setVisible(scrollY > SHOW_AFTER_PX);
    });
  }, []);

  return (
    <button
      type="button"
      aria-label={t("common.scrollTop")}
      title={t("common.scrollTopShort")}
      onClick={() => scrollToTop({ immediate: false, refreshScrollTrigger: false })}
      className={cn("site-scroll-top-btn", visible && "site-scroll-top-btn--visible")}
    >
      <ChevronUp className="site-scroll-top-btn__icon" aria-hidden strokeWidth={2.25} />
    </button>
  );
}
