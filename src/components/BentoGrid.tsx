import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LucideIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BentoCard {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  className?: string;
  size?: "small" | "medium" | "large";
  /** Optional background image URL; placed at right bottom of the card */
  backgroundImage?: string;
}

interface BentoGridProps {
  cards: BentoCard[];
}

export function BentoGrid({ cards }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr md:auto-rows-[minmax(200px,1fr)] relative z-[50]">
      {cards.map((card, index) => {
        const sizeClasses = {
          small: "md:col-span-1 md:row-span-1",
          medium: "md:col-span-1 md:row-span-2",
          large: "md:col-span-2 md:row-span-2",
        };

        // Default size when card.size is not set. Use "medium" for all so grid height stays consistent
        // (a single "small" card would shrink row height and make all cards look short).
        const getSize = (): "small" | "medium" | "large" => "medium";

        const cardSize = card.size ?? getSize();

        return (
          <Link
            key={card.title}
            to={card.href}
            className={cn(
              "group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50/50",
              "border border-gray-200/60 shadow-sm hover:shadow-2xl",
              "transition-all duration-500 hover:-translate-y-2",
              "backdrop-blur-sm hover:border-accent/30",
              sizeClasses[cardSize],
              card.className
            )}
          >
            {/* Optional background image at right bottom */}
            {card.backgroundImage && (
              <div
                className="absolute right-0 bottom-0 w-full h-full bg-no-repeat bg-[length:auto_55%] md:bg-[length:auto_60%] pointer-events-none opacity-50"
                style={{ backgroundImage: `url(${card.backgroundImage})`, backgroundPosition: 'right 0 bottom -10px' }}
                aria-hidden
              />
            )}
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
            
            {/* Content */}
            <div className="relative h-full p-6 md:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Icon with micro-interaction */}
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary shadow-sm group-hover:bg-accent/10 group-hover:text-accent transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <card.icon className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Arrow indicator – backdrop + shadow so it stays readable over background images */}
              <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="inline-flex items-center gap-2 rounded-md bg-white/85 px-2 py-1.5 text-sm font-medium text-primary shadow-[0_0_8px_rgba(255,255,255,0.9),0_1px_3px_rgba(0,0,0,0.12)] backdrop-blur-sm">
                  Μάθετε περισσότερα
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>

            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
        );
      })}
    </div>
  );
}
