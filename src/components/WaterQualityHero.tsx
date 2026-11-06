import { useRef } from "react";
import { useWaterQualityHeroArt } from "@/hooks/useWaterQualityHeroArt";
import { useI18n } from "@/i18n";

interface WaterQualityHeroProps {
  headline: string;
  intro: string;
  headingId?: string;
}

export function WaterQualityHero({
  headline,
  intro,
  headingId = "water-quality-heading",
}: WaterQualityHeroProps) {
  const { t } = useI18n();
  const rootRef = useRef<HTMLElement>(null);
  useWaterQualityHeroArt(rootRef);

  return (
    <section
      ref={rootRef}
      id="hero"
      className="palladio-services-page__hero"
      aria-labelledby={headingId}
    >
      <div className="palladio-services-page__hero-inner">
        <div className="palladio-services-page__hero-grid palladio-water-quality__hero-grid">
          <div className="palladio-services-page__hero-text">
            <h1 id={headingId} className="palladio-services-page__headline">
              {headline}
            </h1>
            <div className="palladio-services-page__hero-intro-wrap">
              <p className="palladio-services-page__intro">{intro}</p>
            </div>
          </div>

          <figure
            className="palladio-water-quality__hero-art"
            role="img"
            aria-label={t("waterQuality.heroArtAria")}
          >
            <svg className="wq-hero" viewBox="0 0 480 400" fill="none">
              <g className="wq-hero__rings">
                <ellipse className="wq-hero__ring" cx="240" cy="372" rx="168" ry="26" />
                <ellipse className="wq-hero__ring" cx="240" cy="372" rx="118" ry="17" />
                <ellipse className="wq-hero__ring" cx="240" cy="372" rx="68" ry="10" />
              </g>

              <path
                className="wq-hero__flask"
                d="M206 34V98C206 122 150 168 112 228C90 280 98 336 162 366C198 386 240 392 240 392C240 392 282 386 318 366C382 336 390 280 368 228C330 168 274 122 274 98V34"
              />
              <ellipse className="wq-hero__rim" cx="240" cy="34" rx="36" ry="9" />

              <defs>
                <clipPath id="wq-hero-water-clip">
                  <path d="M112 228C90 280 98 336 162 366C198 386 240 392 240 392C240 392 282 386 318 366C382 336 390 280 368 228C330 168 274 122 274 148H206C206 148 150 168 112 228Z" />
                </clipPath>
                <clipPath id="wq-hero-drop-clip">
                  <path d="M206 -90H274V98C274 122 330 168 368 228C390 280 382 336 318 366C282 386 240 392 240 392C240 392 198 386 162 366C98 336 90 280 112 228C150 168 206 122 206 98V-90Z" />
                </clipPath>
              </defs>

              <g clipPath="url(#wq-hero-water-clip)">
                <g className="wq-hero__water">
                  <rect className="wq-hero__water-fill" x="80" y="214" width="320" height="190" />
                  <path
                    className="wq-hero__meniscus"
                    d="M116 226C168 238 212 242 240 242C268 242 312 238 364 226"
                  />
                </g>
              </g>

              <g className="wq-hero__ripples">
                <path className="wq-hero__ripple" d="M152 228C188 238 216 242 240 242C264 242 292 238 328 228" />
                <path className="wq-hero__ripple" d="M178 230C206 238 224 240 240 240C256 240 274 238 302 230" />
              </g>

              <path className="wq-hero__shine" d="M200 126C182 164 158 198 146 232" />

              <g className="wq-hero__ticks">
                <path className="wq-hero__tick" d="M360 263H376" />
                <path className="wq-hero__tick" d="M360 293H376" />
                <path className="wq-hero__tick" d="M350 322H366" />
              </g>

              <g clipPath="url(#wq-hero-drop-clip)">
                <g className="wq-hero__drop-g">
                  <path
                    className="wq-hero__drop"
                    d="M240 4C240 4 222 30 222 42C222 52 230 60 240 60C250 60 258 52 258 42C258 30 240 4 240 4Z"
                  />
                </g>
              </g>
            </svg>
          </figure>
        </div>
      </div>
    </section>
  );
}
