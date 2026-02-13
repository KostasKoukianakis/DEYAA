import { ReactNode } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  children: ReactNode;
  ripple?: boolean;
  glow?: boolean;
}

export function AnimatedButton({
  children,
  className,
  ripple = true,
  glow = false,
  ...props
}: AnimatedButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        "relative overflow-hidden",
        ripple && "group/ripple",
        glow && "shadow-lg shadow-accent/50 hover:shadow-xl hover:shadow-accent/60 transition-shadow",
        className
      )}
    >
      {children}
      {ripple && (
        <span className="absolute inset-0 scale-0 rounded-full bg-white/30 opacity-0 group-hover/ripple:scale-100 group-hover/ripple:opacity-100 group-active/ripple:scale-150 transition-all duration-500" />
      )}
    </Button>
  );
}
