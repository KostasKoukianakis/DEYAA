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

const COOKIE_TABLE = [
  {
    name: "deyaa_cookie_consent",
    provider: "ΔΕΥΑΑ",
    purpose: "Αποθήκευση των επιλογών σας για cookies",
    duration: "12 μήνες",
    type: "Απαραίτητο",
  },
  {
    name: "sb-*-auth-token",
    provider: "Supabase",
    purpose: "Αυθεντικοποίηση στον πίνακα διαχείρισης (μόνο με σύνδεση)",
    duration: "Σύμφωνα με πολιτική παρόχου",
    type: "Απαραίτητο",
  },
  {
    name: "UserWay",
    provider: "UserWay.org",
    purpose: "Προσβασιμότητα ιστοτόπου (γλυφήματα, contrast, κ.λπ.)",
    duration: "Σύμφωνα με πολιτική παρόχου",
    type: "Λειτουργικότητας",
  },
] as const;

export function CookieConsent() {
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
                  Χρήση cookies
                </p>
              </div>
              <p id="cookie-banner-desc" className="site-cookie-banner__text">
                Χρησιμοποιούμε απαραίτητα cookies για τη λειτουργία του ιστοτόπου και, με τη
                συγκατάθεσή σας, αναλυτικά cookies για ανώνυμη στατιστική επίσκεψης. Περισσότερα
                στην{" "}
                <Link to="/privacy" className="site-cookie-banner__link">
                  Πολιτική Απορρήτου
                </Link>
                .
              </p>
            </div>

            <div className="site-cookie-banner__actions">
              <button
                type="button"
                className="site-cookie-settings-btn"
                aria-label="Ρυθμίσεις cookies"
                title="Ρυθμίσεις"
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
                Αποδοχή όλων
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {!bannerVisible ? (
        <button
          type="button"
          className="site-cookie-fab"
          aria-label="Ρυθμίσεις cookies"
          title="Ρυθμίσεις cookies"
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
              <DialogTitle className="site-cookie-dialog__title">Ρυθμίσεις cookies</DialogTitle>
              <DialogDescription className="site-cookie-dialog__desc">
                Επιλέξτε ποια cookies επιτρέπετε. Τα απαραίτητα παραμένουν ενεργά για τη λειτουργία
                του ιστοτόπου.{" "}
                <Link to="/privacy" className="site-cookie-dialog__link">
                  Πολιτική Απορρήτου
                </Link>
              </DialogDescription>
            </header>

            <div className="site-cookie-dialog__body">
              <section className="site-cookie-dialog__section" aria-labelledby="cookie-prefs-label">
                <p id="cookie-prefs-label" className="site-cookie-dialog__section-label">
                  Προτιμήσεις
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
                      <span className="site-cookie-dialog__pref-title">Απαραίτητα</span>
                      <span className="site-cookie-dialog__pref-desc">
                        Λειτουργία, ασφάλεια και αποθήκευση των επιλογών σας.
                      </span>
                    </div>
                    <span className="site-cookie-dialog__pref-status">Πάντα ενεργά</span>
                  </li>
                  <li className="site-cookie-dialog__pref">
                    <span
                      className="site-cookie-dialog__pref-icon site-cookie-dialog__pref-icon--analytics"
                      aria-hidden
                    >
                      <BarChart3 />
                    </span>
                    <div className="site-cookie-dialog__pref-copy">
                      <span className="site-cookie-dialog__pref-title">Αναλυτικά / στατιστικά</span>
                      <span className="site-cookie-dialog__pref-desc">
                        Ανώνυμη στατιστική επίσκεψης, χωρίς διαφημιστική καταγραφή προφίλ.
                      </span>
                    </div>
                    <Switch
                      checked={analyticsEnabled}
                      onCheckedChange={setAnalyticsEnabled}
                      aria-label="Αναλυτικά cookies"
                      className="site-cookie-dialog__switch"
                    />
                  </li>
                </ul>
              </section>

              <section className="site-cookie-dialog__section" aria-labelledby="cookie-list-label">
                <p id="cookie-list-label" className="site-cookie-dialog__section-label">
                  Λίστα cookies
                </p>
                <ul className="site-cookie-dialog__list">
                  {COOKIE_TABLE.map((row) => (
                    <li key={row.name} className="site-cookie-dialog__list-item">
                      <div className="site-cookie-dialog__list-head">
                        <code className="site-cookie-dialog__list-name">{row.name}</code>
                        <span className="site-cookie-dialog__list-type">{row.type}</span>
                      </div>
                      <p className="site-cookie-dialog__list-purpose">{row.purpose}</p>
                      <p className="site-cookie-dialog__list-meta">
                        {row.provider} · {row.duration}
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
                Αποθήκευση
              </Button>
              <Button
                type="button"
                className="site-cookie-dialog__btn site-cookie-dialog__btn--primary"
                onClick={() => applyConsent({ analytics: true })}
              >
                <Check className="site-cookie-banner__btn-icon" aria-hidden />
                Αποδοχή όλων
              </Button>
            </footer>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
