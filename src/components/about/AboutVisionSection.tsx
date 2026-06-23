import { useState } from "react";
import {
  aboutMissionText,
  aboutValues,
  aboutVisionText,
} from "@/data/aboutContent";
import { cn } from "@/lib/utils";

const visionTabs = [
  { id: "vision", label: "Όραμα", index: "01" },
  { id: "mission", label: "Αποστολή", index: "02" },
  { id: "values", label: "Αξίες", index: "03" },
] as const;

type VisionTabId = (typeof visionTabs)[number]["id"];

const visionPanels: Record<Exclude<VisionTabId, "values">, string> = {
  vision: aboutVisionText,
  mission: aboutMissionText,
};

interface AboutVisionSectionProps {
  className?: string;
}

/** Όραμα / Αποστολή / Αξίες — editorial split layout */
export function AboutVisionSection({ className }: AboutVisionSectionProps) {
  const [activeTab, setActiveTab] = useState<VisionTabId>("vision");

  return (
    <section
      id="about-vision"
      className={cn("about-vision palladio-about", className)}
      aria-label="Όραμα, Αποστολή και Αξίες"
    >
      <div className="about-vision__inner">
        <header className="about-vision__header">
          <div className="about-vision__anchor palladio-about__anchor-row">
            <span className="palladio-about__anchor-label">Όραμα / Αποστολή</span>
            <span className="palladio-about__anchor-index">[02]</span>
          </div>
        </header>

        <div className="about-vision__layout">
          <nav className="about-vision__rail" aria-label="Επιλογή ενότητας">
            {visionTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={cn(
                  "about-vision__rail-item",
                  activeTab === tab.id && "about-vision__rail-item--active",
                )}
                aria-current={activeTab === tab.id ? "true" : undefined}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="about-vision__rail-index">{tab.index}</span>
                <span className="about-vision__rail-label">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="about-vision__stage">
            <div className="about-vision__stage-glow" aria-hidden />

            {visionTabs.map((tab) => (
              <article
                key={tab.id}
                className={cn(
                  "about-vision__panel",
                  tab.id === "values" && "about-vision__panel--values",
                  activeTab === tab.id && "about-vision__panel--active",
                )}
                hidden={activeTab !== tab.id}
              >
                <p className="about-vision__panel-kicker">
                  <span className="about-vision__panel-kicker-index">{tab.index}</span>
                  {tab.label}
                </p>

                {tab.id === "values" ? (
                  <ul className="about-vision__values-list">
                    {aboutValues.map((value, index) => (
                      <li key={value.title} className="about-vision__value-item">
                        <span className="about-vision__value-index" aria-hidden>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="about-vision__value-icon-wrap">
                          <value.icon
                            className="about-vision__value-icon"
                            strokeWidth={1.2}
                            aria-hidden
                          />
                        </div>
                        <div className="about-vision__value-copy">
                          <h3 className="about-vision__value-title">{value.title}</h3>
                          <p className="about-vision__value-desc">{value.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>
                    <h2 className="about-vision__panel-title">{tab.label}</h2>
                    <p className="about-vision__panel-text">{visionPanels[tab.id]}</p>
                  </>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
