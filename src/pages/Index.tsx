import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  Gauge, 
  Droplets, 
  Waves,
  AlertCircle,
  FileText,
  ChevronRight,
  Calendar
} from "lucide-react";
import ydreyshImage from "@/assets/YDREYSH.webp";
import apoxetefshImage from "@/assets/APOXETEFSH.webp";
import dikaiologhtikaImage from "@/assets/DIKAIOLOGHTIKA.webp";
import { HeroSection } from "@/components/HeroSection";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { BentoGrid } from "@/components/BentoGrid";
import { MicroInteractionIcon } from "@/components/MicroInteractionIcon";
import { ScrollReveal } from "@/components/ScrollReveal";
import paymentsBg from "@/pages/images/payments.png";
import metritisBg from "@/pages/images/Metrhths.png";
import nowaterBg from "@/pages/images/nowater.png";
import lhpsharxeioyBg from "@/pages/images/lhpsharxeioy.png";
import pipesleftSvg from "@/pages/images/pipesleft.svg";
import pipesrightSvg from "@/pages/images/pipesright.svg";
import pipescustomWaterSvg from "@/pages/images/pipescustom_water.svg";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useEffect, useState } from "react";

const announcements = [
  {
    id: 1,
    title: "Διακοπή υδροδότησης στην περιοχή Κέντρου",
    date: "2024-01-15",
    category: "Διακοπές",
    excerpt: "Λόγω εργασιών συντήρησης, θα υπάρξει διακοπή υδροδότησης την Τετάρτη 17/01 από τις 08:00 έως τις 14:00.",
  },
  {
    id: 2,
    title: "Νέα ηλεκτρονική υπηρεσία δήλωσης ένδειξης",
    date: "2024-01-10",
    category: "Ενημέρωση",
    excerpt: "Πλέον μπορείτε να δηλώνετε την ένδειξη του μετρητή σας ηλεκτρονικά μέσω της ιστοσελίδας μας.",
  },
  {
    id: 3,
    title: "Συμβουλές εξοικονόμησης νερού",
    date: "2024-01-05",
    category: "Δελτίο Τύπου",
    excerpt: "Απλοί τρόποι για να μειώσετε την κατανάλωση νερού στο σπίτι σας και να προστατεύσετε το περιβάλλον.",
  },
];

const quickLinks = [
  {
    title: "Πληρωμή Λογαριασμού",
    description: "Εξοφλήστε τον λογαριασμό σας online με ασφάλεια και ευκολία",
    icon: CreditCard,
    href: "/e-services/payment",
    size: "medium" as const,
    backgroundImage: paymentsBg,
  },
  {
    title: "Δήλωση Ένδειξης",
    description: "Καταχωρήστε την ένδειξη του μετρητή γρήγορα και απλά",
    icon: Gauge,
    href: "/e-services/meter-reading",
    size: "medium" as const,
    backgroundImage: metritisBg,
  },
  {
    title: "Διακοπές Νερού",
    description: "Ενημερωθείτε για προγραμματισμένες διακοπές",
    icon: AlertCircle,
    href: "/announcements",
    size: "medium" as const,
    backgroundImage: nowaterBg,
  },
  {
    title: "Δικαιολογητικά",
    description: "Κατεβάστε έντυπα και αιτήσεις",
    icon: FileText,
    href: "/services/documents",
    size: "medium" as const,
    backgroundImage: lhpsharxeioyBg,
  },
];

// pipescustom_water.svg: το νερό ξεκινά στο y=1442 σε ύψος 6709 → κενό πάνω ~21.5%
const WATER_TOP_FRACTION = 1442 / 6709;

