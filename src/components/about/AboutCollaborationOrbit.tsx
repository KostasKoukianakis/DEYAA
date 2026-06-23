import { type CSSProperties } from "react";
import {
  aboutCollaborationLead,
  aboutCollaborationPartners,
  aboutCollaborationTitleLines,
} from "@/data/aboutContent";
import { cn } from "@/lib/utils";

const SUSTAIN_WATER_SRC = "/hero/sustain_water.webp";

/** Γωνία + ακτίνα (0–50, ποσοστό ημιδιαμέτρου stage) — πάνω στις γραμμές ή ανάμεσά τους */
const ORBIT_SLOTS = [
  { partnerId: "municipality", angle: 208, radius: 38 },
  { partnerId: "citizens", angle: 262, radius: 24 },
  { partnerId: "board", angle: 128, radius: 50 },
  { partnerId: "staff", angle: 38, radius: 31 },
  { partnerId: "environment", angle: 308, radius: 44 },
  { partnerId: "digital", angle: 72, radius: 38 },
] as const;

const PARTNER_BY_ID = Object.fromEntries(
  aboutCollaborationPartners.map((partner) => [partner.id, partner]),
);

interface AboutCollaborationOrbitProps {
  className?: string;
}

/** Palladio #collaborations — μεγάλοι κύκλοι, bubbles σε τροχιά με ευθύ κείμενο */
export function AboutCollaborationOrbit({ className }: AboutCollaborationOrbitProps) {
  return (
    <div className={cn("about-mission-hub__orbit-block", className)}>
      <div className="about-mission-hub__universe">
        <div className="about-mission-hub__universe-intro">
          <div className="about-mission-hub__universe-intro-col">
            <h3 className="about-mission-hub__collab-title">
              {aboutCollaborationTitleLines.map((line, index) => (
                <span key={line} className="about-mission-hub__collab-title-line">
                  {index > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </h3>
          </div>
          <div className="about-mission-hub__universe-intro-col">
            <p className="about-mission-hub__collab-lead">{aboutCollaborationLead}</p>
          </div>
        </div>

        <div className="about-mission-hub__orbit-stage">
          <div className="about-mission-hub__circles" aria-hidden>
            <div className="about-mission-hub__circle about-mission-hub__circle--1" />
            <div className="about-mission-hub__circle about-mission-hub__circle--2" />
            <div className="about-mission-hub__circle about-mission-hub__circle--3" />
          </div>

          <div className="about-mission-hub__orbit-center">
            <div className="about-mission-hub__center-frame">
              <img
                src={SUSTAIN_WATER_SRC}
                alt=""
                className="about-mission-hub__center-image"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div
            className="about-mission-hub__orbit-ring"
            aria-label="Δίκτυο συνεργασιών"
          >
            {ORBIT_SLOTS.map((slot) => {
              const partner = PARTNER_BY_ID[slot.partnerId];
              if (!partner) return null;

              return (
                <div
                  key={slot.partnerId}
                  className="about-mission-hub__orbit-slot"
                  style={
                    {
                      "--orbit-angle": `${slot.angle}deg`,
                      "--orbit-radius": slot.radius,
                      "--orbit-popup-delay": `${0.58 + (slot.radius / 50) * 0.76}s`,
                    } as CSSProperties
                  }
                >
                  <div className="about-mission-hub__orbit-bubble-upright">
                    <div className="about-mission-hub__orbit-bubble-cancel">
                      <div className="about-mission-hub__bubble">
                        <span className="about-mission-hub__bubble-icon" aria-hidden>
                          <partner.icon strokeWidth={1.4} />
                        </span>
                        <span>{partner.label}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
