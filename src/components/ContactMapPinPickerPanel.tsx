import { createPortal } from "react-dom";
import { Copy, MapPin, RotateCcw, X } from "lucide-react";
import { formatPinCoordsForFile } from "@/lib/contactMapPinCoords";
import type { PickedPinCoords } from "@/hooks/useContactMapPinPicker";

interface ContactMapPinPickerPanelProps {
  isActive: boolean;
  picked: PickedPinCoords | null;
  copied: boolean;
  onCopy: () => void;
  onReset: () => void;
  onClose?: () => void;
  showClose?: boolean;
}

export function ContactMapPinPickerPanel({
  isActive,
  picked,
  copied,
  onCopy,
  onReset,
  onClose,
  showClose = false,
}: ContactMapPinPickerPanelProps) {
  if (!isActive || typeof document === "undefined") return null;

  return createPortal(
    <>
      <div className="contact-map-pin-picker__banner" role="status">
        <MapPin aria-hidden />
        <span>
          <strong>Pin picker ενεργό</strong> — κάνε κλικ στον χάρτη για τις συντεταγμένες
        </span>
        {showClose && onClose && (
          <button type="button" className="contact-map-pin-picker__banner-close" onClick={onClose}>
            <X aria-hidden />
            <span className="sr-only">Κλείσιμο picker</span>
          </button>
        )}
      </div>

      <div className="contact-map-pin-picker" role="status" aria-live="polite">
        <p className="contact-map-pin-picker__title">Συντεταγμένες pin</p>
        <p className="contact-map-pin-picker__hint">
          Κλικ στον χάρτη = άκρη του pin. Στείλε μου τις τιμές για να τις βάλω στο site.
        </p>
        {picked ? (
          <>
            <pre className="contact-map-pin-picker__coords">
              {formatPinCoordsForFile(picked.pinX, picked.pinY)}
            </pre>
            <div className="contact-map-pin-picker__actions">
              <button type="button" className="contact-map-pin-picker__btn" onClick={onCopy}>
                <Copy aria-hidden />
                {copied ? "Αντιγράφηκε" : "Αντιγραφή"}
              </button>
              <button
                type="button"
                className="contact-map-pin-picker__btn contact-map-pin-picker__btn--ghost"
                onClick={onReset}
              >
                <RotateCcw aria-hidden />
                Επαναφορά
              </button>
            </div>
          </>
        ) : (
          <p className="contact-map-pin-picker__placeholder">Κάνε κλικ στον χάρτη…</p>
        )}
      </div>
    </>,
    document.body,
  );
}

interface ContactMapPinPickerToggleProps {
  onEnable: () => void;
}

export function ContactMapPinPickerToggle({ onEnable }: ContactMapPinPickerToggleProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <button type="button" className="contact-map-pin-picker__toggle" onClick={onEnable}>
      <MapPin aria-hidden />
      Pin picker
    </button>,
    document.body,
  );
}
