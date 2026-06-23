import { useCallback, useEffect, useRef, useState } from "react";
import { Clock, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { deyaaContactLocation } from "@/data/deyaaContactLocation";
// Pin picker (disabled) — uncomment to re-enable
// import { useContactMapPinPicker } from "@/hooks/useContactMapPinPicker";
// import { ContactMapPinPickerPanel } from "@/components/ContactMapPinPickerPanel";

const ROADS_SVG = "/hero/contact-map-roads.svg";

// interface PinPickerMode {
//   isActive: boolean;
//   disable: () => void;
// }

function ContactMapPinMark() {
  return (
    <svg
      className="contact-map-hero__pin-mark"
      viewBox="0 0 36 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M18 44C18 44 3.5 26.5 3.5 15.5C3.5 8.56 9.56 2.5 18 2.5C26.44 2.5 32.5 8.56 32.5 15.5C32.5 26.5 18 44 18 44Z"
        fill="url(#contact-map-pin-fill)"
      />
      <path
        d="M18 44C18 44 3.5 26.5 3.5 15.5C3.5 8.56 9.56 2.5 18 2.5C26.44 2.5 32.5 8.56 32.5 15.5C32.5 26.5 18 44 18 44Z"
        stroke="rgb(255 255 255 / 0.9)"
        strokeWidth="1.5"
      />
      <circle cx="18" cy="15.5" r="5.25" fill="#fff" />
      <circle cx="18" cy="15.5" r="2.35" fill="#0098eb" />
      <defs>
        <linearGradient id="contact-map-pin-fill" x1="18" y1="2.5" x2="18" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0098eb" />
          <stop offset="1" stopColor="#00587a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ContactMapRoadsLayer() {
  const mapLayerRef = useRef<HTMLDivElement>(null);
  const mapPanRef = useRef<HTMLDivElement>(null);
  const pinPanRef = useRef<HTMLDivElement>(null);
  const roadsRef = useRef<HTMLImageElement>(null);
  const pinRef = useRef<HTMLButtonElement>(null);
  const pinLayerRef = useRef<HTMLDivElement>(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const loc = deyaaContactLocation;
  const pinX = loc.pinX;
  const pinY = loc.pinY;

  // Pin picker (disabled) — uncomment to re-enable
  // const pinPickerActive = pinPicker.isActive;
  // const {
  //   picked: pickedPin,
  //   copied: pinCoordsCopied,
  //   handleMapClick,
  //   copyCoords,
  //   resetPick,
  // } = useContactMapPinPicker(mapLayerRef, pinPickerActive);
  // const pinX = pickedPin?.pinX ?? loc.pinX;
  // const pinY = pickedPin?.pinY ?? loc.pinY;

  useEffect(() => {
    const layer = mapLayerRef.current;
    const pan = mapPanRef.current;
    const pinPan = pinPanRef.current;
    if (!layer || !pan || !pinPan) return;

    const page = layer.closest(".contact-page");
    const hero = page?.querySelector(".contact-map-hero");
    if (!page || !hero) return;

    const syncHeroMapBounds = () => {
      const pageRect = page.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      page.style.setProperty("--contact-hero-top", `${heroRect.top - pageRect.top}px`);
      page.style.setProperty("--contact-hero-height", `${heroRect.height}px`);
    };

    const applyMapTransform = () => {
      if (!mapPanRef.current || !pinPanRef.current) return;

      syncHeroMapBounds();

      const styles = getComputedStyle(page);
      const scale = parseFloat(styles.getPropertyValue("--contact-map-scale")) || 1.32;
      const origin = `${pinX}% ${pinY}%`;
      const transform = `scale(${scale})`;

      for (const el of [mapPanRef.current, pinPanRef.current]) {
        el.style.transformOrigin = origin;
        el.style.transform = transform;
      }
    };

    applyMapTransform();

    const observer = new ResizeObserver(applyMapTransform);
    observer.observe(page);
    observer.observe(hero);
    window.addEventListener("resize", applyMapTransform);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", applyMapTransform);
    };
  }, [pinX, pinY]);

  useEffect(() => {
    const roads = roadsRef.current;
    if (!roads) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      roads.classList.add("is-visible");
    } else {
      requestAnimationFrame(() => roads.classList.add("is-animating"));
    }
  }, []);

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      pin.classList.add("is-visible");
      return;
    }

    const handleAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName !== "contact-map-pin-drop") return;
      pin.classList.remove("is-animating");
      pin.classList.add("is-visible");
    };

    requestAnimationFrame(() => pin.classList.add("is-animating"));
    pin.addEventListener("animationend", handleAnimationEnd);

    return () => {
      pin.removeEventListener("animationend", handleAnimationEnd);
    };
  }, []);

  const handlePinClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setInfoOpen((open) => !open);
  }, []);

  useEffect(() => {
    if (!infoOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const pinLayer = pinLayerRef.current;
      if (!pinLayer?.contains(event.target as Node)) {
        setInfoOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setInfoOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [infoOpen]);

  const cardAbove = pinY > 38;

  return (
    <>
      {/* Pin picker panel (disabled)
      <ContactMapPinPickerPanel
        isActive={pinPickerActive}
        picked={pickedPin}
        copied={pinCoordsCopied}
        onCopy={copyCoords}
        onReset={resetPick}
        onClose={pinPicker.disable}
        showClose={import.meta.env.DEV}
      />
      */}

      <div className="contact-page__map-stack">
        <div ref={mapLayerRef} className="contact-page__map-frame">
          <div ref={mapPanRef} className="contact-page__map-pan">
            <img
              ref={roadsRef}
              src={ROADS_SVG}
              alt=""
              className="contact-page__map-roads"
              decoding="async"
              draggable={false}
            />
          </div>
        </div>
      </div>

      <div className="contact-page__pin-stack">
        <div className="contact-page__map-frame">
          <div ref={pinPanRef} className="contact-page__map-pan">
            <div ref={pinLayerRef} className="contact-map-hero__pin-layer">
            <button
              ref={pinRef}
              type="button"
              className={cn("contact-map-hero__pin", infoOpen && "contact-map-hero__pin--active")}
              style={{ left: `${pinX}%`, top: `${pinY}%` }}
              onClick={handlePinClick}
              aria-expanded={infoOpen}
              aria-controls="contact-map-pin-info"
              aria-label={`${loc.placeName} — πληροφορίες τοποθεσίας`}
            >
              <span className="contact-map-hero__pin-pulse" aria-hidden />
              <ContactMapPinMark />
            </button>

            {infoOpen && (
              <div
                id="contact-map-pin-info"
                role="dialog"
                aria-labelledby="contact-map-pin-title"
                className={cn(
                  "contact-map-hero__pin-card",
                  cardAbove ? "contact-map-hero__pin-card--above" : "contact-map-hero__pin-card--below",
                )}
                style={{ left: `${pinX}%`, top: `${pinY}%` }}
              >
                <button
                  type="button"
                  className="contact-map-hero__pin-card-close"
                  onClick={() => setInfoOpen(false)}
                  aria-label="Κλείσιμο"
                >
                  <X aria-hidden />
                </button>

                <p className="contact-map-hero__pin-card-eyebrow">{loc.title}</p>
                <h2 id="contact-map-pin-title" className="contact-map-hero__pin-card-title">
                  {loc.placeName}
                </h2>
                <p className="contact-map-hero__pin-card-subtitle">{loc.placeNameEn}</p>

                <address className="contact-map-hero__pin-card-address">
                  <span>{loc.addressLine1}</span>
                  <span>{loc.addressLine2}</span>
                </address>

                <p className="contact-map-hero__pin-card-row">
                  <Clock className="contact-map-hero__pin-card-icon" aria-hidden />
                  {loc.hours}
                </p>

                <p className="contact-map-hero__pin-card-row">
                  <Phone className="contact-map-hero__pin-card-icon" aria-hidden />
                  <a href={loc.phoneHref}>{loc.phone}</a>
                </p>

                <a
                  href={loc.mapsDirectionsHref}
                  className="contact-map-hero__pin-card-cta"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Οδηγίες στο Google Maps
                </a>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
