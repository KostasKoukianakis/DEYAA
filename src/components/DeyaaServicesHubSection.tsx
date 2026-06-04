import { useState, type RefObject } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { deyaaServiceHubItems, type DeyaaServiceHubItem } from "@/data/deyaaServiceHub";

interface DeyaaServicesHubSectionProps {
  id?: string;
  className?: string;
  setHeightRef?: RefObject<HTMLDivElement | null>;
  readHeightRef?: RefObject<HTMLDivElement | null>;
  pinSectionRef?: RefObject<HTMLElement | null>;
  scrollRef?: RefObject<HTMLDivElement | null>;
  sectionLabel?: string;
  sectionIndex?: string;
  tagline?: string;
  intro?: [string, string, string];
  ctaLabel?: string;
  ctaHref?: string;
  closingTitle?: string;
  closingCtaLabel?: string;
  services?: DeyaaServiceHubItem[];
}

/**
 * Palladio #innovation-hub — intro scrolls naturally (min-h-screen),
 * then a separate pinned horizontal carousel section.
 */
export function DeyaaServicesHubSection({
  id = "section-03",
  className,
  setHeightRef,
  readHeightRef,
  pinSectionRef,
  scrollRef,
  sectionLabel = "Υπηρεσίες",
  sectionIndex = "03",
  tagline = "ΔΕΥΑΑ: οι υπηρεσίες που στηρίζουν την καθημερινότητα",
  intro = [
    "Όχι απλώς μια υπηρεσία κοινής ωφέλειας, αλλά ο πυρήνας της ζωής στον Αποκόρωνα. Εδώ φροντίζουμε το νερό, από την πηγή μέχρι τη βρύση.",
    "Στη ΔΕΥΑΑ συνδυάζουμε σύγχρονη υποδομή, έμπειρο προσωπικό και ψηφιακές λύσεις — για αξιόπιστη παροχή νερού και αποχέτευσης.",
    "Μαζί, σχεδιάζουμε πώς θα ανταποκριθούμε στις ανάγκες των πολιτών — με διαφάνεια, ασφάλεια και σεβασμό στο περιβάλλον.",
  ],
  ctaLabel = "Όλες οι υπηρεσίες",
  ctaHref = "/services",
  closingTitle = "Χρειάζεστε κάτι από εμάς;\nΕίμαστε ένα κλικ μακριά",
  closingCtaLabel = "Όλες οι υπηρεσίες",
  services = deyaaServiceHubItems,
}: DeyaaServicesHubSectionProps) {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const closingLines = closingTitle.split("\n");

  return (
    <section id={id} className={cn("palladio-services-hub", className)} aria-label={`${sectionLabel} — ${tagline}`}>
      <div
        ref={setHeightRef}
        className="palladio-services-hub__set set-height-innovation-hub relative overflow-hidden"
      >
        <div className="palladio-services-hub__bg sticky top-0 h-full" aria-hidden />

        <div
          ref={readHeightRef}
          className="palladio-services-hub__read read-height-innovation-hub relative z-10 w-full md:absolute md:left-0 md:top-0"
        >
          <section className="palladio-services-hub__intro-panel min-h-screen w-full">
            <div className="palladio-services-hub__intro-block palladio-services-hub__intro-block--anchor">
              <div className="palladio-services-hub__anchor-row">
                <span className="palladio-services-hub__anchor-label">{sectionLabel}</span>
                <span className="palladio-services-hub__anchor-index">[{sectionIndex}]</span>
              </div>
            </div>

            <div className="palladio-services-hub__intro-block palladio-services-hub__intro-block--brand">
              <div className="palladio-services-hub__wordmark" aria-hidden>
                <span className="palladio-services-hub__wordmark-line">ΔΕΥΑΑ</span>
                <span className="palladio-services-hub__wordmark-mark">×</span>
                <span className="palladio-services-hub__wordmark-line">ΥΠΗΡΕΣΙΕΣ</span>
              </div>
            </div>

            <div className="palladio-services-hub__intro-block palladio-services-hub__intro-block--tagline">
              <div className="palladio-services-hub__tagline-row">
                <img
                  src="/hero/arrow-down.png"
                  alt=""
                  className="palladio-services-hub__tagline-icon"
                  decoding="async"
                  draggable={false}
                  aria-hidden
                />
                <p className="palladio-services-hub__tagline">{tagline}</p>
              </div>
            </div>

            <div className="palladio-services-hub__intro-block palladio-services-hub__intro-block--copy">
              <div className="palladio-services-hub__info-grid">
                {intro.map((paragraph) => (
                  <p key={paragraph} className="palladio-services-hub__info-text">
                    {paragraph}
                  </p>
                ))}
                <div className="palladio-services-hub__info-cta">
                  <Link to={ctaHref} className="palladio-button button outline white">
                    {ctaLabel}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section
            ref={pinSectionRef}
            className="palladio-services-hub__carousel-section horizontal-scroll-container min-h-screen"
          >
            <div
              ref={scrollRef}
              className="palladio-services-hub__scroll horizontal-scroll palladio-horizontal-scroll min-h-screen"
            >
              <div className="palladio-services-hub__scroll-cards horizontal-scroll-cards">
                <div className="palladio-services-hub__scroll-lead">
                  <p className="palladio-services-hub__scroll-label">{sectionLabel}</p>
                </div>

                {services.map((service) => (
                  <Link
                    key={service.id}
                    to={service.href}
                    className="palladio-services-hub__card hub-card"
                    style={{ backgroundImage: `url(${service.image})` }}
                  >
                    <div className="palladio-services-hub__card-overlay">
                      <p className="palladio-services-hub__card-body">{service.body}</p>
                      <span className="palladio-services-hub__card-title">{service.title}</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="palladio-services-hub__scroll-closing">
                <div className="palladio-services-hub__closing-inner">
                  <p className="palladio-services-hub__closing-title">
                    {closingLines.map((line, index) => (
                      <span key={`${index}-${line}`}>
                        {line}
                        {index < closingLines.length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </p>
                  <Link to={ctaHref} className="palladio-button button outline white">
                    {closingCtaLabel}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <div className="palladio-services-hub__accordion">
            {services.map((service) => {
              const isOpen = openAccordion === service.id;

              return (
                <div key={service.id} className="palladio-services-hub__acc-item">
                  <button
                    type="button"
                    className="palladio-services-hub__acc-trigger"
                    aria-expanded={isOpen}
                    onClick={() => setOpenAccordion(isOpen ? null : service.id)}
                  >
                    <span className="palladio-services-hub__acc-title">{service.title}</span>
                    <ChevronDown
                      className={cn(
                        "palladio-services-hub__acc-icon",
                        isOpen && "palladio-services-hub__acc-icon--open",
                      )}
                      aria-hidden
                    />
                  </button>

                  {isOpen ? (
                    <div className="palladio-services-hub__acc-panel">
                      <p className="palladio-services-hub__acc-body">{service.body}</p>
                      <img
                        src={service.image}
                        alt=""
                        className="palladio-services-hub__acc-image"
                        decoding="async"
                        draggable={false}
                      />
                      <Link
                        to={service.href}
                        className="palladio-button button outline white palladio-button--card"
                      >
                        Μετάβαση
                      </Link>
                    </div>
                  ) : null}
                </div>
              );
            })}

            <div className="palladio-services-hub__acc-footer">
              <p className="palladio-services-hub__closing-title">
                {closingLines.map((line, index) => (
                  <span key={`mobile-${index}-${line}`}>
                    {line}
                    {index < closingLines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </p>
              <Link to={ctaHref} className="palladio-button button outline white">
                {closingCtaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
