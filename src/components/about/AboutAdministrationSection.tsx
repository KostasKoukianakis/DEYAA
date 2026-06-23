import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BoardMemberPortrait, getBoardMemberInitials } from "@/components/about/BoardMemberPortrait";
import { BoardMembersVrBlock } from "@/components/about/BoardMembersVrBlock";
import {
  administrationHeadline,
  administrationIntro,
  administrationIntroDetail,
  administrationLead,
  boardMembers,
  type BoardMember,
} from "@/data/aboutContent";
import { cn } from "@/lib/utils";

interface AboutAdministrationSectionProps {
  className?: string;
}

const FEATURED_COUNT = 4;
const MAX_SUMMARY_AVATARS = 4;

function getInitials(name: string) {
  return getBoardMemberInitials(name);
}

function MemberAvatar({
  member,
  className,
}: {
  member: BoardMember;
  className?: string;
}) {
  const initials = getInitials(member.name);

  return (
    <span
      className={cn(
        "about-administration__avatar",
        member.image
          ? "about-administration__avatar--photo"
          : `about-administration__avatar--${member.accent ?? "ocean"}`,
        className,
      )}
      title={member.name}
    >
      {member.image ? (
        <img src={member.image} alt="" loading="lazy" decoding="async" />
      ) : (
        <span className="about-administration__avatar-initials" aria-hidden>
          {initials}
        </span>
      )}
    </span>
  );
}

function BoardMemberCard({ member }: { member: BoardMember }) {
  return (
    <li className="about-administration__card about-administration__card--featured">
      <article className="about-administration__portrait" tabIndex={0}>
        <BoardMemberPortrait member={member} />
      </article>
    </li>
  );
}

function BoardMembersSummaryCard({
  previewMembers,
  allMembers,
}: {
  previewMembers: BoardMember[];
  allMembers: BoardMember[];
}) {
  if (!allMembers.length) return null;

  const visibleAvatars = previewMembers.slice(0, MAX_SUMMARY_AVATARS);
  const remainingCount = previewMembers.length;

  return (
    <li className="about-administration__card about-administration__card--summary">
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="about-administration__summary-trigger"
            aria-label={`Εμφάνιση ${remainingCount} επιπλέον μελών του Διοικητικού Συμβουλίου`}
          >
            <span className="about-administration__summary" aria-hidden>
              <span className="about-administration__summary-avatars">
                {visibleAvatars.map((member, index) => (
                  <MemberAvatar
                    key={member.name}
                    member={member}
                    className={cn(
                      index > 0 && "about-administration__avatar--stacked",
                      `about-administration__avatar--pos-${index}`,
                    )}
                  />
                ))}
              </span>

              <span className="about-administration__summary-copy">
                <span className="about-administration__summary-count">+{remainingCount}</span>
                <span className="about-administration__summary-label">Μέλη Δ.Σ.</span>
                <span className="about-administration__summary-hint">Δείτε όλα</span>
              </span>
            </span>
          </button>
        </DialogTrigger>

        <DialogContent className="about-administration__members-dialog">
          <BoardMembersVrBlock useDialogSemantics />
        </DialogContent>
      </Dialog>
    </li>
  );
}

/** Διοίκηση — leadership grid με summary card */
export function AboutAdministrationSection({ className }: AboutAdministrationSectionProps) {
  const featuredMembers = boardMembers.slice(0, FEATURED_COUNT);
  const otherMembers = boardMembers.slice(FEATURED_COUNT);

  return (
    <section
      id="about-administration"
      className={cn("about-administration palladio-about", className)}
      aria-label="Διοίκηση"
    >
      <div className="about-administration__inner">
        <div className="about-administration__anchor palladio-about__anchor-row">
          <span className="palladio-about__anchor-label">Διοίκηση</span>
          <span className="palladio-about__anchor-index">[02]</span>
        </div>

        <div className="about-administration__board">
          <header className="about-administration__board-intro">
            <h2 className="about-administration__title">{administrationHeadline}</h2>
            <div className="about-administration__line" aria-hidden />
            <p className="about-administration__lead">{administrationLead}</p>
            <div className="about-administration__copy">
              <p className="about-administration__intro">{administrationIntro}</p>
              <p className="about-administration__intro about-administration__intro--detail">
                {administrationIntroDetail}
              </p>
            </div>
          </header>

          <div className="about-administration__watermark" aria-hidden>
            <img
              src="/hero/homepageimage.webp"
              alt=""
              className="about-administration__watermark-image"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>

          <ul className="about-administration__grid">
            {featuredMembers.map((member) => (
              <BoardMemberCard key={member.name} member={member} />
            ))}
            <BoardMembersSummaryCard previewMembers={otherMembers} allMembers={boardMembers} />
          </ul>
        </div>
      </div>
    </section>
  );
}
