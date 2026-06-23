import type { FormValidationIssue } from "@/data/deyaaFormValidationMessages";
import { contactFormValidationMessages } from "@/data/deyaaFormValidationMessages";
import { focusFormField } from "@/lib/formFieldFocus";
import type { FormEvent, InvalidEvent } from "react";

const FIELD_MESSAGES: Record<string, FormValidationIssue> = {
  firstName: contactFormValidationMessages.firstName,
  lastName: contactFormValidationMessages.lastName,
  email: contactFormValidationMessages.email,
  phone: contactFormValidationMessages.phone,
  message: contactFormValidationMessages.message,
};

export type ContactFormValidationKey = keyof typeof contactFormValidationMessages;

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
  const base = FIELD_MESSAGES[name] ?? contactFormValidationMessages.genericField;

  if (field.validity.valueMissing) {
    return base;
  }

  if (field.validity.typeMismatch && field.type === "email") {
    return contactFormValidationMessages.email;
  }

  if (field.validity.tooShort && name === "message") {
    return contactFormValidationMessages.messageTooShort;
  }

  if (field.validity.patternMismatch && name === "phone") {
    return contactFormValidationMessages.phone;
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
      key: FIELD_MESSAGES[name] ? key : "genericField",
      issue:
        name === "message" && field.validity.tooShort
          ? contactFormValidationMessages.messageTooShort
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
        issue: contactFormValidationMessages.phone,
        focusTarget: field,
      };
    },
    () => {
      const topicValue = values.topic.trim();
      if (topicValue) return null;

      const hiddenTopic = form.querySelector('[name="topic"]') as HTMLInputElement | null;
      return {
        key: "topic",
        issue: contactFormValidationMessages.topic,
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
        issue: contactFormValidationMessages.privacy,
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
        issue: contactFormValidationMessages.captcha,
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
  const issue = getContactFieldValidationIssue(field);
  field.setCustomValidity(`${issue.title} ${issue.description}`);
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
