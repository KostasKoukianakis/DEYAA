import deyaLogoLg from "@/pages/images/deya_logo_lg.webp";
import deyaLogoNav from "@/pages/images/deya_logo_nav.webp";
import { cn } from "@/lib/utils";

type DeyaBrandLogoProps = {
  alt: string;
  className?: string;
  variant?: "nav" | "footer";
};

export function DeyaBrandLogo({ alt, className, variant = "nav" }: DeyaBrandLogoProps) {
  if (variant === "footer") {
    return (
      <img
        src={deyaLogoLg}
        srcSet={`${deyaLogoNav} 360w, ${deyaLogoLg} 450w`}
        sizes="(max-width: 1024px) 180px, 225px"
        width={225}
        height={129}
        alt={alt}
        className={cn(className)}
        decoding="async"
        loading="lazy"
      />
    );
  }

  return (
    <img
      src={deyaLogoNav}
      width={108}
      height={62}
      alt={alt}
      className={cn(className)}
      decoding="async"
    />
  );
}
