export function focusFormField(target: HTMLElement | null | undefined) {
  if (!target) return;

  const focusable =
    target.matches("input, textarea, select, button, [tabindex]:not([tabindex='-1'])")
      ? target
      : target.querySelector<HTMLElement>(
          "input, textarea, select, button, [tabindex]:not([tabindex='-1'])",
        );

  target.scrollIntoView({ behavior: "smooth", block: "center" });
  (focusable ?? target).focus({ preventScroll: true });
}
