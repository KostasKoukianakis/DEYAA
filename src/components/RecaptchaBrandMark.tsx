import { cn } from "@/lib/utils";

const RECAPTCHA_LOGO_SRC = "https://www.gstatic.com/recaptcha/api2/logo_48.png";

export function RecaptchaBrandMark() {
  return (
    <span className="not-a-robot-v3__brand" aria-hidden>
      <img
        src={RECAPTCHA_LOGO_SRC}
        alt=""
        width={32}
        height={32}
        className="not-a-robot-v3__logo-img"
        loading="lazy"
        decoding="async"
      />
      <span className="not-a-robot-v3__logo-text">reCAPTCHA</span>
      <span className="not-a-robot-v3__legal">
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="not-a-robot-v3__legal-link"
          tabIndex={-1}
          aria-hidden
        >
          Απόρρητο
        </a>
        <span aria-hidden> - </span>
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="not-a-robot-v3__legal-link"
          tabIndex={-1}
          aria-hidden
        >
          Όροι
        </a>
      </span>
    </span>
  );
}

export function RecaptchaCheckboxMark({
  verified,
  loading,
}: {
  verified: boolean;
  loading: boolean;
}) {
  return (
    <span
      className={cn(
        "not-a-robot-v3__check",
        verified && "is-checked",
        loading && "is-loading",
      )}
      aria-hidden
    >
      {loading && <span className="not-a-robot-v3__spinner" />}
      {verified && (
        <svg className="not-a-robot-v3__tick" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M9.2 16.2 4.8 11.8l-1.4 1.4L9.2 19 20.6 7.6l-1.4-1.4z"
            fill="currentColor"
          />
        </svg>
      )}
    </span>
  );
}
