const FONT_FAMILY = '"Source Serif 4", Georgia, "Times New Roman", serif';
const TITLE = "ΔΕΥΑ";

export interface GlassTitleCanvasSize {
  width: number;
  height: number;
  fontSize: number;
}

/** Rasterise glass ΔΕΥΑ for the ripple brand texture (transparent bg). */
export async function drawGlassDeyaTitle(
  canvas: HTMLCanvasElement,
  maxWidthPx: number
): Promise<GlassTitleCanvasSize> {
  await document.fonts.load(`700 120px ${FONT_FAMILY}`);

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const probe = document.createElement("canvas").getContext("2d")!;
  let fontSize = Math.min(120, maxWidthPx * 0.22);

  probe.font = `700 ${fontSize}px ${FONT_FAMILY}`;
  let metrics = probe.measureText(TITLE);

  while (metrics.width > maxWidthPx * 0.92 && fontSize > 48) {
    fontSize -= 2;
    probe.font = `700 ${fontSize}px ${FONT_FAMILY}`;
    metrics = probe.measureText(TITLE);
  }

  const padX = fontSize * 0.12;
  const padY = fontSize * 0.2;
  const width = Math.ceil(metrics.width + padX * 2);
  const height = Math.ceil(fontSize * 1.08 + padY * 2);

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return { width, height, fontSize };

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const x = padX;
  const baseline = padY + fontSize * 0.82;

  ctx.font = `700 ${fontSize}px ${FONT_FAMILY}`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  // Depth shadow
  ctx.save();
  ctx.shadowColor = "rgba(0, 36, 72, 0.55)";
  ctx.shadowBlur = fontSize * 0.18;
  ctx.shadowOffsetY = fontSize * 0.06;
  ctx.fillStyle = "rgba(8, 52, 96, 0.35)";
  ctx.fillText(TITLE, x, baseline + fontSize * 0.03);
  ctx.restore();

  // Main ice body
  const bodyGrad = ctx.createLinearGradient(0, padY, 0, height - padY * 0.5);
  bodyGrad.addColorStop(0, "#f2fbff");
  bodyGrad.addColorStop(0.22, "#b8ecff");
  bodyGrad.addColorStop(0.52, "#52bce8");
  bodyGrad.addColorStop(0.78, "#1a7ec4");
  bodyGrad.addColorStop(1, "#0e5a96");
  ctx.fillStyle = bodyGrad;
  ctx.fillText(TITLE, x, baseline);

  // Top specular sheen (clip upper half)
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, width, height * 0.52);
  ctx.clip();
  const sheenGrad = ctx.createLinearGradient(0, padY, 0, height * 0.5);
  sheenGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  sheenGrad.addColorStop(0.45, "rgba(220, 245, 255, 0.45)");
  sheenGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = sheenGrad;
  ctx.fillText(TITLE, x, baseline);
  ctx.restore();

  // Edge highlight stroke
  ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
  ctx.lineWidth = Math.max(1, fontSize * 0.018);
  ctx.strokeText(TITLE, x, baseline);

  // Inner cyan glow
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  ctx.fillStyle = "rgba(120, 220, 255, 0.35)";
  ctx.fillText(TITLE, x, baseline - fontSize * 0.01);
  ctx.restore();

  return { width, height, fontSize };
}

export function glassTitleCanvasToObjectUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/png");
}
