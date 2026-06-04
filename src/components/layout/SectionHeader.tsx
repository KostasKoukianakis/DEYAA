import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  variant?: "default" | "onGradient";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  variant = "default",
  className,
}: SectionHeaderProps) {
  const onGradient = variant === "onGradient";

  return (
    <div
      className={cn(
        "mb-10 md:mb-14",
        align === "center" && "text-center",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-3 flex items-center gap-3",
            align === "center" && "justify-center"
          )}
        >
          <div
            className={cn("h-px w-8", onGradient ? "bg-white/50" : "bg-accent")}
          />
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-widest",
              onGradient ? "text-white/80" : "text-muted-foreground"
            )}
          >
            {eyebrow}
          </span>
          <div
            className={cn("h-px w-8", onGradient ? "bg-white/50" : "bg-accent")}
          />
        </div>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl",
          onGradient ? "text-white drop-shadow-sm" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-relaxed md:text-lg",
            align === "center" && "mx-auto",
            onGradient ? "text-white/85" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
