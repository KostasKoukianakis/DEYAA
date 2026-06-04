import { useEffect } from "react";

const USERWAY_CDN = "https://cdn.userway.org/widget.js";
const SCRIPT_ID = "userway-widget-script";
const USERWAY_STYLE_ID = "userway-custom-colors";
/** Free-tier account ID; override with VITE_USERWAY_ACCOUNT_ID in .env if needed */
const DEFAULT_ACCOUNT_ID = "tTJDjGwT75";

/** Deep Ocean Navy — matches --primary / --site-fab-bg (#0B3D6B) */
const PRIMARY_HEX = "#0B3D6B";
const PRIMARY_HOVER = "#0E5289";
const FAB_OFFSET = "1rem";

function getFabSize() {
  return window.matchMedia("(min-width: 1024px)").matches ? "3.1rem" : "2.85rem";
}

const STYLED_ATTR = "data-deyaa-userway-styled";

function applyUserWayPosition() {
  const fabSize = getFabSize();
  const wrapperSelectors = [".userway_buttons_wrapper", "#userway", "div.userway"];
  for (const sel of wrapperSelectors) {
    document.querySelectorAll(sel).forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      node.style.setProperty("position", "fixed", "important");
      node.style.setProperty("left", FAB_OFFSET, "important");
      node.style.setProperty("right", "auto", "important");
      node.style.setProperty("bottom", FAB_OFFSET, "important");
      node.style.setProperty("top", "auto", "important");
      node.style.setProperty("z-index", "50", "important");
      node.style.setProperty("margin", "0", "important");
      node.style.setProperty("padding", "0", "important");
      node.style.setProperty("transform", "none", "important");
    });
  }

  const buttonSelectors = [".uai.userway_dark", ".userway_dark", ".uai", "#userwayAccessibilityIcon"];
  for (const sel of buttonSelectors) {
    document.querySelectorAll(sel).forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      node.style.setProperty("position", "relative", "important");
      node.style.setProperty("left", "auto", "important");
      node.style.setProperty("right", "auto", "important");
      node.style.setProperty("bottom", "auto", "important");
      node.style.setProperty("top", "auto", "important");
      node.style.setProperty("width", fabSize, "important");
      node.style.setProperty("height", fabSize, "important");
      node.style.setProperty("min-width", fabSize, "important");
      node.style.setProperty("min-height", fabSize, "important");
      node.style.setProperty("border-radius", "9999px", "important");
      node.style.setProperty("border", "none", "important");
      node.style.setProperty(
        "box-shadow",
        "0 4px 16px rgba(11, 61, 107, 0.28)",
        "important"
      );
    });
  }
}

function applyUserWayButtonColor() {
  applyUserWayPosition();

  const selectors = [".uai.userway_dark", ".userway_dark", ".uai"];
  for (const sel of selectors) {
    document.querySelectorAll(sel).forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      el.style.setProperty("background", PRIMARY_HEX, "important");
      el.style.setProperty("background-color", PRIMARY_HEX, "important");
      el.style.setProperty("color", "#fff", "important");
      if (!el.hasAttribute(STYLED_ATTR)) {
        el.setAttribute(STYLED_ATTR, "true");
        el.addEventListener("mouseenter", () => {
          el.style.setProperty("background", PRIMARY_HOVER, "important");
          el.style.setProperty("background-color", PRIMARY_HOVER, "important");
        });
        el.addEventListener("mouseleave", () => {
          el.style.setProperty("background", PRIMARY_HEX, "important");
          el.style.setProperty("background-color", PRIMARY_HEX, "important");
        });
      }
    });
  }
}

function injectUserWayButtonStyles() {
  let style = document.getElementById(USERWAY_STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = USERWAY_STYLE_ID;
    (document.head || document.body).appendChild(style);
  }

  const fabSize = getFabSize();

  style.textContent = `
    .userway_buttons_wrapper, #userway, div.userway {
      position: fixed !important;
      left: ${FAB_OFFSET} !important;
      right: auto !important;
      bottom: ${FAB_OFFSET} !important;
      top: auto !important;
      z-index: 50 !important;
      margin: 0 !important;
      padding: 0 !important;
      transform: none !important;
    }
    .uai.userway_dark, .userway_dark, .uai, #userwayAccessibilityIcon {
      position: relative !important;
      left: auto !important;
      right: auto !important;
      bottom: auto !important;
      top: auto !important;
      width: ${fabSize} !important;
      height: ${fabSize} !important;
      min-width: ${fabSize} !important;
      min-height: ${fabSize} !important;
      border-radius: 9999px !important;
      border: none !important;
      background: ${PRIMARY_HEX} !important;
      background-color: ${PRIMARY_HEX} !important;
      color: #fff !important;
      box-shadow: 0 4px 16px rgba(11, 61, 107, 0.28) !important;
    }
    .uai.userway_dark:hover, .userway_dark:hover, .uai:hover {
      background: ${PRIMARY_HOVER} !important;
      background-color: ${PRIMARY_HOVER} !important;
    }
  `;
  applyUserWayButtonColor();
}

/**
 * Loads the UserWay accessibility widget (free version) for ΑΜΕΑ-friendly access.
 * Position: bottom-left (data-position=5). Styled to match site primary FAB.
 */
export function UserWayWidget() {
  useEffect(() => {
    const envId = import.meta.env.VITE_USERWAY_ACCOUNT_ID;
    const accountId =
      typeof envId === "string" && envId.trim() !== ""
        ? envId.trim()
        : DEFAULT_ACCOUNT_ID;

    const onResize = () => {
      injectUserWayButtonStyles();
      applyUserWayButtonColor();
    };

    if (document.getElementById(SCRIPT_ID)) {
      const existing = document.getElementById(SCRIPT_ID);
      existing?.setAttribute("data-position", "5");
      existing?.setAttribute("data-color", PRIMARY_HEX);
      injectUserWayButtonStyles();
      applyUserWayButtonColor();
      setTimeout(applyUserWayButtonColor, 100);
      setTimeout(applyUserWayButtonColor, 1500);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.setAttribute("data-account", accountId);
    s.setAttribute("data-position", "5");
    s.setAttribute("data-color", PRIMARY_HEX);
    s.setAttribute("src", USERWAY_CDN);
    s.async = true;
    (document.body || document.head).appendChild(s);

    const onRender = () => {
      injectUserWayButtonStyles();
      applyUserWayButtonColor();
      setTimeout(applyUserWayButtonColor, 500);
      setTimeout(applyUserWayButtonColor, 1500);
    };
    document.addEventListener("userway:render_completed", onRender);
    document.addEventListener("userway:init_completed", onRender);

    window.addEventListener("resize", onResize);

    return () => {
      document.removeEventListener("userway:render_completed", onRender);
      document.removeEventListener("userway:init_completed", onRender);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}

export default UserWayWidget;
