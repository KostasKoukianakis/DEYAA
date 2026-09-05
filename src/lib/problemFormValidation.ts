import type { FormValidationIssue } from "@/data/deyaaFormValidationMessages";
import { issue } from "@/i18n/localized";
import { focusFormField } from "@/lib/formFieldFocus";

export type ProblemFormValidationKey =
  | "problemType"
  | "urgency"
  | "location"
  | "description"
  | "name"
  | "phone"
  | "captcha"
  | "submitError";

export interface ProblemFormValidationResult {
  key: ProblemFormValidationKey;
  issue: FormValidationIssue;
  focusTarget: HTMLElement | null;
}

export interface ProblemFormValues {
  problemType: string;
  urgency: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  name: string;
  phone: string;
  captchaToken: string | null;
}

export function getFirstProblemFormIssue(
  form: HTMLFormElement,
  values: ProblemFormValues,
  captchaContainer: HTMLElement | null,
  mapFocusTarget: HTMLElement | null,
): ProblemFormValidationResult | null {
  const checks: Array<() => ProblemFormValidationResult | null> = [
    () => {
      if (values.problemType) return null;
      return {
        key: "problemType",
        issue: issue("eServices.problem.validation.problemType"),
        focusTarget: form.querySelector("#problemType") as HTMLElement | null,
      };
    },
    () => {
      if (values.urgency) return null;
      return {
        key: "urgency",
        issue: issue("eServices.problem.validation.urgency"),
        focusTarget: form.querySelector("#urgency") as HTMLElement | null,
      };
    },
    () => {
      if (values.latitude != null && values.longitude != null) return null;
      return {
        key: "location",
        issue: issue("eServices.problem.validation.location"),
        focusTarget: mapFocusTarget,
      };
    },
    () => {
      const field = form.querySelector("#description") as HTMLTextAreaElement | null;
      if (!field || !field.checkValidity()) {
        return {
          key: "description",
          issue: issue("eServices.problem.validation.description"),
          focusTarget: field,
        };
      }
      return null;
    },
    () => {
      const field = form.querySelector("#name") as HTMLInputElement | null;
      if (!field || !field.checkValidity()) {
        return {
          key: "name",
          issue: issue("eServices.problem.validation.name"),
          focusTarget: field,
        };
      }
      return null;
    },
    () => {
      const field = form.querySelector("#phone") as HTMLInputElement | null;
      if (!field || !field.checkValidity()) {
        return {
          key: "phone",
          issue: issue("eServices.problem.validation.phone"),
          focusTarget: field,
        };
      }
      return null;
    },
    () => {
      if (values.captchaToken) return null;
      const button = captchaContainer?.querySelector(
        ".not-a-robot-v3__box, .not-a-robot__widget",
      ) as HTMLElement | null;
      return {
        key: "captcha",
        issue: issue("contact.validation.captcha"),
        focusTarget: button ?? captchaContainer,
      };
    },
  ];

  for (const check of checks) {
    const result = check();
    if (result) return result;
  }

  return null;
}

export function applyProblemFormValidationFocus(result: ProblemFormValidationResult) {
  if (result.key === "location" && result.focusTarget) {
    result.focusTarget.scrollIntoView({ behavior: "smooth", block: "center" });
    result.focusTarget.focus({ preventScroll: true });
    return;
  }

  focusFormField(result.focusTarget);
}
