export const COOKIE_CONSENT_VERSION = "1.0";
export const COOKIE_CONSENT_KEY = "deyaa_cookie_consent";

export type CookiePreferences = {
  analytics: boolean;
};

export type CookieConsentRecord = {
  version: string;
  timestamp: string;
  preferences: CookiePreferences;
};

const defaultPreferences: CookiePreferences = {
  analytics: false,
};

export function getStoredConsent(): CookieConsentRecord | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentRecord;
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasValidConsent(): boolean {
  return getStoredConsent() !== null;
}

export function saveConsent(preferences: CookiePreferences): CookieConsentRecord {
  const record: CookieConsentRecord = {
    version: COOKIE_CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    preferences: {
      analytics: preferences.analytics,
    },
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(record));
  window.dispatchEvent(
    new CustomEvent("deyaa:cookie-consent", { detail: record.preferences })
  );
  return record;
}

export function acceptAllCookies(): CookieConsentRecord {
  return saveConsent({ analytics: true });
}

export function rejectOptionalCookies(): CookieConsentRecord {
  return saveConsent({ ...defaultPreferences });
}

export function isAnalyticsAllowed(): boolean {
  return getStoredConsent()?.preferences.analytics ?? false;
}
