import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import deyaLogo from "@/pages/images/deya_logo.png";
import {
  SiteMenuOverlay,
  NavPhones,
  languages,
  type Language,
} from "@/components/layout/SiteMenuOverlay";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [phonesOpen, setPhonesOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [navHidden, setNavHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isContactPage = location.pathname === "/contact";
  const isTransparentHero = isHomePage || isContactPage;
  const onHero = isTransparentHero && atTop && !menuOpen;

  useEffect(() => {
    const SCROLL_THRESHOLD = 72;
    const DELTA_THRESHOLD = 6;

    const onScroll = () => {
      const currentY = window.scrollY;

      if (menuOpen) {
        lastScrollY.current = currentY;
        return;
      }

      if (currentY <= SCROLL_THRESHOLD) {
        setNavHidden(false);
        setAtTop(true);
      } else {
        setAtTop(false);
        const delta = currentY - lastScrollY.current;
        if (delta > DELTA_THRESHOLD) {
          setNavHidden(true);
        } else if (delta < -DELTA_THRESHOLD) {
          setNavHidden(false);
        }
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  useEffect(() => {
    setNavHidden(false);
    setAtTop(window.scrollY <= 72);
    lastScrollY.current = window.scrollY;
  }, [location.pathname]);

  useEffect(() => {
    if (navHidden) {
      setLanguageOpen(false);
      setPhonesOpen(false);
    }
  }, [navHidden]);

  useEffect(() => {
    setMenuOpen(false);
    setLanguageOpen(false);
    setPhonesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const root = document.documentElement;

    if (!menuOpen) {
      root.classList.remove("site-menu-open");
      return;
    }

    root.classList.add("site-menu-open");

    return () => {
      root.classList.remove("site-menu-open");
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "site-nav-header",
          onHero ? "site-nav-header--hero" : "site-nav-header--solid",
          menuOpen && "site-nav-header--menu-open",
          !menuOpen && navHidden && "site-nav-header--scroll-hidden",
        )}
      >
        <div className="site-nav-bar">
          <Link to="/" className="shrink-0">
            <img
              src={deyaLogo}
              alt="ΔΕΥΑΑ Logo"
              className="site-nav-logo"
            />
          </Link>

          <div className="site-nav-end">
            <div className="site-nav-actions">
              <NavPhones
                hero={onHero}
                open={phonesOpen}
                onOpenChange={(next) => {
                  setPhonesOpen(next);
                  if (next) setLanguageOpen(false);
                }}
              />

              <div className="relative">
                <button
                  type="button"
                  className={cn("site-nav-lang", onHero && "site-nav-lang--hero")}
                  aria-expanded={languageOpen}
                  aria-haspopup="listbox"
                  onClick={() => {
                    setLanguageOpen((open) => !open);
                    setPhonesOpen(false);
                  }}
                >
                  {selectedLanguage.code}
                </button>
                {languageOpen ? (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-[60] cursor-default"
                      aria-label="Κλείσιμο επιλογής γλώσσας"
                      onClick={() => setLanguageOpen(false)}
                    />
                    <ul
                      role="listbox"
                      className="absolute right-0 top-[calc(100%+0.5rem)] z-[70] min-w-[9rem] overflow-hidden rounded-xl border border-primary/15 bg-white py-1 shadow-lg"
                    >
                      {languages.map((lang) => (
                        <li key={lang.code}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={selectedLanguage.code === lang.code}
                            className={cn(
                              "w-full px-4 py-2.5 text-left text-sm transition-colors",
                              selectedLanguage.code === lang.code
                                ? "font-semibold text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-primary"
                            )}
                            onClick={() => {
                              setSelectedLanguage(lang);
                              setLanguageOpen(false);
                            }}
                          >
                            {lang.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              className={cn(
                "site-nav-burger",
                onHero && "site-nav-burger--hero",
                menuOpen && "site-nav-burger--open",
              )}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
              onClick={() => {
                setLanguageOpen(false);
                setPhonesOpen(false);
                setMenuOpen((open) => !open);
              }}
            >
              <span className="site-nav-burger__icon" aria-hidden>
                <span className="site-nav-burger__bar site-nav-burger__bar--top" />
                <span className="site-nav-burger__bar site-nav-burger__bar--bottom" />
              </span>
            </button>
          </div>
        </div>

        <SiteMenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      </header>
    </>
  );
}
