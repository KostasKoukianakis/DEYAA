import { useRef, type RefObject } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type DeyaaServiceHubItem } from "@/data/deyaaServiceHub";
import { usePalladioServicesHubEntrance } from "@/hooks/usePalladioServicesHubEntrance";
import { ServicesHubClosingPanel } from "@/components/ServicesHubClosingPanel";
import { useI18n } from "@/i18n";
import { getLocalizedServiceHubItems } from "@/i18n/localized";

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
  sectionLabel,
  sectionIndex = "03",
  tagline,
  intro,
  ctaLabel,
  ctaHref = "/services",
  closingTitle,
  closingCtaLabel,
  services,
}: DeyaaServicesHubSectionProps) {
  const { t } = useI18n();
  const resolvedLabel = sectionLabel ?? t("home.hub.label");
  const resolvedTagline = tagline ?? t("home.hub.tagline");
  const resolvedIntro = intro ?? [
    t("home.hub.intro0"),
    t("home.hub.intro1"),
    t("home.hub.intro2"),
  ];
  const resolvedCta = ctaLabel ?? t("home.hub.cta");
  const resolvedClosingTitle = closingTitle ?? t("home.hub.closingTitle");
  const resolvedClosingCta = closingCtaLabel ?? t("home.hub.cta");
  const resolvedServices = services ?? getLocalizedServiceHubItems();
  const closingLines = resolvedClosingTitle.split("\n");
  const sectionRef = useRef<HTMLElement>(null);

  usePalladioServicesHubEntrance({
    sectionRef,
    pinSectionRef,
    scrollRef,
  });

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn("palladio-services-hub", className)}
      aria-label={`${resolvedLabel} — ${resolvedTagline}`}
    >
      <div
        ref={setHeightRef}
        className="palladio-services-hub__set set-height-innovation-hub relative min-[1025px]:overflow-visible overflow-hidden"
      >
        <div className="palladio-services-hub__bg sticky top-0 h-full" aria-hidden />

        <div
          ref={readHeightRef}
          className="palladio-services-hub__read read-height-innovation-hub relative z-10 w-full min-[1025px]:absolute min-[1025px]:left-0 min-[1025px]:top-0"
        >
          <section className="palladio-services-hub__intro-panel min-h-screen w-full">
            <div className="palladio-services-hub__intro-block palladio-services-hub__intro-block--anchor">
              <div className="palladio-services-hub__anchor-row">
                <span className="palladio-services-hub__anchor-label">{resolvedLabel}</span>
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
                <p className="palladio-services-hub__tagline">
                  {resolvedTagline.split(/\s+/).map((word, index) => (
                    <span key={index} className="palladio-services-hub__tagline-word">
                      {index > 0 ? " " : null}
                      {word}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <div className="palladio-services-hub__intro-block palladio-services-hub__intro-block--copy">
              <div className="palladio-services-hub__info-grid">
                {resolvedIntro.map((paragraph) => (
                  <p key={paragraph} className="palladio-services-hub__info-text">
                    {paragraph}
                  </p>
                ))}
                <div className="palladio-services-hub__info-cta">
                  <Link to={ctaHref} className="palladio-button button outline white">
                    {resolvedCta}
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
                  <p className="palladio-services-hub__scroll-label">{resolvedLabel}</p>
                </div>

                {resolvedServices.map((service) => (
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

              <ServicesHubClosingPanel
                className="palladio-services-hub__scroll-closing"
                closingLines={closingLines}
                ctaHref={ctaHref}
                ctaLabel={resolvedClosingCta}
              />
            </div>
          </section>

          <div className="palladio-services-hub__accordion">
            <div className="palladio-services-hub__mobile-tabs">
              {resolvedServices.map((service) => (
                <Link
                  key={service.id}
                  to={service.href}
                  className="palladio-services-hub__acc-item palladio-services-hub__mobile-tab"
                  style={{ backgroundImage: `url(${service.image})` }}
                >
                  <span className="palladio-services-hub__mobile-tab-scrim" aria-hidden />
                  <span className="palladio-services-hub__mobile-tab-title">{service.title}</span>
                  <ArrowUpRight className="palladio-services-hub__mobile-tab-icon" aria-hidden />
                </Link>
              ))}
            </div>
          </div>

          <ServicesHubClosingPanel
            className="palladio-services-hub__acc-footer palladio-services-hub__closing-panel--mobile"
            closingLines={closingLines}
            ctaHref={ctaHref}
            ctaLabel={resolvedClosingCta}
            titleKeyPrefix="mobile-closing"
          />
        </div>
      </div>
    </section>
  );
}
