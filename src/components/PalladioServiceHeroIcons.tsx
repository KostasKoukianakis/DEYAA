import { cn } from "@/lib/utils";

export const PALLADIO_HERO_ICON_IDS = [
  "water",
  "sewerage",
  "documents",
  "plus",
  "pinwheel",
  "hourglass",
  "ring",
] as const;

export type PalladioHeroIconId = (typeof PALLADIO_HERO_ICON_IDS)[number];

const SERVICE_ICONS: Record<PalladioHeroIconId, { src: string; alt: string }> = {
  water: { src: "/hero/services_1.webp", alt: "Ύδρευση" },
  sewerage: { src: "/hero/services_2.webp", alt: "Αποχέτευση" },
  documents: { src: "/hero/services_3.webp", alt: "Δικαιολογητικά" },
  plus: { src: "/hero/services_4.webp", alt: "" },
  pinwheel: { src: "/hero/services_5.webp", alt: "" },
  hourglass: { src: "/hero/services_6.webp", alt: "" },
  ring: { src: "/hero/services_7.webp", alt: "" },
};

export function PalladioServiceHeroIcon({
  iconId,
  className,
}: {
  iconId: PalladioHeroIconId;
  className?: string;
}) {
  const icon = SERVICE_ICONS[iconId];

  return (
    <div className={cn("palladio-services-page__hero-icon", className)}>
      <img
        src={icon.src}
        alt={icon.alt}
        className="palladio-services-page__hero-icon-svg"
        width={200}
        height={200}
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
