const HOME_HERO_INTRO_KEY = "deyaa:home-hero-intro-seen";

export function hasSeenHomeHeroIntro(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(HOME_HERO_INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

export function markHomeHeroIntroSeen(): void {
  try {
    sessionStorage.setItem(HOME_HERO_INTRO_KEY, "1");
  } catch {
    /* private mode */
  }
}
