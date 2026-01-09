import { useEffect, useRef } from "react";

interface TubeProps {
  topPosition: string;
  hoveredColumn?: string | null;
}

// Bubble class
class Bubble {
  startX: number;
  x: number;
  y: number;
  endY: number;
  pipeX: number;
  size: number;
  speed: number;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
  phase: 'vertical' | 'horizontal' | 'toHydrant';
  horizontalSpeed: number;

  constructor(x: number, startY: number, endY: number, pipeWidth: number, pipeX: number) {
    this.startX = x;
    this.x = x + (Math.random() - 0.5) * (pipeWidth - 8);
    this.y = startY;
    this.endY = endY;
    this.pipeX = pipeX;
    this.size = Math.random() * 4 + 2;
    this.speed = Math.random() * 2 + 1;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.1 + 0.05;
    this.phase = 'vertical';
    this.horizontalSpeed = 2;
  }

  update(mainTubeY: number, mainTubeHeight: number, hydrantX: number): boolean {
    if (this.phase === 'vertical') {
      this.y -= this.speed;
      this.wobble += this.wobbleSpeed;

      if (this.y <= mainTubeY + mainTubeHeight / 2) {
        this.phase = 'horizontal';
        this.y = mainTubeY + mainTubeHeight / 2;
      }
    } else if (this.phase === 'horizontal') {
      if (this.x < hydrantX) {
        this.x += this.horizontalSpeed;
        this.wobble += this.wobbleSpeed * 0.5;
      } else {
        this.phase = 'toHydrant';
        this.x = hydrantX;
      }
    } else if (this.phase === 'toHydrant') {
      this.y -= this.speed;
      this.wobble += this.wobbleSpeed;

      const skyHeight = window.innerHeight / 3;
      const hydrantBottomY = skyHeight - 80;
      if (this.y < hydrantBottomY) {
        return false;
      }
    }

    return true;
  }

