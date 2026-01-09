import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronRight, Droplets, Waves, FileText } from "lucide-react";
import { useState } from "react";
import ydreyshImage from "@/assets/YDREYSH.webp";
import apoxetefshImage from "@/assets/APOXETEFSH.webp";
import dikaiologhtikaImage from "@/assets/DIKAIOLOGHTIKA.webp";
import { Tube } from "@/components/Tube";
import { Background } from "@/components/Background";

const services = [
  {
    icon: Droplets,
    title: "Ύδρευση",
    description: "Υπηρεσίες παροχής πόσιμου νερού, σύνδεσης, και συντήρησης δικτύου.",
    href: "/services/water",
    bgColor: "bg-white",
    textColor: "text-foreground",
    number: "01",
    hoverImage: ydreyshImage,
  },
  {
    icon: Waves,
    title: "Αποχέτευση",
    description: "Συλλογή και επεξεργασία λυμάτων, σύνδεση αποχέτευσης.",
    href: "/services/sewerage",
    bgColor: "bg-white",
    textColor: "text-foreground",
    number: "02",
    hoverImage: apoxetefshImage,
  },
  {
    icon: FileText,
    title: "Δικαιολογητικά",
    description: "Έντυπα αιτήσεων και απαιτούμενα δικαιολογητικά.",
    href: "/services/documents",
    bgColor: "bg-white",
    textColor: "text-foreground",
    number: "03",
    hoverImage: dikaiologhtikaImage,
  },
];

export default function Services() {
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  // Check if mouse is below asphalt (in dirt section)
  const isBelowAsphalt = (clientY: number) => {
    const asphaltEnd = (window.innerHeight / 3) + 20; // sky height (33.333vh) + asphalt height (20px)
    return clientY > asphaltEnd;
  };

  const handleMouseEnter = (serviceTitle: string, event: React.MouseEvent) => {
    // Only allow hover if mouse is below asphalt
    if (isBelowAsphalt(event.clientY)) {
      setHoveredColumn(serviceTitle);
    } else {
      // Explicitly clear hover if mouse is above asphalt
      setHoveredColumn(null);
    }
  };

  const handleMouseMove = (serviceTitle: string, event: React.MouseEvent) => {
    // Only allow hover if mouse is below asphalt
    if (isBelowAsphalt(event.clientY)) {
      if (hoveredColumn !== serviceTitle) {
        setHoveredColumn(serviceTitle);
      }
    } else {
      // Explicitly clear hover if mouse is above asphalt
      if (hoveredColumn === serviceTitle) {
        setHoveredColumn(null);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredColumn(null);
  };

  return (
    <Layout>
      {/* Background - sky, asphalt, soil */}
      <Background />
      
      
      {/* Columns - fixed from top, behind header */}
      <div 
        className="fixed inset-0 grid grid-cols-1 md:grid-cols-3 gap-0" 
        style={{ zIndex: hoveredColumn ? 100 : 0 }}
      >
        {services.map((service) => (
          <div
            key={service.title}
            className={`relative ${hoveredColumn === service.title ? 'column-hovered' : ''}`}
            style={{
              zIndex: hoveredColumn === service.title 
                ? (service.title === "Δικαιολογητικά" ? 151 : 100) 
                : 0,
            }}
            onMouseEnter={(e) => handleMouseEnter(service.title, e)}
            onMouseMove={(e) => handleMouseMove(service.title, e)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to={service.href}
              className={`${service.textColor} flex flex-col min-h-full relative overflow-hidden`}
              style={{
                cursor: hoveredColumn === service.title ? 'pointer' : 'default',
              }}
              onClick={(e) => {
                if (!isBelowAsphalt(e.clientY)) {
                  e.preventDefault();
                }
              }}
            >
            {/* Hover background image */}
            {service.hoverImage && (
              <div
                className={`absolute inset-0 z-0 transition-opacity duration-300 ${
                  hoveredColumn === service.title ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  backgroundImage: `url(${service.hoverImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}
            
            {/* Large number background */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20 font-thin text-[200px] md:text-[300px] leading-none select-none pointer-events-none z-0"
              style={{
                maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
              }}
            >
              {service.number}
            </div>
            
            {/* Gradient overlay - only on hover */}
            <div 
              className={`absolute inset-0 transition-opacity duration-300 z-[5] pointer-events-none ${
                hoveredColumn === service.title ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 30%, transparent 70%)',
              }}
            />
            
            {/* Dimming overlay for non-hovered columns when any column is hovered */}
            <div 
              className={`absolute inset-0 transition-opacity duration-300 z-[6] pointer-events-none ${
                hoveredColumn && hoveredColumn !== service.title ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
              }}
            />
            
            {/* Overlay to block hover in sky/asphalt section */}
            <div 
              className="absolute top-0 left-0 right-0 z-[20] pointer-events-auto"
              style={{
                height: `${(window.innerHeight / 3) + 20}px`,
              }}
              onMouseEnter={() => setHoveredColumn(null)}
            />
            
            <div className={`flex-1 flex flex-col items-center justify-center p-8 md:p-12 relative z-10 transition-all duration-300 ease-out ${
              hoveredColumn === service.title ? '-translate-y-8' : ''
            } ${
              hoveredColumn && hoveredColumn !== service.title ? 'opacity-40' : 'opacity-100'
            }`}>
              <div className="flex items-center justify-center mb-6 relative z-10">
                <service.icon className={`h-8 w-8 text-white drop-shadow-lg transition-all ${
                  hoveredColumn === service.title ? 'drop-shadow-xl' : ''
                }`} />
              </div>
              <h3 className={`font-semibold text-xl md:text-2xl mb-4 text-center text-white drop-shadow-lg transition-all relative z-10 ${
                hoveredColumn === service.title ? 'drop-shadow-xl' : ''
              }`}>
                {service.title}
              </h3>
              <p className={`text-white/90 text-base mb-6 text-center max-w-xs drop-shadow-md transition-all relative z-10 font-medium ${
                hoveredColumn === service.title ? 'drop-shadow-lg' : ''
              }`}>
                {service.description}
              </p>
              <span className={`inline-flex items-center text-blue-400 font-semibold drop-shadow-lg transition-all relative z-10 ${
                hoveredColumn === service.title ? 'text-blue-300 drop-shadow-xl cursor-pointer' : 'cursor-default'
              }`}>
                Περισσότερα <ChevronRight className="h-4 w-4 ml-1" />
              </span>
            </div>
          </Link>
          </div>
        ))}
      </div>
      
      {/* Pipe/Tube element - spans full width */}
      <Tube topPosition="70" hoveredColumn={hoveredColumn} />
      
      {/* Title section - positioned above asphalt */}
      <div 
        className="fixed z-[1] pointer-events-none"
        style={{
          top: 'calc(33.333vh - 120px)',
          left: 0,
          width: '100%',
        }}
      >
        <div className="w-full px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pointer-events-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white drop-shadow-lg animate-slide-in-left">
            Υπηρεσίες που παρέχουμε
          </h1>
        </div>
      </div>
    </Layout>
  );
}
