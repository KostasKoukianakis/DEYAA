import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EServiceGlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "feature" | "alert";
  title?: string;
}

export function EServiceGlassCard({
  children,
  className,
  variant = "default",
  title,
}: EServiceGlassCardProps) {
  if (variant === "feature") {
    return (
      <div className={cn("palladio-eservices__glass palladio-eservices__glass--feature", className)}>
        {children}
      </div>
    );
  }

  if (variant === "alert") {
    return (
      <div className={cn("palladio-eservices__glass palladio-eservices__glass--alert", className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("palladio-eservices__glass", className)}>
      {title ? (
        <>
          <div className="palladio-eservices__glass-head">
            <h2 className="palladio-eservices__glass-title">{title}</h2>
          </div>
          <div className="palladio-eservices__glass-body">{children}</div>
        </>
      ) : (
        <div className="palladio-eservices__glass-body palladio-eservices__glass-body--solo">
          {children}
        </div>
      )}
    </div>
  );
}
