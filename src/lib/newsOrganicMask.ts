/** Continuous top-left shoreline. Shallow round lobes so most of the photo stays visible. */

const SEAMS = [6, 5, 7, 5, 6, 4, 7, 6];

const LOBES: Array<{ x: number; peak: number }> = [
  { x: 11, peak: 0.42 },
  { x: 9, peak: 0.5 },
  { x: 12, peak: 0.36 },
  { x: 8, peak: 0.54 },
  { x: 10, peak: 0.44 },
  { x: 9, peak: 0.48 },
  { x: 12, peak: 0.38 },
];

function fmt(value: number) {
  return Number(value.toFixed(2)).toString();
}

function seamAt(index: number) {
  return SEAMS[index % SEAMS.length];
}

function roundLobe(s0: number, s1: number, lobeX: number, peak: number, y0: number, y1: number) {
  const h = y1 - y0;
  const y = (t: number) => fmt(y0 + t * h);
  const rise = Math.min(0.34, Math.max(0.28, peak - 0.08));
  const fall = Math.min(0.72, Math.max(0.64, peak + 0.14));

  return `C ${fmt(s0)} ${y(rise)} ${fmt(lobeX)} ${y(rise)} ${fmt(lobeX)} ${y(peak)} C ${fmt(lobeX)} ${y(fall)} ${fmt(s1)} ${y(fall)} ${fmt(s1)} ${y(1)}`;
}

export function newsOrganicMaskDataUri(count: number, index = 0): string {
  const n = Math.max(1, Math.floor(count));
  const height = n * 100;
  const slice = Math.min(Math.max(0, Math.floor(index)), n - 1);

  let shore = `M ${fmt(seamAt(0))} 0`;
  for (let i = 0; i < n; i += 1) {
    const lobe = LOBES[i % LOBES.length];
    shore += ` ${roundLobe(seamAt(i), seamAt(i + 1), lobe.x, lobe.peak, i * 100, (i + 1) * 100)}`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${slice * 100} 100 100" preserveAspectRatio="none"><path fill="#fff" d="${shore} L 100 ${height} L 100 0 Z"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
