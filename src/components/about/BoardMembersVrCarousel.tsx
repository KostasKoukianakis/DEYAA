import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { flushSync } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion, animate } from "framer-motion";
import { BoardMemberPortrait } from "@/components/about/BoardMemberPortrait";
import type { BoardMember } from "@/data/aboutContent";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

interface BoardMembersVrCarouselProps {
  members: BoardMember[];
  className?: string;
  /** Tuning panel, κάτοψη, κόκκινο τόξο — μόνο για dev */
  showDevTools?: boolean;
  /** Κεντρική εικόνα λίμνης πάνω από τα controls (hero) */
  showLakeAccent?: boolean;
  /** Είσοδος από δεξιά στο πρώτο mount (hero) */
  playIntro?: boolean;
  /** Hero — γυαλί για μέλη χωρίς φωτο, πρόεδρος με εικόνα */
  heroGlassCards?: boolean;
}

const LAKE_ACCENT_SRC = "/hero/koyrnas.webp";

/** Κρατάμε επιπλέον slots mounted κατά το slide — αποφεύγει blink στις άκρες */
const SLOT_VISIBILITY_OVERSCAN = 1;

/** Drag / fling tuning — ρουλετιά αίσθηση */
const DRAG_COMMIT_EDGE = 0.94;
const DRAG_MOMENTUM_GAIN = 0.62;
const DRAG_VELOCITY_SCALE = 22;
const DRAG_SNAP_MIN_DURATION = 0.14;
const DRAG_SNAP_MAX_DURATION = 0.34;
const DRAG_STEP_MIN_DURATION = 0.1;
const DRAG_STEP_MAX_DURATION = 0.26;
const DRAG_MAX_FLING_STEPS = 8;
/** Hysteresis — αποφεύγει flip wrapped/unwrapped στις άκρες κοντά στο μηδέν */
const EDGE_ENTRY_SHIFT_BIAS = 0.04;

/** Hero intro — κάρτες μία-μία από δεξιά προς τα αριστερά */
const INTRO_ENTER_DELAY = 0.32;
const INTRO_CARD_STAGGER = 0.11;
const INTRO_CARD_DURATION = 0.74;

/** Hero lake accent — πτώση από την κορυφή (CSS animation, μετά τις κάρτες) */
const LAKE_FALL_DURATION_S = 1.85;

function introCardEnterPx(viewportWidth: number): number {
  return Math.max(280, Math.min(720, viewportWidth * 0.44));
}

function introCardStaggerDelay(visualOffset: number, visibleOffsetMax: number): number {
  return INTRO_ENTER_DELAY + (visibleOffsetMax - visualOffset) * INTRO_CARD_STAGGER;
}

function introTotalDuration(visibleOffsetMax: number): number {
  return introCardStaggerDelay(-visibleOffsetMax, visibleOffsetMax) + INTRO_CARD_DURATION;
}

interface CardPose {
  x: number;
  y: number;
  z: number;
  rotateY: number;
  depthScale: number;
}

interface CarouselMetrics {
  radiusX: number;
  fitScale: number;
  visibleOffsetMax: number;
  visibleCardCount: number;
  gap: number;
  thetas: number[];
  posesByOffset: Map<number, CardPose>;
}

interface CarouselTuning {
  arcCurvature: number;
  cardSizeScale: number;
  cardWidthScale: number;
  /** Βασικό ύψος καρτών σε vh */
  cardHeightVh: number;
  cardGapPx: number;
  rotationOverrides: Record<number, number>;
  /** px κενού: αριστερά στο outer offset, δεξιά στο inner offset του ζεύγους */
  gapOverrides: Record<number, number>;
  widthOverrides: Record<number, number>;
  heightOverrides: Record<number, number>;
}

const DEFAULT_ROTATION_OVERRIDES: Record<number, number> = {
  [-4]: 20,
  [-3]: 8,
  [-2]: 7,
  [-1]: 2,
  0: 0,
  1: -2,
  2: -7,
  3: -8,
  4: -20,
};

const DEFAULT_GAP_OVERRIDES: Record<number, number> = {
  [-4]: 18,
  [-3]: 10,
  [-2]: 10,
  [-1]: 15,
  0: 0,
  1: 15,
  2: 10,
  3: 10,
  4: 18,
};

const DEFAULT_WIDTH_OVERRIDES: Record<number, number> = {
  [-4]: 0.45,
  [-3]: 0.58,
  [-2]: 0.77,
  [-1]: 1.08,
  0: 1.75,
  1: 1.08,
  2: 0.77,
  3: 0.58,
  4: 0.45,
};

const DEFAULT_HEIGHT_OVERRIDES: Record<number, number> = {
  [-4]: 1.34,
  [-3]: 1.26,
  [-2]: 1.17,
  [-1]: 1.1,
  0: 1.04,
  1: 1.1,
  2: 1.17,
  3: 1.26,
  4: 1.34,
};

const DEFAULT_TUNING: CarouselTuning = {
  arcCurvature: 1.08,
  cardSizeScale: 1.17,
  cardWidthScale: 1.12,
  cardHeightVh: 30.5,
  cardGapPx: 8,
  rotationOverrides: { ...DEFAULT_ROTATION_OVERRIDES },
  gapOverrides: { ...DEFAULT_GAP_OVERRIDES },
  widthOverrides: { ...DEFAULT_WIDTH_OVERRIDES },
  heightOverrides: { ...DEFAULT_HEIGHT_OVERRIDES },
};

/** Όσο μεγαλύτερη η καμπυλότητα, τόσο μικρότερο το κενό — για πυκνότερο τόξο */
function gapScaleForCurvature(arcCurvature: number): number {
  const ref = DEFAULT_TUNING.arcCurvature;
  return Math.min(1, Math.max(0.2, ref / Math.max(arcCurvature, 0.12)));
}

function gapAtOffset(offset: number, tuning: CarouselTuning): number {
  const base = tuning.gapOverrides[offset] !== undefined ? tuning.gapOverrides[offset] : tuning.cardGapPx;
  return Math.round(base * gapScaleForCurvature(tuning.arcCurvature));
}

function widthMultiplierAtOffset(offset: number, tuning: CarouselTuning): number {
  return tuning.widthOverrides[offset] ?? 1;
}

function heightMultiplierAtOffset(offset: number, tuning: CarouselTuning): number {
  return tuning.heightOverrides[offset] ?? 1;
}

function cardHeightVhAtOffset(offset: number, tuning: CarouselTuning): number {
  return tuning.cardHeightVh * heightMultiplierAtOffset(offset, tuning);
}

function formatTuningForCopy(tuning: CarouselTuning): string {
  const lines = [
    `Καμπυλότητα τόξου: ${tuning.arcCurvature.toFixed(2)}`,
    `Μέγεθος καρτών: ${tuning.cardSizeScale.toFixed(2)}`,
    `Πλάτος καρτών: ${tuning.cardWidthScale.toFixed(2)}`,
    `Ύψος καρτών (vh): ${tuning.cardHeightVh.toFixed(1)}`,
    `Σταθερή απόσταση καρτών: ${tuning.cardGapPx}px`,
    "",
    "Ανά κάρτα:",
  ];

  for (let o = -3; o <= 3; o += 1) {
    const rot = tuning.rotationOverrides[o] ?? 0;
    const wid = tuning.widthOverrides[o];
    const hgt = tuning.heightOverrides[o];
    const parts = [`rotate ${rot.toFixed(0)}°`];
    if (o in tuning.gapOverrides) parts.push(`gap ${tuning.gapOverrides[o]}px`);
    if (wid !== undefined) parts.push(`width×${wid.toFixed(2)}`);
    if (hgt !== undefined) parts.push(`height×${hgt.toFixed(2)}`);
    lines.push(`${cardSlotLabel(o)}: ${parts.join(", ")}`);
  }

  lines.push(
    "",
    "JSON:",
    JSON.stringify(
      {
        arcCurvature: tuning.arcCurvature,
        cardSizeScale: tuning.cardSizeScale,
        cardWidthScale: tuning.cardWidthScale,
        cardHeightVh: tuning.cardHeightVh,
        cardGapPx: tuning.cardGapPx,
        rotationOverrides: tuning.rotationOverrides,
        gapOverrides: tuning.gapOverrides,
        widthOverrides: tuning.widthOverrides,
        heightOverrides: tuning.heightOverrides,
      },
      null,
      2,
    ),
  );

  return lines.join("\n");
}

/** Μεγάλες οθόνες: 9 (±4 peek) · desktop: 7 · tablet: 5/3 · κινητό: 1 */
function visibleOffsetMaxForViewport(w: number): number {
  if (w < 520) return 0;
  if (w < 768) return 1;
  if (w < 1024) return 2;
  if (w < 1536) return 3;
  return 4;
}

