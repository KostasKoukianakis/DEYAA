import { useRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { servicesHubClosingImages } from "@/data/servicesHubClosingImages";
import { useServicesHubClosingBg } from "@/hooks/useServicesHubClosingBg";

interface ServicesHubClosingPanelProps {
  className?: string;
  closingLines: string[];
  ctaHref: string;
  ctaLabel: string;
  titleKeyPrefix?: string;
}

export function ServicesHubClosingPanel({
  className,
  closingLines,
  ctaHref,
  ctaLabel,
  titleKeyPrefix = "closing",
}: ServicesHubClosingPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useServicesHubClosingBg(panelRef);

  return (
    <div
      ref={panelRef}
      className={cn("palladio-services-hub__closing-panel", className)}
    >
      <div className="palladio-services-hub__closing-bg" aria-hidden>
        <div className="palladio-services-hub__closing-bg-stage">
          {[...servicesHubClosingImages].reverse().map((src, index, images) => (
            <div
              key={src}
              className={cn(
                "palladio-services-hub__closing-bg-slot",
                index === images.length - 1 && "palladio-services-hub__closing-bg-slot--reveal",
              )}
            >
              <img
                src={src}
                alt=""
                className="palladio-services-hub__closing-bg-img"
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </div>
        <div className="palladio-services-hub__closing-bg-scrim" />
      </div>

      <div className="palladio-services-hub__closing-inner">
        <p className="palladio-services-hub__closing-title">
          {closingLines.map((line, index) => (
            <span key={`${titleKeyPrefix}-${index}-${line}`}>
              {line}
              {index < closingLines.length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
        <Link to={ctaHref} className="palladio-button button outline white">
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
