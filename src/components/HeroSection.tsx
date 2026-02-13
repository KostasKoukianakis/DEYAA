import { ReactNode } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import backgroundHeroSvg from "@/pages/images/background_hero.svg?raw";

interface HeroSectionProps {
  children?: ReactNode;
}

export function HeroSection({ children }: HeroSectionProps) {
  return (
    <section className="relative z-[40] -mt-[7.5rem] pt-[7.5rem] overflow-visible min-h-screen">
      <AuroraBackground className="min-h-screen w-full relative z-0">
        {/* Background hero: inline SVG με vector paths + staggered reveal animation */}
        <div
          className="absolute inset-0 z-0 overflow-hidden"
          aria-hidden
        >
          <div
            className="absolute inset-0 [&_svg]:w-full [&_svg]:h-full [&_svg]:object-cover [&_svg]:object-center"
            dangerouslySetInnerHTML={{
              __html: backgroundHeroSvg.replace(
                '<svg ',
                '<svg preserveAspectRatio="xMidYMid slice" '
              ),
            }}
          />
        </div>
        {/* Content - κείμενο αριστερά, πιο πάνω σε μεγάλες οθόνες */}
        <div className="absolute left-0 right-0 top-[calc(38vh-4rem)] lg:top-[calc(35vh-4rem)] -translate-y-1/2" style={{ zIndex: 100 }}>
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0.0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="max-w-4xl pl-4 md:pl-6 lg:pl-8 xl:pl-12 2xl:pl-16 space-y-6 md:space-y-8"
            >
              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-tight">
                  <span className="block whitespace-nowrap text-primary">Δημοτική Επιχείρηση</span>
                  <span className="block whitespace-nowrap" style={{ color: "#2161ab" }}>Ύδρευσης Αποχέτευσης</span>
                  <span className="block whitespace-nowrap text-primary">Αποκορώνου</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                  Παροχή υψηλής ποιότητας υπηρεσιών νερού και αποχέτευσης στους πολίτες του Αποκόρωνα. 
                  Σύγχρονες λύσεις για ένα καθαρό μέλλον.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="group">
                    <Link to="/e-services">
                      Ηλεκτρονικές Υπηρεσίες
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/announcements">
                      Μάθετε περισσότερα
                    </Link>
                  </Button>
                </div>
              </div>
              
              {children}
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-foreground/50 rounded-full animate-pulse" />
          </div>
        </div>
      </AuroraBackground>
    </section>
  );
}
