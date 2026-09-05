import type { Locale } from "@/i18n/types";

export const LOCALE_STORAGE_KEY = "deyaa_locale";

export const localeMeta: Record<
  Locale,
  { code: string; htmlLang: string; name: string }
> = {
  el: { code: "EL", htmlLang: "el", name: "Ελληνικά" },
  en: { code: "EN", htmlLang: "en", name: "English" },
  de: { code: "DE", htmlLang: "de", name: "Deutsch" },
  fr: { code: "FR", htmlLang: "fr", name: "Français" },
};

export const localeOptions = (Object.keys(localeMeta) as Locale[]).map((id) => ({
  id,
  ...localeMeta[id],
}));
