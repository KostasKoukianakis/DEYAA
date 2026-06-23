import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  clientToMapPinPercent,
  formatPinCoordsForFile,
  formatPinCoordsInline,
} from "@/lib/contactMapPinCoords";

export interface PickedPinCoords {
  pinX: number;
  pinY: number;
}

/** Pin picker — disabled. Set to true or use /contact?pinPicker=1 to re-enable. */
const PIN_PICKER_ENABLED = false;

/** Active in dev by default, or with ?pinPicker=1, or after user toggles on. */
export function useContactMapPinPickerMode() {
  const [searchParams] = useSearchParams();
  const [toggledOn, setToggledOn] = useState(false);

  const paramActive = searchParams.get("pinPicker") === "1";
  const isActive = PIN_PICKER_ENABLED && (import.meta.env.DEV || paramActive || toggledOn);

  const enable = useCallback(() => setToggledOn(true), []);
  const disable = useCallback(() => setToggledOn(false), []);

  return { isActive, enable, disable, paramActive, toggledOn };
}

export function useContactMapPinPicker(
  mapFrameRef: React.RefObject<HTMLDivElement | null>,
  isActive: boolean,
) {
  const [picked, setPicked] = useState<PickedPinCoords | null>(null);
  const [copied, setCopied] = useState(false);

  const handleMapClick = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isActive) return;

      const frame = mapFrameRef.current;
      if (!frame) return;

      event.preventDefault();
      event.stopPropagation();

      const coords = clientToMapPinPercent(event.clientX, event.clientY, frame);
      setPicked(coords);
      setCopied(false);

      const inline = formatPinCoordsInline(coords.pinX, coords.pinY);
      console.info(`[contact map pin picker] ${inline}`);
      console.info(
        `[contact map pin picker] paste into deyaaContactLocation.ts:\n${formatPinCoordsForFile(coords.pinX, coords.pinY)}`,
      );
    },
    [isActive, mapFrameRef],
  );

  const copyCoords = useCallback(async () => {
    if (!picked) return;

    const text = formatPinCoordsInline(picked.pinX, picked.pinY);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [picked]);

  const resetPick = useCallback(() => {
    setPicked(null);
    setCopied(false);
  }, []);

  return {
    picked,
    copied,
    handleMapClick,
    copyCoords,
    resetPick,
  };
}
