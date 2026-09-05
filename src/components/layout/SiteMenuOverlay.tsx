import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

export const menuSections = [
  {
    id: "eServices",
    href: "/e-services",
    links: [
      { id: "payment", href: "/e-services/payment" },
      { id: "meter", href: "/e-services/meter-reading" },
      { id: "problem", href: "/e-services/problem-reporting" },
      { id: "calculator", href: "/e-services/bill-calculator" },
    ],
  },
  {
    id: "services",
    href: "/services",
    links: [
      { id: "water", href: "/services#item-water" },
      { id: "sewerage", href: "/services#item-sewerage" },
      { id: "documents", href: "/services#item-documents" },
    ],
  },
] as const;

export const primaryLinks = [
  { id: "home", href: "/" },
  { id: "announcements", href: "/announcements" },
  { id: "about", href: "/about" },
  { id: "contact", href: "/contact" },
] as const;

export const faultPhones = [
  { id: "water", tel: "+302825340208", display: "28253-40208", detail: "24/7" },
  { id: "sewerage", tel: "+302825340208", display: "28253-40208", detail: "24/7" },
  { id: "service", tel: "+302825340213", display: "28253-40213" },
] as const;

/** Match current route to a menu href (exact for home; supports hash anchors). */
export function isNavLinkActive(pathname: string, href: string, hash = ""): boolean {
  if (href.includes("#")) {
    const [path, fragment] = href.split("#");
    if (pathname !== path) return false;
    return hash === `#${fragment}`;
  }

  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isSectionActive(
  pathname: string,
  hash: string,
  section: (typeof menuSections)[number],
): boolean {
  if (isNavLinkActive(pathname, section.href, hash)) return true;
  return section.links.some((link) => isNavLinkActive(pathname, link.href, hash));
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
  const { t } = useI18n();
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
        aria-label={t("phones.title")}
        onClick={() => setOpen(!isOpen)}
      >
        <Phone className="site-nav-phone-btn__icon" strokeWidth={2} aria-hidden />
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] cursor-default"
            aria-label={t("phones.close")}
            onClick={() => setOpen(false)}
          />
          <div className="site-nav-phone-panel">
            <p className="site-nav-phone-panel__title">{t("phones.title")}</p>
            <ul className="site-nav-phone-panel__list">
              {faultPhones.map((phone) => (
                <li key={`${phone.id}-${phone.tel}`}>
                  <a
                    href={`tel:${phone.tel}`}
                    className="site-nav-phone-panel__link"
                    onClick={() => setOpen(false)}
                  >
                    <span className="site-nav-phone-panel__label">{t(`phones.${phone.id}`)}</span>
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
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const { pathname, hash } = useLocation();

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
      aria-label={t("menu.aria")}
    >
      <div className="site-menu__scroll">
        <div className="site-menu__grid">
          <div className="site-menu__primary">
            <nav aria-label={t("menu.primaryNav")}>
              <ul className="site-menu__primary-list">
                {primaryLinks.map((link, index) => {
                  const active = isNavLinkActive(pathname, link.href, hash);
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
                      {t(`nav.${link.id}`)}
                    </Link>
                  </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="site-menu__sections">
            {menuSections.map((section, index) => {
              const sectionActive = isSectionActive(pathname, hash, section);
              const activeSublink = section.links.find((link) =>
                isNavLinkActive(pathname, link.href, hash),
              );
              const titleActive =
                isNavLinkActive(pathname, section.href, hash) && !activeSublink;
              return (
              <section
                key={section.id}
                className={cn(
                  "site-menu__section site-menu__anim site-menu__anim--fade",
                  `site-menu__anim--section-${index + 1}`,
                  sectionActive && "site-menu__section--active",
                )}
              >
                <div className="site-menu__section-inner">
                  <p className="site-menu__kicker">{t(`menu.${section.id}Kicker`)}</p>
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
                          titleActive && "site-menu__title-link--active",
                        )}
                        aria-current={titleActive ? "page" : undefined}
                        onClick={onClose}
                      >
                        <MenuCrocino />
                        <span className="site-menu__title">{t(`menu.${section.id}Title`)}</span>
                      </Link>
                    </div>
                    {section.links.length > 0 ? (
                      <div className="site-menu__subsection">
                        <ul className="site-menu__sublist">
                          {section.links.map((link) => {
                            const sublinkActive = isNavLinkActive(pathname, link.href, hash);
                            return (
                              <li
                                key={link.href}
                                className={cn(sublinkActive && "site-menu__sublist-item--active")}
                              >
                                <Link
                                  to={link.href}
                                  className={cn(
                                    "site-menu__sublink",
                                    sublinkActive && "site-menu__sublink--active",
                                  )}
                                  aria-current={sublinkActive ? "page" : undefined}
                                  onClick={onClose}
                                >
                                  <span className="site-menu__sublink-marker" aria-hidden>
                                    {sublinkActive ? <MenuCrocino /> : null}
                                  </span>
                                  <span className="site-menu__sublink-label">{t(`menu.${link.id}`)}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              </section>
            );
            })}
          </div>

          <div className="site-menu__footer site-menu__anim site-menu__anim--fade site-menu__anim--footer">
            <div className="site-menu__phones">
              {faultPhones.map((phone) => (
                <a
                  key={`${phone.id}-${phone.tel}`}
                  href={`tel:${phone.tel}`}
                  className="site-menu__phone"
                  onClick={onClose}
                >
                  <Phone className="h-5 w-5 shrink-0" aria-hidden />
                  <span>
                    {t(`phones.${phone.id}`)}: {phone.display}
                    {"detail" in phone && phone.detail ? ` · ${phone.detail}` : ""}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
