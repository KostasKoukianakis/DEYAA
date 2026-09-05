import { useEffect, useState } from "react";
import { usePersistentHomeShaderSlot } from "@/components/PersistentHomeShader";

const PHONE_MAX_WIDTH = 767;

function isPhoneViewport() {
  if (typeof window === "undefined") return true;
  return window.matchMedia(`(max-width: ${PHONE_MAX_WIDTH}px)`).matches;
}

/** Full-viewport water wash for utility pages (privacy, verify, 404). */
export function PageShaderBackdrop() {
  const [phone, setPhone] = useState(isPhoneViewport);
  const slotRef = usePersistentHomeShaderSlot(!phone);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${PHONE_MAX_WIDTH}px)`);
    const onChange = () => setPhone(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="page-shader-backdrop" aria-hidden>
      <div className="hero-shader-static" />
      {!phone ? <div ref={slotRef} className="hero-shader-persist-slot" /> : null}
    </div>
  );
}