export default function Index() {
  const scrollProgress = useScrollProgress();
  const waterReveal = Math.min(1, scrollProgress);
  // Αποκάλυψη μόνο στην περιοχή όπου υπάρχει νερό (από WATER_TOP_FRACTION μέχρι κάτω)
  const clipTop = WATER_TOP_FRACTION * 100;
  const clipBottom = (1 - WATER_TOP_FRACTION) * (1 - waterReveal) * 100;
  
  // Animation state for pipes
  const [pipesVisible, setPipesVisible] = useState(false);
  const [pipesRightOffset, setPipesRightOffset] = useState(-100);
  const [pipesLeftOffset, setPipesLeftOffset] = useState(-100);

  useEffect(() => {
    // Trigger animations on mount
    const timer1 = setTimeout(() => {
      setPipesVisible(true);
      setPipesRightOffset(0);
    }, 300);
    
    const timer2 = setTimeout(() => {
      setPipesLeftOffset(0);
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <>
      {/* Fixed aurora behind navbar so hero background shows through transparent header */}
      <div className="fixed inset-0 z-[1] pointer-events-none min-h-screen" aria-hidden>
        <AuroraBackground className="min-h-screen" showRadialGradient={true}>
          <div />
        </AuroraBackground>
      </div>
      {/* UI: ποσοστό scroll & ποσοστό εμφάνισης νερού */}
      <div
        className="fixed bottom-4 right-4 z-[100] rounded-lg bg-black/80 text-white px-4 py-3 text-sm font-mono shadow-lg"
        aria-live="polite"
      >
        <div className="space-y-1">
          <div>Scroll: <strong>{Math.round(scrollProgress * 100)}%</strong></div>
          <div>Νερό (εμφάνιση): <strong>{Math.round(waterReveal * 100)}%</strong></div>
        </div>
      </div>

      <Layout>
        {/* Pipes background - covers entire page, behind all content with parallax */}
        <div className="absolute inset-0 pointer-events-none overflow-visible" aria-hidden style={{ zIndex: 10 }}>
        <div className="relative w-full">
          {/* Right pipes - slide in from left */}
          <img 
            src={pipesrightSvg} 
            alt="" 
            className="absolute top-0 left-0 block w-full h-auto transition-all duration-1000 ease-out"
            style={{
              opacity: pipesVisible ? 1 : 0,
              transform: `translateX(${pipesRightOffset}px)`,
              zIndex: 1,
            }}
          />
          {/* Left pipes - slide in from left */}
          <img 
            src={pipesleftSvg} 
            alt="" 
            className="relative block w-full h-auto transition-all duration-1000 ease-out"
            style={{
              opacity: pipesVisible ? 1 : 0,
              transform: `translateX(${pipesLeftOffset}px)`,
              zIndex: 2,
            }}
          />
          {/* Water animation - reveal with scroll */}
          <div
            className="absolute top-0 left-0 w-full transition-[clip-path] duration-150 ease-out"
            style={{
              clipPath: `inset(${clipTop}% 0 ${clipBottom}% 0)`,
              WebkitClipPath: `inset(${clipTop}% 0 ${clipBottom}% 0)`,
              opacity: pipesVisible ? 1 : 0,
              transition: 'opacity 1s ease-out 0.7s',
              zIndex: 3,
            }}
          >
            <img src={pipescustomWaterSvg} alt="" className="block w-full h-auto" />
          </div>
        </div>
        </div>
        {/* Modern Hero Section with Fluid Animation */}
        <HeroSection />

      {/* Bento Grid Quick Links Section - background ends with wavy shape */}
      <section className="relative overflow-visible z-[50]">
        {/* SVG clipPath for wavy bottom edge (objectBoundingBox: 0–1) */}
        <svg width="0" height="0" className="absolute" aria-hidden>
          <defs>
            <clipPath id="quick-access-wavy-bottom" clipPathUnits="objectBoundingBox">
              {/* From your design: cubic Bezier – cp1 (0.6, 0.65) peak, cp2 (0.25, 1.05) dip, end (0, 0.88) */}
              <path d="M 0 0 L 1 0 L 1 0.82 C 0.6 0.65 0.25 1.05 0 0.88 Z" />
            </clipPath>
          </defs>
        </svg>
        <div
          className="relative pb-[min(26vw,180px)] pt-12 md:pt-16 z-[50]"
          style={{ clipPath: "url(#quick-access-wavy-bottom)" }}
        >
          {/* Background gradient - behind pipes */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(195,80%,97%)]/30 to-[hsl(195,60%,94%)]/50 pointer-events-none" style={{ zIndex: 0 }}></div>
          <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-[50] pb-24 md:pb-32">
            <ScrollReveal direction="up" delay={200}>
              <div className="mb-12 md:mb-16 text-center px-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 tracking-[-0.02em] leading-[0.95]">
                  <span className="bg-gradient-to-r from-[#2161ab] via-[#004aad] to-[#2161ab] bg-clip-text text-transparent drop-shadow-sm">
                    Γρήγορη Πρόσβαση
                  </span>
                </h2>
                <p className="text-muted-foreground text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                  Οι πιο δημοφιλείς υπηρεσίες μας σε ένα κλικ
                </p>
              </div>
              <BentoGrid cards={quickLinks} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="mt-8 md:mt-12 py-12 md:py-16 relative z-[50]">
        <div className="container relative z-[50]">
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-12">
              <div className="flex items-start justify-between gap-6 mb-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-3 mb-3">
                    <div className="w-8 h-0.5 bg-[#2161ab]"></div>
                    <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
                      Νέα & Ενημερώσεις
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800">
                    Ανακοινώσεις
                  </h2>
                </div>
                <Button asChild variant="outline" size="sm" className="group shrink-0">
                  <Link to="/announcements">
                    Όλες οι ανακοινώσεις
                    <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.map((announcement, index) => (
              <ScrollReveal key={announcement.id} direction="up" delay={index * 100}>
                <Card className="card-hover group">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 group-hover:text-accent transition-colors" />
                      <span>{new Date(announcement.date).toLocaleDateString('el-GR')}</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                        {announcement.category}
                      </span>
                    </div>
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                      {announcement.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3">{announcement.excerpt}</CardDescription>
                    <Link 
                      to={`/announcements/${announcement.id}`} 
                      className="inline-flex items-center text-sm text-primary mt-4 link-underline group/link"
                    >
                      Περισσότερα
                      <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="mt-8 md:mt-12 py-12 md:py-16 relative overflow-visible">
        <div className="container relative z-[50]">
          <ScrollReveal direction="up" delay={100}>
            <div className="text-center mb-16 md:mb-24 px-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-8 tracking-[-0.02em] leading-[0.95]">
                <span className="bg-gradient-to-r from-[#2161ab] via-[#004aad] to-[#2161ab] bg-clip-text text-transparent drop-shadow-sm">
                  Οι Υπηρεσίες μας
                </span>
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl lg:text-2xl mt-6 max-w-3xl mx-auto leading-relaxed font-light">
                Η ΔΕΥΑΑ παρέχει ολοκληρωμένες υπηρεσίες ύδρευσης και αποχέτευσης
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Μεγαλύτερο box - Ύδρευση */}
            <ScrollReveal direction="up" delay={200}>
              <Link 
                to="/services/water"
                className="group relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 block isolate"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 rounded-2xl"
                  style={{ 
                    backgroundImage: `url(${ydreyshImage})`,
                    transformOrigin: 'center center',
                    willChange: 'transform'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 transition-all duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-10 text-white z-10">
                  <div className="mb-4">
                    <MicroInteractionIcon icon={Droplets} variant="droplet" className="h-16 w-16 text-white mb-4 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-3 group-hover:text-blue-300 transition-colors">
                    Ύδρευση
                  </h3>
                  <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl leading-relaxed">
                    Παροχή καθαρού πόσιμου νερού υψηλής ποιότητας σε όλα τα νοικοκυριά και επιχειρήσεις της περιοχής μας.
                  </p>
                  <div className="flex items-center text-white/90 group-hover:text-white font-medium">
                    <span>Μάθετε περισσότερα</span>
                    <ChevronRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Column με τα δύο μικρότερα boxes */}
            <div className="flex flex-col gap-6">
              {/* Μικρότερο box - Αποχέτευση */}
              <ScrollReveal direction="up" delay={300}>
                <Link 
                  to="/services/sewerage"
                  className="group relative h-[240px] md:h-[290px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 block isolate"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 rounded-2xl"
                    style={{ 
                      backgroundImage: `url(${apoxetefshImage})`,
                      transformOrigin: 'center center',
                      willChange: 'transform'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover:from-black/70 transition-all duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                    <div className="mb-3">
                      <MicroInteractionIcon icon={Waves} variant="wave" className="h-12 w-12 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-300 transition-colors">
                      Αποχέτευση
                    </h3>
                    <p className="text-sm text-white/90 mb-4 line-clamp-2">
                      Συλλογή και επεξεργασία λυμάτων με σύγχρονες μεθόδους.
                    </p>
                    <div className="flex items-center text-white/90 group-hover:text-white text-sm font-medium">
                      <span>Μάθετε περισσότερα</span>
                      <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>

              {/* Μικρότερο box - Δικαιολογητικά */}
              <ScrollReveal direction="up" delay={400}>
                <Link 
                  to="/services/documents"
                  className="group relative h-[240px] md:h-[290px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 block isolate"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 rounded-2xl"
                    style={{ 
                      backgroundImage: `url(${dikaiologhtikaImage})`,
                      transformOrigin: 'center center',
                      willChange: 'transform'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover:from-black/70 transition-all duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                    <div className="mb-3">
                      <MicroInteractionIcon icon={FileText} variant="default" className="h-12 w-12 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-300 transition-colors">
                      Δικαιολογητικά
                    </h3>
                    <p className="text-sm text-white/90 mb-4 line-clamp-2">
                      Έντυπα αιτήσεων και απαιτούμενα δικαιολογητικά για τις υπηρεσίες της ΔΕΥΑΑ.
                    </p>
                    <div className="flex items-center text-white/90 group-hover:text-white text-sm font-medium">
                      <span>Μάθετε περισσότερα</span>
                      <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
      </Layout>
    </>
  );
}
