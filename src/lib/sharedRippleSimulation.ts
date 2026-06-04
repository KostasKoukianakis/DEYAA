const SIM_SIZE = 256;
const DAMPING = 0.985;
const POINTER_RADIUS = 14;

let current = new Float32Array(SIM_SIZE * SIM_SIZE);
let previous = new Float32Array(SIM_SIZE * SIM_SIZE);
const rippleData = new Uint8Array(SIM_SIZE * SIM_SIZE * 4);

let raf = 0;
let subscriberCount = 0;
let pointerInside = false;
let ambientTimer = 0;
const listeners = new Set<() => void>();

function stepSimulation() {
  for (let y = 1; y < SIM_SIZE - 1; y++) {
    for (let x = 1; x < SIM_SIZE - 1; x++) {
      const i = y * SIM_SIZE + x;
      current[i] =
        (previous[i - 1] +
          previous[i + 1] +
          previous[i - SIM_SIZE] +
          previous[i + SIM_SIZE]) /
          2 -
        current[i];
      current[i] *= DAMPING;
    }
  }
  const swap = current;
  current = previous;
  previous = swap;
}

function uploadRippleData() {
  for (let i = 0; i < SIM_SIZE * SIM_SIZE; i++) {
    const v = Math.max(0, Math.min(255, (previous[i] + 1) * 127));
    const o = i * 4;
    rippleData[o] = v;
    rippleData[o + 1] = v;
    rippleData[o + 2] = v;
    rippleData[o + 3] = 255;
  }
}

function tick(time: number) {
  stepSimulation();

  if (!pointerInside && time - ambientTimer > 120) {
    ambientTimer = time;
    if (Math.random() < 0.35) {
      addSharedRipple(Math.random(), Math.random(), 0.25);
    }
  }

  uploadRippleData();
  listeners.forEach((fn) => fn());
  raf = requestAnimationFrame(tick);
}

function ensureLoop() {
  if (raf === 0) {
    raf = requestAnimationFrame(tick);
  }
}

function stopLoopIfIdle() {
  if (subscriberCount === 0 && raf !== 0) {
    cancelAnimationFrame(raf);
    raf = 0;
  }
}

/** Drop a ripple in 0–1 coords across the full combined surface (top→bottom) */
export function addSharedRipple(nx: number, ny: number, strength: number) {
  const cx = Math.floor(nx * SIM_SIZE);
  const cy = Math.floor((1 - ny) * SIM_SIZE);
  const r2 = POINTER_RADIUS * POINTER_RADIUS;

  for (let py = -POINTER_RADIUS; py <= POINTER_RADIUS; py++) {
    for (let px = -POINTER_RADIUS; px <= POINTER_RADIUS; px++) {
      const sx = cx + px;
      const sy = cy + py;
      if (sx < 1 || sx >= SIM_SIZE - 1 || sy < 1 || sy >= SIM_SIZE - 1) continue;
      const d2 = px * px + py * py;
      if (d2 > r2) continue;
      previous[sy * SIM_SIZE + sx] += strength * (1 - d2 / r2);
    }
  }
}

export function setSharedPointerInside(inside: boolean) {
  pointerInside = inside;
}

export function getSharedRippleData() {
  return rippleData;
}

export function subscribeSharedRipple(onUpdate: () => void) {
  listeners.add(onUpdate);
  subscriberCount += 1;
  ensureLoop();
  return () => {
    listeners.delete(onUpdate);
    subscriberCount -= 1;
    stopLoopIfIdle();
  };
}

export const SHARED_SIM_SIZE = SIM_SIZE;
