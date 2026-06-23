/** Round to 2 decimal places for pin % coordinates */
export function roundPinPercent(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Convert a screen click to map-frame pin % (tip position). */
export function clientToMapPinPercent(
  clientX: number,
  clientY: number,
  frame: HTMLElement,
): { pinX: number; pinY: number } {
  const rect = frame.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return { pinX: 50, pinY: 50 };
  }

  return {
    pinX: roundPinPercent(((clientX - rect.left) / rect.width) * 100),
    pinY: roundPinPercent(((clientY - rect.top) / rect.height) * 100),
  };
}

export function formatPinCoordsForFile(pinX: number, pinY: number): string {
  return `pinX: ${pinX},\n  pinY: ${pinY},`;
}

export function formatPinCoordsInline(pinX: number, pinY: number): string {
  return `pinX: ${pinX}, pinY: ${pinY}`;
}

export function isContactMapPinPickerActive(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("pinPicker") === "1";
}
