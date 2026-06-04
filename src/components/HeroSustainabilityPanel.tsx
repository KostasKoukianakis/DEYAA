import { useRef } from "react";
import { cn } from "@/lib/utils";
import { sustainSlides } from "@/data/sustainSlides";
import { usePalladioSustainShowreel } from "@/hooks/usePalladioSustainShowreel";

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
 * Video starts small, grows to fullscreen on scroll, then releases to next section
 */
export function HeroSustainabilityPanel({
  id,
  className,
  sectionLabel = "Βιωσιμότητα",
  sectionIndex = "02",
  headline = "Φροντίζουμε",
  videoSrc = "/video/eyes.mp4",
}: HeroSustainabilityPanelProps) {
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
      className={cn("palladio-sustain bg-white", className)}
      aria-label={sectionLabel}
    >
      <div className="palladio-sustain__showreel">
        <div className="palladio-sustain__wrapper">
          <div className="palladio-sustain__anchor-row">
            <span className="palladio-sustain__anchor-label">{sectionLabel}</span>
            <span className="palladio-sustain__anchor-index">[{sectionIndex}]</span>
          </div>

          <div ref={contentContainerRef} className="palladio-sustain__content-container">
            <div className="palladio-sustain__content-inner">
              <div ref={beforeRef} className="palladio-sustain__before">
                <span className="palladio-sustain__headline">{headline}</span>
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
                    <span className="palladio-sustain__pill">{slide.label}</span>
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
                  aria-label="Βιωσιμότητα — showreel"
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
