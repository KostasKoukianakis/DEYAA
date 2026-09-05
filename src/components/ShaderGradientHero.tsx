import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { HeroGlassDeyaTitle } from "@/components/HeroGlassDeyaTitle";
import { HeroWaterRipple } from "@/components/HeroWaterRipple";
import { waitForPaintedCanvas } from "@/lib/waitForPaintedCanvas";
import { cn } from "@/lib/utils";

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
  pointerBoundsRef,
  onRippleSceneReady,
  onShaderSceneReady,
}: ShaderGradientHeroProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [brandTextureUrl, setBrandTextureUrl] = useState<string>();
  const [rippleCanvasReady, setRippleCanvasReady] = useState(false);

  const handleTextureReady = useCallback((url: string) => {
    setBrandTextureUrl(url);
  }, []);

  const handleRippleCanvasReady = useCallback(() => {
    setRippleCanvasReady(true);
    onRippleSceneReady?.();
  }, [onRippleSceneReady]);

  const titleRipple = ripple && (glassTitle || Boolean(topImage));
  const brandImageUrl = glassTitle ? brandTextureUrl : topImage;

  useEffect(() => {
    if (titleRipple) return;
    onRippleSceneReady?.();
  }, [titleRipple, onRippleSceneReady]);

  useEffect(() => {
    const root = sceneRef.current;
    if (!root || !onShaderSceneReady) return;

    let cancelled = false;
    waitForPaintedCanvas(root)
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) onShaderSceneReady();
      });

    return () => {
      cancelled = true;
    };
  }, [onShaderSceneReady]);

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

      {topImage && !glassTitle && !ripple ? (
        <div
          className="hero-shader-top-image pointer-events-none absolute inset-x-0 z-[3] flex justify-center px-4"
          style={{ top: `${topImageTopVh}vh` }}
        >
          <img
            src={topImage}
            alt={topImageAlt}
            className="hero-shader-top-image__asset w-full object-contain"
            style={{ maxWidth: `min(88vw, ${topImageMaxWidthRem}rem)` }}
            decoding="async"
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
      <ShaderGradientCanvas
        className="absolute inset-0 h-full w-full"
        style={{ position: "absolute", inset: 0 }}
        pixelDensity={1}
        fov={30}
        pointerEvents="none"
      >
        <ShaderGradient
          animate="on"
          brightness={1.08}
          cAzimuthAngle={30}
          cDistance={8.27}
          cPolarAngle={90}
          cameraZoom={1}
          color1="rgb(130, 218, 255)"
          color2="rgb(0, 152, 235)"
          color3="rgb(0, 72, 168)"
          envPreset="lobby"
          grain="off"
          lightType="3d"
          positionX={0}
          positionY={0}
          positionZ={0}
          range="disabled"
          rangeEnd={40}
          rangeStart={0}
          reflection={0.44}
          rotationX={0}
          rotationY={30}
          rotationZ={-90}
          shader="defaults"
          type="waterPlane"
          uAmplitude={1}
          uDensity={1.8}
          uFrequency={5.5}
          uSpeed={0.45}
          uStrength={0.52}
          uTime={0}
          wireframe={false}
        />
      </ShaderGradientCanvas>

      {bottomGrain ? <div className="hero-bottom-grain" aria-hidden /> : null}
      {organicSpot ? <HeroOrganicSpot /> : null}

      {titleRipple && brandImageUrl ? (
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
