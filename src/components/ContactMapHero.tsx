import { deyaaContactLocation } from "@/data/deyaaContactLocation";

export function ContactMapHero() {
  const loc = deyaaContactLocation;

  return (
    <section className="contact-map-hero" aria-labelledby="contact-map-heading">
      <div className="contact-map-hero__stage" aria-hidden />

      <div className="contact-map-hero__meta">
        <div>
          <p className="contact-map-hero__eyebrow">{loc.subtitle}</p>
          <h1 id="contact-map-heading" className="contact-map-hero__title">
            {loc.title}
          </h1>
          <address className="contact-map-hero__address">
            <span>{loc.addressLine1}</span>
            <span>{loc.addressLine2}</span>
          </address>
        </div>
        <div className="contact-map-hero__meta-actions">
          <a href={loc.phoneHref} className="contact-map-hero__phone">
            {loc.phone}
          </a>
          <a
            href={loc.mapsDirectionsHref}
            className="contact-map-hero__directions"
            target="_blank"
            rel="noopener noreferrer"
          >
            Οδηγίες στο χάρτη
          </a>
        </div>
      </div>
    </section>
  );
}
