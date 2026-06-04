import { ReactNode } from "react";
import { HeroWaterRipple } from "@/components/HeroWaterRipple";

interface HeroSectionProps {
  children?: ReactNode;
}

/** Visual hero backdrop for the transparent navbar — no visible copy. */
export function HeroSection({ children }: HeroSectionProps) {
  return (
    <section
      className="relative min-h-svh overflow-hidden"
      aria-label="Κύρια εικόνα"
    >
      <HeroWaterRipple />

      <h1 className="sr-only">ΔΕΥΑΑ — Ύδρευση & Αποχέτευση Αποκόρωνα</h1>

      {children}

      <div
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 motion-safe:animate-bounce"
        aria-hidden
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/40 p-2">
          <div className="h-2 w-1 rounded-full bg-white/70" />
        </div>
      </div>
    </section>
  );
}
