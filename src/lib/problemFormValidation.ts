import type { FormValidationIssue } from "@/data/deyaaFormValidationMessages";
import { problemReportValidationMessages } from "@/data/deyaaFormValidationMessages";
import { focusFormField } from "@/lib/formFieldFocus";

export interface ProblemFormValidationResult {
  key:
    | keyof typeof problemReportValidationMessages
    | "problemType"
    | "urgency"
    | "location"
    | "description"
    | "name"
    | "phone";
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
        issue: problemReportValidationMessages.problemType,
        focusTarget: form.querySelector("#problemType") as HTMLElement | null,
      };
    },
    () => {
      if (values.urgency) return null;
      return {
        key: "urgency",
        issue: problemReportValidationMessages.urgency,
        focusTarget: form.querySelector("#urgency") as HTMLElement | null,
      };
    },
    () => {
      if (values.latitude != null && values.longitude != null) return null;
      return {
        key: "location",
        issue: problemReportValidationMessages.location,
        focusTarget: mapFocusTarget,
      };
    },
    () => {
      const field = form.querySelector("#description") as HTMLTextAreaElement | null;
      if (!field || !field.checkValidity()) {
        return {
          key: "description",
          issue: problemReportValidationMessages.description,
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
          issue: problemReportValidationMessages.name,
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
          issue: problemReportValidationMessages.phone,
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
        issue: problemReportValidationMessages.captcha,
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
