import { useEffect, useRef, useState, type RefObject } from "react";
import { bindImageReady } from "@/lib/bindImageReady";
import { cn } from "@/lib/utils";
import { applyRippleObstacles } from "@/lib/rippleObstacles";
import {
  addSharedRipple,
  getSharedRippleData,
  setSharedPointerInside,
  SHARED_SIM_SIZE,
  subscribeSharedRipple,
} from "@/lib/sharedRippleSimulation";

const DEFAULT_BG = "/hero/gradiente-sfondo-2.jpg";
const SIM_SIZE = 256;

/** Tuned softer than default — closer to gentlerain.ai subtle water */
const RIPPLE_DISPLACE = 0.032;
const RIPPLE_CAUSTIC = 0.75;
const RIPPLE_CAUSTIC_COLOR = [0.06, 0.11, 0.16] as const;
const RIPPLE_DAMPING = 0.988;
const RIPPLE_POINTER_RADIUS = 10;
const RIPPLE_POINTER_STRENGTH = 0.65;
const RIPPLE_CLICK_MULT = 1.6;
const RIPPLE_AMBIENT_INTERVAL_MS = 220;
const RIPPLE_AMBIENT_CHANCE = 0.18;
const RIPPLE_AMBIENT_STRENGTH = 0.12;

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform sampler2D u_texture;
  uniform sampler2D u_ripple;
  uniform vec2 u_texel;
  uniform vec2 u_imageSize;
  uniform vec2 u_viewSize;
  uniform vec2 u_bgPosition;
  uniform vec2 u_rippleSlice;
  uniform float u_sharedSlice;
  varying vec2 v_uv;

  vec2 rippleUV(vec2 uv) {
    if (u_sharedSlice > 0.5) {
      float globalNy = u_rippleSlice.x + (1.0 - uv.y) * u_rippleSlice.y;
      return vec2(uv.x, 1.0 - globalNy);
    }
    return vec2(uv.x, uv.y);
  }

  /* Pixel-accurate CSS background-size: cover + background-position (top-left origin) */
  vec2 coverUV(vec2 uv) {
    vec2 viewPx = vec2(uv.x, 1.0 - uv.y) * u_viewSize;
    float scale = max(u_viewSize.x / u_imageSize.x, u_viewSize.y / u_imageSize.y);
    vec2 scaledSize = u_imageSize * scale;
    vec2 offset = (u_viewSize - scaledSize) * u_bgPosition;
    return (viewPx - offset) / scaledSize;
  }

  void main() {
    vec2 ruv = rippleUV(v_uv);

    float dx = texture2D(u_ripple, ruv + vec2(u_texel.x, 0.0)).r
             - texture2D(u_ripple, ruv - vec2(u_texel.x, 0.0)).r;
    float dy = texture2D(u_ripple, ruv + vec2(0.0, u_texel.y)).r
             - texture2D(u_ripple, ruv - vec2(0.0, u_texel.y)).r;

    vec2 offset = vec2(dx, dy) * ${RIPPLE_DISPLACE.toFixed(3)};
    vec2 sampleUV = coverUV(v_uv);
    vec2 uv = clamp(sampleUV + offset, 0.001, 0.999);
    vec3 color = texture2D(u_texture, uv).rgb;

    float caustic = pow(dx * dx + dy * dy + 0.0001, 0.75) * ${RIPPLE_CAUSTIC.toFixed(2)};
    color += vec3(${RIPPLE_CAUSTIC_COLOR[0]}, ${RIPPLE_CAUSTIC_COLOR[1]}, ${RIPPLE_CAUSTIC_COLOR[2]}) * caustic;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const OVERLAY_FRAGMENT_SHADER = `
  precision mediump float;
  uniform sampler2D u_texture;
  uniform sampler2D u_ripple;
  uniform vec2 u_texel;
  uniform vec2 u_coverScale;
  uniform vec2 u_coverOffset;
  uniform vec2 u_rippleSlice;
  uniform float u_sharedSlice;
  uniform float uDisplace;
  uniform float uCaustic;
  uniform float uOverlayAlpha;
  uniform float uStrengthStart;
  uniform float uStrengthEnd;
  varying vec2 v_uv;

  vec2 rippleUV(vec2 uv) {
    if (u_sharedSlice > 0.5) {
      float globalNy = u_rippleSlice.x + (1.0 - uv.y) * u_rippleSlice.y;
      return vec2(uv.x, 1.0 - globalNy);
    }
    return vec2(uv.x, uv.y);
  }

  void main() {
    vec2 baseUV = vec2(v_uv.x, 1.0 - v_uv.y);
    vec2 ruv = rippleUV(v_uv);

    float dx = texture2D(u_ripple, ruv + vec2(u_texel.x, 0.0)).r
             - texture2D(u_ripple, ruv - vec2(u_texel.x, 0.0)).r;
    float dy = texture2D(u_ripple, ruv + vec2(0.0, u_texel.y)).r
             - texture2D(u_ripple, ruv - vec2(0.0, u_texel.y)).r;

    vec2 offset = vec2(dx, dy) * uDisplace;
    vec2 sampleUV = baseUV * u_coverScale + u_coverOffset;
    vec2 refractedUV = clamp(sampleUV + offset, 0.001, 0.999);
    vec3 refracted = texture2D(u_texture, refractedUV).rgb;

    float caustic = pow(dx * dx + dy * dy + 0.0001, 0.75) * uCaustic;
    float rippleMag = length(vec2(dx, dy));
    vec3 causticAdd = vec3(${RIPPLE_CAUSTIC_COLOR[0]}, ${RIPPLE_CAUSTIC_COLOR[1]}, ${RIPPLE_CAUSTIC_COLOR[2]}) * caustic;

    float strength = smoothstep(uStrengthStart, uStrengthEnd, rippleMag);
    vec3 color = refracted + causticAdd;
    float alpha = strength * uOverlayAlpha;

    gl_FragColor = vec4(color, alpha);
  }
`;

const BRAND_OVERLAY_FRAGMENT_SHADER = `
  precision mediump float;
  uniform sampler2D u_brand;
  uniform sampler2D u_ripple;
  uniform vec2 u_texel;
  uniform vec2 u_viewSize;
  uniform vec2 u_brandImageSize;
  uniform vec4 u_brandRect;
  uniform vec2 u_rippleSlice;
  uniform float u_sharedSlice;
  uniform float uDisplace;
  uniform float uBrandDisplace;
  uniform float uCaustic;
  uniform float uWaterAlpha;
  uniform float uStrengthStart;
  uniform float uStrengthEnd;
  varying vec2 v_uv;

  vec2 rippleUV(vec2 uv) {
    if (u_sharedSlice > 0.5) {
      float globalNy = u_rippleSlice.x + (1.0 - uv.y) * u_rippleSlice.y;
      return vec2(uv.x, 1.0 - globalNy);
    }
    return vec2(uv.x, uv.y);
  }

  vec2 brandContainUV(vec2 viewPx) {
    vec2 rectMin = u_brandRect.xy * u_viewSize;
    vec2 rectSize = u_brandRect.zw * u_viewSize;

    if (
      viewPx.x < rectMin.x || viewPx.x > rectMin.x + rectSize.x ||
      viewPx.y < rectMin.y || viewPx.y > rectMin.y + rectSize.y
    ) {
      return vec2(-1.0);
    }

    float imageAspect = u_brandImageSize.x / u_brandImageSize.y;
    float rectAspect = rectSize.x / rectSize.y;
    vec2 uv;

    if (rectAspect > imageAspect) {
      float scaledW = rectSize.y * imageAspect;
      float padX = (rectSize.x - scaledW) * 0.5;
      uv.x = (viewPx.x - rectMin.x - padX) / scaledW;
      uv.y = (viewPx.y - rectMin.y) / rectSize.y;
    } else {
      float scaledH = rectSize.x / imageAspect;
      float padY = (rectSize.y - scaledH) * 0.5;
      uv.x = (viewPx.x - rectMin.x) / rectSize.x;
      uv.y = (viewPx.y - rectMin.y - padY) / scaledH;
    }

    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      return vec2(-1.0);
    }

    return clamp(uv, 0.001, 0.999);
  }

  void main() {
    vec2 viewPx = vec2(v_uv.x, 1.0 - v_uv.y) * u_viewSize;
    vec2 ruv = rippleUV(v_uv);

    float dx = texture2D(u_ripple, ruv + vec2(u_texel.x, 0.0)).r
             - texture2D(u_ripple, ruv - vec2(u_texel.x, 0.0)).r;
    float dy = texture2D(u_ripple, ruv + vec2(0.0, u_texel.y)).r
             - texture2D(u_ripple, ruv - vec2(0.0, u_texel.y)).r;

    vec2 offset = vec2(dx, dy) * uBrandDisplace;
    float rippleMag = length(vec2(dx, dy));
    float caustic = pow(dx * dx + dy * dy + 0.0001, 0.75) * uCaustic;
    vec3 causticAdd = vec3(${RIPPLE_CAUSTIC_COLOR[0]}, ${RIPPLE_CAUSTIC_COLOR[1]}, ${RIPPLE_CAUSTIC_COLOR[2]}) * caustic;
    float strength = smoothstep(uStrengthStart, uStrengthEnd, rippleMag);
    float causticAlpha = strength * uWaterAlpha;
    vec3 causticColor = causticAdd * 1.35;

    vec2 baseUV = brandContainUV(viewPx);
    vec3 premultBrand = vec3(0.0);
    float brandAlpha = 0.0;

    if (baseUV.x >= 0.0) {
      vec2 refractedUV = clamp(baseUV + offset, 0.001, 0.999);
      vec4 tex = texture2D(u_brand, refractedUV);
      float alpha = tex.a;
      if (alpha > 0.98) {
        float maxC = max(max(tex.r, tex.g), tex.b);
        float minC = min(min(tex.r, tex.g), tex.b);
        float sat = maxC - minC;
        vec3 bgKey = vec3(0.70, 0.84, 0.96);
        float bgDist = length(tex.rgb - bgKey);
        alpha = max(
          smoothstep(0.20, 0.42, bgDist),
          smoothstep(0.04, 0.22, sat) * smoothstep(0.25, 0.55, maxC)
        );
      } else {
        alpha = smoothstep(0.02, 0.95, alpha);
      }

      if (alpha > 0.01) {
        premultBrand = tex.rgb * alpha;
        brandAlpha = alpha;
      }
    }

    if (brandAlpha > 0.01) {
      float causticLayerA = max(causticAlpha * 1.55, rippleMag * uWaterAlpha * 0.26);
      vec3 premultCaustic = causticColor * causticLayerA;
      /* Caustics ON TOP of refracted brand — previous order hid them under opaque PNG pixels */
      vec3 outRgb = premultCaustic + premultBrand * (1.0 - causticLayerA);
      float outA = causticLayerA + brandAlpha * (1.0 - causticLayerA);
      gl_FragColor = vec4(outRgb, min(outA, 1.0));
      return;
    }

    gl_FragColor = vec4(causticColor * causticAlpha, causticAlpha);
  }
`;

/** Transparent caustic shimmer only — sits above a stable CSS/HTML brand layer */
const CAUSTICS_ONLY_FRAGMENT_SHADER = `
  precision mediump float;
  uniform sampler2D u_ripple;
  uniform vec2 u_texel;
  uniform vec2 u_rippleSlice;
  uniform float u_sharedSlice;
  uniform float uCaustic;
  uniform float uWaterAlpha;
  uniform float uStrengthStart;
  uniform float uStrengthEnd;
  varying vec2 v_uv;

  vec2 rippleUV(vec2 uv) {
    if (u_sharedSlice > 0.5) {
      float globalNy = u_rippleSlice.x + (1.0 - uv.y) * u_rippleSlice.y;
      return vec2(uv.x, 1.0 - globalNy);
    }
    return vec2(uv.x, uv.y);
  }

  void main() {
    vec2 ruv = rippleUV(v_uv);

    float dx = texture2D(u_ripple, ruv + vec2(u_texel.x, 0.0)).r
             - texture2D(u_ripple, ruv - vec2(u_texel.x, 0.0)).r;
    float dy = texture2D(u_ripple, ruv + vec2(0.0, u_texel.y)).r
             - texture2D(u_ripple, ruv - vec2(0.0, u_texel.y)).r;

    float rippleMag = length(vec2(dx, dy));
    float caustic = pow(dx * dx + dy * dy + 0.0001, 0.75) * uCaustic;
    vec3 causticAdd = vec3(${RIPPLE_CAUSTIC_COLOR[0]}, ${RIPPLE_CAUSTIC_COLOR[1]}, ${RIPPLE_CAUSTIC_COLOR[2]}) * caustic;

    float strength = smoothstep(uStrengthStart, uStrengthEnd, rippleMag);
    float alpha = strength * uWaterAlpha;
    gl_FragColor = vec4(causticAdd * 1.35, alpha);
  }
`;

/** Homepage-identical water + glass title lockup in one ripple field */
const WATER_PLUS_BRAND_FRAGMENT_SHADER = `
  precision mediump float;
  uniform sampler2D u_texture;
  uniform sampler2D u_brand;
  uniform sampler2D u_ripple;
  uniform vec2 u_texel;
  uniform vec2 u_imageSize;
  uniform vec2 u_viewSize;
  uniform vec2 u_bgPosition;
  uniform vec2 u_brandImageSize;
  uniform vec4 u_brandRect;
  uniform vec2 u_rippleSlice;
  uniform float u_sharedSlice;
  varying vec2 v_uv;

  vec2 rippleUV(vec2 uv) {
    if (u_sharedSlice > 0.5) {
      float globalNy = u_rippleSlice.x + (1.0 - uv.y) * u_rippleSlice.y;
      return vec2(uv.x, 1.0 - globalNy);
    }
    return vec2(uv.x, uv.y);
  }

  vec2 coverUV(vec2 uv) {
    vec2 viewPx = vec2(uv.x, 1.0 - uv.y) * u_viewSize;
    float scale = max(u_viewSize.x / u_imageSize.x, u_viewSize.y / u_imageSize.y);
    vec2 scaledSize = u_imageSize * scale;
    vec2 offset = (u_viewSize - scaledSize) * u_bgPosition;
    return (viewPx - offset) / scaledSize;
  }

  vec2 brandContainUV(vec2 viewPx) {
    vec2 rectMin = u_brandRect.xy * u_viewSize;
    vec2 rectSize = u_brandRect.zw * u_viewSize;

    if (
      viewPx.x < rectMin.x || viewPx.x > rectMin.x + rectSize.x ||
      viewPx.y < rectMin.y || viewPx.y > rectMin.y + rectSize.y
    ) {
      return vec2(-1.0);
    }

    float imageAspect = u_brandImageSize.x / u_brandImageSize.y;
    float rectAspect = rectSize.x / rectSize.y;
    vec2 uv;

    if (rectAspect > imageAspect) {
      float scaledW = rectSize.y * imageAspect;
      float padX = (rectSize.x - scaledW) * 0.5;
      uv.x = (viewPx.x - rectMin.x - padX) / scaledW;
      uv.y = (viewPx.y - rectMin.y) / rectSize.y;
    } else {
      float scaledH = rectSize.x / imageAspect;
      float padY = (rectSize.y - scaledH) * 0.5;
      uv.x = (viewPx.x - rectMin.x) / rectSize.x;
      uv.y = (viewPx.y - rectMin.y - padY) / scaledH;
    }

    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      return vec2(-1.0);
    }

    return clamp(uv, 0.001, 0.999);
  }

  void main() {
    vec2 viewPx = vec2(v_uv.x, 1.0 - v_uv.y) * u_viewSize;
    vec2 ruv = rippleUV(v_uv);

    float dx = texture2D(u_ripple, ruv + vec2(u_texel.x, 0.0)).r
             - texture2D(u_ripple, ruv - vec2(u_texel.x, 0.0)).r;
    float dy = texture2D(u_ripple, ruv + vec2(0.0, u_texel.y)).r
             - texture2D(u_ripple, ruv - vec2(0.0, u_texel.y)).r;

    vec2 offset = vec2(dx, dy) * ${RIPPLE_DISPLACE.toFixed(3)};

    vec2 waterUV = clamp(coverUV(v_uv) + offset, 0.001, 0.999);
    vec3 waterColor = texture2D(u_texture, waterUV).rgb;

    float caustic = pow(dx * dx + dy * dy + 0.0001, 0.75) * ${RIPPLE_CAUSTIC.toFixed(2)};
    vec3 causticAdd = vec3(${RIPPLE_CAUSTIC_COLOR[0]}, ${RIPPLE_CAUSTIC_COLOR[1]}, ${RIPPLE_CAUSTIC_COLOR[2]}) * caustic;
    waterColor += causticAdd;

    vec2 brandUV = brandContainUV(viewPx);
    if (brandUV.x >= 0.0) {
      vec2 refractedBrandUV = clamp(brandUV + offset, 0.001, 0.999);
      vec4 brandTex = texture2D(u_brand, refractedBrandUV);
      vec3 brandColor = brandTex.rgb;
      float maxC = max(max(brandColor.r, brandColor.g), brandColor.b);
      float minC = min(min(brandColor.r, brandColor.g), brandColor.b);
      float sat = maxC - minC;
      vec3 bgKey = vec3(0.70, 0.84, 0.96);
      float bgDist = length(brandColor - bgKey);
      float alpha = brandTex.a;
      if (alpha > 0.98) {
        alpha = max(
          smoothstep(0.20, 0.42, bgDist),
          smoothstep(0.04, 0.22, sat) * smoothstep(0.25, 0.55, maxC)
        );
      } else {
        alpha = smoothstep(0.02, 0.95, alpha);
      }

      if (alpha > 0.01) {
        brandColor += causticAdd;
        vec3 color = brandColor * alpha + waterColor * (1.0 - alpha);
        gl_FragColor = vec4(color, 1.0);
        return;
      }
    }

    gl_FragColor = vec4(waterColor, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function parseBackgroundPosition(position: string): [number, number] {
  const parts = position.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const horizontal = new Set(["left", "center", "right"]);
  const verticalOnly = new Set(["top", "bottom"]);

  const toAxis = (value: string, axis: "x" | "y") => {
    if (value === "left" || value === "top") return 0;
    if (value === "right" || value === "bottom") return 1;
    if (value === "center") return 0.5;
    if (value.endsWith("%")) return parseFloat(value) / 100;
    if (value.endsWith("px")) return axis === "x" ? 0.5 : 0.5;
    return 0.5;
  };

  let xKeyword = "center";
  let yKeyword = "center";

  if (parts.length === 1) {
    const token = parts[0];
    if (verticalOnly.has(token)) {
      yKeyword = token;
    } else {
      xKeyword = token;
    }
  } else if (parts.length >= 2) {
    const [first, second] = parts;
    // CSS: "bottom center" → x=center, y=bottom (vertical keyword first)
    if (verticalOnly.has(first) && horizontal.has(second)) {
      yKeyword = first;
      xKeyword = second;
    } else if (horizontal.has(first) && verticalOnly.has(second)) {
      xKeyword = first;
      yKeyword = second;
    } else {
      // Default CSS order: horizontal, then vertical
      xKeyword = first;
      yKeyword = second;
    }
  }

  return [toAxis(xKeyword, "x"), toAxis(yKeyword, "y")];
}

/** CSS background-size: cover + background-position as UV scale/offset */
function computeCoverTransform(
  imageWidth: number,
  imageHeight: number,
  viewWidth: number,
  viewHeight: number,
  position: string
): { scale: [number, number]; offset: [number, number] } {
  const [posX, posY] = parseBackgroundPosition(position);
  const viewAspect = viewWidth / viewHeight;
  const imageAspect = imageWidth / imageHeight;

  if (viewAspect > imageAspect) {
    // Width-limited cover: full texture width, crop height
    const sx = 1;
    const sy = imageAspect / viewAspect;
    return {
      scale: [sx, sy],
      offset: [(1 - sx) * posX, (1 - sy) * posY],
    };
  }

  // Height-limited cover: full texture height, crop width
  const sx = viewAspect / imageAspect;
  const sy = 1;
  return {
    scale: [sx, sy],
    offset: [(1 - sx) * posX, (1 - sy) * posY],
  };
}

/** Brand lockup rect in normalized view coords (origin top-left) */
function computeBrandRect(
  brandWidth: number,
  brandHeight: number,
  viewWidth: number,
  viewHeight: number,
  topVh: number,
  maxWidthRem: number,
  layoutReferenceVh?: number
): [number, number, number, number] {
  const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const layoutHeight =
    layoutReferenceVh != null
      ? Math.min(viewHeight, (layoutReferenceVh / 100) * window.innerHeight)
      : viewHeight;
  const maxWidthPx = Math.min(viewWidth * 0.88, maxWidthRem * remPx);
  const topPx = layoutHeight * (topVh / 100);
  const imageAspect = brandWidth / brandHeight;

  let drawW = maxWidthPx;
  let drawH = drawW / imageAspect;

  const maxDrawH = layoutHeight * 0.14;
  if (drawH > maxDrawH) {
    drawH = maxDrawH;
    drawW = drawH * imageAspect;
  }

  const x = (viewWidth - drawW) * 0.5;
  const y = topPx;

  return [x / viewWidth, y / viewHeight, drawW / viewWidth, drawH / viewHeight];
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const vShader = createShader(gl, gl.VERTEX_SHADER, vs);
  const fShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
  if (!vShader || !fShader) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

interface HeroWaterRippleProps {
  className?: string;
  /** Background texture path */
  imageUrl?: string;
  /** Horizontal mirror — pairs with hero for seamless scroll transition */
  mirrored?: boolean;
  /** Disable pointer ripple (e.g. while layer is fading in) */
  interactive?: boolean;
  /** CSS background-position for cover alignment (e.g. "bottom center") */
  backgroundPosition?: string;
  /** Draw only ripple refraction on transparent canvas — CSS bg shows through */
  overlayOnly?: boolean;
  /** Use one ripple simulation shared across multiple surfaces */
  useSharedRipple?: boolean;
  /** When shared, map pointer Y across this element (hero + section 2 combined) */
  globalBoundsRef?: RefObject<HTMLElement | null>;
  /**
   * Track pointer on window using this element's bounds — works through
   * pointer-events-none overlays (unified 200svh shader + Palladio panels).
   */
  pointerBoundsRef?: RefObject<HTMLElement | null>;
  /** Portion of shared ripple field to sample: offset (0–1) + scale (0–1) on Y */
  rippleSlice?: [number, number];
  /** Show matching CSS bg until WebGL is ready — then ripple canvas takes over */
  withCssFallback?: boolean;
  /** Visual + simulation strength multiplier (0–1). Default 1 = homepage hero. */
  intensity?: number;
  /** Random ambient ripples strength (0–1). Defaults to intensity; use 1 for homepage-like splashes. */
  ambientIntensity?: number;
  /** Glass/brand lockup distorted by ripple (overlay mode) */
  brandImageUrl?: string;
  brandImageTopVh?: number;
  brandImageMaxWidthRem?: number;
  /** When canvas is taller than one screen, anchor brand layout to this vh (e.g. 100 on 200vh hero) */
  brandLayoutReferenceVh?: number;
  /** Full homepage water refraction + brand lockup (same shader as hero) */
  waterPlusBrand?: boolean;
  /** Caustic shimmer on transparent canvas — brand stays stable underneath (HTML/CSS) */
  causticsOnly?: boolean;
  onCanvasReady?: () => void;
}

export function HeroWaterRipple({
  className,
  imageUrl = DEFAULT_BG,
  mirrored = false,
  interactive = true,
  backgroundPosition = "center center",
  overlayOnly = false,
  useSharedRipple = false,
  globalBoundsRef,
  pointerBoundsRef,
  rippleSlice = [0, 1],
  withCssFallback = false,
  intensity = 1,
  ambientIntensity,
  brandImageUrl,
  brandImageTopVh = 7,
  brandImageMaxWidthRem = 36,
  brandLayoutReferenceVh,
  waterPlusBrand = false,
  causticsOnly = false,
  onCanvasReady,
}: HeroWaterRippleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const showCanvasBrandRef = useRef(false);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const root = document.getElementById("section-01");
    if (!root) {
      showCanvasBrandRef.current = true;
      return;
    }

    const syncCanvasBrand = () => {
      showCanvasBrandRef.current = root.classList.contains("hero-entrance-brand-ripple");
    };

    syncCanvasBrand();
    const observer = new MutationObserver(syncCanvasBrand);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setCanvasReady(false);
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !interactive) {
      onCanvasReady?.();
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: overlayOnly && !(waterPlusBrand && brandImageUrl),
      antialias: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      onCanvasReady?.();
      return;
    }

    const useWaterPlusBrand = Boolean(waterPlusBrand && brandImageUrl);
    const useCausticsOnly = Boolean(causticsOnly && overlayOnly);
    const useBrandOverlay =
      overlayOnly && Boolean(brandImageUrl) && !useWaterPlusBrand && !useCausticsOnly;
    const fragmentShader = useWaterPlusBrand
      ? WATER_PLUS_BRAND_FRAGMENT_SHADER
      : useBrandOverlay
        ? BRAND_OVERLAY_FRAGMENT_SHADER
        : useCausticsOnly
          ? CAUSTICS_ONLY_FRAGMENT_SHADER
          : overlayOnly
            ? OVERLAY_FRAGMENT_SHADER
            : FRAGMENT_SHADER;

    const program = createProgram(gl, VERTEX_SHADER, fragmentShader);
    if (!program) {
      onCanvasReady?.();
      return;
    }

    gl.useProgram(program);

    if (overlayOnly && !useWaterPlusBrand) {
      gl.enable(gl.BLEND);
      gl.blendFunc(
        useBrandOverlay ? gl.ONE : gl.SRC_ALPHA,
        gl.ONE_MINUS_SRC_ALPHA
      );
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uTexture = gl.getUniformLocation(program, "u_texture");
    const uRipple = gl.getUniformLocation(program, "u_ripple");
    const uTexel = gl.getUniformLocation(program, "u_texel");
    const uImageSize = gl.getUniformLocation(program, "u_imageSize");
    const uViewSize = gl.getUniformLocation(program, "u_viewSize");
    const uBgPosition = gl.getUniformLocation(program, "u_bgPosition");
    const uCoverScale = gl.getUniformLocation(program, "u_coverScale");
    const uCoverOffset = gl.getUniformLocation(program, "u_coverOffset");
    const uRippleSlice = gl.getUniformLocation(program, "u_rippleSlice");
    const uSharedSlice = gl.getUniformLocation(program, "u_sharedSlice");
    const uDisplace = gl.getUniformLocation(program, "uDisplace");
    const uBrandDisplace = gl.getUniformLocation(program, "uBrandDisplace");
    const uCaustic = gl.getUniformLocation(program, "uCaustic");
    const uOverlayAlpha = gl.getUniformLocation(program, "uOverlayAlpha");
    const uStrengthStart = gl.getUniformLocation(program, "uStrengthStart");
    const uStrengthEnd = gl.getUniformLocation(program, "uStrengthEnd");
    const uBrand = gl.getUniformLocation(program, "u_brand");
    const uBrandImageSize = gl.getUniformLocation(program, "u_brandImageSize");
    const uBrandRect = gl.getUniformLocation(program, "u_brandRect");
    const uWaterAlpha = gl.getUniformLocation(program, "uWaterAlpha");

    const clampedIntensity = Math.max(0.15, Math.min(1, intensity));
    const clampedAmbient = Math.max(
      0.15,
      Math.min(1, ambientIntensity ?? intensity)
    );
    const displace = RIPPLE_DISPLACE * clampedIntensity;
    const brandDisplace = RIPPLE_DISPLACE * (0.38 + clampedIntensity * 0.48);
    const caustic = RIPPLE_CAUSTIC * clampedIntensity;
    const overlayAlpha = 0.9 * clampedIntensity;
    const strengthStart = 0.0012 + (1 - clampedIntensity) * 0.016;
    const strengthEnd = 0.034 + (1 - clampedIntensity) * 0.028;
    const waterAlpha = useBrandOverlay
      ? 0.42 * clampedIntensity
      : useCausticsOnly
        ? 0.58 * clampedIntensity
        : 0;

    if (overlayOnly && (uDisplace || uBrandDisplace || useCausticsOnly)) {
      if (uDisplace) gl.uniform1f(uDisplace, displace);
      if (uBrandDisplace) gl.uniform1f(uBrandDisplace, brandDisplace);
      if (uCaustic) gl.uniform1f(uCaustic, caustic);
      if (useBrandOverlay || useCausticsOnly) {
        if (uWaterAlpha) gl.uniform1f(uWaterAlpha, waterAlpha);
        if (uStrengthStart) gl.uniform1f(uStrengthStart, strengthStart);
        if (uStrengthEnd) gl.uniform1f(uStrengthEnd, strengthEnd);
      } else {
        gl.uniform1f(uOverlayAlpha, overlayAlpha);
        gl.uniform1f(uStrengthStart, strengthStart);
        gl.uniform1f(uStrengthEnd, strengthEnd);
      }
    }

    const [bgPosX, bgPosY] = parseBackgroundPosition(backgroundPosition);

    if (uRippleSlice) {
      gl.uniform2f(uRippleSlice, rippleSlice[0], rippleSlice[1]);
    }
    if (uSharedSlice) {
      gl.uniform1f(uSharedSlice, useSharedRipple ? 1.0 : 0.0);
    }

    const bgTexture = gl.createTexture();
    const rippleTexture = gl.createTexture();
    const brandTexture =
      useBrandOverlay || useWaterPlusBrand ? gl.createTexture() : null;

    const configureTexture = (tex: WebGLTexture) => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    configureTexture(bgTexture);
    configureTexture(rippleTexture);
    if (brandTexture) configureTexture(brandTexture);

    let brandWidth = 1;
    let brandHeight = 1;
    let brandReady = !(useBrandOverlay || useWaterPlusBrand);

    const image = new Image();
    image.crossOrigin = "anonymous";
    if (!useBrandOverlay && !useCausticsOnly) {
      image.src = imageUrl;
    }

    let imageReady = useBrandOverlay || useCausticsOnly;
    let imageWidth = 1;
    let imageHeight = 1;

    const applyBrandUniforms = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w <= 0 || h <= 0 || !brandReady) return;

      if (uViewSize && uBrandImageSize && uBrandRect) {
        gl.uniform2f(uViewSize, w, h);
        gl.uniform2f(uBrandImageSize, brandWidth, brandHeight);
        const rect = computeBrandRect(
          brandWidth,
          brandHeight,
          w,
          h,
          brandImageTopVh,
          brandImageMaxWidthRem,
          brandLayoutReferenceVh
        );
        gl.uniform4f(uBrandRect, rect[0], rect[1], rect[2], rect[3]);
      }
    };

    const applyCoverUniforms = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w <= 0 || h <= 0) return;

      if (uImageSize && uViewSize && uBgPosition) {
        gl.uniform2f(uImageSize, imageWidth, imageHeight);
        gl.uniform2f(uViewSize, w, h);
        gl.uniform2f(uBgPosition, bgPosX, bgPosY);
      }

      if (uCoverScale && uCoverOffset) {
        const { scale, offset } = computeCoverTransform(
          imageWidth,
          imageHeight,
          w,
          h,
          backgroundPosition
        );
        gl.uniform2f(uCoverScale, scale[0], scale[1]);
        gl.uniform2f(uCoverOffset, offset[0], offset[1]);
      }

      applyBrandUniforms();
    };

    image.onload = () => {
      imageWidth = image.naturalWidth || 1;
      imageHeight = image.naturalHeight || 1;
      gl.bindTexture(gl.TEXTURE_2D, bgTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      imageReady = true;
      applyCoverUniforms();
      if (!useWaterPlusBrand || brandReady) {
        setCanvasReady(true);
        onCanvasReady?.();
      }
    };

    if (useCausticsOnly) {
      setCanvasReady(true);
      onCanvasReady?.();
    }

    if ((useBrandOverlay || useWaterPlusBrand) && brandImageUrl && brandTexture) {
      const brandImage = new Image();
      brandImage.crossOrigin = "anonymous";
      const markBrandReady = () => {
        brandWidth = brandImage.naturalWidth || 1;
        brandHeight = brandImage.naturalHeight || 1;
        gl.bindTexture(gl.TEXTURE_2D, brandTexture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          brandImage
        );
        brandReady = true;
        applyBrandUniforms();
        if (!useWaterPlusBrand || imageReady) {
          setCanvasReady(true);
          onCanvasReady?.();
        }
      };
      bindImageReady(brandImage, markBrandReady, () => {
        brandReady = true;
        setCanvasReady(true);
        onCanvasReady?.();
      });
      brandImage.src = brandImageUrl;
    }

    const rippleData = useSharedRipple
      ? getSharedRippleData()
      : new Uint8Array(SIM_SIZE * SIM_SIZE * 4);
    let current = useSharedRipple ? null : new Float32Array(SIM_SIZE * SIM_SIZE);
    let previous = useSharedRipple ? null : new Float32Array(SIM_SIZE * SIM_SIZE);

    const softness = 1 - clampedIntensity;
    const DAMPING = RIPPLE_DAMPING + softness * 0.012;
    const POINTER_RADIUS = Math.max(
      5,
      Math.round(RIPPLE_POINTER_RADIUS * (0.65 + 0.25 * clampedIntensity))
    );
    const POINTER_STRENGTH = RIPPLE_POINTER_STRENGTH * clampedIntensity * 0.62;
    const AMBIENT_CHANCE = RIPPLE_AMBIENT_CHANCE * clampedAmbient;
    const AMBIENT_STRENGTH = RIPPLE_AMBIENT_STRENGTH * clampedAmbient;

    const resolvePointerBounds = () =>
      pointerBoundsRef?.current ??
      (useSharedRipple ? globalBoundsRef?.current : null) ??
      container;

    const toGlobalCoords = (clientX: number, clientY: number) => {
      const bounds = resolvePointerBounds();
      const rect = bounds.getBoundingClientRect();
      let nx = (clientX - rect.left) / rect.width;
      let ny = (clientY - rect.top) / rect.height;

      // Pinned shader shows the lower 100svh slice of the 200svh canvas
      if (pointerBoundsRef?.current?.classList.contains("hero-unified-shader--pinned")) {
        ny = 0.5 + ny * 0.5;
      }

      return { nx, ny };
    };

    const useWindowPointer = Boolean(pointerBoundsRef) || useSharedRipple;

    const toRippleCoords = (nx: number, ny: number) => ({
      x: mirrored ? 1 - nx : nx,
      y: ny,
    });

    const addRipple = (nx: number, ny: number, strength: number) => {
      if (useSharedRipple) {
        addSharedRipple(nx, ny, strength);
        return;
      }
      const { x, y } = toRippleCoords(nx, ny);
      const cx = Math.floor(x * SIM_SIZE);
      const cy = Math.floor((1 - y) * SIM_SIZE);
      const r2 = POINTER_RADIUS * POINTER_RADIUS;

      for (let py = -POINTER_RADIUS; py <= POINTER_RADIUS; py++) {
        for (let px = -POINTER_RADIUS; px <= POINTER_RADIUS; px++) {
          const sx = cx + px;
          const sy = cy + py;
          if (sx < 1 || sx >= SIM_SIZE - 1 || sy < 1 || sy >= SIM_SIZE - 1) continue;
          const d2 = px * px + py * py;
          if (d2 > r2) continue;
          const falloff = 1 - d2 / r2;
          previous![sy * SIM_SIZE + sx] += strength * falloff;
        }
      }
    };

    const stepSimulation = () => {
      if (useSharedRipple || !current || !previous) return;
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
      applyRippleObstacles(previous, SIM_SIZE);
      applyRippleObstacles(current, SIM_SIZE);
    };

    const uploadRipple = () => {
      const data = useSharedRipple ? getSharedRippleData() : rippleData;
      if (!useSharedRipple && previous) {
        for (let i = 0; i < SIM_SIZE * SIM_SIZE; i++) {
          const v = Math.max(0, Math.min(255, (previous[i] + 1) * 127));
          const o = i * 4;
          rippleData[o] = v;
          rippleData[o + 1] = v;
          rippleData[o + 2] = v;
          rippleData[o + 3] = 255;
        }
      }
      gl.bindTexture(gl.TEXTURE_2D, rippleTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        SHARED_SIM_SIZE,
        SHARED_SIM_SIZE,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        data
      );
    };

    let pointerInside = false;

    const isInsidePointerBounds = (clientX: number, clientY: number) => {
      const bounds = resolvePointerBounds();
      const rect = bounds.getBoundingClientRect();
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    };

    const onPointerMove = (e: PointerEvent) => {
      if (useWindowPointer && !isInsidePointerBounds(e.clientX, e.clientY)) {
        pointerInside = false;
        if (useSharedRipple) setSharedPointerInside(false);
        return;
      }

      const { nx, ny } = useWindowPointer
        ? toGlobalCoords(e.clientX, e.clientY)
        : (() => {
            const rect = container.getBoundingClientRect();
            return {
              nx: (e.clientX - rect.left) / rect.width,
              ny: (e.clientY - rect.top) / rect.height,
            };
          })();
      if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return;
      pointerInside = true;
      if (useSharedRipple) setSharedPointerInside(true);
      addRipple(nx, ny, POINTER_STRENGTH);
    };

    const onPointerLeave = (e: PointerEvent) => {
      if (useWindowPointer) return;
      pointerInside = false;
      if (useSharedRipple && globalBoundsRef?.current) {
        const rect = globalBoundsRef.current.getBoundingClientRect();
        const stillInside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        if (!stillInside) setSharedPointerInside(false);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (useWindowPointer && !isInsidePointerBounds(e.clientX, e.clientY)) return;

      const { nx, ny } = useWindowPointer
        ? toGlobalCoords(e.clientX, e.clientY)
        : (() => {
            const rect = container.getBoundingClientRect();
            return {
              nx: (e.clientX - rect.left) / rect.width,
              ny: (e.clientY - rect.top) / rect.height,
            };
          })();
      if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return;
      addRipple(nx, ny, POINTER_STRENGTH * RIPPLE_CLICK_MULT);
    };

    const pointerTarget: EventTarget = useWindowPointer ? window : container;
    pointerTarget.addEventListener("pointermove", onPointerMove);
    pointerTarget.addEventListener("pointerdown", onPointerDown);
    if (!useWindowPointer) {
      container.addEventListener("pointerleave", onPointerLeave);
    }

    let raf = 0;
    let ambientTimer = 0;
    let unsubscribeShared: (() => void) | undefined;

    const render = (time: number) => {
      if (!useSharedRipple) {
        raf = requestAnimationFrame(render);
      }
      if (useBrandOverlay ? !brandReady : !imageReady) return;
      if (useWaterPlusBrand && (!imageReady || !brandReady)) return;

      if (useBrandOverlay && !showCanvasBrandRef.current) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return;
      }

      if (!useSharedRipple) {
        stepSimulation();

        if (!pointerInside && time - ambientTimer > RIPPLE_AMBIENT_INTERVAL_MS) {
          ambientTimer = time;
          if (Math.random() < AMBIENT_CHANCE) {
            addRipple(Math.random(), Math.random(), AMBIENT_STRENGTH);
          }
        }
      }

      uploadRipple();

      gl.clearColor(
        overlayOnly && !useWaterPlusBrand ? 0 : 1,
        overlayOnly && !useWaterPlusBrand ? 0 : 1,
        overlayOnly && !useWaterPlusBrand ? 0 : 1,
        overlayOnly && !useWaterPlusBrand ? 0 : 1
      );
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (useWaterPlusBrand && brandTexture && uBrand) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, bgTexture);
        gl.uniform1i(uTexture, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, brandTexture);
        gl.uniform1i(uBrand, 1);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, rippleTexture);
        gl.uniform1i(uRipple, 2);
      } else if (useCausticsOnly) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, rippleTexture);
        gl.uniform1i(uRipple, 0);
      } else {
        if (useBrandOverlay && brandTexture && uBrand) {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, brandTexture);
          gl.uniform1i(uBrand, 0);
        } else {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, bgTexture);
          gl.uniform1i(uTexture, 0);
        }

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, rippleTexture);
        gl.uniform1i(uRipple, 1);
      }

      gl.uniform2f(uTexel, 1 / SIM_SIZE, 1 / SIM_SIZE);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    if (useSharedRipple) {
      unsubscribeShared = subscribeSharedRipple(() => render(performance.now()));
    } else {
      raf = requestAnimationFrame(render);
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      applyCoverUniforms();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    return () => {
      if (!useSharedRipple) cancelAnimationFrame(raf);
      unsubscribeShared?.();
      ro.disconnect();
      pointerTarget.removeEventListener("pointermove", onPointerMove);
      pointerTarget.removeEventListener("pointerdown", onPointerDown);
      if (!useWindowPointer) {
        container.removeEventListener("pointerleave", onPointerLeave);
      }
      gl.deleteProgram(program);
      gl.deleteTexture(bgTexture);
      gl.deleteTexture(rippleTexture);
      if (brandTexture) gl.deleteTexture(brandTexture);
      gl.deleteBuffer(buffer);
    };
  }, [
    imageUrl,
    mirrored,
    interactive,
    backgroundPosition,
    overlayOnly,
    useSharedRipple,
    globalBoundsRef,
    pointerBoundsRef,
    rippleSlice,
    withCssFallback,
    intensity,
    ambientIntensity,
    brandImageUrl,
    brandImageTopVh,
    brandImageMaxWidthRem,
    brandLayoutReferenceVh,
    waterPlusBrand,
    causticsOnly,
    onCanvasReady,
  ]);

  const cssFallbackVisible = withCssFallback && !canvasReady;
  const brandCssFallbackVisible = Boolean(brandImageUrl) && withCssFallback && !canvasReady;

  const passThroughPointer = Boolean(pointerBoundsRef);

  return (
    <div
      ref={containerRef}
      className={cn(
        "hero-water-ripple absolute inset-0 z-[1]",
        interactive && !passThroughPointer && "pointer-events-auto",
        passThroughPointer && "pointer-events-none",
        mirrored && "[transform:scaleX(-1)]",
        className
      )}
      aria-hidden={!brandImageUrl}
    >
      {brandImageUrl && overlayOnly && (
        <div
          className="hero-entrance-brand pointer-events-none absolute inset-x-0 z-[5] flex justify-center px-4"
          style={{ top: `${brandImageTopVh}vh` }}
        >
          <img
            src={brandImageUrl}
            alt=""
            className="hero-shader-top-image__asset w-full object-contain"
            style={{ maxWidth: `min(88vw, ${brandImageMaxWidthRem}rem)` }}
            decoding="async"
            fetchPriority="high"
            draggable={false}
          />
        </div>
      )}
      {brandImageUrl && withCssFallback && (
        <div
          className="pointer-events-none absolute inset-x-0 z-0 flex justify-center px-4 transition-opacity duration-300"
          style={{ top: `${brandImageTopVh}vh` }}
        >
          <img
            src={brandImageUrl}
            alt=""
            className={cn(
              "hero-shader-top-image__asset w-full object-contain",
              brandCssFallbackVisible ? "opacity-100" : "opacity-0"
            )}
            style={{ maxWidth: `min(88vw, ${brandImageMaxWidthRem}rem)` }}
            decoding="async"
          />
        </div>
      )}
      {withCssFallback && !brandImageUrl && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-0 bg-white bg-cover bg-no-repeat transition-opacity duration-300",
            cssFallbackVisible ? "opacity-100" : "opacity-0"
          )}
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition,
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        className={cn(
          "relative z-[1] block h-full w-full",
          causticsOnly && "mix-blend-screen",
          withCssFallback && !canvasReady && "opacity-0",
          withCssFallback && canvasReady && "opacity-100"
        )}
      />
      {!overlayOnly && (
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition,
          }}
          aria-hidden
        />
      )}
    </div>
  );
}
