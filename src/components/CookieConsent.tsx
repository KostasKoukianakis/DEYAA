import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Check,
  Cookie,
  Save,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  acceptAllCookies,
  getStoredConsent,
  hasValidConsent,
  saveConsent,
  type CookiePreferences,
} from "@/lib/cookieConsent";
import { useI18n } from "@/i18n";

const COOKIE_TABLE = [
  {
    name: "deyaa_cookie_consent",
    provider: "ΔΕΥΑΑ",
    purposeKey: "cookies.table.consentPurpose",
    durationKey: "cookies.table.consentDuration",
    typeKey: "cookies.table.essentialType",
  },
  {
    name: "sb-*-auth-token",
    provider: "Supabase",
    purposeKey: "cookies.table.authPurpose",
    durationKey: "cookies.table.providerPolicy",
    typeKey: "cookies.table.essentialType",
  },
  {
    name: "UserWay",
    provider: "UserWay.org",
    purposeKey: "cookies.table.userwayPurpose",
    durationKey: "cookies.table.providerPolicy",
    typeKey: "cookies.table.functionalType",
  },
] as const;

export function CookieConsent() {
  const { t } = useI18n();
  const [bannerVisible, setBannerVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const syncFromStorage = useCallback(() => {
    const stored = getStoredConsent();
    setAnalyticsEnabled(stored?.preferences.analytics ?? false);
    setBannerVisible(!hasValidConsent());
  }, []);

  useEffect(() => {
    syncFromStorage();
  }, [syncFromStorage]);

  const applyConsent = (preferences: CookiePreferences) => {
    saveConsent(preferences);
    setAnalyticsEnabled(preferences.analytics);
    setBannerVisible(false);
    setDialogOpen(false);
  };

  return (
    <>
      {bannerVisible ? (
        <div
          className="site-cookie-banner"
          role="dialog"
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-desc"
        >
          <div className="site-cookie-banner__inner">
            <div className="site-cookie-banner__content">
              <div className="site-cookie-banner__header">
                <span className="site-cookie-banner__icon-wrap" aria-hidden>
                  <Cookie className="site-cookie-banner__icon" />
                </span>
                <p id="cookie-banner-title" className="site-cookie-banner__title">
                  {t("cookies.bannerTitle")}
                </p>
              </div>
              <p id="cookie-banner-desc" className="site-cookie-banner__text">
                {t("cookies.bannerTextBefore")}{" "}
                <Link to="/privacy" className="site-cookie-banner__link">
                  {t("footer.privacy")}
                </Link>
                .
              </p>
            </div>

            <div className="site-cookie-banner__actions">
              <button
                type="button"
                className="site-cookie-settings-btn"
                aria-label={t("cookies.settings")}
                title={t("cookies.settingsShort")}
                onClick={() => setDialogOpen(true)}
              >
                <Settings2 className="site-cookie-settings-btn__icon" aria-hidden />
              </button>
              <Button
                type="button"
                className="site-cookie-banner__btn site-cookie-banner__btn--primary"
                onClick={() => applyConsent(acceptAllCookies().preferences)}
              >
                <Check className="site-cookie-banner__btn-icon" aria-hidden />
                {t("cookies.acceptAll")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {!bannerVisible ? (
        <button
          type="button"
          className="site-cookie-fab"
          aria-label={t("cookies.settings")}
          title={t("cookies.settings")}
          onClick={() => setDialogOpen(true)}
        >
          <Cookie className="site-cookie-fab__icon" aria-hidden />
        </button>
      ) : null}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="site-cookie-dialog sm:max-w-[32rem]">
          <div className="site-cookie-dialog__shell">
            <header className="site-cookie-dialog__header">
              <span className="site-cookie-dialog__badge" aria-hidden>
                <Cookie className="site-cookie-dialog__badge-icon" />
              </span>
              <DialogTitle className="site-cookie-dialog__title">{t("cookies.dialogTitle")}</DialogTitle>
              <DialogDescription className="site-cookie-dialog__desc">
                {t("cookies.dialogDesc")}{" "}
                <Link to="/privacy" className="site-cookie-dialog__link">
                  {t("footer.privacy")}
                </Link>
              </DialogDescription>
            </header>

            <div className="site-cookie-dialog__body">
              <section className="site-cookie-dialog__section" aria-labelledby="cookie-prefs-label">
                <p id="cookie-prefs-label" className="site-cookie-dialog__section-label">
                  {t("cookies.prefs")}
                </p>
                <ul className="site-cookie-dialog__prefs">
                  <li className="site-cookie-dialog__pref">
                    <span
                      className="site-cookie-dialog__pref-icon site-cookie-dialog__pref-icon--essential"
                      aria-hidden
                    >
                      <ShieldCheck />
                    </span>
                    <div className="site-cookie-dialog__pref-copy">
                      <span className="site-cookie-dialog__pref-title">{t("cookies.essential")}</span>
                      <span className="site-cookie-dialog__pref-desc">
                        {t("cookies.essentialDesc")}
                      </span>
                    </div>
                    <span className="site-cookie-dialog__pref-status">{t("cookies.alwaysOn")}</span>
                  </li>
                  <li className="site-cookie-dialog__pref">
                    <span
                      className="site-cookie-dialog__pref-icon site-cookie-dialog__pref-icon--analytics"
                      aria-hidden
                    >
                      <BarChart3 />
                    </span>
                    <div className="site-cookie-dialog__pref-copy">
                      <span className="site-cookie-dialog__pref-title">{t("cookies.analytics")}</span>
                      <span className="site-cookie-dialog__pref-desc">
                        {t("cookies.analyticsDesc")}
                      </span>
                    </div>
                    <Switch
                      checked={analyticsEnabled}
                      onCheckedChange={setAnalyticsEnabled}
                      aria-label={t("cookies.analyticsAria")}
                      className="site-cookie-dialog__switch"
                    />
                  </li>
                </ul>
              </section>

              <section className="site-cookie-dialog__section" aria-labelledby="cookie-list-label">
                <p id="cookie-list-label" className="site-cookie-dialog__section-label">
                  {t("cookies.list")}
                </p>
                <ul className="site-cookie-dialog__list">
                  {COOKIE_TABLE.map((row) => (
                    <li key={row.name} className="site-cookie-dialog__list-item">
                      <div className="site-cookie-dialog__list-head">
                        <code className="site-cookie-dialog__list-name">{row.name}</code>
                        <span className="site-cookie-dialog__list-type">{t(row.typeKey)}</span>
                      </div>
                      <p className="site-cookie-dialog__list-purpose">{t(row.purposeKey)}</p>
                      <p className="site-cookie-dialog__list-meta">
                        {row.provider} · {t(row.durationKey)}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <footer className="site-cookie-dialog__footer">
              <Button
                type="button"
                variant="outline"
                className="site-cookie-dialog__btn"
                onClick={() => applyConsent({ analytics: analyticsEnabled })}
              >
                <Save className="site-cookie-banner__btn-icon" aria-hidden />
                {t("cookies.save")}
              </Button>
              <Button
                type="button"
                className="site-cookie-dialog__btn site-cookie-dialog__btn--primary"
                onClick={() => applyConsent({ analytics: true })}
              >
                <Check className="site-cookie-banner__btn-icon" aria-hidden />
                {t("cookies.acceptAll")}
              </Button>
            </footer>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
