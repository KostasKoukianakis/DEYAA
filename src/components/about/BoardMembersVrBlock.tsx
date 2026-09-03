import { BoardMembersDialogSky } from "@/components/about/BoardMembersDialogSky";
import { BoardMembersFlatCarousel } from "@/components/about/BoardMembersFlatCarousel";
import { BoardMembersLakeAccent } from "@/components/about/BoardMembersLakeAccent";
import { BoardMembersVrCarousel } from "@/components/about/BoardMembersVrCarousel";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  administrationLead,
  boardMembers,
} from "@/data/aboutContent";
import { usePrefersFlatBoardCarousel } from "@/hooks/usePrefersFlatBoardCarousel";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";

const HERO_TEXT_EASE = [0.22, 1, 0.36, 1] as const;

const heroCopyVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.14,
    },
  },
};

const heroLineVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: HERO_TEXT_EASE,
    },
  },
};

interface BoardMembersVrBlockProps {
  className?: string;
  shellClassName?: string;
  useDialogSemantics?: boolean;
  showDevTools?: boolean;
}

/** Sky + header + VR carousel (κοινό για hero και modal) */
export function BoardMembersVrBlock({
  className,
  shellClassName,
  useDialogSemantics = false,
  showDevTools = false,
}: BoardMembersVrBlockProps) {
  const titleId = useDialogSemantics ? undefined : "about-board-members-hero-title";
  const reduceMotion = useReducedMotion();
  const prefersFlatCarousel = usePrefersFlatBoardCarousel();
  const playHeroTextIntro = !useDialogSemantics && !reduceMotion;
  const heroLineMotion = playHeroTextIntro
    ? heroLineVariants
    : { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className={cn("about-administration__members-vr-block", className)}>
      {useDialogSemantics ? <BoardMembersDialogSky /> : null}
      <div className={cn("about-administration__members-dialog-shell", shellClassName)}>
        <header
          className={cn(
            "about-administration__members-dialog-header",
            !useDialogSemantics && "about-board-members-hero__header",
          )}
        >
          {useDialogSemantics ? (
            <div className="about-administration__members-dialog-intro">
              <DialogTitle className="about-administration__members-dialog-title">
                Μέλη Διοικητικού Συμβουλίου
              </DialogTitle>
              <DialogDescription className="about-administration__members-dialog-desc">
                Όλα τα μέλη του Διοικητικού Συμβουλίου ({boardMembers.length})
              </DialogDescription>
            </div>
          ) : (
            <motion.div
              className="about-board-members-hero__copy"
              variants={heroCopyVariants}
              initial={playHeroTextIntro ? "hidden" : false}
              animate="visible"
            >
              <motion.h1
                id={titleId}
                className="about-board-members-hero__title"
                variants={heroLineMotion}
              >
                Η ομάδα που καθοδηγεί τη{" "}
                <span className="about-board-members-hero__brand">ΔΕΥΑΑ</span>
              </motion.h1>
              <motion.p className="about-board-members-hero__lead" variants={heroLineMotion}>
                {administrationLead}
              </motion.p>
            </motion.div>
          )}
        </header>

        <div
          className={cn(
            "about-administration__members-dialog-body",
            prefersFlatCarousel && "about-administration__members-dialog-body--flat",
          )}
        >
          {prefersFlatCarousel ? (
            <>
              <BoardMembersFlatCarousel
                members={boardMembers}
                heroGlassCards={!useDialogSemantics}
              />
              {!useDialogSemantics ? (
                <BoardMembersLakeAccent playIntro introDelayMs={520} />
              ) : null}
            </>
          ) : (
            <BoardMembersVrCarousel
              members={boardMembers}
              showDevTools={showDevTools}
              showLakeAccent={!useDialogSemantics}
              playIntro={!useDialogSemantics}
              heroGlassCards={!useDialogSemantics}
            />
          )}
        </div>
      </div>
    </div>
  );
}