function cardDisplayNumber(offset: number): number {
  return Math.abs(offset) + 1;
}

function cardSlotLabel(offset: number): string {
  const n = cardDisplayNumber(offset);
  if (offset === 0) return `${n} (κέντρο)`;
  if (offset < 0) return `${n} αριστερά`;
  return `${n} δεξιά`;
}

function depthScaleAtOffset(offset: number, visibleOffsetMax: number): number {
  const t = visibleOffsetMax > 0 ? Math.abs(offset) / visibleOffsetMax : 0;
  return 0.66 + 0.72 * Math.pow(t, 0.62);
}

function cardWidthAtOffset(
  baseWidth: number,
  offset: number,
  visibleOffsetMax: number,
  tuning: CarouselTuning,
): number {
  return (
    baseWidth *
    tuning.cardWidthScale *
    tuning.cardSizeScale *
    depthScaleAtOffset(offset, visibleOffsetMax) *
    widthMultiplierAtOffset(offset, tuning)
  );
}

function halfCardWidthAtOffset(
  baseWidth: number,
  offset: number,
  visibleOffsetMax: number,
  tuning: CarouselTuning,
): number {
  return cardWidthAtOffset(baseWidth, offset, visibleOffsetMax, tuning) / 2;
}

function rotateYForOffset(
  offset: number,
  theta: number,
  arcCurvature: number,
  rotationOverrides: Record<number, number>,
): number {
  return arcRotateY(theta, arcCurvature) + (rotationOverrides[offset] ?? 0);
}

function depthScaleAtTheta(absTheta: number, thetaMax: number): number {
  const denom = 1 - Math.cos(thetaMax);
  const t = denom > 0 ? (1 - Math.cos(absTheta)) / denom : 0;
  return 0.66 + 0.72 * Math.pow(Math.min(Math.max(t, 0), 1), 0.62);
}

function pointOnArc(theta: number, radius: number, arcCurvature: number): { x: number; y: number; z: number } {
  const t = theta * Math.max(arcCurvature, 0.12);
  return {
    x: radius * Math.sin(t),
    y: 0,
    z: radius * (1 - Math.cos(t)),
  };
}

function arcRotateY(theta: number, arcCurvature: number): number {
  return (-theta * arcCurvature * 180) / Math.PI;
}

function vrMotionUnit(value: string | number | undefined, unit = "px"): string {
  if (value === undefined || value === null) return `0${unit}`;
  if (typeof value === "number") return `${value}${unit}`;
  return String(value);
}

function vrTransformTemplate(
  x: string | number | undefined,
  y: string | number | undefined,
  z: string | number | undefined,
  rotateY: string | number | undefined,
): string {
  const ry = vrMotionUnit(rotateY, "deg");

  return [
    `translate3d(${vrMotionUnit(x)}, ${vrMotionUnit(y)}, ${vrMotionUnit(z)})`,
    `rotate3d(0, 1, 0, ${ry})`,
  ].join(" ");
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpPose(a: CardPose, b: CardPose, t: number): CardPose {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    z: lerp(a.z, b.z, t),
    rotateY: lerp(a.rotateY, b.rotateY, t),
    depthScale: lerp(a.depthScale, b.depthScale, t),
  };
}

function poseAtVisualOffset(
  visualOffset: number,
  posesByOffset: Map<number, CardPose>,
  visibleOffsetMax: number,
): CardPose {
  const o0 = Math.floor(visualOffset);
  const o1 = Math.ceil(visualOffset);
  if (o0 === o1) return getCarouselPose(o0, posesByOffset, visibleOffsetMax);
  const t = visualOffset - o0;
  return lerpPose(
    getCarouselPose(o0, posesByOffset, visibleOffsetMax),
    getCarouselPose(o1, posesByOffset, visibleOffsetMax),
    t,
  );
}

function scalarAtVisualOffset(visualOffset: number, valueAtOffset: (offset: number) => number): number {
  const o0 = Math.floor(visualOffset);
  const o1 = Math.ceil(visualOffset);
  if (o0 === o1) return valueAtOffset(o0);
  const t = visualOffset - o0;
  return lerp(valueAtOffset(o0), valueAtOffset(o1), t);
}

/** Κατά το drag/fling: commit βήματα όταν ξεπερνάμε το όριο — επιτρέπει συνεχές «γύρισμα» */
function rebalanceCarouselShift(
  value: number,
  commit: (direction: 1 | -1) => void,
  edge = DRAG_COMMIT_EDGE,
): number {
  let shift = value;
  while (shift > edge) {
    commit(1);
    shift -= 1;
  }
  while (shift < -edge) {
    commit(-1);
    shift += 1;
  }
  return shift;
}

function memberVisualOffset(
  memberIndex: number,
  activeIndex: number,
  shift: number,
  total: number,
  slideDirection: -1 | 0 | 1 = 0,
  isInteracting = false,
  entryModeCache?: Map<number, "wrapped" | "unwrapped">,
): number {
  const half = total / 2;
  const linear = memberIndex - activeIndex;
  const unwrapped = linear - shift;

  let wrapped = unwrapped;
  while (wrapped > half) wrapped -= total;
  while (wrapped < -half) wrapped += total;

  if (!isInteracting) return wrapped;

  const entryFromRight = linear > half && linear <= half + 1 + SLOT_VISIBILITY_OVERSCAN;
  const entryFromLeft = linear >= half - 1 && linear < half;
  const movingRight = slideDirection > 0;
  const movingLeft = slideDirection < 0;

  if (entryModeCache) {
    const cached = entryModeCache.get(memberIndex);
    if (cached === "unwrapped") {
      const stillEntry =
        (movingRight && entryFromRight) || (movingLeft && entryFromLeft);
      if (stillEntry) return unwrapped;
      entryModeCache.delete(memberIndex);
    }
  }

  if (movingRight && entryFromRight) {
    entryModeCache?.set(memberIndex, "unwrapped");
    return unwrapped;
  }
  if (movingLeft && entryFromLeft) {
    entryModeCache?.set(memberIndex, "unwrapped");
    return unwrapped;
  }

  return wrapped;
}

function shortestStepDelta(from: number, to: number, total: number): number {
  let delta = to - from;
  if (delta > total / 2) delta -= total;
  if (delta < -total / 2) delta += total;
  return delta;
}

/** Πλάτος slot από tuning μόνο — χωρίς pose.depthScale που αλλοιώνει τα width overrides */
function cardSlotDisplayWidth(
  baseWidth: number,
  offset: number,
  visibleOffsetMax: number,
  tuning: CarouselTuning,
): number {
  return cardWidthAtOffset(baseWidth, offset, visibleOffsetMax, tuning);
}

function cardSlotDisplayWidthInterpolated(
  baseWidth: number,
  visualOffset: number,
  visibleOffsetMax: number,
  tuning: CarouselTuning,
): number {
  return scalarAtVisualOffset(visualOffset, (offset) =>
    cardSlotDisplayWidth(baseWidth, offset, visibleOffsetMax, tuning),
  );
}

function cardHeightVhInterpolated(visualOffset: number, tuning: CarouselTuning): number {
  return scalarAtVisualOffset(visualOffset, (offset) => cardHeightVhAtOffset(offset, tuning));
}

/** Λεπτό translateZ μπροστά κοντά στο κέντρο — αποφεύγει 3D overlap στις άκρες */
function slotTranslateZ(poseZ: number, visualOffset: number): number {
  const focus = Math.max(0, 1 - Math.abs(visualOffset));
  return poseZ + focus * 32;
}

/** z-index: κοντά στο κέντρο μπροστά — floor αντί round για λιγότερο flicker */
function slotZIndex(visualOffset: number): number {
  const focus = Math.max(0, 1 - Math.abs(visualOffset));
  return Math.floor(40 + focus * 120 - Math.abs(visualOffset) * 4);
}

function buildSideThetas(
  radius: number,
  visibleOffsetMax: number,
  direction: 1 | -1,
  cardWidth: number,
  tuning: CarouselTuning,
): number[] {
  const thetas = [0];
  for (let step = 0; step < visibleOffsetMax; step += 1) {
    const fromOffset = direction > 0 ? step : -(step + 1);
    const toOffset = direction > 0 ? step + 1 : -step;
    const gapKey = direction > 0 ? toOffset : fromOffset;
    const gap = gapAtOffset(gapKey, tuning);
    const chord =
      halfCardWidthAtOffset(cardWidth, fromOffset, visibleOffsetMax, tuning) +
      gap +
      halfCardWidthAtOffset(cardWidth, toOffset, visibleOffsetMax, tuning);
    const ratio = Math.min(chord / (2 * radius), 1);
    thetas.push(thetas[step] + 2 * Math.asin(ratio));
  }
  return thetas;
}

