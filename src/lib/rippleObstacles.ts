/** Circle obstacle in bounds-local CSS px (matches visual tank geometry). */
export type RippleCircleObstacle = {
  cxPx: number;
  cyPx: number;
  rPx: number;
  boundsW: number;
  boundsH: number;
};

let obstacles: RippleCircleObstacle[] = [];
const listeners = new Set<() => void>();

function notifyObstacleListeners() {
  listeners.forEach((fn) => fn());
}

export function setRippleObstacles(next: RippleCircleObstacle[]) {
  obstacles = next;
  notifyObstacleListeners();
}

export function subscribeRippleObstacles(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

export function getRippleObstacles() {
  return obstacles;
}

/** Pin wave height inside obstacles — only iterates sim pixels in the circle bbox. */
export function applyRippleObstacles(
  buffer: Float32Array,
  simSize: number,
  source = obstacles,
) {
  if (source.length === 0) return;

  for (const obs of source) {
    const r2 = obs.rPx * obs.rPx;
    const minX = Math.max(
      1,
      Math.floor(((obs.cxPx - obs.rPx) / obs.boundsW) * simSize),
    );
    const maxX = Math.min(
      simSize - 2,
      Math.ceil(((obs.cxPx + obs.rPx) / obs.boundsW) * simSize),
    );
    const minY = Math.max(
      1,
      Math.floor((1 - (obs.cyPx + obs.rPx) / obs.boundsH) * simSize),
    );
    const maxY = Math.min(
      simSize - 2,
      Math.ceil((1 - (obs.cyPx - obs.rPx) / obs.boundsH) * simSize),
    );

    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        const nx = (x + 0.5) / simSize;
        const ny = 1 - (y + 0.5) / simSize;
        const px = nx * obs.boundsW;
        const py = ny * obs.boundsH;
        const dx = px - obs.cxPx;
        const dy = py - obs.cyPx;
        if (dx * dx + dy * dy <= r2) {
          buffer[y * simSize + x] = 0;
        }
      }
    }
  }
}
