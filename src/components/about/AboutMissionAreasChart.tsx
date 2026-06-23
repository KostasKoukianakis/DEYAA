import { useRef, type CSSProperties } from "react";
import { aboutMissionAreasFeatured, type AboutMissionStat } from "@/data/aboutContent";
import { useAboutMissionAreasImageScroll } from "@/hooks/useAboutMissionAreasImageScroll";
import { useAboutMissionAreasStatsReveal } from "@/hooks/useAboutMissionAreasStatsReveal";
import { cn } from "@/lib/utils";

const SUSTAIN_WATER_SRC = "/hero/sustain_water.webp";

const AREA_ACCENTS: Record<string, string> = {
  vision: "#0098eb",
  mission: "#0098eb",
  values: "#22c55e",
  water: "#10b981",
  structure: "#fbbf24",
};

function PalladioTargetIcon() {
  return (
    <svg
      className="about-mission-areas__block-icon"
      viewBox="0 0 32 32"
      aria-hidden
    >
      <circle cx="16" cy="16" r="13.5" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <line x1="16" y1="5" x2="16" y2="27" stroke="currentColor" strokeWidth="1.25" />
      <line x1="5" y1="16" x2="27" y2="16" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="16" cy="16" r="1.75" fill="currentColor" />
    </svg>
  );
}

function parseStatCount(stat: AboutMissionStat): {
  countTo?: number;
  prefix?: string;
  decimals?: number;
  literal?: string;
} {
  if (stat.delta) {
    const deltaMatch = stat.delta.match(/^([+\-]?)\s*(\d+(?:\.\d+)?)/);
    if (deltaMatch) {
      const [, prefix, num] = deltaMatch;
      const countTo = Number(num);
      if (Number.isFinite(countTo)) {
        return {
          countTo,
          prefix: prefix || "+",
          decimals: num.includes(".") ? 1 : 0,
        };
      }
    }
    return { literal: stat.delta.trim() };
  }

  if (stat.value.includes("/")) {
    return { literal: stat.value };
  }

  const countTo = Number(stat.value);
  if (Number.isFinite(countTo)) {
    return {
      countTo,
      prefix: "",
      decimals: stat.value.includes(".") ? 1 : 0,
    };
  }

  return { literal: stat.value };
}

function formatCountValue(
  count: { countTo: number; prefix?: string; decimals?: number },
  value: number,
) {
  const prefix = count.prefix ?? "";
  const decimals = count.decimals ?? 0;
  const n = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
  return `${prefix}${n}`;
}

function StatMetric({ stat, accent }: { stat: AboutMissionStat; accent: string }) {
  const parsed = parseStatCount(stat);

  if (parsed.literal && stat.delta) {
    return (
      <p className="about-mission-areas__stat-metric" style={{ color: accent }}>
        {parsed.literal}
      </p>
    );
  }

  if (parsed.literal) {
    return (
      <p className="about-mission-areas__stat-metric" style={{ color: accent }}>
        <span className="about-mission-areas__stat-metric-value">{parsed.literal}</span>
      </p>
    );
  }

  return (
    <p className="about-mission-areas__stat-metric" style={{ color: accent }}>
      <span
        className="about-mission-areas__stat-metric-value"
        data-count-to={parsed.countTo}
        data-count-prefix={parsed.prefix ?? ""}
        data-count-decimals={parsed.decimals ?? 0}
      >
        {formatCountValue(parsed, 0)}
      </span>
      {stat.unit ? (
        <span className="about-mission-areas__stat-metric-unit">{stat.unit}</span>
      ) : null}
    </p>
  );
}

interface AboutMissionAreasChartProps {
  className?: string;
}

export function AboutMissionAreasChart({ className }: AboutMissionAreasChartProps) {
  const layoutRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLElement>(null);
  const imageSlotRef = useRef<HTMLDivElement>(null);
  const endBlockRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useAboutMissionAreasImageScroll({
    layoutRef,
    visualRef,
    imageSlotRef,
    endBlockRef,
  });

  useAboutMissionAreasStatsReveal(contentRef);

  return (
    <div className={cn("about-mission-areas__inner", className)}>
      <div ref={layoutRef} className="about-mission-areas__layout">
        <aside ref={visualRef} className="about-mission-areas__visual" aria-hidden>
          <div className="about-mission-areas__image-track">
            <div ref={imageSlotRef} className="about-mission-areas__image-slot">
              <img
                src={SUSTAIN_WATER_SRC}
                alt=""
                className="about-mission-areas__image-slot-img"
                decoding="async"
                draggable={false}
              />
            </div>
          </div>
        </aside>

        <div ref={contentRef} className="about-mission-areas__content">
          {aboutMissionAreasFeatured.map((area, index) => {
            const accent = AREA_ACCENTS[area.id] ?? "#0098eb";
            const isLastBlock = index === aboutMissionAreasFeatured.length - 1;

            return (
              <article
                key={area.id}
                ref={isLastBlock ? endBlockRef : undefined}
                className="about-mission-areas__block"
                style={{ "--area-accent": accent } as CSSProperties}
                aria-labelledby={`about-mission-${area.id}-title`}
              >
                <header className="about-mission-areas__block-head">
                  <PalladioTargetIcon />
                  <h2
                    id={`about-mission-${area.id}-title`}
                    className="about-mission-areas__block-title"
                  >
                    {area.title}
                  </h2>
                </header>

                <div className="about-mission-areas__stats-list">
                  {area.stats.map((stat) => (
                    <div
                      key={`${area.id}-${stat.label}`}
                      className="about-mission-areas__stat-row"
                    >
                      <StatMetric stat={stat} accent={accent} />
                      <h3 className="about-mission-areas__stat-label">{stat.label}</h3>
                      <p className="about-mission-areas__stat-desc">{stat.description}</p>
                    </div>
                  ))}
                </div>

                {area.footnote ? (
                  <p className="about-mission-areas__figures-footnote">{area.footnote}</p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