function edgeExtentForSide(
  radius: number,
  thetas: number[],
  visibleOffsetMax: number,
  direction: 1 | -1,
  arcCurvature: number,
  cardWidth: number,
  tuning: CarouselTuning,
): number {
  const thetaMax = thetas[visibleOffsetMax];
  const curv = Math.max(arcCurvature, 0.12);
  const tEdge = thetaMax * curv * direction;
  const edgeOffset = direction > 0 ? visibleOffsetMax : -visibleOffsetMax;
  const xEdge = radius * Math.sin(tEdge);
  const hwEdge = halfCardWidthAtOffset(cardWidth, edgeOffset, visibleOffsetMax, tuning);
  const depthScale = depthScaleAtTheta(thetaMax, thetaMax) * tuning.cardSizeScale;
  const scaledHw = hwEdge * depthScale * tuning.cardWidthScale;
  const rotateY = rotateYForOffset(edgeOffset, direction * thetaMax, arcCurvature, tuning.rotationOverrides);
  const projectedW = Math.abs(scaledHw * Math.cos((rotateY * Math.PI) / 180));
  return Math.abs(xEdge) + projectedW;
}

/** Μικραίνει ολόκληρο το ring αν το 3D bleed ξεπερνά το viewport */
function computeCarouselFitScale(
  posesByOffset: Map<number, CardPose>,
  visibleOffsetMax: number,
  cardWidth: number,
  viewportWidth: number,
  viewportHeight: number,
  tuning: CarouselTuning,
): number {
  if (viewportWidth <= 0 || viewportHeight <= 0 || visibleOffsetMax === 0) return 1;

  const vhPx = viewportHeight;
  let maxX = 0;
  let maxY = 0;

  for (let o = -visibleOffsetMax; o <= visibleOffsetMax; o += 1) {
    const pose = posesByOffset.get(o);
    if (!pose) continue;

    const slotW = cardSlotDisplayWidth(cardWidth, o, visibleOffsetMax, tuning);
    const hh = (cardHeightVhAtOffset(o, tuning) * vhPx) / 100 / 2;
    const ry = (pose.rotateY * Math.PI) / 180;
    const cosR = Math.abs(Math.cos(ry));
    const sinR = Math.abs(Math.sin(ry));

    maxX = Math.max(maxX, Math.abs(pose.x) + slotW / 2 * cosR + hh * sinR);
    maxY = Math.max(maxY, Math.abs(pose.y) + hh);
  }

  const padX = 32;
  const padY = 28;
  const scaleX = maxX > 0 ? (viewportWidth / 2 - padX) / maxX : 1;
  const scaleY = maxY > 0 ? (viewportHeight / 2 - padY) / maxY : 1;

  return Math.min(1, scaleX, scaleY) * 0.96;
}

function buildUniformGapLayout(
  cardWidth: number,
  viewportWidth: number,
  visibleOffsetMax: number,
  tuning: CarouselTuning,
): { radiusX: number; thetas: number[]; thetasNeg: number[]; posesByOffset: Map<number, CardPose> } {
  if (visibleOffsetMax === 0) {
    const posesByOffset = new Map<number, CardPose>();
    posesByOffset.set(0, {
      x: 0,
      y: 0,
      z: 0,
      rotateY: tuning.rotationOverrides[0] ?? 0,
      depthScale: 0.66 * tuning.cardSizeScale,
    });
    return { radiusX: 400, thetas: [0], thetasNeg: [0], posesByOffset };
  }

  const curv = Math.max(tuning.arcCurvature, 0.12);
  const target = (viewportWidth / 2) * 0.88;
  let lo = 120;
  let hi = Math.max(viewportWidth * 3, viewportWidth + tuning.cardGapPx * visibleOffsetMax * 8);
  let radiusX = 500;

  const edgeForRadius = (r: number) => {
    const thetasPos = buildSideThetas(r, visibleOffsetMax, 1, cardWidth, tuning);
    const thetasNeg = buildSideThetas(r, visibleOffsetMax, -1, cardWidth, tuning);
    const edge = Math.max(
      edgeExtentForSide(r, thetasPos, visibleOffsetMax, 1, tuning.arcCurvature, cardWidth, tuning),
      edgeExtentForSide(r, thetasNeg, visibleOffsetMax, -1, tuning.arcCurvature, cardWidth, tuning),
    );
    return { thetasPos, thetasNeg, edge };
  };

  for (let i = 0; i < 64; i += 1) {
    const mid = (lo + hi) / 2;
    const { edge } = edgeForRadius(mid);
    if (edge < target) lo = mid;
    else hi = mid;
    radiusX = mid;
  }

  const { thetasPos, thetasNeg } = edgeForRadius(radiusX);
  const thetaMax = thetasPos[visibleOffsetMax];
  const posesByOffset = new Map<number, CardPose>();

  for (let o = -visibleOffsetMax; o <= visibleOffsetMax; o += 1) {
    const absO = Math.abs(o);
    const sign = o >= 0 ? 1 : -1;
    const theta = sign * (o >= 0 ? thetasPos[absO] : thetasNeg[absO]);
    const p = pointOnArc(theta, radiusX, tuning.arcCurvature);

    posesByOffset.set(o, {
      x: p.x,
      y: p.y,
      z: p.z,
      rotateY: rotateYForOffset(o, theta, tuning.arcCurvature, tuning.rotationOverrides),
      depthScale: depthScaleAtTheta(o >= 0 ? thetasPos[absO] : thetasNeg[absO], thetaMax) * tuning.cardSizeScale,
    });
  }

  return { radiusX, thetas: thetasPos, thetasNeg, posesByOffset };
}

function buildArcSegments(
  thetas: number[],
  radiusX: number,
  arcCurvature: number,
  visibleOffsetMax: number,
  steps = 96,
) {
  const thetaMax = thetas[visibleOffsetMax] ?? 0;
  const segments: Array<{
    x1: number;
    y1: number;
    z1: number;
    len: number;
    rotX: number;
    rotY: number;
  }> = [];

  for (let i = 0; i < steps; i += 1) {
    const t1 = -thetaMax + (i / steps) * thetaMax * 2;
    const t2 = -thetaMax + ((i + 1) / steps) * thetaMax * 2;
    const p1 = pointOnArc(t1, radiusX, arcCurvature);
    const p2 = pointOnArc(t2, radiusX, arcCurvature);
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    const len = Math.hypot(dx, dy, dz);
    if (len < 0.5) continue;

    segments.push({
      x1: p1.x,
      y1: p1.y,
      z1: p1.z,
      len,
      rotY: (Math.atan2(dx, dz) * 180) / Math.PI,
      rotX: (-Math.atan2(dy, Math.hypot(dx, dz)) * 180) / Math.PI,
    });
  }

  return segments;
}

function buildTopDownMap(
  thetas: number[],
  radiusX: number,
  cardWidth: number,
  posesByOffset: Map<number, CardPose>,
  activeIndex: number,
  members: BoardMember[],
  visibleOffsetMax: number,
  arcCurvature: number,
  tuning: CarouselTuning,
) {
  const thetaMax = thetas[visibleOffsetMax] ?? 0;
  const arcPoints: Array<{ x: number; z: number }> = [];
  const steps = 80;

  for (let i = 0; i <= steps; i += 1) {
    const t = -thetaMax + (i / steps) * thetaMax * 2;
    const p = pointOnArc(t, radiusX, arcCurvature);
    arcPoints.push({ x: p.x, z: p.z });
  }

  const cardLines: Array<{ x1: number; z1: number; x2: number; z2: number; isActive: boolean }> = [];
  members.forEach((_, index) => {
    let offset = index - activeIndex;
    if (offset > members.length / 2) offset -= members.length;
    if (offset < -members.length / 2) offset += members.length;
    if (Math.abs(offset) > visibleOffsetMax) return;

    const pose = posesByOffset.get(offset);
    if (!pose) return;

    const t = thetas[Math.abs(offset)] ?? 0;
    const halfW = halfCardWidthAtOffset(cardWidth, offset, visibleOffsetMax, tuning);
    const arcAngle = t * Math.max(arcCurvature, 0.12);
    const cosT = Math.cos(arcAngle);
    const sinT = Math.sin(arcAngle);

    cardLines.push({
      x1: pose.x - halfW * cosT,
      z1: pose.z - halfW * sinT,
      x2: pose.x + halfW * cosT,
      z2: pose.z + halfW * sinT,
      isActive: offset === 0,
    });
  });

  const samples = [
    ...arcPoints,
    ...cardLines.flatMap((line) => [
      { x: line.x1, z: line.z1 },
      { x: line.x2, z: line.z2 },
    ]),
  ];

  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  samples.forEach((point) => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minZ = Math.min(minZ, point.z);
    maxZ = Math.max(maxZ, point.z);
  });

  const pad = Math.max(48, cardWidth * 0.12);
  const width = maxX - minX + pad * 2;
  const height = maxZ - minZ + pad * 2;

  const toSvg = (x: number, z: number) => ({
    sx: x - minX + pad,
    sy: z - minZ + pad,
  });

  const arcD = arcPoints
    .map((point, index) => {
      const { sx, sy } = toSvg(point.x, point.z);
      return `${index === 0 ? "M" : "L"} ${sx.toFixed(2)} ${sy.toFixed(2)}`;
    })
    .join(" ");

  const lines = cardLines.map((line) => {
    const start = toSvg(line.x1, line.z1);
    const end = toSvg(line.x2, line.z2);
    return {
      isActive: line.isActive,
      sx1: start.sx,
      sy1: start.sy,
      sx2: end.sx,
      sy2: end.sy,
    };
  });

  return {
    arcD,
    lines,
    viewBox: `0 0 ${width.toFixed(2)} ${height.toFixed(2)}`,
    viewerX: width / 2,
    viewerY: height - pad * 0.35,
  };
}

