import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  acceptAllCookies,
  getStoredConsent,
  hasValidConsent,
  rejectOptionalCookies,
  saveConsent,
  type CookiePreferences,
} from "@/lib/cookieConsent";
import { cn } from "@/lib/utils";

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
              <p id="cookie-banner-title" className="site-cookie-banner__title">
                Χρήση cookies
              </p>
              <p id="cookie-banner-desc" className="site-cookie-banner__text">
                Χρησιμοποιούμε απαραίτητα cookies για τη λειτουργία του ιστοτόπου και, με τη
                συγκατάθεσή σας, αναλυτικά cookies για ανώνυμη στατιστική επίσκεψης. Μπορείτε
                να αλλάξετε τις επιλογές σας ανά πάσα στιγμή. Περισσότερα στην{" "}
                <Link to="/privacy" className="site-cookie-banner__link">
                  Πολιτική Απορρήτου
                </Link>
                .
              </p>
            </div>
            <div className="site-cookie-banner__actions">
              <Button
                type="button"
                variant="outline"
                className="site-cookie-banner__btn"
                onClick={() => {
                  setDialogOpen(true);
                }}
              >
                Ρυθμίσεις
              </Button>
              <Button
                type="button"
                variant="outline"
                className="site-cookie-banner__btn"
                onClick={() => applyConsent(rejectOptionalCookies().preferences)}
              >
                Απόρριψη προαιρετικών
              </Button>
              <Button
                type="button"
                className="site-cookie-banner__btn site-cookie-banner__btn--primary"
                onClick={() => applyConsent(acceptAllCookies().preferences)}
              >
                Αποδοχή όλων
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className={cn(
          "site-cookie-fab",
          bannerVisible && "site-cookie-fab--banner-visible"
        )}
        aria-label="Ρυθμίσεις cookies"
        title="Ρυθμίσεις cookies"
        onClick={() => setDialogOpen(true)}
      >
        <Cookie className="site-cookie-fab__icon" aria-hidden />
      </button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="site-cookie-dialog max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Ρυθμίσεις cookies</DialogTitle>
            <DialogDescription>
              Σύμφωνα με τον Κανονισμό (ΕΕ) 2016/679 (GDPR) και την ελληνική νομοθεσία
              (Ν. 4624/2019), επιλέξτε ποια cookies επιτρέπετε. Τα απαραίτητα cookies δεν
              απενεργοποιούνται.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <section className="site-cookie-category">
              <div className="site-cookie-category__head">
                <div>
                  <h3 className="site-cookie-category__title">Απαραίτητα</h3>
                  <p className="site-cookie-category__desc">
                    Απαιτούνται για τη βασική λειτουργία, την ασφάλεια και την αποθήκευση των
                    προτιμήσεών σας.
                  </p>
                </div>
                <Switch checked disabled aria-label="Απαραίτητα cookies — πάντα ενεργά" />
              </div>
            </section>

            <section className="site-cookie-category">
              <div className="site-cookie-category__head">
                <div>
                  <h3 className="site-cookie-category__title">Αναλυτικά / στατιστικά</h3>
                  <p className="site-cookie-category__desc">
                    Ανώνυμη καταμέτρηση επισκέψεων και λήψεων αρχείων για βελτίωση των υπηρεσιών.
                    Δεν χρησιμοποιούνται για διαφημιστική καταγραφή προφίλ.
                  </p>
                </div>
                <Switch
                  checked={analyticsEnabled}
                  onCheckedChange={setAnalyticsEnabled}
                  aria-label="Αναλυτικά cookies"
                />
              </div>
            </section>

            <section>
              <h3 className="site-cookie-category__title mb-3">Λίστα cookies</h3>
              <div className="site-cookie-table-wrap">
                <table className="site-cookie-table">
                  <thead>
                    <tr>
                      <th scope="col">Cookie</th>
                      <th scope="col">Σκοπός</th>
                      <th scope="col">Διάρκεια</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COOKIE_TABLE.map((row) => (
                      <tr key={row.name}>
                        <td>
                          <strong>{row.name}</strong>
                          <span className="site-cookie-table__meta">
                            {row.provider} · {row.type}
                          </span>
                        </td>
                        <td>{row.purpose}</td>
                        <td>{row.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => applyConsent({ analytics: false })}>
              Απόρριψη προαιρετικών
            </Button>
            <Button
              type="button"
              onClick={() => applyConsent({ analytics: analyticsEnabled })}
            >
              Αποθήκευση επιλογών
            </Button>
            <Button type="button" onClick={() => applyConsent({ analytics: true })}>
              Αποδοχή όλων
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
