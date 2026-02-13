import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicroInteractionIconProps {
  icon: LucideIcon;
  className?: string;
  variant?: "droplet" | "wave" | "default";
}

export function MicroInteractionIcon({ 
  icon: Icon, 
  className,
  variant = "default" 
}: MicroInteractionIconProps) {
  const variantAnimations = {
    droplet: "group-hover:animate-bounce group-hover:scale-110",
    wave: "group-hover:animate-wave group-hover:scale-110",
    default: "group-hover:scale-110 group-hover:rotate-3",
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center transition-all duration-300", className)}>
      <Icon className={cn(
        "transition-all duration-300",
        variantAnimations[variant]
      )} />
      
      {/* Animated background circle on hover */}
      <div className="absolute inset-0 rounded-full bg-accent/20 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />
    </div>
  );
}
