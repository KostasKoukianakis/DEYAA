import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowUpRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export const menuSections = [
  {
    kicker: "ΗΛΕΚΤΡΟΝΙΚΕΣ ΥΠΗΡΕΣΙΕΣ",
    title: "e-Services",
    href: "/e-services",
    seeAll: "Όλες οι e-υπηρεσίες",
    links: [
      { name: "Πληρωμή λογαριασμών", href: "/e-services/payment" },
      { name: "Δήλωση ένδειξης", href: "/e-services/meter-reading" },
      { name: "Αναφορά προβλήματος", href: "/e-services/problem-reporting" },
      { name: "Υπολογισμός λογαριασμού", href: "/e-services/bill-calculator" },
    ],
  },
  {
    kicker: "ΥΠΗΡΕΣΙΕΣ",
    title: "Ύδρευση & Αποχέτευση",
    href: "/services",
    seeAll: "Όλες οι υπηρεσίες",
    links: [
      { name: "Ύδρευση", href: "/services#item-water" },
      { name: "Αποχέτευση", href: "/services#item-sewerage" },
      { name: "Δικαιολογητικά", href: "/services#item-documents" },
    ],
  },
] as const;

export const primaryLinks = [
  { name: "Αρχική", href: "/" },
  { name: "Ανακοινώσεις", href: "/announcements" },
  { name: "Σχετικά", href: "/about" },
  { name: "Επικοινωνία", href: "/contact" },
] as const;

export const languages = [
  { code: "EL", name: "Ελληνικά" },
  { code: "EN", name: "English" },
] as const;

export const faultPhones = [
  { label: "Ύδρευση", tel: "+302825340208", display: "28253-40208", detail: "24/7" },
  { label: "Αποχέτευση", tel: "+302825340208", display: "28253-40208", detail: "24/7" },
  { label: "Εξυπηρέτηση", tel: "+302825340213", display: "28253-40213" },
] as const;

export type Language = (typeof languages)[number];

/** Match current route to a menu href (exact for home). */
export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isSectionActive(pathname: string, section: (typeof menuSections)[number]): boolean {
  if (isNavLinkActive(pathname, section.href)) return true;
  return section.links.some((link) => isNavLinkActive(pathname, link.href));
}

function MenuCrocino() {
  return (
    <span className="site-menu__crocino" aria-hidden>
      <span className="site-menu__crocino-line" />
    </span>
  );
}

interface NavPhonesProps {
  hero?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NavPhones({ hero = false, open, onOpenChange }: NavPhonesProps) {
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlled ? open : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  return (
    <div className="relative">
      <button
        type="button"
        className={cn("site-nav-phone-btn", hero && "site-nav-phone-btn--hero")}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Τηλέφωνα βλαβών 24/7"
        onClick={() => setOpen(!isOpen)}
      >
        <Phone className="site-nav-phone-btn__icon" strokeWidth={2} aria-hidden />
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] cursor-default"
            aria-label="Κλείσιμο τηλεφώνων"
            onClick={() => setOpen(false)}
          />
          <div className="site-nav-phone-panel">
            <p className="site-nav-phone-panel__title">Τηλέφωνα βλαβών 24/7</p>
            <ul className="site-nav-phone-panel__list">
              {faultPhones.map((phone) => (
                <li key={`${phone.label}-${phone.tel}`}>
                  <a
                    href={`tel:${phone.tel}`}
                    className="site-nav-phone-panel__link"
                    onClick={() => setOpen(false)}
                  >
                    <span className="site-nav-phone-panel__label">{phone.label}</span>
                    <strong>{phone.display}</strong>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}

interface SiteMenuOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SiteMenuOverlay({ open, onClose }: SiteMenuOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timeout = window.setTimeout(() => setMounted(false), 560);
    return () => window.clearTimeout(timeout);
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      className={cn("site-menu", visible && "site-menu--visible")}
      role="dialog"
      aria-modal="true"
      aria-label="Κύριο μενού"
    >
      <div className="site-menu__scroll">
        <div className="site-menu__grid">
          <div className="site-menu__primary">
            <nav aria-label="Κύριες σελίδες">
              <ul className="site-menu__primary-list">
                {primaryLinks.map((link, index) => {
                  const active = isNavLinkActive(pathname, link.href);
                  return (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className={cn(
                        "site-menu__primary-link site-menu__anim site-menu__anim--fade",
                        `site-menu__anim--primary-${index + 1}`,
                        active && "site-menu__primary-link--active",
                      )}
                      aria-current={active ? "page" : undefined}
                      onClick={onClose}
                    >
                      <MenuCrocino />
                      {link.name}
                    </Link>
                  </li>
                  );
                })}
              </ul>
            </nav>

            <div className="site-menu__footer site-menu__anim site-menu__anim--fade site-menu__anim--footer">
              <div className="site-menu__phones">
                {faultPhones.map((phone) => (
                  <a
                    key={`${phone.label}-${phone.tel}`}
                    href={`tel:${phone.tel}`}
                    className="site-menu__phone"
                    onClick={onClose}
                  >
                    <Phone className="h-5 w-5 shrink-0" aria-hidden />
                    <span>
                      {phone.label}: {phone.display}
                      {"detail" in phone && phone.detail ? ` · ${phone.detail}` : ""}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="site-menu__sections">
            {menuSections.map((section, index) => {
              const sectionActive = isSectionActive(pathname, section);
              return (
              <section
                key={section.kicker}
                className={cn(
                  "site-menu__section site-menu__anim",
                  `site-menu__anim--section-${index + 1}`,
                  sectionActive && "site-menu__section--active",
                )}
              >
                <div className="site-menu__section-inner">
                  <p className="site-menu__kicker">{section.kicker}</p>
                  <div
                    className={cn(
                      "site-menu__section-main",
                      section.links.length === 0 && "site-menu__section-main--solo",
                    )}
                  >
                    <div className="site-menu__section-title-col">
                      <Link
                        to={section.href}
                        className={cn(
                          "site-menu__title-link",
                          sectionActive && "site-menu__title-link--active",
                        )}
                        aria-current={isNavLinkActive(pathname, section.href) ? "page" : undefined}
                        onClick={onClose}
                      >
                        <MenuCrocino />
                        <span className="site-menu__title">{section.title}</span>
                      </Link>
                      <Link to={section.href} className="site-menu__see-all" onClick={onClose}>
                        {section.seeAll}
                        <ArrowUpRight className="site-menu__see-all-icon" aria-hidden />
                      </Link>
                    </div>
                    {section.links.length > 0 ? (
                      <ul className="site-menu__sublist">
                        {section.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              to={link.href}
                              className={cn(
                                "site-menu__sublink",
                                isNavLinkActive(pathname, link.href) && "site-menu__sublink--active",
                              )}
                              aria-current={isNavLinkActive(pathname, link.href) ? "page" : undefined}
                              onClick={onClose}
                            >
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </section>
            );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
