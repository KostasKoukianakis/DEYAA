import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { isEServicesSubpage as checkEServicesSubpage } from "@/lib/eServicesRoutes";
import { isShaderBackdropPath } from "@/lib/shaderBackdropRoutes";
import { subscribeScroll } from "@/lib/scrollControl";
import { DeyaBrandLogo } from "@/components/DeyaBrandLogo";
import { SiteMenuOverlay, NavPhones } from "@/components/layout/SiteMenuOverlay";
import { useI18n } from "@/i18n";

const CONTACT_TOP_THRESHOLD = 72;
const SCROLL_SHOW_TOP = 72;
const SCROLL_DOWN_HIDE = 14;
const SCROLL_UP_SHOW = 8;
/** Match `.site-menu` clip-path close duration in index.css */
const MENU_CLOSE_MS = 560;

function getHomeHeroCutoff(height: number) {
  return height * 0.92;
}

function getEServicesHeroCutoff(height: number) {
  return height * 0.72;
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  /** Stays true through menu close animation so header chrome matches panel wipe */
  const [menuActive, setMenuActive] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [phonesOpen, setPhonesOpen] = useState(false);
  const { locale, setLocale, options, t, meta } = useI18n();
  const [navHidden, setNavHidden] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<-1 | 0 | 1>(0);
  const [scrollY, setScrollY] = useState(() =>
    typeof window !== "undefined" ? window.scrollY : 0,
  );
  const lastScrollY = useRef(0);
  const scrollDeltaAcc = useRef(0);
  const viewportHeight = useRef(
    typeof window !== "undefined" ? window.innerHeight : 800,
  );
  const location = useLocation();

  useEffect(() => {
    const onResize = () => {
      viewportHeight.current = window.innerHeight;
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isHomePage = location.pathname === "/";
  const isContactPage = location.pathname === "/contact";
  const isAboutPage = location.pathname === "/about";
  const isAnnouncementsPage = location.pathname.startsWith("/announcements");
  const isAnnouncementsArchive = location.pathname === "/announcements";
  const isEServicesHub = location.pathname === "/e-services";
  const isServicesHub = location.pathname === "/services";
  const isEServicesSubpage = checkEServicesSubpage(location.pathname);
  const utilityAtTop =
    isShaderBackdropPath(location.pathname) && scrollY <= CONTACT_TOP_THRESHOLD;
  const inHomeHero = isHomePage && scrollY < getHomeHeroCutoff(viewportHeight.current);
  const contactAtTop = isContactPage && scrollY <= CONTACT_TOP_THRESHOLD;
  const aboutAtTop = isAboutPage && scrollY <= CONTACT_TOP_THRESHOLD;
  const palladioHubInHero =
    (isEServicesHub || isServicesHub || isEServicesSubpage) &&
    scrollY < getEServicesHeroCutoff(viewportHeight.current);
  const navTransparent =
    !menuActive &&
    (inHomeHero ||
      contactAtTop ||
      aboutAtTop ||
      isAnnouncementsArchive ||
      palladioHubInHero ||
      utilityAtTop);
  const navChromeTransparent =
    navTransparent ||
    navHidden ||
    (scrollDirection === 1 && scrollY > SCROLL_SHOW_TOP);
  const heroChrome = (inHomeHero || aboutAtTop || palladioHubInHero || utilityAtTop) && !menuActive;

  const updateScroll = useCallback(
    ({ scrollY: currentY, direction }: { scrollY: number; direction: -1 | 0 | 1 }) => {
      setScrollY(currentY);

      if (direction !== 0) {
        setScrollDirection(direction);
      }

      if (menuActive) {
        lastScrollY.current = currentY;
        scrollDeltaAcc.current = 0;
        return;
      }

      if (currentY <= SCROLL_SHOW_TOP) {
        setNavHidden(false);
        setScrollDirection(0);
        lastScrollY.current = currentY;
        scrollDeltaAcc.current = 0;
        return;
      }

      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      if (Math.abs(delta) < 0.25) return;

      scrollDeltaAcc.current += delta;

      if (direction === -1 || scrollDeltaAcc.current <= -SCROLL_UP_SHOW) {
        setNavHidden(false);
        scrollDeltaAcc.current = 0;
        return;
      }

      if (direction === 1 && scrollDeltaAcc.current >= SCROLL_DOWN_HIDE) {
        setNavHidden(true);
        scrollDeltaAcc.current = 0;
      }
    },
    [menuActive],
  );

  useEffect(() => {
    const unsubscribe = subscribeScroll(updateScroll);

    const onResize = () => updateScroll({ scrollY: window.scrollY, direction: 0 });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", onResize);
    };
  }, [updateScroll]);

  useEffect(() => {
    setNavHidden(false);
    setScrollDirection(0);
    lastScrollY.current = window.scrollY;
    scrollDeltaAcc.current = 0;
    setScrollY(window.scrollY);
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
    if (menuOpen) {
      setMenuActive(true);
    }
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen || !menuActive) return;

    const timeout = window.setTimeout(() => setMenuActive(false), MENU_CLOSE_MS);
    return () => window.clearTimeout(timeout);
  }, [menuOpen, menuActive]);

  useEffect(() => {
    const root = document.documentElement;

    if (!menuActive) {
      root.classList.remove("site-menu-open");
      return;
    }

    root.classList.add("site-menu-open");

    return () => {
      root.classList.remove("site-menu-open");
    };
  }, [menuActive]);

  return (
    <>
      <header
        className={cn(
          "site-nav-header",
          menuActive
            ? "site-nav-header--menu-open"
            : navChromeTransparent
              ? "site-nav-header--hero"
              : "site-nav-header--solid",
          isAnnouncementsPage && !menuActive && "site-nav-header--borderless",
          (isEServicesHub || isServicesHub || isEServicesSubpage) &&
            palladioHubInHero &&
            !menuActive &&
            "site-nav-header--borderless",
          !menuActive && navHidden && "site-nav-header--scroll-hidden",
        )}
      >
        <div className="site-nav-bar">
          <Link to="/" className="shrink-0">
            <DeyaBrandLogo
              alt={t("nav.logoAlt")}
              className={cn("site-nav-logo", heroChrome && "site-nav-logo--hero")}
            />
          </Link>

          <div className="site-nav-end">
            <div className="site-nav-actions">
              <NavPhones
                hero={heroChrome}
                open={phonesOpen}
                onOpenChange={(next) => {
                  setPhonesOpen(next);
                  if (next) setLanguageOpen(false);
                }}
              />

              <div className="relative">
                <button
                  type="button"
                  className={cn("site-nav-lang", heroChrome && "site-nav-lang--hero")}
                  aria-expanded={languageOpen}
                  aria-haspopup="listbox"
                  onClick={() => {
                    setLanguageOpen((open) => !open);
                    setPhonesOpen(false);
                  }}
                >
                  {meta[locale].code}
                </button>
                {languageOpen ? (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-[60] cursor-default"
                      aria-label={t("nav.closeLanguage")}
                      onClick={() => setLanguageOpen(false)}
                    />
                    <ul
                      role="listbox"
                      aria-label={t("nav.language")}
                      className="absolute right-0 top-[calc(100%+0.5rem)] z-[70] min-w-[9rem] overflow-hidden rounded-xl border border-primary/15 bg-white py-1 shadow-lg"
                    >
                      {options.map((lang) => (
                        <li key={lang.id}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={locale === lang.id}
                            className={cn(
                              "w-full px-4 py-2.5 text-left text-sm transition-colors",
                              locale === lang.id
                                ? "font-semibold text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-primary",
                            )}
                            onClick={() => {
                              setLocale(lang.id);
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
                heroChrome && "site-nav-burger--hero",
                menuOpen && "site-nav-burger--open",
              )}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
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
