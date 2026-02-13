import { useEffect } from "react";

const USERWAY_CDN = "https://cdn.userway.org/widget.js";
const SCRIPT_ID = "userway-widget-script";
const USERWAY_STYLE_ID = "userway-custom-colors";
/** Free-tier account ID; override with VITE_USERWAY_ACCOUNT_ID in .env if needed */
const DEFAULT_ACCOUNT_ID = "tTJDjGwT75";

/** Site accent color (cyan/aqua) for UserWay button – matches CSS --accent */
const ACCENT_HEX = "#00B4D8";
const ACCENT_HEX_HOVER = "#0099b8";

/**
 * UserWay applies inline style="background: rgb(...) !important" on .uai.userway_dark.
 * Inline !important cannot be overridden by CSS, so we set the style via JS.
 */
const STYLED_ATTR = "data-deyaa-userway-styled";

function applyUserWayButtonColor() {
  const selectors = [".uai.userway_dark", ".userway_dark", ".uai"];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el && el instanceof HTMLElement) {
      el.style.setProperty("background", ACCENT_HEX, "important");
      el.style.setProperty("background-color", ACCENT_HEX, "important");
      el.style.setProperty("color", "#fff", "important");
      if (!el.hasAttribute(STYLED_ATTR)) {
        el.setAttribute(STYLED_ATTR, "true");
        el.addEventListener("mouseenter", () => {
          el.style.setProperty("background", ACCENT_HEX_HOVER, "important");
          el.style.setProperty("background-color", ACCENT_HEX_HOVER, "important");
        });
        el.addEventListener("mouseleave", () => {
          el.style.setProperty("background", ACCENT_HEX, "important");
          el.style.setProperty("background-color", ACCENT_HEX, "important");
        });
      }
    }
  }
}

/**
 * Injects CSS to restyle the UserWay floating button to our site colors.
 * UserWay may render the button in an iframe; we inject a style that runs in the page
 * context. If the button is in-DOM, our global CSS in index.css handles it.
 * This listener also tries to apply color via the script’s config if supported later.
 */
function injectUserWayButtonStyles() {
  if (document.getElementById(USERWAY_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = USERWAY_STYLE_ID;
  style.textContent = `
    .uai.userway_dark, .userway_dark, .uai {
      background: ${ACCENT_HEX} !important;
      background-color: ${ACCENT_HEX} !important;
      color: #fff !important;
    }
    .uai.userway_dark:hover, .userway_dark:hover, .uai:hover {
      background: ${ACCENT_HEX_HOVER} !important;
      background-color: ${ACCENT_HEX_HOVER} !important;
    }
  `;
  (document.head || document.body).appendChild(style);
  applyUserWayButtonColor();
}

/**
 * Loads the UserWay accessibility widget (free version) for ΑΜΕΑ-friendly access.
 * Same widget as greece20.gov.gr. Uses account tTJDjGwT75 by default;
 * set VITE_USERWAY_ACCOUNT_ID in .env to override.
 * Button is styled with our site accent color (cyan/aqua).
 */
export function UserWayWidget() {
  useEffect(() => {
    const envId = import.meta.env.VITE_USERWAY_ACCOUNT_ID;
    const accountId =
      typeof envId === "string" && envId.trim() !== ""
        ? envId.trim()
        : DEFAULT_ACCOUNT_ID;
    if (document.getElementById(SCRIPT_ID)) {
      injectUserWayButtonStyles();
      applyUserWayButtonColor();
      setTimeout(applyUserWayButtonColor, 100);
      return;
    }
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.setAttribute("data-account", accountId);
    s.setAttribute("src", USERWAY_CDN);
    s.async = true;
    (document.body || document.head).appendChild(s);

    const onRender = () => {
      injectUserWayButtonStyles();
      applyUserWayButtonColor();
      // UserWay may inject the button a bit later; retry once after a short delay
      setTimeout(applyUserWayButtonColor, 500);
      setTimeout(applyUserWayButtonColor, 1500);
    };
    document.addEventListener("userway:render_completed", onRender);
    document.addEventListener("userway:init_completed", onRender);

    return () => {
      document.removeEventListener("userway:render_completed", onRender);
      document.removeEventListener("userway:init_completed", onRender);
    };
  }, []);

  return null;
}

export default UserWayWidget;
