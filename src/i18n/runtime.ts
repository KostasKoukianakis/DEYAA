import { extractLocaleTree, interpolate, lookupPath } from "@/i18n/extract";
import { localeMeta, LOCALE_STORAGE_KEY } from "@/i18n/locales";
import { catalog } from "@/i18n/catalog";
import { isLocale, LOCALES, type Locale } from "@/i18n/types";

const listeners = new Set<() => void>();

const messageTrees = Object.fromEntries(
  LOCALES.map((locale) => [locale, extractLocaleTree(catalog, locale)]),
) as Record<Locale, unknown>;

function readStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function readInitialLocale(): Locale {
  return readStoredLocale() ?? "el";
}

let currentLocale: Locale = "el";

export function getLocale(): Locale {
  return currentLocale;
}

export function subscribeLocale(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function applyDocumentLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  const meta = localeMeta[locale];
  document.documentElement.lang = meta.htmlLang;
  const title = t("meta.title");
  if (title && title !== "meta.title") document.title = title;
  const description = t("meta.description");
  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag && description && description !== "meta.description") {
    descriptionTag.setAttribute("content", description);
  }
}

export function setLocale(next: Locale) {
  currentLocale = next;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
  } catch {
    /* ignore quota / private mode */
  }
  applyDocumentLocale(next);
  listeners.forEach((listener) => listener());
}

export function initLocaleRuntime(locale: Locale = readInitialLocale()) {
  currentLocale = locale;
  applyDocumentLocale(locale);
}

export function t(path: string, vars?: Record<string, string | number>): string {
  const fromCurrent = lookupPath(messageTrees[currentLocale], path);
  const fromFallback = lookupPath(messageTrees.el, path);
  const value = typeof fromCurrent === "string" ? fromCurrent : fromFallback;
  if (typeof value !== "string") return path;
  return interpolate(value, vars);
}

export function tList(path: string): string[] {
  const fromCurrent = lookupPath(messageTrees[currentLocale], path);
  const fromFallback = lookupPath(messageTrees.el, path);
  const value = Array.isArray(fromCurrent) ? fromCurrent : fromFallback;
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(localeMeta[currentLocale].htmlLang, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
