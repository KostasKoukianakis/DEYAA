import { useEffect } from "react";

const SCROLL_LOCK_FIX_ID = "deyaa-scroll-lock-layout-fix";

const SCROLL_LOCK_FIX_CSS = `
html:has(body[data-scroll-locked]) {
  scrollbar-gutter: stable !important;
}

body[data-scroll-locked] {
  --removed-body-scroll-bar-size: 0px !important;
  margin-right: 0 !important;
  padding-right: 0 !important;
  padding-left: 0 !important;
  padding-top: 0 !important;
}

body[data-scroll-locked] .width-before-scroll-bar {
  margin-right: 0 !important;
}

body[data-scroll-locked] .right-scroll-bar-position {
  right: 0 !important;
}
`;

function syncScrollLockFixStyle(isLocked: boolean) {
  const existing = document.getElementById(SCROLL_LOCK_FIX_ID);

  if (isLocked) {
    const style = existing ?? document.createElement("style");
    style.id = SCROLL_LOCK_FIX_ID;
    style.textContent = SCROLL_LOCK_FIX_CSS;
    if (!existing) {
      document.head.appendChild(style);
    }
    return;
  }

  existing?.remove();
}

/** Prevent Radix Select/Dialog scroll-lock from shifting layout when html uses scrollbar-gutter: stable */
export function useScrollLockLayoutFix() {
  useEffect(() => {
    syncScrollLockFixStyle(document.body.hasAttribute("data-scroll-locked"));

    const observer = new MutationObserver(() => {
      syncScrollLockFixStyle(document.body.hasAttribute("data-scroll-locked"));
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-scroll-locked"],
    });

    return () => {
      observer.disconnect();
      document.getElementById(SCROLL_LOCK_FIX_ID)?.remove();
    };
  }, []);
}