  draw(ctx: CanvasRenderingContext2D, pipeWidth: number) {
    let wobbleOffset = 0;
    let x = this.x;

    if (this.phase === 'vertical' || this.phase === 'toHydrant') {
      wobbleOffset = Math.sin(this.wobble) * 3;
      x = this.x + wobbleOffset;
    } else {
      wobbleOffset = Math.sin(this.wobble) * 2;
      this.y = this.y + wobbleOffset * 0.1;
    }

    const gradient = ctx.createRadialGradient(
      x - this.size / 3,
      this.y - this.size / 3,
      0,
      x,
      this.y,
      this.size
    );
    gradient.addColorStop(0, `rgba(200, 230, 255, ${this.opacity})`);
    gradient.addColorStop(0.5, `rgba(100, 180, 255, ${this.opacity * 0.7})`);
    gradient.addColorStop(1, `rgba(50, 150, 230, ${this.opacity * 0.3})`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.6})`;
    ctx.beginPath();
    ctx.arc(x - this.size / 3, this.y - this.size / 3, this.size / 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

// WaterDrop class
class WaterDrop {
  x: number;
  y: number;
  maxY: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  life: number;

  constructor(x: number, y: number, maxY: number) {
    this.x = x + (Math.random() - 0.5) * 40;
    this.y = y;
    this.maxY = maxY;
    this.size = Math.random() * 3 + 2;
    this.speedY = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 1;
    this.opacity = Math.random() * 0.6 + 0.4;
    this.life = 1.0;
  }

  update(): boolean {
    this.y += this.speedY;
    this.x += this.speedX;
    this.speedY += 0.2;
    this.life -= 0.015;

    if (this.y >= this.maxY) {
      return false;
    }

    return this.life > 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const currentOpacity = this.opacity * this.life;

    const gradient = ctx.createRadialGradient(
      this.x - this.size / 3,
      this.y - this.size / 2,
      0,
      this.x,
      this.y,
      this.size
    );
    gradient.addColorStop(0, `rgba(180, 220, 255, ${currentOpacity})`);
    gradient.addColorStop(0.5, `rgba(100, 180, 255, ${currentOpacity * 0.8})`);
    gradient.addColorStop(1, `rgba(50, 150, 230, ${currentOpacity * 0.4})`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.size, this.size * 1.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.7})`;
    ctx.beginPath();
    ctx.arc(this.x - this.size / 3, this.y - this.size / 2, this.size / 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

interface GrassBlade {
  x: number;
  baseY: number;
  height: number;
  width: number;
  bendX: number;
  color: string;
}

export function Tube({ topPosition, hoveredColumn }: TubeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseXRef = useRef<number>(-1000);
  const mouseYRef = useRef<number>(-1000);
  const bubblesRef = useRef<Bubble[]>([]);
  const waterDropsRef = useRef<WaterDrop[]>([]);
  const hydrantPulseRef = useRef<number>(0);
  const isWaterFlowingRef = useRef<boolean>(false);
  const grassBladesRef = useRef<GrassBlade[]>([]);
  const animationFrameRef = useRef<number>();
  const animationStartTimeRef = useRef<number | null>(null);
  const animationProgressRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseXRef.current = e.clientX - rect.left;
      mouseYRef.current = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseXRef.current = -1000;
      mouseYRef.current = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Generate grass blades
    function generateGrassBlades(
      x: number,
      baseY: number,
      baseHeight: number,
      grassWidth: number,
      grassHeight: number
    ): GrassBlade[] {
      const blades: GrassBlade[] = [];
      const grassBottomY = baseY + baseHeight + grassHeight / 3;

      for (let i = 0; i < 60; i++) {
        const angle = (Math.random() - 0.5) * Math.PI * 0.8;
        const distance = Math.random() * (grassWidth / 2) * 0.85;
        const bladeX = x + Math.cos(angle) * distance;
        const bladeBaseY = grassBottomY;
        const bladeHeight = Math.random() * 6 + 4;
        const bladeWidth = Math.random() * 1.5 + 1;
        const bendX = (Math.random() - 0.5) * 2;
        const greenVariation = Math.floor(Math.random() * 30);
        const opacity = Math.random() * 0.3 + 0.6;

        blades.push({
          x: bladeX,
          baseY: bladeBaseY,
          height: bladeHeight,
          width: bladeWidth,
          bendX: bendX,
          color: `rgba(${50 + greenVariation}, ${120 + greenVariation}, ${40 + greenVariation}, ${opacity})`,
        });
      }
      return blades;
    }

    function isMouseOverPipe(
      pipeX: number,
      pipeWidth: number,
      mouseX: number,
      mouseY: number,
      mainTubeY: number,
      mainTubeHeight: number
    ): boolean {
      const pipeLeft = pipeX - pipeWidth / 2;
      const pipeRight = pipeX + pipeWidth / 2;
      const pipeTop = mainTubeY + mainTubeHeight;

      return mouseX >= pipeLeft && mouseX <= pipeRight && mouseY >= pipeTop;
    }

    function drawFireHydrant(x: number, y: number, pulse: number) {
      // Store original x position for grass (grass should not move)
      const originalX = x;
      // Reduce pulse offset significantly (from 0.5 to 0.1)
      const pulseOffset = Math.sin(pulse) * 0.1;
      x = x + pulseOffset;
      const bodyWidth = 38;
      const bodyHeight = 65;
      const baseHeight = 12;
      const baseWidth = 45;

      const baseY = y + bodyHeight;
      const grassY = baseY + baseHeight - 2;
      const grassWidth = 75;
      const grassHeight = 12;

      if (grassBladesRef.current.length === 0) {
        const rightGrass = generateGrassBlades(originalX + bodyWidth / 4, baseY, baseHeight, grassWidth, grassHeight);
        const leftGrass = generateGrassBlades(originalX - bodyWidth / 4, baseY, baseHeight, grassWidth, grassHeight);
        grassBladesRef.current = [...leftGrass, ...rightGrass];
      }

      // Grass patches - use originalX so grass doesn't move
      const grassGradient = ctx.createRadialGradient(originalX + bodyWidth / 4, grassY, 0, originalX + bodyWidth / 4, grassY, grassWidth / 2);
      grassGradient.addColorStop(0, "#5a8c4a");
      grassGradient.addColorStop(0.6, "#4a7c3a");
      grassGradient.addColorStop(1, "rgba(58, 108, 42, 0.5)");
      ctx.fillStyle = grassGradient;
      ctx.beginPath();
      ctx.ellipse(originalX + bodyWidth / 4, grassY + grassHeight / 3, grassWidth / 2, grassHeight / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      const grassGradientLeft = ctx.createRadialGradient(originalX - bodyWidth / 4, grassY, 0, originalX - bodyWidth / 4, grassY, grassWidth / 2);
      grassGradientLeft.addColorStop(0, "#5a8c4a");
      grassGradientLeft.addColorStop(0.6, "#4a7c3a");
      grassGradientLeft.addColorStop(1, "rgba(58, 108, 42, 0.5)");
      ctx.fillStyle = grassGradientLeft;
      ctx.beginPath();
      ctx.ellipse(originalX - bodyWidth / 4, grassY + grassHeight / 3, grassWidth / 2, grassHeight / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Base
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.beginPath();
      ctx.ellipse(x, baseY + baseHeight, baseWidth / 2 + 2, baseHeight / 2 + 2, 0, 0, Math.PI * 2);
      ctx.fill();

      const baseGradient = ctx.createLinearGradient(x - baseWidth / 2, baseY, x + baseWidth / 2, baseY);
      baseGradient.addColorStop(0, "#7A1515");
      baseGradient.addColorStop(0.3, "#A52A2A");
      baseGradient.addColorStop(0.5, "#C41E3A");
      baseGradient.addColorStop(0.7, "#A52A2A");
      baseGradient.addColorStop(1, "#7A1515");
      ctx.fillStyle = baseGradient;
      ctx.fillRect(x - baseWidth / 2, baseY, baseWidth, baseHeight);

      const baseTopGradient = ctx.createRadialGradient(x - 8, baseY - 3, 0, x, baseY, baseWidth / 2);
      baseTopGradient.addColorStop(0, "#DC143C");
      baseTopGradient.addColorStop(0.7, "#C41E3A");
      baseTopGradient.addColorStop(1, "#A52A2A");
      ctx.fillStyle = baseTopGradient;
      ctx.beginPath();
      ctx.ellipse(x, baseY, baseWidth / 2, baseHeight / 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#7A1515";
      ctx.beginPath();
      ctx.ellipse(x, baseY + baseHeight, baseWidth / 2, baseHeight / 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Main body
      const bodyStartY = y;
      const bodyGradient = ctx.createLinearGradient(x - bodyWidth / 2, bodyStartY, x + bodyWidth / 2, bodyStartY);
      bodyGradient.addColorStop(0, "#8B1A1A");
      bodyGradient.addColorStop(0.15, "#A52A2A");
      bodyGradient.addColorStop(0.3, "#C41E3A");
      bodyGradient.addColorStop(0.5, "#DC143C");
      bodyGradient.addColorStop(0.7, "#C41E3A");
      bodyGradient.addColorStop(0.85, "#A52A2A");
      bodyGradient.addColorStop(1, "#7A1515");
      ctx.fillStyle = bodyGradient;
      ctx.fillRect(x - bodyWidth / 2, bodyStartY, bodyWidth, bodyHeight);

      const leftHighlight = ctx.createLinearGradient(x - bodyWidth / 2, bodyStartY, x - bodyWidth / 2 + 15, bodyStartY);
      leftHighlight.addColorStop(0, "rgba(255, 180, 180, 0.5)");
      leftHighlight.addColorStop(1, "rgba(255, 180, 180, 0)");
      ctx.fillStyle = leftHighlight;
      ctx.fillRect(x - bodyWidth / 2, bodyStartY, 15, bodyHeight);

      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(x + bodyWidth / 2 - 4, bodyStartY, 4, bodyHeight);

      // Side outlets
      const outletY = bodyStartY + bodyHeight * 0.35;
      const outletDiameter = 14;
      const outletLength = 6;

      const leftOutletStartX = x - bodyWidth / 2;
      const leftOutletGrad = ctx.createLinearGradient(leftOutletStartX - outletLength, outletY, leftOutletStartX, outletY);
      leftOutletGrad.addColorStop(0, "#7A1515");
      leftOutletGrad.addColorStop(0.5, "#A52A2A");
      leftOutletGrad.addColorStop(1, "#C41E3A");
      ctx.fillStyle = leftOutletGrad;
      ctx.fillRect(leftOutletStartX - outletLength, outletY - outletDiameter / 2, outletLength, outletDiameter);

      const leftCapGrad = ctx.createRadialGradient(
        leftOutletStartX - outletLength - 2,
        outletY - 2,
        0,
        leftOutletStartX - outletLength,
        outletY,
        outletDiameter / 2
      );
      leftCapGrad.addColorStop(0, "#C41E3A");
      leftCapGrad.addColorStop(0.7, "#A52A2A");
      leftCapGrad.addColorStop(1, "#8B1A1A");
      ctx.fillStyle = leftCapGrad;
      ctx.beginPath();
      ctx.arc(leftOutletStartX - outletLength, outletY, outletDiameter / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#4a4a4a";
      ctx.beginPath();
      ctx.arc(leftOutletStartX - outletLength, outletY, outletDiameter / 3, 0, Math.PI * 2);
      ctx.fill();

      const rightOutletStartX = x + bodyWidth / 2;
      const rightOutletGrad = ctx.createLinearGradient(rightOutletStartX, outletY, rightOutletStartX + outletLength, outletY);
      rightOutletGrad.addColorStop(0, "#C41E3A");
      rightOutletGrad.addColorStop(0.5, "#A52A2A");
      rightOutletGrad.addColorStop(1, "#7A1515");
      ctx.fillStyle = rightOutletGrad;
      ctx.fillRect(rightOutletStartX, outletY - outletDiameter / 2, outletLength, outletDiameter);

      const rightCapGrad = ctx.createRadialGradient(
        rightOutletStartX + outletLength + 2,
        outletY - 2,
        0,
        rightOutletStartX + outletLength,
        outletY,
        outletDiameter / 2
      );
      rightCapGrad.addColorStop(0, "#C41E3A");
      rightCapGrad.addColorStop(0.7, "#A52A2A");
      rightCapGrad.addColorStop(1, "#8B1A1A");
      ctx.fillStyle = rightCapGrad;
      ctx.beginPath();
      ctx.arc(rightOutletStartX + outletLength, outletY, outletDiameter / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#4a4a4a";
      ctx.beginPath();
      ctx.arc(rightOutletStartX + outletLength, outletY, outletDiameter / 3, 0, Math.PI * 2);
      ctx.fill();

      // Dome
      const domeStartY = bodyStartY;
      const ringHeight = 8;
      const ringWidth = bodyWidth + 6;

      const ringGradient = ctx.createLinearGradient(x, domeStartY - ringHeight, x, domeStartY);
      ringGradient.addColorStop(0, "#A52A2A");
      ringGradient.addColorStop(0.5, "#C41E3A");
      ringGradient.addColorStop(1, "#A52A2A");
      ctx.fillStyle = ringGradient;
      ctx.fillRect(x - ringWidth / 2, domeStartY - ringHeight, ringWidth, ringHeight);

      ctx.fillStyle = "rgba(255, 180, 180, 0.4)";
      ctx.fillRect(x - ringWidth / 2, domeStartY - ringHeight, ringWidth, 2);

      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(x - ringWidth / 2, domeStartY - 2, ringWidth, 2);

      const domeHeight = 20;
      const domeBaseY = domeStartY - ringHeight;
      const domeWidth = bodyWidth - 4;

      ctx.fillStyle = "#8B1A1A";
      ctx.beginPath();
      ctx.moveTo(x, domeBaseY - domeHeight);
      const cp1x = x - domeWidth / 2;
      const cp1y = domeBaseY - domeHeight * 0.4;
      ctx.quadraticCurveTo(cp1x, cp1y, x - domeWidth / 2, domeBaseY);
      ctx.lineTo(x + domeWidth / 2, domeBaseY);
      const cp2x = x + domeWidth / 2;
      const cp2y = domeBaseY - domeHeight * 0.4;
      ctx.quadraticCurveTo(cp2x, cp2y, x, domeBaseY - domeHeight);
      ctx.closePath();

      const domeGradient = ctx.createLinearGradient(x - domeWidth / 2, domeBaseY - domeHeight, x + domeWidth / 2, domeBaseY);
      domeGradient.addColorStop(0, "#8B1A1A");
      domeGradient.addColorStop(0.2, "#A52A2A");
      domeGradient.addColorStop(0.4, "#C41E3A");
      domeGradient.addColorStop(0.6, "#DC143C");
      domeGradient.addColorStop(0.8, "#C41E3A");
      domeGradient.addColorStop(1, "#8B1A1A");
      ctx.fillStyle = domeGradient;
      ctx.fill();

      const domeHighlight = ctx.createLinearGradient(x - domeWidth / 2, domeBaseY - domeHeight, x - domeWidth / 4, domeBaseY);
      domeHighlight.addColorStop(0, "rgba(255, 200, 200, 0.6)");
      domeHighlight.addColorStop(1, "rgba(255, 200, 200, 0)");
      ctx.fillStyle = domeHighlight;
      ctx.beginPath();
      ctx.moveTo(x, domeBaseY - domeHeight);
      ctx.quadraticCurveTo(x - domeWidth / 2, domeBaseY - domeHeight * 0.4, x - domeWidth / 2, domeBaseY);
      ctx.lineTo(x - domeWidth / 4, domeBaseY);
      ctx.quadraticCurveTo(x - domeWidth / 4, domeBaseY - domeHeight * 0.5, x, domeBaseY - domeHeight);
      ctx.closePath();
      ctx.fill();

      // Front nozzle
      const frontNozzleY = bodyStartY + bodyHeight * 0.35;
      const frontNozzleSize = 16;

      const frontNozzleGrad = ctx.createRadialGradient(x - 4, frontNozzleY - 4, 0, x, frontNozzleY, frontNozzleSize / 2);
      frontNozzleGrad.addColorStop(0, "#3a8dc0");
      frontNozzleGrad.addColorStop(0.6, "#2a6da0");
      frontNozzleGrad.addColorStop(1, "#1a4d7a");
      ctx.fillStyle = frontNozzleGrad;
      ctx.beginPath();
      ctx.arc(x, frontNozzleY, frontNozzleSize / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#4a4a4a";
      ctx.beginPath();
      ctx.arc(x, frontNozzleY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.arc(x - 1.5, frontNozzleY - 1.5, 2, 0, Math.PI * 2);
      ctx.fill();

      // White band
      const bandY = bodyStartY + bodyHeight - 15;
      const bandHeight = 8;
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillRect(x - bodyWidth / 2, bandY, bodyWidth, bandHeight);

      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillRect(x - bodyWidth / 2, bandY, bodyWidth, 2);

      ctx.fillStyle = "rgba(200, 200, 200, 0.3)";
      ctx.fillRect(x - bodyWidth / 2, bandY + bandHeight - 2, bodyWidth, 2);

      // Grass blades
      grassBladesRef.current.forEach((blade) => {
        ctx.strokeStyle = blade.color;
        ctx.lineWidth = blade.width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(blade.x, blade.baseY);
        ctx.quadraticCurveTo(
          blade.x + blade.bendX,
          blade.baseY - blade.height / 2,
          blade.x + blade.bendX * 1.5,
          blade.baseY - blade.height
        );
        ctx.stroke();
      });
    }

    function drawVerticalPipe(x: number, startY: number, endY: number, width: number) {
      const gradient = ctx.createLinearGradient(x, startY, x + width, startY);
      gradient.addColorStop(0, "#1a3d5a");
      gradient.addColorStop(0.3, "#2a6da0");
      gradient.addColorStop(0.5, "#3a8dc0");
      gradient.addColorStop(0.7, "#2a6da0");
      gradient.addColorStop(1, "#1a4d7a");

      ctx.fillStyle = gradient;
      ctx.fillRect(x, startY, width, endY - startY);

      const highlightGradient = ctx.createLinearGradient(x, startY, x + width * 0.3, startY);
      highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
      highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = highlightGradient;
      ctx.fillRect(x, startY, width * 0.3, endY - startY);

      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(x + width - 2, startY, 2, endY - startY);

      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.fillRect(x, startY, 2, endY - startY);
    }

    function drawJoint(x: number, y: number, mainPipeHeight: number, verticalPipeWidth: number, isTop: boolean = false) {
      const flangeY = isTop ? y : y + mainPipeHeight;
      const flangeWidth = 45;
      const flangeHeight = 12;
      const cornerRadius = 6;

      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.moveTo(x - flangeWidth / 2 + cornerRadius + 2, flangeY - flangeHeight / 2 + 2);
      ctx.lineTo(x + flangeWidth / 2 - cornerRadius + 2, flangeY - flangeHeight / 2 + 2);
      ctx.arcTo(x + flangeWidth / 2 + 2, flangeY - flangeHeight / 2 + 2, x + flangeWidth / 2 + 2, flangeY + 2, cornerRadius);
      ctx.lineTo(x + flangeWidth / 2 + 2, flangeY + flangeHeight / 2 - cornerRadius + 2);
      ctx.arcTo(x + flangeWidth / 2 + 2, flangeY + flangeHeight / 2 + 2, x + 2, flangeY + flangeHeight / 2 + 2, cornerRadius);
      ctx.lineTo(x - flangeWidth / 2 + cornerRadius + 2, flangeY + flangeHeight / 2 + 2);
      ctx.arcTo(x - flangeWidth / 2 + 2, flangeY + flangeHeight / 2 + 2, x - flangeWidth / 2 + 2, flangeY + 2, cornerRadius);
      ctx.lineTo(x - flangeWidth / 2 + 2, flangeY - flangeHeight / 2 + cornerRadius + 2);
      ctx.arcTo(x - flangeWidth / 2 + 2, flangeY - flangeHeight / 2 + 2, x + 2, flangeY - flangeHeight / 2 + 2, cornerRadius);
      ctx.closePath();
      ctx.fill();

      const flangeGradient = ctx.createLinearGradient(x, flangeY - flangeHeight / 2, x, flangeY + flangeHeight / 2);
      flangeGradient.addColorStop(0, "#2a5d80");
      flangeGradient.addColorStop(0.5, "#3a7da0");
      flangeGradient.addColorStop(1, "#2a5d80");
      ctx.fillStyle = flangeGradient;
      ctx.beginPath();
      ctx.moveTo(x - flangeWidth / 2 + cornerRadius, flangeY - flangeHeight / 2);
      ctx.lineTo(x + flangeWidth / 2 - cornerRadius, flangeY - flangeHeight / 2);
      ctx.arcTo(x + flangeWidth / 2, flangeY - flangeHeight / 2, x + flangeWidth / 2, flangeY, cornerRadius);
      ctx.lineTo(x + flangeWidth / 2, flangeY + flangeHeight / 2 - cornerRadius);
      ctx.arcTo(x + flangeWidth / 2, flangeY + flangeHeight / 2, x, flangeY + flangeHeight / 2, cornerRadius);
      ctx.lineTo(x - flangeWidth / 2 + cornerRadius, flangeY + flangeHeight / 2);
      ctx.arcTo(x - flangeWidth / 2, flangeY + flangeHeight / 2, x - flangeWidth / 2, flangeY, cornerRadius);
      ctx.lineTo(x - flangeWidth / 2, flangeY - flangeHeight / 2 + cornerRadius);
      ctx.arcTo(x - flangeWidth / 2, flangeY - flangeHeight / 2, x, flangeY - flangeHeight / 2, cornerRadius);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.moveTo(x - flangeWidth / 2 + cornerRadius, flangeY - flangeHeight / 2);
      ctx.lineTo(x + flangeWidth / 2 - cornerRadius, flangeY - flangeHeight / 2);
      ctx.arcTo(x + flangeWidth / 2, flangeY - flangeHeight / 2, x + flangeWidth / 2, flangeY - flangeHeight / 2 + 2, cornerRadius);
      ctx.lineTo(x + flangeWidth / 2, flangeY - flangeHeight / 2 + 2);
      ctx.lineTo(x - flangeWidth / 2, flangeY - flangeHeight / 2 + 2);
      ctx.lineTo(x - flangeWidth / 2, flangeY - flangeHeight / 2 + cornerRadius);
      ctx.arcTo(x - flangeWidth / 2, flangeY - flangeHeight / 2, x - flangeWidth / 2 + cornerRadius, flangeY - flangeHeight / 2, cornerRadius);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(x - flangeWidth / 2, flangeY + flangeHeight / 2 - 2, flangeWidth, 2);

      const boltPositions = [
        { x: x - flangeWidth / 3, y: flangeY },
        { x: x, y: flangeY },
        { x: x + flangeWidth / 3, y: flangeY },
      ];

      boltPositions.forEach((bolt) => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.beginPath();
        ctx.arc(bolt.x + 1, bolt.y + 1, 4, 0, Math.PI * 2);
        ctx.fill();

        const boltGradient = ctx.createRadialGradient(bolt.x - 1, bolt.y - 1, 0, bolt.x, bolt.y, 4);
        boltGradient.addColorStop(0, "#5a5a5a");
        boltGradient.addColorStop(0.7, "#3a3a3a");
        boltGradient.addColorStop(1, "#2a2a2a");
        ctx.fillStyle = boltGradient;
        ctx.beginPath();
        ctx.arc(bolt.x, bolt.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.beginPath();
        ctx.arc(bolt.x - 1.5, bolt.y - 1.5, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.beginPath();
        ctx.arc(bolt.x, bolt.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function drawTube() {
      if (!ctx || !canvas) return;

      const animationProgress = animationProgressRef.current;

      const mainTubeHeight = 50;
      const mainTubeY = parseFloat(topPosition.replace("vh", "")) * (window.innerHeight / 100) - mainTubeHeight / 2;
      const tubeWidth = canvas.width;
      const verticalPipeWidth = 20;

      const columnWidth = canvas.width / 3;
      const pipePositions = [
        { x: 0, width: verticalPipeWidth, endY: canvas.height },
        { x: columnWidth, width: verticalPipeWidth, endY: canvas.height },
        { x: columnWidth * 2, width: verticalPipeWidth, endY: canvas.height },
        { x: canvas.width, width: verticalPipeWidth, endY: canvas.height },
      ];

      const skyHeight = canvas.height / 3;
      const asphaltHeight = 20;
      const asphaltY = skyHeight;
      const hydrantX = canvas.width - 80;
      const hydrantBottomY = asphaltY - 80;

      const hydrantPipePos = {
        x: hydrantX,
        width: verticalPipeWidth,
        endY: hydrantBottomY,
      };

      // Create bubbles based on hovered column
      // Column 1 (Ύδρευση) → pipe at columnWidth (2nd pipe, index 1)
      // Column 2 (Αποχέτευση) → pipe at columnWidth * 2 (3rd pipe, index 2)
      let targetPipeX: number | null = null;
      
      if (hoveredColumn === "Ύδρευση") {
        // Hover on column 1 → bubbles from 2nd pipe
        targetPipeX = columnWidth;
      } else if (hoveredColumn === "Αποχέτευση") {
        // Hover on column 2 → bubbles from 3rd pipe
        targetPipeX = columnWidth * 2;
      }

      // Only allow bubbles and water flow when animation is complete
      if (animationProgress >= 1) {
        if (targetPipeX !== null) {
          // Create bubbles from the target pipe
          if (Math.random() < 0.3) {
            bubblesRef.current.push(
              new Bubble(targetPipeX, canvas.height, mainTubeY + mainTubeHeight, verticalPipeWidth, targetPipeX)
            );
          }
          isWaterFlowingRef.current = true;
        } else {
          // No column hovered - check if bubbles are still active
          if (bubblesRef.current.length === 0) {
            isWaterFlowingRef.current = false;
            waterDropsRef.current = [];
          } else {
            // Still have bubbles, keep water flowing
            isWaterFlowingRef.current = true;
          }
        }
      } else {
        // Animation still running, clear bubbles and water
        bubblesRef.current = [];
        waterDropsRef.current = [];
        isWaterFlowingRef.current = false;
      }

      // Animate vertical pipes coming from bottom
      // Each pipe animates with a slight delay for staggered effect
      pipePositions.forEach((pipe, index) => {
        const pipeStartY = mainTubeY + mainTubeHeight;
        const pipeEndY = pipe.endY;
        const totalHeight = pipeEndY - pipeStartY;
        
        // Stagger animation: each pipe starts slightly later (0, 0.1, 0.2, 0.3)
        const delay = index * 0.1;
        const pipeProgress = Math.max(0, Math.min(1, (animationProgress - delay) / (1 - delay)));
        
        // Animate from bottom (canvas.height) to final position
        let animatedStartY = pipeEndY;
        if (pipeProgress > 0) {
          const startPosition = canvas.height;
          const endPosition = pipeStartY;
          animatedStartY = startPosition - (startPosition - endPosition) * easeOutCubic(pipeProgress);
        }
        
        drawVerticalPipe(pipe.x - verticalPipeWidth / 2, animatedStartY, pipeEndY, verticalPipeWidth);
      });

      // Animate hydrant pipe (starts last)
      const hydrantDelay = 0.3;
      const hydrantPipeProgress = Math.max(0, Math.min(1, (animationProgress - hydrantDelay) / (1 - hydrantDelay)));
      let animatedHydrantStartY = hydrantBottomY;
      if (hydrantPipeProgress > 0) {
        const hydrantStartPosition = canvas.height;
        const hydrantEndPosition = mainTubeY;
        animatedHydrantStartY = hydrantStartPosition - (hydrantStartPosition - hydrantEndPosition) * easeOutCubic(hydrantPipeProgress);
      }
      drawVerticalPipe(hydrantX - verticalPipeWidth / 2, animatedHydrantStartY, hydrantBottomY, verticalPipeWidth);

      // Draw main horizontal tube (appears after vertical pipes start connecting)
      // Start showing horizontal tube when first pipe reaches it (around 0.4 progress)
      const horizontalTubeProgress = Math.max(0, Math.min(1, (animationProgress - 0.4) / 0.6));
      if (horizontalTubeProgress > 0) {
        const gradient = ctx.createLinearGradient(0, mainTubeY, 0, mainTubeY + mainTubeHeight);
        gradient.addColorStop(0, "#1a4d7a");
        gradient.addColorStop(0.2, "#2a6da0");
        gradient.addColorStop(0.5, "#3a8dc0");
        gradient.addColorStop(0.8, "#2a6da0");
        gradient.addColorStop(1, "#1a3d5a");
        ctx.fillStyle = gradient;
        
        // Animate horizontal tube growing from left to right
        const tubeWidthAnimated = tubeWidth * easeOutCubic(horizontalTubeProgress);
        const tubeX = 0; // Start from left (x=0)
        ctx.fillRect(tubeX, mainTubeY, tubeWidthAnimated, mainTubeHeight);
        
        // Draw highlights and shadows only when tube is visible
        if (horizontalTubeProgress >= 0.5) {
          const shadowGradient = ctx.createLinearGradient(0, mainTubeY + mainTubeHeight, 0, mainTubeY + mainTubeHeight + 10);
          shadowGradient.addColorStop(0, "rgba(0, 0, 0, 0.4)");
          shadowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = shadowGradient;
          ctx.fillRect(tubeX, mainTubeY + mainTubeHeight, tubeWidthAnimated, 10);

          const highlightGradient = ctx.createLinearGradient(0, mainTubeY, 0, mainTubeY + mainTubeHeight * 0.3);
          highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
          highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = highlightGradient;
          ctx.fillRect(tubeX, mainTubeY, tubeWidthAnimated, mainTubeHeight * 0.3);

          ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
          ctx.fillRect(tubeX, mainTubeY + mainTubeHeight - 3, tubeWidthAnimated, 3);

          ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
          ctx.fillRect(tubeX, mainTubeY, tubeWidthAnimated, 2);

          for (let i = 0; i < 5; i++) {
            const x = tubeX + (tubeWidthAnimated / 5) * i + tubeWidthAnimated / 10;
            const highlightWidth = 40;
            const specular = ctx.createRadialGradient(x, mainTubeY + mainTubeHeight * 0.25, 0, x, mainTubeY + mainTubeHeight * 0.25, highlightWidth);
            specular.addColorStop(0, "rgba(255, 255, 255, 0.3)");
            specular.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = specular;
            ctx.fillRect(x - highlightWidth, mainTubeY, highlightWidth * 2, mainTubeHeight * 0.5);
          }
        }
      }

      if (isWaterFlowingRef.current) {
        hydrantPulseRef.current += 0.3;
        if (Math.random() < 0.4) {
          const maxDropY = asphaltY;
          waterDropsRef.current.push(new WaterDrop(hydrantX, hydrantBottomY + 30, maxDropY));
        }
      } else {
        hydrantPulseRef.current = 0;
      }

      if (waterDropsRef.current.length > 0) {
        waterDropsRef.current = waterDropsRef.current.filter((drop) => {
          const alive = drop.update();
          if (alive) {
            drop.draw(ctx);
          }
          return alive;
        });
      }

      // Update bubbles first
      let bubblesReachingHydrant = false;
      bubblesRef.current = bubblesRef.current.filter((bubble) => {
        const alive = bubble.update(mainTubeY, mainTubeHeight, hydrantX);
        if (alive && bubble.phase === "toHydrant") {
          bubblesReachingHydrant = true;
        }
        return alive;
      });

      // Draw bubbles on top of horizontal tube
      // Only skip bubbles that are in the "toHydrant" phase and above the hydrant (not horizontal phase)
      // Hydrant area: bodyWidth = 38, baseWidth = 45, bodyHeight = 65, domeHeight = 20, grassWidth = 75
      // Total width: ~75px (grass width), height: ~120px (dome + body + base + grass)
      const hydrantAreaWidth = 80;
      const hydrantAreaHeight = 120;
      const hydrantAreaLeft = hydrantX - hydrantAreaWidth / 2;
      const hydrantAreaRight = hydrantX + hydrantAreaWidth / 2;
      const hydrantAreaTop = hydrantBottomY - 30; // dome + ring above base
      const hydrantAreaBottom = hydrantBottomY + 90; // bodyHeight + baseHeight + grassHeight
      
      bubblesRef.current.forEach((bubble) => {
        // Skip bubbles only if they are in "toHydrant" phase and near the hydrant
        // This allows horizontal phase bubbles to be visible as they move through the horizontal pipe
        const isNearHydrant = 
          bubble.x >= hydrantAreaLeft && 
          bubble.x <= hydrantAreaRight && 
          bubble.y >= hydrantAreaTop && 
          bubble.y <= hydrantAreaBottom;
        
        // Only skip if bubble is in toHydrant phase AND near hydrant
        // Horizontal phase bubbles should always be drawn
        if (bubble.phase === "toHydrant" && isNearHydrant) {
          return; // Skip drawing this bubble
        }
        
        bubble.draw(ctx, verticalPipeWidth);
      });

      // Draw joints only when pipes have reached the horizontal tube
      // Show joints when animation progress is high enough (around 0.6)
      if (animationProgress >= 0.6) {
        const jointProgress = Math.max(0, Math.min(1, (animationProgress - 0.6) / 0.4));
        if (jointProgress > 0) {
          pipePositions.forEach((pipe, index) => {
            const delay = index * 0.05;
            const jointOpacity = Math.max(0, Math.min(1, (jointProgress - delay) / (1 - delay)));
            if (jointOpacity > 0) {
              ctx.save();
              ctx.globalAlpha = easeOutCubic(jointOpacity);
              drawJoint(pipe.x, mainTubeY, mainTubeHeight, verticalPipeWidth, false);
              ctx.restore();
            }
          });

          // Hydrant joint
          const hydrantJointOpacity = Math.max(0, Math.min(1, (jointProgress - 0.2) / 0.8));
          if (hydrantJointOpacity > 0) {
            ctx.save();
            ctx.globalAlpha = easeOutCubic(hydrantJointOpacity);
            drawJoint(hydrantX, mainTubeY, mainTubeHeight, verticalPipeWidth, true);
            ctx.restore();
          }
        }
      }

      // Draw hydrant from the beginning (no animation)
      drawFireHydrant(hydrantX, hydrantBottomY, hydrantPulseRef.current);

      if (!bubblesReachingHydrant) {
        if (isWaterFlowingRef.current) {
          waterDropsRef.current = [];
        }
        isWaterFlowingRef.current = false;
      } else {
        isWaterFlowingRef.current = true;
      }
    }

    // Easing function for smooth animation
    function easeOutCubic(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate() {
      // Update animation progress
      if (animationStartTimeRef.current === null) {
        animationStartTimeRef.current = Date.now();
      }
      
      const animationDuration = 2000; // 2 seconds (slower animation)
      const elapsed = Date.now() - animationStartTimeRef.current;
      let progress = Math.min(elapsed / animationDuration, 1);
      
      // Apply easing
      animationProgressRef.current = easeOutCubic(progress);

      // Clear only the area where tubes, bubbles, water drops, and hydrant are drawn
      // We need to clear from sky area (for water drops) to bottom
      const skyHeight = canvas.height / 3;
      const clearStartY = skyHeight - 100; // Start clearing from above hydrant area
      ctx.clearRect(0, clearStartY, canvas.width, canvas.height - clearStartY);

      drawTube();

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      bubblesRef.current = [];
      waterDropsRef.current = [];
      grassBladesRef.current = [];
      isWaterFlowingRef.current = false;
      hydrantPulseRef.current = 0;
    };

    updateCanvasSize();
    animate();

    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [topPosition, hoveredColumn]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[150]"
      style={{ 
        display: "block",
        opacity: hoveredColumn === "Δικαιολογητικά" ? 0 : 1,
        transition: "opacity 0.3s ease"
      }}
    />
  );
}
