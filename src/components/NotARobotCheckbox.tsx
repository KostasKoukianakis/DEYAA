import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  executeRecaptchaV3,
  getRecaptchaSiteKey,
  getRecaptchaVersion,
  loadRecaptchaV2Script,
  loadRecaptchaV3Script,
} from "@/lib/recaptcha";
import { contactFormValidationMessages } from "@/data/deyaaFormValidationMessages";
import { FormValidationNotice } from "@/components/FormValidationNotice";
import { RecaptchaBrandMark, RecaptchaCheckboxMark } from "@/components/RecaptchaBrandMark";

interface NotARobotCheckboxProps {
  onVerify: (token: string | null) => void;
  className?: string;
  /** Remount widget after successful submit (pass incremented form key). */
  resetKey?: number;
  /** Highlight widget when parent form validation failed on captcha. */
  invalid?: boolean;
}

function RecaptchaV2Widget({
  onVerify,
  resetKey,
}: {
  onVerify: (token: string | null) => void;
  resetKey: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onVerifyRef = useRef(onVerify);
  const [loadError, setLoadError] = useState(false);

  onVerifyRef.current = onVerify;

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;

    if (!container) return;

    container.innerHTML = "";
    setLoadError(false);

    loadRecaptchaV2Script()
      .then(() => {
        if (cancelled || !containerRef.current || !window.grecaptcha?.render) return;

        window.grecaptcha.render(containerRef.current, {
          sitekey: getRecaptchaSiteKey(),
          callback: (token: string) => onVerifyRef.current(token),
          "expired-callback": () => onVerifyRef.current(null),
          "error-callback": () => onVerifyRef.current(null),
        });
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true);
          onVerifyRef.current(null);
        }
      });

    return () => {
      cancelled = true;
      onVerifyRef.current(null);
    };
  }, [resetKey]);

  if (loadError) {
    return <FormValidationNotice {...contactFormValidationMessages.captchaLoad} />;
  }

  return <div ref={containerRef} className="not-a-robot__widget" />;
}

function RecaptchaV3Widget({
  onVerify,
  resetKey,
  invalid,
}: {
  onVerify: (token: string | null) => void;
  resetKey: number;
  invalid?: boolean;
}) {
  const onVerifyRef = useRef(onVerify);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [internalError, setInternalError] = useState<"load" | "verify" | null>(null);

  onVerifyRef.current = onVerify;

  useEffect(() => {
    setVerified(false);
    setLoading(false);
    setInternalError(null);
    onVerifyRef.current(null);

    loadRecaptchaV3Script().catch(() => {
      setInternalError("load");
      onVerifyRef.current(null);
    });
  }, [resetKey]);

  const handleVerify = useCallback(async () => {
    if (loading || verified) return;

    setLoading(true);
    setInternalError(null);

    try {
      const token = await executeRecaptchaV3("contact_form");
      setVerified(true);
      onVerifyRef.current(token);
    } catch {
      setVerified(false);
      setInternalError("verify");
      onVerifyRef.current(null);
    } finally {
      setLoading(false);
    }
  }, [loading, verified]);

  const internalIssue =
    internalError === "load"
      ? contactFormValidationMessages.captchaLoad
      : internalError === "verify"
        ? contactFormValidationMessages.captchaFailed
        : null;

  return (
    <div className="not-a-robot-v3" data-verified={verified || undefined}>
      <button
        type="button"
        className={cn("not-a-robot-v3__box", invalid && "is-invalid")}
        onClick={handleVerify}
        disabled={loading || verified}
        aria-pressed={verified}
        aria-busy={loading}
        aria-invalid={invalid || undefined}
        aria-label={verified ? "Επιβεβαιώθηκε ότι δεν είστε ρομπότ" : "Επιβεβαιώστε ότι δεν είστε ρομπότ"}
      >
        <RecaptchaCheckboxMark verified={verified} loading={loading} />
        <span className="not-a-robot-v3__label">Δεν είμαι ρομπότ</span>
        <RecaptchaBrandMark />
      </button>
      {internalIssue && <FormValidationNotice {...internalIssue} />}
    </div>
  );
}

/**
 * reCAPTCHA widget — v3 by default (matches Google key type), v2 checkbox if VITE_RECAPTCHA_VERSION=v2.
 */
export function NotARobotCheckbox({
  onVerify,
  className,
  resetKey = 0,
  invalid = false,
}: NotARobotCheckboxProps) {
  const version = getRecaptchaVersion();

  return (
    <div
      className={cn("not-a-robot", version === "v3" && "not-a-robot--v3", className)}
      aria-live="polite"
    >
      {version === "v2" ? (
        <RecaptchaV2Widget onVerify={onVerify} resetKey={resetKey} />
      ) : (
        <RecaptchaV3Widget onVerify={onVerify} resetKey={resetKey} invalid={invalid} />
      )}
    </div>
  );
}
