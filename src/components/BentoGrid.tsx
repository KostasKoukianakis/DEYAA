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
  backgroundImage?: string;
}

interface BentoGridProps {
  cards: BentoCard[];
}

export function BentoGrid({ cards }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[minmax(200px,1fr)]">
      {cards.map((card) => (
        <Link
          key={card.title}
          to={card.href}
          className={cn(
            "group relative flex min-h-[200px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-6 md:p-8",
            "shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-lg cursor-pointer",
            card.className
          )}
        >
          {card.backgroundImage && (
            <div
              className="pointer-events-none absolute right-0 bottom-0 h-full w-2/3 bg-contain bg-right-bottom bg-no-repeat opacity-[0.12] transition-opacity duration-300 group-hover:opacity-20"
              style={{ backgroundImage: `url(${card.backgroundImage})` }}
              aria-hidden
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-accent-foreground">
                <card.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {card.description}
              </p>
            </div>

            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              Μάθετε περισσότερα
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
