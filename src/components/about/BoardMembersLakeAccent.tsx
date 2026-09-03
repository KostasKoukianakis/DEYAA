import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const LAKE_ACCENT_SRC = "/hero/koyrnas.webp";
const LAKE_FALL_DURATION_S = 1.85;

interface BoardMembersLakeAccentProps {
  className?: string;
  playIntro?: boolean;
  /** Delay before the fall starts (ms). */
  introDelayMs?: number;
}

/** Center lake accent (koyrnas) — falls into place after carousel intro. */
export function BoardMembersLakeAccent({
  className,
  playIntro = true,
  introDelayMs = 120,
}: BoardMembersLakeAccentProps) {
  const reduceMotion = useReducedMotion();
  const [lakeFalling, setLakeFalling] = useState(false);
  const [lakeSettled, setLakeSettled] = useState(!playIntro || !!reduceMotion);

  useEffect(() => {
    if (!playIntro || reduceMotion) {
      setLakeSettled(true);
      return;
    }

    const fallTimer = window.setTimeout(() => setLakeFalling(true), introDelayMs);
    const settleTimer = window.setTimeout(
      () => setLakeSettled(true),
      introDelayMs + LAKE_FALL_DURATION_S * 1000 + 40,
    );

    return () => {
      window.clearTimeout(fallTimer);
      window.clearTimeout(settleTimer);
    };
  }, [playIntro, reduceMotion, introDelayMs]);

  return (
    <div
      className={cn(
        "about-administration__vr-lake-accent",
        lakeFalling && "is-falling",
        lakeSettled && "is-settled",
        className,
      )}
      aria-hidden
    >
      <img
        className="about-administration__vr-lake-accent__img"
        src={LAKE_ACCENT_SRC}
        alt=""
        fetchPriority="high"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
