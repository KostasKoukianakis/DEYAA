import { useRef } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";
import deyaLogo from "@/pages/images/deya_logo.png";
import { footerLegalLinks, footerMenuColumns } from "@/data/deyaaFooterLinks";
import { usePalladioMarquee } from "@/hooks/usePalladioMarquee";
import { usePalladioFooterEntrance } from "@/hooks/usePalladioFooterEntrance";
import { cn } from "@/lib/utils";

const marqueePhrase = "Φροντίζουμε το νερό";

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

function MarqueeGroup() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <span key={index} className="palladio-footer__marquee-item">
          <span className="palladio-footer__marquee-text">{marqueePhrase}</span>
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
  const footerRef = useRef<HTMLElement>(null);
  const marqueeRef = usePalladioMarquee<HTMLDivElement>();
  const year = new Date().getFullYear();

  usePalladioFooterEntrance(footerRef);

  return (
    <footer
      ref={footerRef}
      className={cn("palladio-footer", className)}
      aria-label="Υποσέλιδο"
    >
      <div className="palladio-footer__marquee-wrap">
        <div className="palladio-footer__marquee">
          <div ref={marqueeRef} className="palladio-footer__marquee-inner">
            <div className="palladio-footer__marquee-group">
              <MarqueeGroup />
            </div>
            <div className="palladio-footer__marquee-group" aria-hidden="true">
              <MarqueeGroup />
            </div>
          </div>
        </div>
      </div>

      <div className="palladio-footer__body">
        <div className="palladio-footer__logo-row">
          <Link to="/" className="palladio-footer__logo-link">
            <img src={deyaLogo} alt="ΔΕΥΑΑ Αποκορώνου" className="palladio-footer__logo" />
          </Link>
        </div>

        <div className="palladio-footer__menus">
          <div className="palladio-footer__info">
            <div className="palladio-footer__info-inner">
              <span className="palladio-footer__info-title">ΔΕΥΑΑ Αποκορώνου</span>
              <p className="palladio-footer__info-text">
                Δημοτική Επιχείρηση Ύδρευσης Αποχέτευσης Αποκορώνου
              </p>
              <p className="palladio-footer__info-text">
                Επαρ. Οδ. Καλυβών–Γεωργιούπολης 159, Βάμος, 73008 — Χανιά, Κρήτη, Ελλάδα
              </p>
              <p className="palladio-footer__info-text">
                Τηλ. εξυπηρέτησης:{" "}
                <a href="tel:+302825340213" className="palladio-footer__info-link">
                  28253-40213
                </a>
                {" · "}
                Email:{" "}
                <a href="mailto:info@deyaa.gr" className="palladio-footer__info-link">
                  info@deyaa.gr
                </a>
              </p>
            </div>
          </div>

          <div className="palladio-footer__menu-grid">
            {footerMenuColumns.map((column) => (
              <div key={column.id} className="palladio-footer__menu-col">
                <span className="palladio-footer__menu-label">{column.label}</span>
                <nav aria-label={column.label}>
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
                            {link.label}
                          </a>
                        ) : (
                          <Link to={link.href} className="palladio-footer__menu-link">
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>

          <div className="palladio-footer__social-row">
            <div className="palladio-footer__copyright-mobile">
              <span>Copyright {year}</span>
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

      <div className="palladio-footer__legal">
        <div className="palladio-footer__copyright-desktop">
          <span>Copyright {year}</span>
        </div>
        <div className="palladio-footer__legal-links">
          {footerLegalLinks.map((link) => (
            <Link key={link.href} to={link.href} className="palladio-footer__legal-link">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="palladio-footer__legal-spacer" aria-hidden />
      </div>
    </footer>
  );
}
