import { useEffect, useRef, useState } from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { cn } from "@/lib/utils";

export const ABOUT_SKY_SHADER_COLORS = {
  color1: "rgb(94, 196, 255)",
  color2: "rgb(26, 168, 245)",
  color3: "rgb(6, 105, 179)",
} as const;

interface AboutSkyShaderBgProps {
  className?: string;
  /** When false, skip WebGL — CSS gradient only (hero perf). */
  active?: boolean;
}

function shaderPixelDensity() {
  if (typeof window === "undefined") return 0.65;
  const dpr = window.devicePixelRatio || 1;
  if (dpr >= 2) return 0.55;
  if (dpr >= 1.5) return 0.65;
  return 0.75;
}

/** Ένα fixed viewport shader — history + vision μοιράζονται το ίδιο WebGL surface */
export function AboutSkyShaderBg({ className, active = true }: AboutSkyShaderBgProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [pixelDensity] = useState(shaderPixelDensity);

  useEffect(() => {
    if (!active) {
      setCanvasReady(false);
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    const markReady = () => {
      const canvas = root.querySelector("canvas");
      if (!canvas || canvas.width < 64 || canvas.height < 64) return false;
      setCanvasReady(true);
      return true;
    };

    if (markReady()) return;

    const observer = new MutationObserver(() => {
      if (markReady()) observer.disconnect();
    });
    observer.observe(root, { childList: true, subtree: true });

    let frame = 0;
    let rafId = 0;
    const poll = () => {
      if (markReady() || frame++ > 180) {
        observer.disconnect();
        return;
      }
      rafId = requestAnimationFrame(poll);
    };
    rafId = requestAnimationFrame(poll);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [active]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "about-sky-shader about-sky-shader--fixed",
        !active && "about-sky-shader--idle",
        active && canvasReady && "is-canvas-ready",
        className,
      )}
      aria-hidden
    >
      {active ? (
      <ShaderGradientCanvas
        className="about-sky-shader__canvas"
        style={{ position: "absolute", inset: 0 }}
        pixelDensity={pixelDensity}
        fov={48}
        pointerEvents="none"
        lazyLoad={false}
        powerPreference="high-performance"
      >
        <ShaderGradient
          animate="on"
          brightness={0.88}
          cAzimuthAngle={168}
          cDistance={2.8}
          cPolarAngle={82}
          cameraZoom={1.05}
          color1={ABOUT_SKY_SHADER_COLORS.color1}
          color2={ABOUT_SKY_SHADER_COLORS.color2}
          color3={ABOUT_SKY_SHADER_COLORS.color3}
          envPreset="city"
          grain="off"
          lightType="3d"
          positionX={-0.4}
          positionY={0.2}
          positionZ={0}
          range="disabled"
          rangeEnd={40}
          rangeStart={0}
          reflection={0.22}
          rotationX={0}
          rotationY={10}
          rotationZ={28}
          shader="defaults"
          type="waterPlane"
          uAmplitude={1.1}
          uDensity={1.15}
          uFrequency={5.2}
          uSpeed={0.14}
          uStrength={1.45}
          uTime={0}
          wireframe={false}
        />
      </ShaderGradientCanvas>
      ) : null}
    </div>
  );
}
