import type { FormValidationIssue } from "@/data/deyaaFormValidationMessages";
import { issue } from "@/i18n/localized";
import { focusFormField } from "@/lib/formFieldFocus";
import type { FormEvent, InvalidEvent } from "react";

export type ContactFormValidationKey =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "message"
  | "messageTooShort"
  | "genericField"
  | "topic"
  | "privacy"
  | "captcha"
  | "submitError";

const FIELD_ISSUE_PATHS: Record<string, string> = {
  firstName: "contact.validation.firstName",
  lastName: "contact.validation.lastName",
  email: "contact.validation.email",
  phone: "contact.validation.phone",
  message: "contact.validation.message",
};

export interface ContactFormValidationResult {
  key: ContactFormValidationKey;
  issue: FormValidationIssue;
  focusTarget: HTMLElement | null;
}

export interface ContactFormValues {
  topic: string;
  phone: string;
  privacyAccepted: boolean;
  captchaToken: string | null;
}

export function getContactFieldValidationIssue(
  field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): FormValidationIssue {
  const name = field.name;
  const path = FIELD_ISSUE_PATHS[name];
  const base = path ? issue(path) : issue("contact.validation.genericField");

  if (field.validity.valueMissing) {
    return base;
  }

  if (field.validity.typeMismatch && field.type === "email") {
    return issue("contact.validation.email");
  }

  if (field.validity.tooShort && name === "message") {
    return issue("contact.validation.messageTooShort");
  }

  if (field.validity.patternMismatch && name === "phone") {
    return issue("contact.validation.phone");
  }

  return base;
}

export function getFirstInvalidFieldIssue(form: HTMLFormElement): FormValidationIssue | null {
  const invalidField = form.querySelector(":invalid") as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | null;

  if (!invalidField) return null;

  return getContactFieldValidationIssue(invalidField);
}

function checkHtmlField(
  form: HTMLFormElement,
  name: string,
): ContactFormValidationResult | null {
  const field = form.querySelector(`[name="${name}"]`) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | null;

  if (!field) return null;

  if (!field.checkValidity()) {
    const key: ContactFormValidationKey =
      name === "message" && field.validity.tooShort ? "messageTooShort" : (name as ContactFormValidationKey);

    return {
      key: FIELD_ISSUE_PATHS[name] ? key : "genericField",
      issue:
        name === "message" && field.validity.tooShort
          ? issue("contact.validation.messageTooShort")
          : getContactFieldValidationIssue(field),
      focusTarget: field,
    };
  }

  return null;
}

export function getFirstContactFormIssue(
  form: HTMLFormElement,
  values: ContactFormValues,
  refs: {
    topicTrigger: HTMLElement | null;
    captchaContainer: HTMLElement | null;
  },
): ContactFormValidationResult | null {
  const checks: Array<() => ContactFormValidationResult | null> = [
    () => checkHtmlField(form, "firstName"),
    () => checkHtmlField(form, "lastName"),
    () => checkHtmlField(form, "email"),
    () => {
      const htmlIssue = checkHtmlField(form, "phone");
      if (htmlIssue) return htmlIssue;
      if (isValidGreekPhone(values.phone)) return null;
      const field = form.querySelector('[name="phone"]') as HTMLInputElement | null;
      return {
        key: "phone",
        issue: issue("contact.validation.phone"),
        focusTarget: field,
      };
    },
    () => {
      const topicValue = values.topic.trim();
      if (topicValue) return null;

      const hiddenTopic = form.querySelector('[name="topic"]') as HTMLInputElement | null;
      return {
        key: "topic",
        issue: issue("contact.validation.topic"),
        focusTarget: refs.topicTrigger ?? hiddenTopic,
      };
    },
    () => checkHtmlField(form, "message"),
    () => {
      if (values.privacyAccepted) return null;
      const checkbox = form.querySelector(
        '.palladio-contact__checkbox input[type="checkbox"]',
      ) as HTMLInputElement | null;
      return {
        key: "privacy",
        issue: issue("contact.validation.privacy"),
        focusTarget: checkbox,
      };
    },
    () => {
      if (values.captchaToken) return null;
      const button = refs.captchaContainer?.querySelector(
        ".not-a-robot-v3__box, .not-a-robot__widget",
      ) as HTMLElement | null;
      return {
        key: "captcha",
        issue: issue("contact.validation.captcha"),
        focusTarget: button ?? refs.captchaContainer,
      };
    },
  ];

  for (const check of checks) {
    const result = check();
    if (result) return result;
  }

  return null;
}

export function applyContactFormValidationFocus(result: ContactFormValidationResult) {
  focusFormField(result.focusTarget);
}

export function focusInvalidField(form: HTMLFormElement) {
  const firstIssue = getFirstContactFormIssue(
    form,
    {
      topic: (form.querySelector('[name="topic"]') as HTMLInputElement | null)?.value ?? "",
      phone: (form.querySelector('[name="phone"]') as HTMLInputElement | null)?.value ?? "",
      privacyAccepted: (
        form.querySelector('.palladio-contact__checkbox input[type="checkbox"]') as HTMLInputElement | null
      )?.checked ?? false,
      captchaToken: null,
    },
    { topicTrigger: null, captchaContainer: null },
  );

  if (firstIssue) {
    applyContactFormValidationFocus(firstIssue);
    return;
  }

  const invalidField = form.querySelector(":invalid") as HTMLElement | null;
  focusFormField(invalidField);
}

export function setGreekFieldValidity(
  event: InvalidEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
) {
  const field = event.currentTarget;
  const currentIssue = getContactFieldValidationIssue(field);
  field.setCustomValidity(`${currentIssue.title} ${currentIssue.description}`);
}

export function clearFieldValidity(
  event: FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
) {
  event.currentTarget.setCustomValidity("");
}

export function isValidGreekPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}
