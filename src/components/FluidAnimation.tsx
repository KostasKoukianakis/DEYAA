import { useEffect, useRef, useState } from "react";

interface FluidAnimationProps {
  className?: string;
  blobCount?: number;
}

export function FluidAnimation({ className = "", blobCount = 4 }: FluidAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<HTMLDivElement[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const blobs = blobsRef.current;
    
    // Animate blobs with smooth, organic movement
    const animate = () => {
      blobs.forEach((blob, index) => {
        if (!blob) return;
        
        // More controlled movement - keep blobs within bounds
        const x = -20 + Math.random() * 40; // -20% to 20%
        const y = -20 + Math.random() * 40; // -20% to 20%
        const scale = 0.9 + Math.random() * 0.3; // 0.9 to 1.2
        
        blob.style.transform = `translate(${x}%, ${y}%) scale(${scale})`;
        blob.style.transition = `transform ${10 + index * 2}s cubic-bezier(0.4, 0, 0.2, 1)`;
      });
    };

    // Initial animation after a short delay
    const timeout = setTimeout(() => {
      animate();
    }, 100);
    
    // Animate every 12-15 seconds
    const interval = setInterval(animate, 13000);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} 
      aria-hidden="true"
    >
      {Array.from({ length: blobCount }).map((_, i) => {
        const baseSize = 250 + i * 80;
        const initialX = 15 + (i % 2) * 50;
        const initialY = 20 + Math.floor(i / 2) * 40;
        
        return (
          <div
            key={i}
            ref={(el) => {
              if (el) blobsRef.current[i] = el;
            }}
            className={`absolute rounded-full opacity-0 blur-3xl transition-opacity duration-2000 ${
              isVisible ? 'opacity-20' : ''
            }`}
            style={{
              width: `${baseSize}px`,
              height: `${baseSize}px`,
              background: `radial-gradient(circle, hsl(195 100% 50% / 0.5) 0%, hsl(210 100% 20% / 0.3) 50%, transparent 100%)`,
              left: `${initialX}%`,
              top: `${initialY}%`,
              transform: `translate(0, 0) scale(1)`,
              willChange: 'transform',
            }}
          />
        );
      })}
    </div>
  );
}
