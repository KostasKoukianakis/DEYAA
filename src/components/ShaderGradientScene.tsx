import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

export default function ShaderGradientScene() {
  return (
    <ShaderGradientCanvas
      className="absolute inset-0 h-full w-full"
      style={{ position: "absolute", inset: 0 }}
      pixelDensity={1}
      fov={30}
      pointerEvents="none"
      lazyLoad={false}
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
  );
}
