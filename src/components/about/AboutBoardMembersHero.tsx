import { BoardMembersVrBlock } from "@/components/about/BoardMembersVrBlock";
import { cn } from "@/lib/utils";

interface AboutBoardMembersHeroProps {
  className?: string;
}

/** Hero θέση — VR carousel μελών Δ.Σ. (αντί για video hero) */
export function AboutBoardMembersHero({ className }: AboutBoardMembersHeroProps) {
  return (
    <section
      id="about-hero"
      className={cn("about-board-members-hero", className)}
      aria-labelledby="about-board-members-hero-title"
    >
      <BoardMembersVrBlock
        shellClassName="about-board-members-hero__shell"
        // showDevTools — tuning panel (sliders τιμών καρτελών)
      />
    </section>
  );
}
