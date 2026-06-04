import { useRef } from "react";
import { Link } from "react-router-dom";
import { LucideIcon, ChevronRight } from "lucide-react";
import { HeroWaterRipple } from "@/components/HeroWaterRipple";
import { HeroLakeBrandTitle } from "@/components/HeroLakeBrandTitle";
import { HeroExpandingPipe } from "@/components/HeroExpandingPipe";
import { PalladioGradientLayer } from "@/components/PalladioGradientLayer";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  usePalladioHorizontalScroll,
  usePalladioSectionHeights,
} from "@/hooks/usePalladioHorizontalScroll";

const HERO_BG = "/hero/gradiente_sfondo_1.jpg";
const SECTION2_BG = "/hero/gradiente-sfondo_2.jpg";

interface QuickLink {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  backgroundImage?: string;
}

interface PalladioScrollPanelsProps {
  quickLinks: QuickLink[];
}

function ScrollHint() {
  return (
    <div
      className="pointer-events-none absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-center"
      aria-hidden
    >
      <p className="mb-4 font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-white/55">
        [ Κύλιση προς τα κάτω ]
      </p>
      <div className="mx-auto motion-safe:animate-bounce">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/40 p-2">
          <div className="h-2 w-1 rounded-full bg-white/70" />
        </div>
      </div>
    </div>
  );
}

function QuickAccessCard({ link }: { link: QuickLink }) {
  return (
    <Link
      to={link.href}
      className="group flex min-h-[220px] min-w-[min(85vw,320px)] shrink-0 flex-col justify-between border-r border-white/25 px-8 py-10 md:min-w-[360px] md:px-14 md:py-14 cursor-pointer"
    >
      <div>
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white transition-colors group-hover:bg-white/20">
          <link.icon className="h-6 w-6" />
        </div>
        <h3 className="font-display text-xl font-bold text-white md:text-2xl">{link.title}</h3>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/75">{link.description}</p>
      </div>
      <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-white/90 opacity-0 transition-opacity group-hover:opacity-100">
        Μάθετε περισσότερα
        <ChevronRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

/**
 * Palladio #first block:
 * - Hero: ripple + sfondo_1 | Section 2: CSS gradient only (sfondo_2)
 */
export function PalladioScrollPanels({ quickLinks }: PalladioScrollPanelsProps) {
  const setHeightRef = useRef<HTMLDivElement>(null);
  const readHeightRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const quickAccessSectionRef = useRef<HTMLElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);

  usePalladioSectionHeights(setHeightRef, readHeightRef, [quickLinks]);
  usePalladioHorizontalScroll(quickAccessSectionRef, horizontalScrollRef);

  return (
    <section id="section-01">
      <div ref={setHeightRef} className="relative">
        <div ref={readHeightRef} className="relative w-full overflow-visible">
          <HeroExpandingPipe heroRef={heroRef} />

          {/* Hero — Palladio groupage */}
          <div
            ref={heroRef}
            id="hero"
            className="relative h-svh w-full overflow-visible"
            aria-label="Hero"
          >
            <HeroWaterRipple
              imageUrl={HERO_BG}
              backgroundPosition="bottom center"
              withCssFallback
            />
            <HeroLakeBrandTitle className="absolute bottom-28 left-4 z-20 md:bottom-32 md:left-8" />
            <ScrollHint />
          </div>

          {/* Section 2 — Palladio #data */}
          <section
            ref={quickAccessSectionRef}
            id="section-02"
            className="relative h-svh overflow-hidden"
            aria-label="Γρήγορη πρόσβαση"
          >
            <PalladioGradientLayer
              imageUrl={SECTION2_BG}
              backgroundPosition="top center"
              className="z-0"
            />
            {/* Ripple μόνο στο hero — shared ripple section 2 disabled
            <HeroWaterRipple
              imageUrl={SECTION2_BG}
              backgroundPosition="top center"
              withCssFallback
              useSharedRipple
              globalBoundsRef={readHeightRef}
              rippleSlice={[0.5, 0.5]}
            />
            */}

            <div className="relative z-10 flex h-svh flex-col justify-between pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
              <div className="container px-4 pb-8 pt-16 md:px-8 md:pt-20">
                <div className="mb-6 flex items-center justify-between border-b border-white/20 py-4 md:mb-8">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">
                    Υπηρεσίες
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">
                    [02]
                  </span>
                </div>
                <SectionHeader
                  eyebrow=""
                  title="Γρήγορη Πρόσβαση"
                  description="Οι πιο δημοφιλείς υπηρεσίες μας σε ένα κλικ"
                  variant="onGradient"
                  className="mb-0 md:mb-4"
                />
              </div>

              <div className="border-t border-white/25 pb-16 md:pb-0">
                <div
                  ref={horizontalScrollRef}
                  className="palladio-horizontal-scroll flex flex-col md:flex-row md:flex-nowrap"
                >
                  {quickLinks.map((link) => (
                    <QuickAccessCard key={link.href} link={link} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
