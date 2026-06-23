/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
  readonly VITE_RECAPTCHA_VERSION?: "v2" | "v3";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  grecaptcha?: {
    ready: (callback: () => void) => void;
    render: (
      container: HTMLElement,
      parameters: {
        sitekey: string;
        callback?: (token: string) => void;
        "expired-callback"?: () => void;
        "error-callback"?: () => void;
      },
    ) => number;
    reset: (widgetId?: number) => void;
    getResponse: (widgetId?: number) => string;
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
  };
}
