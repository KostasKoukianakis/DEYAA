import { useEffect, useRef } from "react";
import dirtImage from "@/assets/Dirt.svg";
import skyImage from "@/assets/sky.webp";

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load images
    const dirtTexture = new Image();
    dirtTexture.src = dirtImage;
    
    const skyTexture = new Image();
    skyTexture.src = skyImage;

    // Set canvas to full window size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawBackground();
    };

    function drawBackground() {
      if (!ctx || !canvas) return;

      const skyHeight = canvas.height / 3;
      const asphaltHeight = 20;
      const groundStart = skyHeight;

      // Draw sky using sky.webp image
      if (skyTexture.complete && skyTexture.naturalWidth > 0) {
        // Draw sky image to cover the sky area
        ctx.drawImage(
          skyTexture,
          0,
          0,
          canvas.width,
          skyHeight
        );
      } else {
        // Fallback gradient if image not loaded yet
        const skyGradient = ctx.createLinearGradient(0, 0, 0, skyHeight);
        skyGradient.addColorStop(0, "#1e5a8e");
        skyGradient.addColorStop(0.3, "#2b7ab5");
        skyGradient.addColorStop(0.6, "#4a9fd1");
        skyGradient.addColorStop(0.85, "#7cb8db");
        skyGradient.addColorStop(1, "#a8d5e8");
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, skyHeight);
      }

      // Draw realistic asphalt layer with depth
      const asphaltStart = groundStart;

      // Asphalt top edge highlight (sunlit)
      const topHighlight = ctx.createLinearGradient(0, asphaltStart - 2, 0, asphaltStart + 2);
      topHighlight.addColorStop(0, "rgba(100, 100, 100, 0.3)");
      topHighlight.addColorStop(1, "rgba(50, 50, 50, 0)");
      ctx.fillStyle = topHighlight;
      ctx.fillRect(0, asphaltStart - 2, canvas.width, 4);

      // Main asphalt with realistic gradient
      const asphaltGradient = ctx.createLinearGradient(0, asphaltStart, 0, asphaltStart + asphaltHeight);
      asphaltGradient.addColorStop(0, "#5a5a5a");
      asphaltGradient.addColorStop(0.2, "#4a4a4a");
      asphaltGradient.addColorStop(0.5, "#3a3a3a");
      asphaltGradient.addColorStop(0.8, "#2a2a2a");
      asphaltGradient.addColorStop(1, "#1a1a1a");

      ctx.fillStyle = asphaltGradient;
      ctx.fillRect(0, asphaltStart, canvas.width, asphaltHeight);

      // Add realistic asphalt texture with varied stones
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * canvas.width;
        const y = asphaltStart + Math.random() * asphaltHeight;
        const size = Math.random() * 2 + 0.5;
        const brightness = Math.random() * 60 + 40;
        ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${Math.random() * 0.4 + 0.2})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Add asphalt cracks for realism
      ctx.strokeStyle = "rgba(20, 20, 20, 0.6)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const startX = Math.random() * canvas.width;
        const startY = asphaltStart + Math.random() * asphaltHeight;
        ctx.moveTo(startX, startY);
        let currentX = startX;
        let currentY = startY;
        for (let j = 0; j < 5; j++) {
          currentX += (Math.random() - 0.5) * 40;
          currentY += (Math.random() - 0.5) * 10;
          ctx.lineTo(currentX, currentY);
        }
        ctx.stroke();
      }

      // Draw ground/soil using Dirt.svg (fit to width, no repeat)
      const soilStart = asphaltStart + asphaltHeight;

      // Draw dirt image if loaded (fit to width, draw only once)
      if (dirtTexture.complete && dirtTexture.naturalWidth > 0) {
        const soilWidth = canvas.width;
        
        // Fit to width to cover entire width
        const imageAspect = dirtTexture.naturalWidth / dirtTexture.naturalHeight;
        const drawWidth = soilWidth;
        const drawHeight = drawWidth / imageAspect;
        
        // Draw the image only once, fit to width
        ctx.drawImage(
          dirtTexture,
          0,
          soilStart,
          drawWidth,
          drawHeight
        );
      } else {
        // Fallback color if image not loaded yet
        ctx.fillStyle = "#5a3a25";
        ctx.fillRect(0, soilStart, canvas.width, canvas.height - soilStart);
      }
    }

    // Wait for images to load before drawing
    const loadAndDraw = () => {
      let imagesLoaded = 0;
      const totalImages = 2;
      
      const checkAndDraw = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
          updateCanvasSize();
          drawBackground();
        }
      };
      
      if (dirtTexture.complete) {
        checkAndDraw();
      } else {
        dirtTexture.onload = checkAndDraw;
      }
      
      if (skyTexture.complete) {
        checkAndDraw();
      } else {
        skyTexture.onload = checkAndDraw;
      }
    };

    loadAndDraw();

    // Redraw on window resize
    window.addEventListener("resize", updateCanvasSize);
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10"
      style={{ display: "block" }}
    />
  );
}

