import { lazy, Suspense, useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { HeroGlassDeyaTitle } from "@/components/HeroGlassDeyaTitle";
import { usePersistentHomeShaderSlot } from "@/components/PersistentHomeShader";
import { waitForPaintedCanvas } from "@/lib/waitForPaintedCanvas";
import { cn, fetchPriorityHigh } from "@/lib/utils";

const PHONE_MAX_WIDTH = 767;

let knownPhoneViewport: boolean | null = null;

function readPhoneViewport() {
  if (typeof window === "undefined") return true;
  return window.matchMedia(`(max-width: ${PHONE_MAX_WIDTH}px)`).matches;
}

const ShaderGradientScene = lazy(() => import("@/components/ShaderGradientScene"));
const HeroWaterRipple = lazy(() =>
  import("@/components/HeroWaterRipple").then((m) => ({ default: m.HeroWaterRipple })),
);

function HeroOrganicSpot() {
  return (
    <div className="hero-organic-spot" aria-hidden>
      <div className="hero-organic-spot__depth" />
      <div className="hero-organic-spot__edge-light" />
    </div>
  );
}

interface ShaderGradientHeroProps {
  className?: string;
  bottomGrain?: boolean;
  organicSpot?: boolean;
  ripple?: boolean;
  /** Procedural ice-glass ΔΕΥΑ title (CSS + ripple texture) */
  glassTitle?: boolean;
  /** Ripple strength (0–1). Test hero defaults softer than homepage. */
  rippleIntensity?: number;
  /** @deprecated Use glassTitle — image file lockup */
  topImage?: string;
  topImageAlt?: string;
  topImageTopVh?: number;
  topImageMaxWidthRem?: number;
  /** Extra scroll height below the first viewport (e.g. 100 → 200vh total). Shader + ripple fill all; brand lockup stays in first 100vh. */
  scrollExtensionVh?: number;
  /** Keep the desktop water-plane alive across homepage remounts. */
  persistScene?: boolean;
  /** Window pointer tracking bounds — ripple works through overlay panels */
  pointerBoundsRef?: RefObject<HTMLElement | null>;
  /** Fires when ripple canvas (homepage lockup scene) is initialized */
  onRippleSceneReady?: () => void;
  /** Fires after the shader gradient canvas has a painted GPU frame */
  onShaderSceneReady?: () => void;
}

/** Shader gradient hero + soft ripple overlay (no JPG background) */
export function ShaderGradientHero({
  className,
  bottomGrain = true,
  organicSpot = true,
  ripple = false,
  glassTitle = false,
  rippleIntensity = 0.22,
  topImage,
  topImageAlt = "ΔΕΥΑ",
  topImageTopVh = 7,
  topImageMaxWidthRem = 36,
  scrollExtensionVh = 0,
  persistScene = false,
  pointerBoundsRef,
  onRippleSceneReady,
  onShaderSceneReady,
}: ShaderGradientHeroProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [brandTextureUrl, setBrandTextureUrl] = useState<string>();
  const [rippleCanvasReady, setRippleCanvasReady] = useState(false);
  const [phoneViewport, setPhoneViewport] = useState(
    () => knownPhoneViewport ?? readPhoneViewport(),
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${PHONE_MAX_WIDTH}px)`);
    const onChange = () => {
      knownPhoneViewport = mql.matches;
      setPhoneViewport(mql.matches);
    };
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const handleTextureReady = useCallback((url: string) => {
    setBrandTextureUrl(url);
  }, []);

  const handleRippleCanvasReady = useCallback(() => {
    setRippleCanvasReady(true);
    onRippleSceneReady?.();
  }, [onRippleSceneReady]);

  const persistDesktopScene = persistScene && !phoneViewport;
  const shaderSlotRef = usePersistentHomeShaderSlot(persistDesktopScene);
  const titleRipple = ripple && !phoneViewport && (glassTitle || Boolean(topImage));
  const brandImageUrl = glassTitle ? brandTextureUrl : topImage;

  useEffect(() => {
    if (titleRipple) return;
    onRippleSceneReady?.();
  }, [titleRipple, onRippleSceneReady]);

  useEffect(() => {
    if (!onShaderSceneReady) return;
    if (phoneViewport) {
      onShaderSceneReady();
      return;
    }

    const root = sceneRef.current;
    if (!root) return;

    let cancelled = false;
    waitForPaintedCanvas(root)
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) onShaderSceneReady();
      });

    return () => {
      cancelled = true;
    };
  }, [onShaderSceneReady, phoneViewport]);

  const brandLayoutReferenceVh = scrollExtensionVh > 0 ? 100 : undefined;

  const firstViewportLockup = (
    <>
      {glassTitle ? (
        <HeroGlassDeyaTitle
          topVh={topImageTopVh}
          maxWidthRem={topImageMaxWidthRem}
          onTextureReady={handleTextureReady}
          hidden={rippleCanvasReady}
        />
      ) : null}

      {topImage && !glassTitle ? (
        <div
          className="hero-entrance-brand hero-shader-top-image pointer-events-none absolute inset-x-0 z-[5] flex justify-center px-4"
          style={{ top: `${topImageTopVh}vh` }}
        >
          <img
            src={topImage}
            alt={topImageAlt}
            className="hero-shader-top-image__asset w-full object-contain"
            style={{ maxWidth: `min(88vw, ${topImageMaxWidthRem}rem)` }}
            width={1139}
            height={344}
            decoding="async"
            draggable={false}
            {...fetchPriorityHigh}
          />
        </div>
      ) : null}
    </>
  );

  return (
    <div
      ref={sceneRef}
      className={cn("hero-entrance-shader-scene relative h-full w-full", className)}
    >
      <div className="hero-shader-static" aria-hidden />
      {persistDesktopScene ? (
        <div ref={shaderSlotRef} className="hero-shader-persist-slot" aria-hidden />
      ) : null}
      {!phoneViewport && !persistScene ? (
        <Suspense fallback={null}>
          <ShaderGradientScene />
        </Suspense>
      ) : null}

      {bottomGrain ? <div className="hero-bottom-grain" aria-hidden /> : null}
      {organicSpot ? <HeroOrganicSpot /> : null}

      {titleRipple && brandImageUrl ? (
        <Suspense fallback={null}>
          <HeroWaterRipple
            className="z-[4]"
            overlayOnly
            brandImageUrl={brandImageUrl}
            brandImageTopVh={topImageTopVh}
            brandImageMaxWidthRem={topImageMaxWidthRem}
            brandLayoutReferenceVh={brandLayoutReferenceVh}
            pointerBoundsRef={pointerBoundsRef}
            intensity={rippleIntensity}
            ambientIntensity={1}
            onCanvasReady={handleRippleCanvasReady}
          />
        </Suspense>
      ) : null}

      {scrollExtensionVh > 0 ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-svh w-full overflow-hidden">
          {firstViewportLockup}
        </div>
      ) : (
        firstViewportLockup
      )}
    </div>
  );
}
