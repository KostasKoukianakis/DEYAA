const RECAPTCHA_V2_SCRIPT_ID = "google-recaptcha-v2";
const RECAPTCHA_V2_SCRIPT_SRC = "https://www.google.com/recaptcha/api.js?render=explicit&hl=el";

/** Default DEYAA reCAPTCHA site key (public — safe in frontend). Override via VITE_RECAPTCHA_SITE_KEY. */
const RECAPTCHA_DEFAULT_SITE_KEY = "6Le17C8tAAAAABQFaJpJ98OBxdbwbdXo2rZcZ2Na";

export type RecaptchaVersion = "v2" | "v3";

let v2ScriptLoadPromise: Promise<void> | null = null;
let v3ScriptLoadPromise: Promise<void> | null = null;
let v3LoadedSiteKey: string | null = null;

export function getRecaptchaSiteKey(): string {
  return import.meta.env.VITE_RECAPTCHA_SITE_KEY?.trim() || RECAPTCHA_DEFAULT_SITE_KEY;
}

export function getRecaptchaVersion(): RecaptchaVersion {
  const configured = import.meta.env.VITE_RECAPTCHA_VERSION?.trim().toLowerCase();
  return configured === "v2" ? "v2" : "v3";
}

export function loadRecaptchaV2Script(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("reCAPTCHA is only available in the browser."));
  }

  if (window.grecaptcha?.render) {
    return Promise.resolve();
  }

  if (v2ScriptLoadPromise) {
    return v2ScriptLoadPromise;
  }

  v2ScriptLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(RECAPTCHA_V2_SCRIPT_ID) as HTMLScriptElement | null;

    const onReady = () => {
      window.grecaptcha?.ready(() => resolve());
    };

    if (existing) {
      if (window.grecaptcha?.render) {
        onReady();
        return;
      }

      existing.addEventListener("load", onReady, { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load reCAPTCHA v2.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = RECAPTCHA_V2_SCRIPT_ID;
    script.src = RECAPTCHA_V2_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = onReady;
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA v2."));
    document.head.appendChild(script);
  });

  return v2ScriptLoadPromise;
}

export function loadRecaptchaV3Script(siteKey = getRecaptchaSiteKey()): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("reCAPTCHA is only available in the browser."));
  }

  if (window.grecaptcha?.execute && v3LoadedSiteKey === siteKey) {
    return Promise.resolve();
  }

  if (v3ScriptLoadPromise && v3LoadedSiteKey === siteKey) {
    return v3ScriptLoadPromise;
  }

  v3ScriptLoadPromise = new Promise<void>((resolve, reject) => {
    const scriptId = "google-recaptcha-v3";
    const scriptSrc = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}&hl=el`;
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;

    const onReady = () => {
      window.grecaptcha?.ready(() => {
        v3LoadedSiteKey = siteKey;
        resolve();
      });
    };

    if (existing) {
      existing.addEventListener("load", onReady, { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load reCAPTCHA v3.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = scriptSrc;
    script.async = true;
    script.defer = true;
    script.onload = onReady;
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA v3."));
    document.head.appendChild(script);
  });

  return v3ScriptLoadPromise;
}

export async function executeRecaptchaV3(action = "submit"): Promise<string> {
  const siteKey = getRecaptchaSiteKey();
  await loadRecaptchaV3Script(siteKey);

  if (!window.grecaptcha?.execute) {
    throw new Error("reCAPTCHA v3 is not ready.");
  }

  return window.grecaptcha.execute(siteKey, { action });
}

/** @deprecated Use loadRecaptchaV2Script — kept for compatibility */
export function loadRecaptchaScript(): Promise<void> {
  return getRecaptchaVersion() === "v2" ? loadRecaptchaV2Script() : loadRecaptchaV3Script();
}