function estimateCardWidth(w: number): number {
  if (w < 640) return Math.min(Math.max(w * 0.2, 108), 192);
  if (w < 1280) return Math.min(Math.max(w * 0.13, 192), 240);
  if (w < 1536) return Math.min(Math.max(w * 0.125, 208), 260);
  if (w < 1920) return Math.min(Math.max(w * 0.115, 224), 336);
  if (w < 2560) return Math.min(Math.max(w * 0.105, 252), 384);
  return Math.min(Math.max(w * 0.095, 280), 420);
}

function useCarouselMetrics(
  measuredCardWidth: number,
  viewportWidth: number,
  viewportHeight: number,
  tuning: CarouselTuning,
) {
  return useMemo(() => {
    const w =
      viewportWidth > 0
        ? viewportWidth
        : typeof window !== "undefined"
          ? window.innerWidth
          : 1920;
    const h =
      viewportHeight > 0
        ? viewportHeight
        : typeof window !== "undefined"
          ? window.innerHeight
          : 900;
    const visibleOffsetMax = visibleOffsetMaxForViewport(w);
    const visibleCardCount = visibleOffsetMax * 2 + 1;
    const cardWidth = measuredCardWidth > 0 ? measuredCardWidth : estimateCardWidth(w);

    const { radiusX, thetas, posesByOffset } = buildUniformGapLayout(
      cardWidth,
      w,
      visibleOffsetMax,
      tuning,
    );

    const fitScale = computeCarouselFitScale(
      posesByOffset,
      visibleOffsetMax,
      cardWidth,
      w,
      h,
      tuning,
    );

    return {
      radiusX,
      fitScale,
      visibleOffsetMax,
      visibleCardCount,
      gap: tuning.cardGapPx,
      thetas,
      posesByOffset,
    };
  }, [measuredCardWidth, viewportWidth, viewportHeight, tuning]);
}

function extrapolateCarouselPose(
  offset: number,
  visibleOffsetMax: number,
  posesByOffset: Map<number, CardPose>,
): CardPose | null {
  if (visibleOffsetMax <= 0) return null;

  if (offset > visibleOffsetMax) {
    const edge = posesByOffset.get(visibleOffsetMax);
    const inner = posesByOffset.get(visibleOffsetMax - 1);
    if (!edge || !inner) return null;
    const t = offset - visibleOffsetMax;
    return {
      x: edge.x + (edge.x - inner.x) * t,
      y: 0,
      z: edge.z + (edge.z - inner.z) * t,
      rotateY: edge.rotateY + (edge.rotateY - inner.rotateY) * t,
      depthScale: edge.depthScale,
    };
  }

  if (offset < -visibleOffsetMax) {
    const edge = posesByOffset.get(-visibleOffsetMax);
    const inner = posesByOffset.get(-visibleOffsetMax + 1);
    if (!edge || !inner) return null;
    const t = Math.abs(offset) - visibleOffsetMax;
    return {
      x: edge.x + (edge.x - inner.x) * t,
      y: 0,
      z: edge.z + (edge.z - inner.z) * t,
      rotateY: edge.rotateY + (edge.rotateY - inner.rotateY) * t,
      depthScale: edge.depthScale,
    };
  }

  return null;
}

function getCarouselPose(
  offset: number,
  posesByOffset: Map<number, CardPose>,
  visibleOffsetMax: number,
): CardPose {
  const pose = posesByOffset.get(offset);
  if (pose) return pose;

  const extrapolated = extrapolateCarouselPose(offset, visibleOffsetMax, posesByOffset);
  if (extrapolated) return extrapolated;

  return {
    x: 0,
    y: 0,
    z: 0,
    rotateY: 0,
    depthScale: 0.66,
  };
}

/** 0 στο κέντρο → 1 μόνο στο εξωτερικό ~30% του τόξου */
function cardEdgeEffectT(visualOffset: number, visibleOffsetMax: number): number {
  if (visibleOffsetMax <= 0) return 0;
  const t = Math.min(1, Math.abs(visualOffset) / visibleOffsetMax);
  const start = 0.68;
  if (t < start) return 0;
  return (t - start) / (1 - start);
}

/** Blur στις εξωτερικές κάρτες — αυξάνεται προς τα άκρα του carousel */
function cardEdgeBlurPx(visualOffset: number, visibleOffsetMax: number): number {
  const edge = cardEdgeEffectT(visualOffset, visibleOffsetMax);
  if (edge <= 0) return 0;
  return Math.pow(edge, 0.95) * 3.25;
}

/** Ελαφρύ fade στα άκρα — συνδυάζεται με blur, όχι ημιδιαφάνεια στο κέντρο */
function cardEdgeOpacity(visualOffset: number, visibleOffsetMax: number): number {
  const edge = cardEdgeEffectT(visualOffset, visibleOffsetMax);
  if (edge <= 0) return 1;
  return 1 - Math.pow(edge, 1.25) * 0.22;
}

function slotVisibilityLimit(
  visibleOffsetMax: number,
  shift: number,
  isInteracting: boolean,
  slideDirection: -1 | 0 | 1,
): number {
  if (isInteracting && slideDirection !== 0) return visibleOffsetMax + SLOT_VISIBILITY_OVERSCAN;
  if (Math.abs(shift) > EDGE_ENTRY_SHIFT_BIAS) return visibleOffsetMax + SLOT_VISIBILITY_OVERSCAN;
  return visibleOffsetMax;
}

/** Fade-out για κάρτες στο overscan zone — αντί για απότομο unmount */
function cardOverscanOpacity(
  visualOffset: number,
  visibleOffsetMax: number,
  shift: number,
  isInteracting: boolean,
  slideDirection: -1 | 0 | 1,
): number {
  const abs = Math.abs(visualOffset);
  if (abs <= visibleOffsetMax) return 1;
  const overscan =
    isInteracting && slideDirection !== 0
      ? SLOT_VISIBILITY_OVERSCAN
      : Math.abs(shift) > EDGE_ENTRY_SHIFT_BIAS
        ? SLOT_VISIBILITY_OVERSCAN
        : 0;
  if (overscan <= 0) return 0;
  const beyond = abs - visibleOffsetMax;
  if (beyond >= overscan) return 0;
  return 1 - beyond / overscan;
}

/** Μαλακό shadow μόνο κοντά στο κέντρο — σε rotateY το box-shadow γίνεται σκληρή γραμμή */
function cardDropShadow(visualOffset: number): string {
  const focus = Math.max(0, 1 - Math.abs(visualOffset));
  if (focus < 0.08) return "none";
  const y = 8 + focus * 22;
  const blur = 20 + focus * 36;
  const alpha = 0.07 + focus * 0.13;
  return `0 ${y.toFixed(1)}px ${blur.toFixed(1)}px -6px rgb(0 32 90 / ${alpha.toFixed(3)})`;
}

