/** Announcements hero pipes — load entrance timing (seconds) */
export const ANNOUNCEMENTS_PIPE_ENTRANCE = {
  delay: 0.1,
  /** Base vertical duration for the longer (right) pipe */
  vertDuration: 0.78,
  horizDuration: 0.62,
  /** Overlap vertical end → horizontal start for one continuous stroke */
  horizOverlap: 0.1,
  /** Right pipe starts slightly after left */
  run2Stagger: 0.09,
} as const;
