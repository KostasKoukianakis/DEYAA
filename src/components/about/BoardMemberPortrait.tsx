import { User } from "lucide-react";
import type { BoardMember } from "@/data/aboutContent";
import { cn } from "@/lib/utils";

export function getBoardMemberInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

interface BoardMemberPortraitProps {
  member: BoardMember;
  className?: string;
}

/** Πορτρέτο μέλους Δ.Σ. — κοινό για VR carousel και dialog */
export function BoardMemberPortrait({ member, className }: BoardMemberPortraitProps) {
  const initials = getBoardMemberInitials(member.name);
  const accent = member.accent ?? "sky";

  return (
    <div
      className={cn(
        "about-administration__portrait-media",
        member.image
          ? "about-administration__portrait-media--photo"
          : `about-administration__portrait-media--${accent}`,
        className,
      )}
    >
      <div
        className={cn(
          "about-administration__portrait-accent-bg",
          `about-administration__portrait-accent-bg--${accent}`,
        )}
        aria-hidden
      />

      {member.image ? (
        <img
          src={member.image}
          alt=""
          className="about-administration__portrait-image"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ) : (
        <span className="about-administration__portrait-initials" aria-hidden>
          {initials}
        </span>
      )}

      <div className="about-administration__portrait-scrim" aria-hidden />

      {member.hoverDetail ? (
        <div className="about-administration__portrait-hover">
          <p className="about-administration__portrait-hover-eyebrow">ΔΕΥΑΑ</p>
          <p className="about-administration__portrait-hover-detail">{member.hoverDetail}</p>
        </div>
      ) : null}

      <div className="about-administration__portrait-top">
        <h3 className="about-administration__portrait-name">{member.name}</h3>
      </div>

      <div className="about-administration__portrait-footer">
        <div className="about-administration__portrait-meta">
          <div className="about-administration__portrait-thumb" aria-hidden>
            {member.image ? (
              <img src={member.image} alt="" loading="lazy" decoding="async" />
            ) : (
              <User className="about-administration__portrait-thumb-icon" strokeWidth={1.4} />
            )}
          </div>
          <div className="about-administration__portrait-meta-copy">
            <p className="about-administration__portrait-role">{member.position}</p>
          </div>
        </div>

        <span className="about-administration__portrait-role-label">{member.role}</span>
      </div>
    </div>
  );
}