function MemberCarouselCard({
  member,
  heightVh,
  visualOffset,
  isActive = false,
  edgeBlurPx = 0,
  edgeOpacity = 1,
  heroGlassCards = false,
}: {
  member: BoardMember;
  heightVh: number;
  visualOffset: number;
  isActive?: boolean;
  edgeBlurPx?: number;
  edgeOpacity?: number;
  heroGlassCards?: boolean;
}) {
  const edgeFilter = edgeBlurPx > 0.01 ? `blur(${edgeBlurPx.toFixed(2)}px)` : "none";
  const isPresident = Boolean(member.image);

  return (
    <article
      className={cn(
        "about-administration__vr-card about-administration__vr-card--member about-administration__vr-card--sized",
        isActive && "is-active",
        heroGlassCards && (isPresident ? "about-administration__vr-card--president" : "about-administration__vr-card--glass"),
      )}
      style={
        {
          "--vr-card-h": `${heightVh}vh`,
          "--vr-card-shadow": cardDropShadow(visualOffset),
        } as CSSProperties
      }
    >
      <div
        className="about-administration__vr-card-surface"
        style={{
          filter: edgeFilter,
          opacity: edgeOpacity,
        }}
      >
        <div className="about-administration__portrait about-administration__portrait--vr">
          <BoardMemberPortrait member={member} />
        </div>
      </div>
    </article>
  );
}

function gapControlVisible(offset: number, visibleOffsetMax: number): boolean {
  if (visibleOffsetMax === 0) return false;
  if (Math.abs(offset) === visibleOffsetMax) return true;
  if (offset > 0) return offset < visibleOffsetMax;
  return offset > -visibleOffsetMax;
}

