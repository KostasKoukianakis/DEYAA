import { useEffect, useRef, useState } from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { cn } from "@/lib/utils";

interface AboutAdministrationShaderBgProps {
  className?: string;
}

function shaderPixelDensity() {
  if (typeof window === "undefined") return 0.65;
  const dpr = window.devicePixelRatio || 1;
  if (dpr >= 2) return 0.55;
  if (dpr >= 1.5) return 0.65;
  return 0.75;
}

/** Soft blue water shader for administration section */
export function AboutAdministrationShaderBg({ className }: AboutAdministrationShaderBgProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [pixelDensity] = useState(shaderPixelDensity);

  useEffect(() => {
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
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        "about-administration__shader",
        canvasReady && "is-canvas-ready",
        className,
      )}
      aria-hidden
    >
      <ShaderGradientCanvas
        className="about-administration__shader-canvas"
        style={{ position: "absolute", inset: 0 }}
        pixelDensity={pixelDensity}
        fov={45}
        pointerEvents="none"
        lazyLoad={false}
        powerPreference="high-performance"
      >
        <ShaderGradient
          animate="on"
          brightness={0.72}
          cAzimuthAngle={200}
          cDistance={3.2}
          cPolarAngle={88}
          cameraZoom={1}
          color1="rgb(168, 228, 255)"
          color2="rgb(0, 152, 235)"
          color3="rgb(11, 61, 107)"
          envPreset="city"
          grain="off"
          lightType="3d"
          positionX={-0.8}
          positionY={0.1}
          positionZ={0}
          range="disabled"
          rangeEnd={40}
          rangeStart={0}
          reflection={0.14}
          rotationX={0}
          rotationY={14}
          rotationZ={42}
          shader="defaults"
          type="waterPlane"
          uAmplitude={0.9}
          uDensity={1}
          uFrequency={4.8}
          uSpeed={0.08}
          uStrength={1.2}
          uTime={0}
          wireframe={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
