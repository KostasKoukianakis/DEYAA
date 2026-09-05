import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { localeMeta, localeOptions } from "@/i18n/locales";
import {
  formatDate,
  getLocale,
  initLocaleRuntime,
  readInitialLocale,
  setLocale as setRuntimeLocale,
  subscribeLocale,
  t,
  tList,
} from "@/i18n/runtime";
import type { Locale } from "@/i18n/types";

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof t;
  tList: typeof tList;
  formatDate: typeof formatDate;
  options: typeof localeOptions;
  meta: typeof localeMeta;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const initial = typeof window === "undefined" ? "el" : readInitialLocale();
    initLocaleRuntime(initial);
    return initial;
  });

  useEffect(() => subscribeLocale(() => setLocaleState(getLocale())), []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: setRuntimeLocale,
      t,
      tList,
      formatDate,
      options: localeOptions,
      meta: localeMeta,
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return context;
}