function VrCarouselTuningPanel({
  tuning,
  visibleOffsetMax,
  visibleCardCount,
  onCurvatureChange,
  onCardSizeChange,
  onCardWidthChange,
  onCardHeightVhChange,
  onCardGapChange,
  onRotationChange,
  onGapOverrideChange,
  onWidthOverrideChange,
  onHeightOverrideChange,
  onReset,
  onCopy,
  copyState,
}: {
  tuning: CarouselTuning;
  visibleOffsetMax: number;
  visibleCardCount: number;
  onCurvatureChange: (value: number) => void;
  onCardSizeChange: (value: number) => void;
  onCardWidthChange: (value: number) => void;
  onCardHeightVhChange: (value: number) => void;
  onCardGapChange: (value: number) => void;
  onRotationChange: (offset: number, value: number) => void;
  onGapOverrideChange: (offset: number, value: number) => void;
  onWidthOverrideChange: (offset: number, value: number) => void;
  onHeightOverrideChange: (offset: number, value: number) => void;
  onReset: () => void;
  onCopy: () => void;
  copyState: "idle" | "copied" | "error";
}) {
  const offsets = useMemo(() => {
    const list: number[] = [];
    for (let o = -visibleOffsetMax; o <= visibleOffsetMax; o += 1) list.push(o);
    return list;
  }, [visibleOffsetMax]);

  return (
    <div className="about-administration__vr-tuning">
      <div className="about-administration__vr-tuning-head">
        <p className="about-administration__vr-tuning-title">Ρυθμίσεις καρουζέλ</p>
        <span className="about-administration__vr-tuning-count">
          {visibleCardCount} κάρτες στο viewport
        </span>
        <button type="button" className="about-administration__vr-tuning-reset" onClick={onReset}>
          Επαναφορά
        </button>
        <button type="button" className="about-administration__vr-tuning-copy" onClick={onCopy}>
          {copyState === "copied" ? "Αντιγράφηκε!" : copyState === "error" ? "Σφάλμα" : "Copy τιμές"}
        </button>
      </div>

      <label className="about-administration__vr-tuning-field">
        <span className="about-administration__vr-tuning-label">
          Καμπυλότητα τόξου
          <strong>{tuning.arcCurvature.toFixed(2)}</strong>
        </span>
        <input
          type="range"
          min={0.25}
          max={2.5}
          step={0.01}
          value={tuning.arcCurvature}
          onChange={(e) => onCurvatureChange(Number(e.target.value))}
        />
      </label>

      <label className="about-administration__vr-tuning-field">
        <span className="about-administration__vr-tuning-label">
          Μέγεθος καρτών
          <strong>{tuning.cardSizeScale.toFixed(2)}</strong>
        </span>
        <input
          type="range"
          min={0.55}
          max={1.65}
          step={0.01}
          value={tuning.cardSizeScale}
          onChange={(e) => onCardSizeChange(Number(e.target.value))}
        />
      </label>

      <label className="about-administration__vr-tuning-field">
        <span className="about-administration__vr-tuning-label">
          Πλάτος καρτών
          <strong>{tuning.cardWidthScale.toFixed(2)}</strong>
        </span>
        <input
          type="range"
          min={0.45}
          max={1.75}
          step={0.01}
          value={tuning.cardWidthScale}
          onChange={(e) => onCardWidthChange(Number(e.target.value))}
        />
      </label>

      <label className="about-administration__vr-tuning-field">
        <span className="about-administration__vr-tuning-label">
          Ύψος καρτών (vh)
          <strong>{tuning.cardHeightVh.toFixed(1)}vh</strong>
        </span>
        <input
          type="range"
          min={18}
          max={52}
          step={0.5}
          value={tuning.cardHeightVh}
          onChange={(e) => onCardHeightVhChange(Number(e.target.value))}
        />
      </label>

      <label className="about-administration__vr-tuning-field about-administration__vr-tuning-field--gap">
        <span className="about-administration__vr-tuning-label">
          Σταθερή απόσταση καρτών (px)
        </span>
        <div className="about-administration__vr-tuning-gap-input">
          <input
            type="number"
            min={0}
            max={400}
            step={1}
            inputMode="numeric"
            value={tuning.cardGapPx}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (Number.isFinite(next)) onCardGapChange(next);
            }}
          />
          <span className="about-administration__vr-tuning-gap-unit">px μεταξύ άκρων</span>
        </div>
      </label>

      <div className="about-administration__vr-tuning-per-card">
        <p className="about-administration__vr-tuning-subtitle">Ρυθμίσεις ανά κάρτα</p>
        <div className="about-administration__vr-tuning-card-list">
          {offsets.map((offset) => {
            const gapValue = gapAtOffset(offset, tuning);
            const widthValue = tuning.widthOverrides[offset] ?? 1;
            const heightValue = tuning.heightOverrides[offset] ?? 1;
            const showGap = gapControlVisible(offset, visibleOffsetMax);

            return (
              <div key={`card-tune-${offset}`} className="about-administration__vr-tuning-card-block">
                <p className="about-administration__vr-tuning-card-title">{cardSlotLabel(offset)}</p>
                <div className="about-administration__vr-tuning-card-grid">
                  <label className="about-administration__vr-tuning-field">
                    <span className="about-administration__vr-tuning-label">
                      RotateY
                      <strong>{(tuning.rotationOverrides[offset] ?? 0).toFixed(0)}°</strong>
                    </span>
                    <input
                      type="range"
                      min={-90}
                      max={90}
                      step={1}
                      value={tuning.rotationOverrides[offset] ?? 0}
                      onChange={(e) => onRotationChange(offset, Number(e.target.value))}
                    />
                  </label>

                  {showGap ? (
                    <label className="about-administration__vr-tuning-field">
                      <span className="about-administration__vr-tuning-label">
                        Απόσταση (px)
                        <strong>{gapValue}px</strong>
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={200}
                        step={1}
                        value={gapValue}
                        onChange={(e) => onGapOverrideChange(offset, Number(e.target.value))}
                      />
                    </label>
                  ) : (
                    <div className="about-administration__vr-tuning-field about-administration__vr-tuning-field--spacer" />
                  )}

                  <label className="about-administration__vr-tuning-field">
                    <span className="about-administration__vr-tuning-label">
                      Πλάτος ×
                      <strong>{widthValue.toFixed(2)}</strong>
                    </span>
                    <input
                      type="range"
                      min={0.45}
                      max={1.75}
                      step={0.01}
                      value={widthValue}
                      onChange={(e) => onWidthOverrideChange(offset, Number(e.target.value))}
                    />
                  </label>

                  <label className="about-administration__vr-tuning-field">
                    <span className="about-administration__vr-tuning-label">
                      Ύψος ×
                      <strong>{heightValue.toFixed(2)}</strong>
                    </span>
                    <input
                      type="range"
                      min={0.45}
                      max={1.75}
                      step={0.01}
                      value={heightValue}
                      onChange={(e) => onHeightOverrideChange(offset, Number(e.target.value))}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function VrCarouselTopDownMap({
  thetas,
  radiusX,
  cardWidth,
  posesByOffset,
  activeIndex,
  members,
  visibleOffsetMax,
  arcCurvature,
  tuning,
}: {
  thetas: number[];
  radiusX: number;
  cardWidth: number;
  posesByOffset: Map<number, CardPose>;
  activeIndex: number;
  members: BoardMember[];
  visibleOffsetMax: number;
  arcCurvature: number;
  tuning: CarouselTuning;
}) {
  const map = useMemo(
    () =>
      buildTopDownMap(
        thetas,
        radiusX,
        cardWidth,
        posesByOffset,
        activeIndex,
        members,
        visibleOffsetMax,
        arcCurvature,
        tuning,
      ),
    [
      thetas,
      radiusX,
      cardWidth,
      posesByOffset,
      activeIndex,
      members,
      visibleOffsetMax,
      arcCurvature,
      tuning,
    ],
  );

  if (!map.arcD) return null;

  return (
    <div className="about-administration__vr-topdown" aria-hidden>
      <p className="about-administration__vr-topdown-label">Κάτοψη καρουζέλ</p>
      <svg
        className="about-administration__vr-topdown-svg"
        viewBox={map.viewBox}
        preserveAspectRatio="xMidYMid meet"
      >
        <path className="about-administration__vr-topdown-arc" d={map.arcD} />
        {map.lines.map((line, index) => (
          <line
            key={`topdown-card-${index}`}
            className={cn(
              "about-administration__vr-topdown-card",
              line.isActive && "is-active",
            )}
            x1={line.sx1}
            y1={line.sy1}
            x2={line.sx2}
            y2={line.sy2}
          />
        ))}
        <g className="about-administration__vr-topdown-viewer">
          <polygon
            points={`${map.viewerX},${map.viewerY} ${map.viewerX - 10},${map.viewerY + 18} ${map.viewerX + 10},${map.viewerY + 18}`}
          />
          <text x={map.viewerX} y={map.viewerY + 34} textAnchor="middle">
            Θεατής
          </text>
        </g>
      </svg>
    </div>
  );
}

export function BoardMembersVrCarousel({
  members,
  className,
  showDevTools = false,
  showLakeAccent = false,
  playIntro = false,
  heroGlassCards = false,
}: BoardMembersVrCarouselProps) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [introComplete, setIntroComplete] = useState(!playIntro || !!reduceMotion);
  const introLocked = playIntro && !introComplete;
  const [activeIndex, setActiveIndex] = useState(0);
  const [tuning, setTuning] = useState<CarouselTuning>(() => ({
    ...DEFAULT_TUNING,
    rotationOverrides: { ...DEFAULT_ROTATION_OVERRIDES },
    gapOverrides: { ...DEFAULT_GAP_OVERRIDES },
    widthOverrides: { ...DEFAULT_WIDTH_OVERRIDES },
    heightOverrides: { ...DEFAULT_HEIGHT_OVERRIDES },
  }));
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [shift, setShift] = useState(0);
  const [slideDirection, setSlideDirection] = useState<-1 | 0 | 1>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [shiftAnimating, setShiftAnimating] = useState(false);
  const [lakeFalling, setLakeFalling] = useState(false);
  const [lakeSettled, setLakeSettled] = useState(!showLakeAccent || !playIntro);
  const shiftRef = useRef(0);
  const slideDirectionRef = useRef<-1 | 0 | 1>(0);
  const entryModeRef = useRef<Map<number, "wrapped" | "unwrapped">>(new Map());
  const shiftAnimRef = useRef<ReturnType<typeof animate> | null>(null);
  const navigatingLockRef = useRef(false);
  const dragRef = useRef<{ startX: number; baseShift: number; lastX: number; lastT: number; velocity: number } | null>(
    null,
  );
  const viewportRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  const { radiusX, fitScale, visibleOffsetMax, visibleCardCount, thetas, posesByOffset } =
    useCarouselMetrics(cardWidth, viewportWidth, viewportHeight, tuning);

  const effectiveCardWidth =
    cardWidth > 0 ? cardWidth : estimateCardWidth(viewportWidth > 0 ? viewportWidth : 1920);

  const arcSegments = useMemo(
    () => buildArcSegments(thetas, radiusX, tuning.arcCurvature, visibleOffsetMax),
    [thetas, radiusX, tuning.arcCurvature, visibleOffsetMax],
  );

  const stepPx = useMemo(() => {
    const p0 = posesByOffset.get(0);
    const p1 = posesByOffset.get(1);
    if (!p0 || !p1) return 140;
    return Math.max(90, Math.abs(p1.x - p0.x));
  }, [posesByOffset]);

  const visibleSlots = useMemo(() => {
    const isInteracting = isDragging || shiftAnimating || isNavigating;
    const effectiveDirection = slideDirectionRef.current || slideDirection;
    const slots: Array<{
      member: BoardMember;
      index: number;
      visualOffset: number;
      pose: CardPose;
    }> = [];

    const visibilityLimit = slotVisibilityLimit(
      visibleOffsetMax,
      shift,
      isInteracting,
      effectiveDirection,
    );

    members.forEach((member, index) => {
      const visualOffset = memberVisualOffset(
        index,
        activeIndex,
        shift,
        members.length,
        effectiveDirection,
        isInteracting,
        isInteracting ? entryModeRef.current : undefined,
      );
      if (Math.abs(visualOffset) > visibilityLimit + 0.001) return;

      slots.push({
        member,
        index,
        visualOffset,
        pose: poseAtVisualOffset(visualOffset, posesByOffset, visibleOffsetMax),
      });
    });

    return slots.sort((a, b) => {
      const focusA = Math.abs(a.visualOffset);
      const focusB = Math.abs(b.visualOffset);
      if (Math.abs(focusA - focusB) > 0.001) return focusB - focusA;
      if (Math.abs(a.pose.z - b.pose.z) > 0.001) return a.pose.z - b.pose.z;
      return a.index - b.index;
    });
  }, [members, activeIndex, shift, slideDirection, isDragging, shiftAnimating, isNavigating, visibleOffsetMax, posesByOffset]);

  useLayoutEffect(() => {
    const measure = () => {
      const width = measureRef.current?.getBoundingClientRect().width ?? 0;
      if (width > 0) setCardWidth(width);
      const vpRect = viewportRef.current?.getBoundingClientRect();
      const vp = vpRect?.width ?? 0;
      const vh = vpRect?.height ?? 0;
      if (vp > 0) setViewportWidth(vp);
      if (vh > 0) setViewportHeight(vh);
    };

    measure();
    const observer = new ResizeObserver(measure);
    const measureNode = measureRef.current;
    const viewportNode = viewportRef.current;
    if (measureNode) observer.observe(measureNode);
    if (viewportNode) observer.observe(viewportNode);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    return () => {
      shiftAnimRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (!playIntro || reduceMotion || introComplete || visibleOffsetMax <= 0) return;
    const t = window.setTimeout(
      () => setIntroComplete(true),
      introTotalDuration(visibleOffsetMax) * 1000 + 40,
    );
    return () => window.clearTimeout(t);
  }, [playIntro, reduceMotion, introComplete, visibleOffsetMax]);

  useEffect(() => {
    if (!showLakeAccent || !playIntro || reduceMotion || visibleOffsetMax <= 0) return;

    const delayMs = introCardStaggerDelay(0, visibleOffsetMax) * 1000 + 120;
    const fallTimer = window.setTimeout(() => setLakeFalling(true), delayMs);
    const settleTimer = window.setTimeout(
      () => setLakeSettled(true),
      delayMs + LAKE_FALL_DURATION_S * 1000 + 40,
    );

    return () => {
      window.clearTimeout(fallTimer);
      window.clearTimeout(settleTimer);
    };
  }, [showLakeAccent, playIntro, reduceMotion, visibleOffsetMax]);

  const wrapIndex = useCallback(
    (index: number) => ((index % members.length) + members.length) % members.length,
    [members.length],
  );

  useEffect(() => {
    shiftRef.current = shift;
  }, [shift]);

  const setShiftLive = useCallback((value: number) => {
    shiftRef.current = value;
    setShift(value);
  }, []);

  const setSlideDirectionLive = useCallback((direction: -1 | 0 | 1) => {
    slideDirectionRef.current = direction;
    setSlideDirection(direction);
  }, []);

  const clearInteractionCaches = useCallback(() => {
    entryModeRef.current.clear();
    slideDirectionRef.current = 0;
    setSlideDirection(0);
  }, []);

  const snapShiftToZero = useCallback(
    (from: number) => {
      if (Math.abs(from) < 0.001) {
        setShiftLive(0);
        return Promise.resolve();
      }
      shiftAnimRef.current?.stop();
      setShiftAnimating(true);
      const duration = Math.max(
        DRAG_SNAP_MIN_DURATION,
        Math.min(DRAG_SNAP_MAX_DURATION, Math.abs(from) * 0.32),
      );
      return new Promise<void>((resolve) => {
        shiftAnimRef.current = animate(from, 0, {
          duration,
          ease: [0.33, 1, 0.68, 1],
          onUpdate: (v) => setShiftLive(v),
          onComplete: () => {
            setShiftLive(0);
            setShiftAnimating(false);
            resolve();
          },
        });
      });
    },
    [setShiftLive],
  );

  const animateShiftEase = useCallback(
    (target: number, duration: number, from?: number) =>
      new Promise<void>((resolve) => {
        shiftAnimRef.current?.stop();
        const start = from ?? shiftRef.current;
        shiftAnimRef.current = animate(start, target, {
          duration,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: (v) => setShiftLive(v),
          onComplete: () => resolve(),
        });
      }),
    [setShiftLive],
  );

  const commitCarouselStep = useCallback(
    (direction: number) => {
      flushSync(() => {
        setActiveIndex((prev) => wrapIndex(prev + direction));
        setShiftLive(shiftRef.current - direction);
      });
    },
    [setShiftLive, wrapIndex],
  );

  const settleFlingAfterDrag = useCallback(
    async (releaseShift: number, steps: number, releaseVelocity: number) => {
      const commitDir = steps < 0 ? 1 : -1;
      const count = Math.abs(steps);
      setSlideDirectionLive(commitDir);
      setShiftAnimating(true);

      const stepDuration = Math.max(
        DRAG_STEP_MIN_DURATION,
        Math.min(DRAG_STEP_MAX_DURATION, 0.34 - Math.abs(releaseVelocity) * 0.035),
      );

      try {
        for (let i = 0; i < count; i += 1) {
          const from = i === 0 ? releaseShift : shiftRef.current;
          await animateShiftEase(commitDir, stepDuration, from);
          commitCarouselStep(commitDir);
        }

        const remainder = shiftRef.current;
        if (Math.abs(remainder) > 0.002) {
          const snapDuration = Math.max(
            DRAG_SNAP_MIN_DURATION,
            Math.min(DRAG_SNAP_MAX_DURATION, Math.abs(remainder) * 0.3),
          );
          await animateShiftEase(0, snapDuration, remainder);
        }
        setShiftLive(0);
      } finally {
        clearInteractionCaches();
        setShiftAnimating(false);
      }
    },
    [animateShiftEase, clearInteractionCaches, commitCarouselStep, setShiftLive, setSlideDirectionLive],
  );

  const animateShiftTo = useCallback(
    (target: number) =>
      new Promise<void>((resolve) => {
        shiftAnimRef.current?.stop();
        shiftAnimRef.current = animate(shiftRef.current, target, {
          duration: 0.36,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: (v) => setShiftLive(v),
          onComplete: () => resolve(),
        });
      }),
    [setShiftLive],
  );

  const navigateBySteps = useCallback(
    async (steps: number) => {
      if (steps === 0 || navigatingLockRef.current || isDragging || introLocked) return;

      if (reduceMotion) {
        setActiveIndex((prev) => wrapIndex(prev + steps));
        setShiftLive(0);
        return;
      }

      navigatingLockRef.current = true;
      setIsNavigating(true);
      setShiftAnimating(true);
      const direction = steps > 0 ? 1 : -1;
      const count = Math.abs(steps);
      setSlideDirectionLive(direction);

      try {
        for (let i = 0; i < count; i += 1) {
          await animateShiftTo(direction);
          commitCarouselStep(direction);
        }
      } finally {
        clearInteractionCaches();
        setShiftAnimating(false);
        navigatingLockRef.current = false;
        setIsNavigating(false);
      }
    },
    [animateShiftTo, clearInteractionCaches, commitCarouselStep, introLocked, isDragging, reduceMotion, setShiftLive, setSlideDirectionLive, wrapIndex],
  );

  const goTo = useCallback(
    (index: number) => {
      const target = wrapIndex(index);
      const delta = shortestStepDelta(activeIndex, target, members.length);
      void navigateBySteps(delta);
    },
    [activeIndex, members.length, navigateBySteps, wrapIndex],
  );

  const goPrev = useCallback(() => {
    void navigateBySteps(-1);
  }, [navigateBySteps]);

  const goNext = useCallback(() => {
    void navigateBySteps(1);
  }, [navigateBySteps]);

  const setCurvature = useCallback((arcCurvature: number) => {
    setTuning((prev) => ({ ...prev, arcCurvature }));
  }, []);

  const setCardSizeScale = useCallback((cardSizeScale: number) => {
    setTuning((prev) => ({ ...prev, cardSizeScale }));
  }, []);

  const setCardWidthScale = useCallback((cardWidthScale: number) => {
    setTuning((prev) => ({ ...prev, cardWidthScale }));
  }, []);

  const setCardHeightVh = useCallback((cardHeightVh: number) => {
    setTuning((prev) => ({ ...prev, cardHeightVh }));
  }, []);

  const setCardGapPx = useCallback((cardGapPx: number) => {
    setTuning((prev) => ({
      ...prev,
      cardGapPx: Math.min(400, Math.max(0, Math.round(cardGapPx))),
    }));
  }, []);

  const setRotation = useCallback((offset: number, value: number) => {
    setTuning((prev) => ({
      ...prev,
      rotationOverrides: { ...prev.rotationOverrides, [offset]: value },
    }));
  }, []);

  const setGapOverride = useCallback((offset: number, value: number) => {
    setTuning((prev) => ({
      ...prev,
      gapOverrides: { ...prev.gapOverrides, [offset]: Math.min(200, Math.max(0, Math.round(value))) },
    }));
  }, []);

  const setWidthOverride = useCallback((offset: number, value: number) => {
    setTuning((prev) => ({
      ...prev,
      widthOverrides: { ...prev.widthOverrides, [offset]: value },
    }));
  }, []);

  const setHeightOverride = useCallback((offset: number, value: number) => {
    setTuning((prev) => ({
      ...prev,
      heightOverrides: { ...prev.heightOverrides, [offset]: value },
    }));
  }, []);

  const resetTuning = useCallback(
    () =>
      setTuning({
        ...DEFAULT_TUNING,
        rotationOverrides: { ...DEFAULT_ROTATION_OVERRIDES },
        gapOverrides: { ...DEFAULT_GAP_OVERRIDES },
        widthOverrides: { ...DEFAULT_WIDTH_OVERRIDES },
        heightOverrides: { ...DEFAULT_HEIGHT_OVERRIDES },
      }),
    [],
  );

  const copyTuning = useCallback(async () => {
    const text = formatTuningForCopy(tuning);
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2000);
    }
  }, [tuning]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) return;
      if (Math.abs(event.deltaX) < 8) return;
      event.preventDefault();
      if (event.deltaX > 0) goNext();
      else goPrev();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    node.addEventListener("keydown", onKeyDown);
    return () => {
      node.removeEventListener("wheel", onWheel);
      node.removeEventListener("keydown", onKeyDown);
    };
  }, [goNext, goPrev]);

  const finishDrag = useCallback(
    (releaseShift: number, releaseVelocity: number) => {
      setIsDragging(false);
      dragRef.current = null;
      shiftAnimRef.current?.stop();

      const projected = releaseShift + releaseVelocity * DRAG_MOMENTUM_GAIN;
      let steps = Math.round(-projected);
      const maxFling = Math.min(
        DRAG_MAX_FLING_STEPS,
        Math.max(2, Math.ceil(Math.abs(releaseVelocity) * 2.8)),
      );
      steps = Math.max(-maxFling, Math.min(maxFling, steps));

      if (steps === 0) {
        void snapShiftToZero(releaseShift).then(() => clearInteractionCaches());
        return;
      }

      void settleFlingAfterDrag(releaseShift, steps, releaseVelocity);
    },
    [clearInteractionCaches, settleFlingAfterDrag, snapShiftToZero],
  );

  const onViewportPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || introLocked || isNavigating || navigatingLockRef.current) return;
      shiftAnimRef.current?.stop();
      setShiftAnimating(false);
      entryModeRef.current.clear();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        startX: event.clientX,
        baseShift: shiftRef.current,
        lastX: event.clientX,
        lastT: performance.now(),
        velocity: 0,
      };
      setIsDragging(true);
    },
    [introLocked, isNavigating],
  );

  const onViewportPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;

      const now = performance.now();
      const dt = Math.max(now - drag.lastT, 1);
      drag.velocity = (event.clientX - drag.lastX) / dt;
      drag.lastX = event.clientX;
      drag.lastT = now;

      const dx = event.clientX - drag.startX;
      let nextShift = drag.baseShift + -dx / stepPx;

      nextShift = rebalanceCarouselShift(nextShift, (direction) => {
        commitCarouselStep(direction);
        setSlideDirectionLive(direction);
        drag.baseShift = shiftRef.current;
        drag.startX = event.clientX;
      });

      if (nextShift > EDGE_ENTRY_SHIFT_BIAS) setSlideDirectionLive(1);
      else if (nextShift < -EDGE_ENTRY_SHIFT_BIAS) setSlideDirectionLive(-1);

      setShiftLive(nextShift);
    },
    [commitCarouselStep, setShiftLive, setSlideDirectionLive, stepPx],
  );

  const onViewportPointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      const dx = event.clientX - drag.startX;
      let currentShift = drag.baseShift + -dx / stepPx;
      currentShift = rebalanceCarouselShift(currentShift, (direction) => {
        commitCarouselStep(direction);
        setSlideDirectionLive(direction);
      });
      const velocityShift = (-drag.velocity * DRAG_VELOCITY_SCALE) / stepPx;
      finishDrag(currentShift, velocityShift);
    },
    [commitCarouselStep, finishDrag, setSlideDirectionLive, stepPx],
  );

  const onViewportPointerCancel = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      finishDrag(shift, 0);
    },
    [finishDrag, shift],
  );

  if (!members.length) return null;

  const interactionLive = isDragging || isNavigating || shiftAnimating;
  const effectiveSlideDirection = slideDirectionRef.current || slideDirection;
  const introPlaying = playIntro && !introComplete && !reduceMotion;
  const introEnterPx = introCardEnterPx(viewportWidth > 0 ? viewportWidth : 1280);
  const controlsIntroDelay =
    visibleOffsetMax > 0
      ? introCardStaggerDelay(-visibleOffsetMax, visibleOffsetMax) + INTRO_CARD_DURATION * 0.45
      : INTRO_ENTER_DELAY;

  if (reduceMotion) {
    return (
      <div className={cn("about-administration__vr-fallback", className)}>
        <ul className="about-administration__vr-fallback-list">
          {members.map((member) => (
            <li key={member.name}>
              <MemberCarouselCard member={member} heightVh={tuning.cardHeightVh} visualOffset={0} isActive />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "about-administration__vr-carousel about-administration__vr-carousel--inside",
        introLocked && "about-administration__vr-carousel--intro-active",
        className,
      )}
    >
      {showDevTools ? (
        <div className="about-administration__vr-tools">
          <VrCarouselTuningPanel
            tuning={tuning}
            visibleOffsetMax={visibleOffsetMax}
            visibleCardCount={visibleCardCount}
            onCurvatureChange={setCurvature}
            onCardSizeChange={setCardSizeScale}
            onCardWidthChange={setCardWidthScale}
            onCardHeightVhChange={setCardHeightVh}
            onCardGapChange={setCardGapPx}
            onRotationChange={setRotation}
            onGapOverrideChange={setGapOverride}
            onWidthOverrideChange={setWidthOverride}
            onHeightOverrideChange={setHeightOverride}
            onReset={resetTuning}
            onCopy={copyTuning}
            copyState={copyState}
          />

          <VrCarouselTopDownMap
            thetas={thetas}
            radiusX={radiusX}
            cardWidth={effectiveCardWidth}
            posesByOffset={posesByOffset}
            activeIndex={activeIndex}
            members={members}
            visibleOffsetMax={visibleOffsetMax}
            arcCurvature={tuning.arcCurvature}
            tuning={tuning}
          />
        </div>
      ) : null}

      <div
        ref={viewportRef}
        className={cn(
          "about-administration__vr-viewport",
          interactionLive && "about-administration__vr-viewport--dragging",
        )}
        role="region"
        aria-roledescription="carousel"
        aria-label={t("about.hero.carouselAria")}
        tabIndex={0}
        onPointerDown={onViewportPointerDown}
        onPointerMove={onViewportPointerMove}
        onPointerUp={onViewportPointerUp}
        onPointerCancel={onViewportPointerCancel}
      >
        <div
          ref={measureRef}
          className="about-administration__vr-slot about-administration__vr-slot--measure"
          aria-hidden
        >
          <div className="about-administration__vr-card about-administration__vr-card--member" />
        </div>
        <div className="about-administration__vr-center" aria-hidden />
        <motion.div
          className="about-administration__vr-ring"
          style={{ scale: fitScale, transformStyle: "preserve-3d" }}
        >
          {showDevTools ? (
            <div className="about-administration__vr-arc" aria-hidden>
              {arcSegments.map((segment, index) => (
                <span
                  key={`arc-${index}`}
                  className="about-administration__vr-arc-segment"
                  style={{
                    width: segment.len,
                    transform: `translate3d(${segment.x1}px, ${segment.y1}px, ${segment.z1}px) rotateY(${segment.rotY}deg) rotateX(${segment.rotX}deg)`,
                  }}
                />
              ))}
            </div>
          ) : null}
          {visibleSlots.map(({ member, index, visualOffset, pose }) => {
            const isActive = index === activeIndex;
            const slotWidth = cardSlotDisplayWidthInterpolated(
                effectiveCardWidth,
                visualOffset,
                visibleOffsetMax,
                tuning,
              );
            const cardHeightVh = cardHeightVhInterpolated(visualOffset, tuning);
            const edgeBlurPx =
              introPlaying || reduceMotion ? 0 : cardEdgeBlurPx(visualOffset, visibleOffsetMax);
            const edgeOpacity = reduceMotion
              ? 1
              : cardEdgeOpacity(visualOffset, visibleOffsetMax) *
                cardOverscanOpacity(
                  visualOffset,
                  visibleOffsetMax,
                  shift,
                  interactionLive,
                  effectiveSlideDirection,
                );

            const slotZ = slotTranslateZ(pose.z, visualOffset);
            const cardTransition = introPlaying
              ? {
                  duration: INTRO_CARD_DURATION,
                  delay: introCardStaggerDelay(visualOffset, visibleOffsetMax),
                  ease: [0.22, 1, 0.36, 1] as const,
                }
              : { duration: 0 };

            return (
              <motion.div
                key={member.name}
                className="about-administration__vr-slot about-administration__vr-slot--anchored"
                initial={
                  introPlaying
                    ? {
                        x: pose.x + introEnterPx,
                        y: pose.y,
                        z: slotZ,
                        rotateY: pose.rotateY,
                        opacity: 0,
                      }
                    : false
                }
                animate={{
                  x: pose.x,
                  y: pose.y,
                  z: slotZ,
                  rotateY: pose.rotateY,
                  opacity: 1,
                }}
                transformTemplate={({ x, y, z, rotateY }) => vrTransformTemplate(x, y, z, rotateY)}
                transition={cardTransition}
                style={{
                  zIndex: slotZIndex(visualOffset),
                  transformStyle: "preserve-3d",
                  transformOrigin: "center center",
                  width: slotWidth,
                  marginLeft: -slotWidth / 2,
                }}
              >
                <button
                  type="button"
                  className={cn("about-administration__vr-slot-btn", isActive && "is-active")}
                  onClick={() => goTo(index)}
                  onPointerDown={(event) => event.stopPropagation()}
                  aria-label={`${member.name}, ${member.role}`}
                  aria-current={isActive ? "true" : undefined}
                  tabIndex={isActive ? 0 : -1}
                >
                  <MemberCarouselCard
                    member={member}
                    heightVh={cardHeightVh}
                    visualOffset={visualOffset}
                    isActive={isActive}
                    edgeBlurPx={edgeBlurPx}
                    edgeOpacity={edgeOpacity}
                    heroGlassCards={heroGlassCards}
                  />
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {showLakeAccent ? (
        <div
          className={cn(
            "about-administration__vr-lake-accent",
            lakeFalling && "is-falling",
            lakeSettled && "is-settled",
          )}
          aria-hidden
        >
          <img
            className="about-administration__vr-lake-accent__img"
            src={LAKE_ACCENT_SRC}
            alt=""
            fetchPriority="high"
            decoding="async"
            draggable={false}
          />
        </div>
      ) : null}

      <motion.div
        className="about-administration__vr-controls"
        initial={introPlaying ? { opacity: 0, y: 14 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={
          introPlaying
            ? { duration: 0.42, delay: controlsIntroDelay, ease: [0.22, 1, 0.36, 1] }
            : { duration: 0 }
        }
      >
        <button type="button" className="about-administration__vr-nav" onClick={goPrev} aria-label={t("about.hero.prev")} disabled={isNavigating || introLocked}>
          <ChevronLeft aria-hidden />
        </button>

        <div className="about-administration__vr-dots" role="tablist" aria-label={t("about.hero.dotsAria")}>
          {members.map((member, index) => (
            <button
              key={member.name}
              type="button"
              role="tab"
              className={cn("about-administration__vr-dot", index === activeIndex && "is-active")}
              aria-label={t("about.hero.memberN", { n: index + 1 })}
              aria-selected={index === activeIndex}
              onClick={() => goTo(index)}
              disabled={introLocked}
            />
          ))}
        </div>

        <button type="button" className="about-administration__vr-nav" onClick={goNext} aria-label={t("about.hero.next")} disabled={isNavigating || introLocked}>
          <ChevronRight aria-hidden />
        </button>
      </motion.div>
    </div>
  );
}
