import { useRef } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { DeyaBrandLogo } from "@/components/DeyaBrandLogo";
import { FooterNewsletterForm } from "@/components/FooterNewsletterForm";
import { footerLegalLinks, footerMenuColumns } from "@/data/deyaaFooterLinks";
import { usePalladioMarquee } from "@/hooks/usePalladioMarquee";
import { usePalladioFooterEntrance } from "@/hooks/usePalladioFooterEntrance";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

const FOOTER_COLUMN_KEYS = {
  about: "footer.aboutCol",
  sections: "footer.sectionsCol",
  services: "footer.servicesCol",
} as const;

const FOOTER_LINK_KEYS: Record<string, string> = {
  "/about": "footer.about",
  "/about#about-vision": "footer.mission",
  "/about#about-hero": "footer.board",
  "/": "nav.home",
  "/announcements": "nav.announcements",
  "/water-quality": "nav.waterQuality",
  "/contact": "nav.contact",
  "/services": "footer.allServices",
  "/services#item-water": "menu.water",
  "/services#item-sewerage": "menu.sewerage",
  "/services#item-documents": "menu.documents",
  "/e-services": "footer.eServices",
  "/e-services/payment": "menu.payment",
  "/e-services/meter-reading": "menu.meter",
  "/e-services/bill-calculator": "menu.calculator",
  "/e-services/problem-reporting": "menu.problem",
  "/privacy": "footer.privacy",
  "/terms": "footer.terms",
};

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com",
    Icon: Facebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com",
    Icon: Instagram,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com",
    Icon: Youtube,
  },
] as const;

function FooterMarqueeIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className="palladio-footer__marquee-svg">
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

function MarqueeGroup({ phrase }: { phrase: string }) {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <span key={index} className="palladio-footer__marquee-item">
          <span className="palladio-footer__marquee-text">{phrase}</span>
          <span className="palladio-footer__marquee-icon">
            <FooterMarqueeIcon />
          </span>
        </span>
      ))}
    </>
  );
}

interface PalladioFooterProps {
  className?: string;
}

/**
 * Palladio footer v1 — marquee band, logo, menu grid, copyright row.
 */
export function PalladioFooter({ className }: PalladioFooterProps) {
  const { t } = useI18n();
  const footerRef = useRef<HTMLElement>(null);
  const marqueeRef = usePalladioMarquee<HTMLDivElement>();
  const year = new Date().getFullYear();
  const marqueePhrase = t("footer.marquee");

  usePalladioFooterEntrance(footerRef);

  return (
    <footer
      ref={footerRef}
      className={cn("palladio-footer", className)}
      aria-label={t("footer.aria")}
    >
      <div className="palladio-footer__marquee-wrap">
        <div className="palladio-footer__marquee">
          <div ref={marqueeRef} className="palladio-footer__marquee-inner">
            <div className="palladio-footer__marquee-group">
              <MarqueeGroup phrase={marqueePhrase} />
            </div>
            <div className="palladio-footer__marquee-group" aria-hidden="true">
              <MarqueeGroup phrase={marqueePhrase} />
            </div>
          </div>
        </div>
      </div>

      <div className="palladio-footer__body">
        <div className="palladio-footer__logo-row">
          <Link to="/" className="palladio-footer__logo-link">
            <DeyaBrandLogo alt={t("footer.logoAlt")} className="palladio-footer__logo" variant="footer" />
          </Link>
        </div>

        <div className="palladio-footer__menus">
          <div className="palladio-footer__info">
            <div className="palladio-footer__info-inner">
              <span className="palladio-footer__info-title">{t("footer.orgName")}</span>
              <p className="palladio-footer__info-text">{t("footer.orgFull")}</p>
              <p className="palladio-footer__info-text">{t("footer.address")}</p>
              <p className="palladio-footer__info-text">
                {t("footer.phoneLabel")}{" "}
                <a href="tel:+302825340213" className="palladio-footer__info-link">
                  28253-40213
                </a>
                {" · "}
                {t("footer.emailLabel")}{" "}
                <a href="mailto:info@deyaa.gr" className="palladio-footer__info-link">
                  info@deyaa.gr
                </a>
              </p>
            </div>
          </div>

          <div className="palladio-footer__menu-grid">
            {footerMenuColumns.map((column) => {
              const columnLabel = t(
                FOOTER_COLUMN_KEYS[column.id as keyof typeof FOOTER_COLUMN_KEYS],
              );
              return (
              <div key={column.id} className="palladio-footer__menu-col">
                <span className="palladio-footer__menu-label">{columnLabel}</span>
                <nav aria-label={columnLabel}>
                  <ul className="palladio-footer__menu-list">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        {link.external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="palladio-footer__menu-link"
                          >
                            {t(FOOTER_LINK_KEYS[link.href] ?? link.label)}
                          </a>
                        ) : (
                          <Link to={link.href} className="palladio-footer__menu-link">
                            {t(FOOTER_LINK_KEYS[link.href] ?? link.label)}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              );
            })}
          </div>

          <div className="palladio-footer__social-row">
            <div className="palladio-footer__copyright-mobile">
              <span>{t("footer.copyright", { year })}</span>
            </div>
            <div className="palladio-footer__social-links">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="palladio-footer__social-link"
                  aria-label={label}
                >
                  <Icon className="palladio-footer__social-icon" strokeWidth={1.35} aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FooterNewsletterForm />

      <div className="palladio-footer__legal">
        <div className="palladio-footer__copyright-desktop">
          <span>{t("footer.copyright", { year })}</span>
        </div>
        <div className="palladio-footer__legal-links">
          {footerLegalLinks.map((link) => (
            <Link key={link.href} to={link.href} className="palladio-footer__legal-link">
              {t(FOOTER_LINK_KEYS[link.href] ?? link.label)}
            </Link>
          ))}
        </div>
        <div className="palladio-footer__legal-spacer" aria-hidden />
      </div>
    </footer>
  );
}
