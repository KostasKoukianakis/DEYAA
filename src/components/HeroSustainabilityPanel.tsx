import { useRef } from "react";
import { cn } from "@/lib/utils";
import { sustainSlides } from "@/data/sustainSlides";
import { usePalladioSustainShowreel } from "@/hooks/usePalladioSustainShowreel";
import { useI18n } from "@/i18n";

interface HeroSustainabilityPanelProps {
  id?: string;
  className?: string;
  sectionLabel?: string;
  sectionIndex?: string;
  headline?: string;
  videoSrc?: string;
}

/**
 * Palladio #sustainability showreel — white sticky block
 * Desktop (>=1025px): video starts small, grows to fullscreen on scroll
 * At 1024px and below: large in-flow video, no scroll expand, copy stays visible
 */
export function HeroSustainabilityPanel({
  id,
  className,
  sectionLabel,
  sectionIndex = "02",
  headline,
  videoSrc = "/video/eyes.mp4",
}: HeroSustainabilityPanelProps) {
  const { t } = useI18n();
  const resolvedLabel = sectionLabel ?? t("home.sustain.label");
  const resolvedHeadline = headline ?? t("home.sustain.headline");
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const mediaFrameRef = useRef<HTMLDivElement>(null);

  usePalladioSustainShowreel({
    contentContainerRef,
    mediaFrameRef,
    beforeRef,
    afterRef,
  });

  return (
    <section
      id={id}
      className={cn("palladio-sustain", className)}
      aria-label={resolvedLabel}
    >
      <div className="palladio-sustain__showreel">
        <div className="palladio-sustain__wrapper">
          <div className="palladio-sustain__anchor-row">
            <span className="palladio-sustain__anchor-label">{resolvedLabel}</span>
            <span className="palladio-sustain__anchor-index">[{sectionIndex}]</span>
          </div>

          <div ref={contentContainerRef} className="palladio-sustain__content-container">
            <div className="palladio-sustain__content-inner">
              <div ref={beforeRef} className="palladio-sustain__before">
                <span className="palladio-sustain__headline">{resolvedHeadline}</span>
                <div className="palladio-sustain__line palladio-sustain__line--desktop" aria-hidden />
              </div>

              <div className="palladio-sustain__media-slot" aria-hidden />

              <div ref={afterRef} className="palladio-sustain__after">
                {sustainSlides.map((slide, index) => (
                  <span
                    key={slide.id}
                    className="palladio-sustain__pill-row"
                    style={{ animationDelay: `${index * 1.5}s` }}
                  >
                    <div className="palladio-sustain__line palladio-sustain__line--desktop" aria-hidden />
                    <span className="palladio-sustain__pill">{t(`home.sustain.${slide.id}`)}</span>
                  </span>
                ))}
              </div>

              <div ref={mediaFrameRef} className="palladio-sustain__media">
                <video
                  id="showreel-video"
                  className="palladio-sustain__video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={t("home.sustain.showreelAria")}
                >
                  <source src={videoSrc} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          <div className="palladio-sustain__scroll-spacer" aria-hidden />
        </div>
      </div>
    </section>
  );
}
