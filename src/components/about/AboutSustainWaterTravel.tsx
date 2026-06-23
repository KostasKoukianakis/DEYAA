import { useEffect, useRef } from "react";
import { useAboutSustainWaterTravel } from "@/hooks/useAboutSustainWaterTravel";

const SUSTAIN_WATER_SRC = "/hero/sustain_water.webp";

/** Fixed droplet that travels from timeline pipe exit → mission hub center */
export function AboutSustainWaterTravel() {
  const travelRef = useRef<HTMLDivElement>(null);

  useAboutSustainWaterTravel({ travelRef });

  useEffect(() => {
    const img = new Image();
    img.src = SUSTAIN_WATER_SRC;
  }, []);

  return (
    <div ref={travelRef} className="about-sustain-water-travel" aria-hidden>
      <img
        src={SUSTAIN_WATER_SRC}
        alt=""
        className="about-sustain-water-travel__image"
        decoding="sync"
        fetchPriority="high"
        draggable={false}
      />
    </div>
  );
}
