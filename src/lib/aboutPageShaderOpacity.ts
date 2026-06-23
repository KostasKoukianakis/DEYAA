import gsap from "gsap";

/** Keeps the fixed sky shader fully visible until the white stats panel scrolls in. */
export function updateAboutPageShaderOpacity() {
  const aboutPage = document.querySelector<HTMLElement>(".about-page");
  if (!aboutPage) return;

  let opacity = 1;

  const missionAreas = document.getElementById("about-mission-areas");
  if (missionAreas) {
    const rect = missionAreas.getBoundingClientRect();
    const fadeRange = Math.max(window.innerHeight * 0.72, 420);
    const whiteCover = gsap.utils.clamp(0, 1, 1 - rect.top / fadeRange);
    opacity = 1 - whiteCover;
  }

  aboutPage.style.setProperty("--about-sky-shader-opacity", opacity.toFixed(4));
}
