/**
 * Green screen key — removes green plate; preserves water / metal subject.
 */
export function removeGreenPlate(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  options: {
    minGreen?: number;
    dominance?: number;
    feather?: number;
    borderBandPx?: number;
    borderDominance?: number;
  } = {},
) {
  const minGreen = options.minGreen ?? 72;
  const dominance = options.dominance ?? 28;
  const feather = options.feather ?? 22;
  const borderBandPx =
    options.borderBandPx ?? Math.max(12, Math.floor(Math.min(width, height) * 0.08));
  const borderDominance = options.borderDominance ?? 18;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const greenLead = g - Math.max(r, b);

      const nearBorder =
        x < borderBandPx ||
        x >= width - borderBandPx ||
        y < borderBandPx ||
        y >= height - borderBandPx;

      const domCut = nearBorder ? borderDominance : dominance;

      if (g < minGreen || greenLead < domCut) continue;

      if (greenLead >= domCut + feather) {
        data[i + 3] = 0;
      } else {
        const t = (greenLead - domCut) / feather;
        data[i + 3] = Math.round(data[i + 3] * (1 - t));
      }
    }
  }
}

/**
 * Black plate key — removes neutral black only.
 * Dark blue water (blue channel leads) and coloured pixels are preserved.
 */
export function removeBlackPlate(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  options: {
    threshold?: number;
    feather?: number;
    borderBandPx?: number;
    borderThreshold?: number;
  } = {},
) {
  const threshold = options.threshold ?? 16;
  const feather = options.feather ?? 14;
  const borderBandPx =
    options.borderBandPx ?? Math.max(12, Math.floor(Math.min(width, height) * 0.08));
  const borderThreshold = options.borderThreshold ?? 24;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] === 0) continue;

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const peak = Math.max(r, g, b);
      const floor = Math.min(r, g, b);
      const chroma = peak - floor;

      // Dark water / metal — coloured even when very dark
      if (chroma > 12) continue;
      if (b > r + 3 && b >= g - 1) continue;
      if (g > r + 6 && g >= b - 2) continue;

      const nearBorder =
        x < borderBandPx ||
        x >= width - borderBandPx ||
        y < borderBandPx ||
        y >= height - borderBandPx;

      const cut = nearBorder ? borderThreshold : threshold;

      if (peak <= cut) {
        data[i + 3] = 0;
      } else if (peak <= cut + feather) {
        data[i + 3] = Math.round(data[i + 3] * ((peak - cut) / feather));
      }
    }
  }
}

/** Green screen + black letterbox — tank_filled_greennew.mp4 scroll frames */
export function removeTankPlateBackground(
  data: Uint8ClampedArray,
  width: number,
  height: number,
) {
  removeGreenPlate(data, width, height);
  removeBlackPlate(data, width, height, {
    threshold: 14,
    borderThreshold: 32,
  });
}
