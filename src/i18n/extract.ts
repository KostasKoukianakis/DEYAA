import { LOCALES, type I18nText, type I18nTextList, type Locale } from "@/i18n/types";

function isI18nText(value: unknown): value is I18nText {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return LOCALES.every((locale) => typeof record[locale] === "string");
}

function isI18nTextList(value: unknown): value is I18nTextList {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return LOCALES.every(
    (locale) =>
      Array.isArray(record[locale]) &&
      (record[locale] as unknown[]).every((item) => typeof item === "string"),
  );
}

export function extractLocaleTree(node: unknown, locale: Locale): unknown {
  if (isI18nText(node)) return node[locale];
  if (isI18nTextList(node)) return [...node[locale]];
  if (Array.isArray(node)) return node.map((item) => extractLocaleTree(item, locale));
  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) {
      out[key] = extractLocaleTree(value, locale);
    }
    return out;
  }
  return node;
}

export function lookupPath(tree: unknown, path: string): unknown {
  const parts = path.split(".").filter(Boolean);
  let current: unknown = tree;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

export function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] == null ? `{${key}}` : String(vars[key]),
  );
}
