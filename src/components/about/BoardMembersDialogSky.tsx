import { useEffect, useRef, useState } from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { cn } from "@/lib/utils";

function shaderPixelDensity() {
  if (typeof window === "undefined") return 0.6;
  const dpr = window.devicePixelRatio || 1;
  if (dpr >= 2) return 0.5;
  if (dpr >= 1.5) return 0.58;
  return 0.68;
}

/** Ζωντανό μπλε sky background για το modal μελών Δ.Σ. */
export function BoardMembersDialogSky({
  className,
  simple = false,
}: {
  className?: string;
  simple?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [pixelDensity] = useState(shaderPixelDensity);

  useEffect(() => {
    if (simple) return;
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
  }, [simple]);

  if (simple) {
    return (
      <div
        className={cn(
          "about-administration__members-dialog-sky about-administration__members-dialog-sky--simple is-canvas-ready",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "about-administration__members-dialog-sky",
        canvasReady && "is-canvas-ready",
        className,
      )}
      aria-hidden
    >
      <ShaderGradientCanvas
        className="about-administration__members-dialog-sky-canvas"
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
          color1="rgb(120, 210, 255)"
          color2="rgb(0, 168, 255)"
          color3="rgb(0, 98, 210)"
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

      <div className="about-administration__members-dialog-sky-glow" />
      <div className="about-administration__members-dialog-cloud about-administration__members-dialog-cloud--1" />
      <div className="about-administration__members-dialog-cloud about-administration__members-dialog-cloud--2" />
      <div className="about-administration__members-dialog-cloud about-administration__members-dialog-cloud--3" />
    </div>
  );
}
