export const LOCALES = ["el", "en", "de", "fr"] as const;

export type Locale = (typeof LOCALES)[number];

export type I18nText = Record<Locale, string>;

export type I18nTextList = Record<Locale, readonly string[]>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
