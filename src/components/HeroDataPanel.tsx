import { type RefObject } from "react";
import { Link } from "react-router-dom";
import { type HeroServiceItem } from "@/data/heroServices";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { getLocalizedHeroServices } from "@/i18n/localized";

interface HeroDataPanelProps {
  id?: string;
  className?: string;
  sectionRef?: RefObject<HTMLElement | null>;
  scrollRef?: RefObject<HTMLDivElement | null>;
  sectionLabel?: string;
  sectionIndex?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  services?: HeroServiceItem[];
}

/**
 * Palladio #data section — markup mirrors palladiogroup.com view-source
 * Horizontal carousel: ~3 cards + peek of 4th (GSAP scrub on desktop)
 */
export function HeroDataPanel({
  id = "section-01-data",
  className,
  sectionRef,
  scrollRef,
  sectionLabel,
  sectionIndex = "01",
  title,
  body,
  ctaLabel,
  ctaHref = "/e-services",
  services,
}: HeroDataPanelProps) {
  const { t } = useI18n();
  const resolvedLabel = sectionLabel ?? t("home.data.label");
  const resolvedTitle = title ?? t("home.data.title");
  const resolvedBody = body ?? t("home.data.body");
  const resolvedCta = ctaLabel ?? t("home.data.cta");
  const resolvedServices = services ?? getLocalizedHeroServices();
  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "palladio-data hero-data-panel horizontal-scroll-container pointer-events-none relative z-[20] h-svh min-h-svh w-full",
        className
      )}
      aria-label={resolvedLabel}
    >
      <div className="palladio-data__shell relative z-10 flex h-full flex-col justify-between">
        <div className="palladio-data__content flex flex-col gap-25 md-gap-48 px-16 md-px-100">
          <div className="palladio-data__ancor-row ancor-row flex w-full flex-row items-center justify-between py-0 md-py-23">
            <span className="palladio-data__anchor-label">{resolvedLabel}</span>
            <span className="palladio-data__anchor-index">[{sectionIndex}]</span>
          </div>

          <div className="palladio-data__grid grid grid-cols-1 gap-50 md-grid-cols-3 md-gap-75">
            <div className="palladio-data__title-col md-col-span-2 md-pr-220">
              <h2 className="color-white">{resolvedTitle}</h2>
            </div>

            <div className="palladio-data__aside flex flex-col justify-end gap-32 color-white md-gap-48">
              <p>{resolvedBody}</p>
              <div className="flex">
                <Link to={ctaHref} className="palladio-button button outline white">
                  {resolvedCta}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="palladio-data__cards-wrap palladio-data__cards-wrap--glass">
          <div
            ref={scrollRef}
            className="data-cards palladio-horizontal-scroll flex flex-row horizontal-scroll will-change-transform"
          >
            {resolvedServices.map((service) => (
              <div
                key={service.id}
                className="data-card px-16 md-px-40"
              >
                <div className="palladio-data__card-inner">
                  <div className="palladio-data__card-icon-wrap image-container flex shrink-0 items-center justify-center">
                    <service.icon className="palladio-data__card-icon" strokeWidth={1.1} aria-hidden />
                  </div>

                  <div className="palladio-data__card-content">
                    <div className="palladio-data__card-copy">
                      <span className="palladio-data__card-title color-white font-500 md-size-22">
                        {service.title}
                      </span>

                      <p className="palladio-data__card-desc color-white font-400 size-14">
                        {service.description}
                      </p>

                      {service.secondaryHref && service.secondaryLabel ? (
                        <Link to={service.secondaryHref} className="palladio-data__card-link">
                          {service.secondaryLabel}
                        </Link>
                      ) : null}
                    </div>

                    <div className="palladio-data__card-actions">
                      <Link
                        to={service.href}
                        className="palladio-button button outline white palladio-button--card"
                      >
                        {t("home.data.go")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
