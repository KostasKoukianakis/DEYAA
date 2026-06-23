import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FormValidationIssue } from "@/data/deyaaFormValidationMessages";

interface FormValidationNoticeProps extends FormValidationIssue {
  className?: string;
  id?: string;
}

/**
 * Minimal inline form warning — shared across contact forms and reCAPTCHA.
 */
export function FormValidationNotice({
  title,
  description,
  className,
  id,
}: FormValidationNoticeProps) {
  return (
    <div
      id={id}
      className={cn("form-validation-notice", className)}
      role="alert"
      aria-live="polite"
    >
      <span className="form-validation-notice__icon" aria-hidden>
        <AlertCircle strokeWidth={1.75} />
      </span>
      <div className="form-validation-notice__body">
        <p className="form-validation-notice__title">{title}</p>
        <p className="form-validation-notice__text">{description}</p>
      </div>
    </div>
  );
}
