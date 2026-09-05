import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCreateSubscriber } from "@/hooks/useSubscribers";
import { sendEmail } from "@/lib/email";
import { useI18n } from "@/i18n";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function FooterNewsletterForm() {
  const { t } = useI18n();
  const { toast } = useToast();
  const createSubscriber = useCreateSubscriber();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const honeypotRef = useRef<HTMLInputElement>(null);

  const submitting = createSubscriber.isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (honeypotRef.current?.value) return;

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    if (!EMAIL_RE.test(cleanEmail)) {
      toast({
        title: t("footer.newsletter.invalidTitle"),
        description: t("footer.newsletter.invalidBody"),
        variant: "destructive",
      });
      return;
    }

    try {
      const created = await createSubscriber.mutateAsync({
        email: cleanEmail,
        name: null,
        verificationToken: crypto.randomUUID(),
      } as Parameters<typeof createSubscriber.mutateAsync>[0]);

      const verificationLink = `${window.location.origin}/verify-email?token=${created.verificationToken}`;
      const emailSent = await sendEmail({
        to: cleanEmail,
        subject: t("footer.newsletter.mailSubject"),
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0b3d6b;">${t("footer.newsletter.mailHeading")}</h2>
            <p>${t("footer.newsletter.mailIntro")}</p>
            <p>${t("footer.newsletter.mailBody")}</p>
            <p style="margin: 30px 0;">
              <a href="${verificationLink}"
                 style="background-color: #0b3d6b; color: white; padding: 12px 24px; text-decoration: none; display: inline-block;">
                ${t("footer.newsletter.mailCta")}
              </a>
            </p>
            <p>${t("footer.newsletter.mailIgnore")}</p>
            <p style="margin-top: 30px; color: #666; font-size: 12px;">
              ${t("footer.orgName")}<br/>
              ${t("footer.orgFull")}
            </p>
          </div>
        `,
      });

      if (!emailSent.success) {
        throw new Error(emailSent.error || t("footer.newsletter.errorBody"));
      }

      setStatus("success");
      setEmail("");
      toast({
        title: t("footer.newsletter.successTitle"),
        description: t("footer.newsletter.successBody"),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      const lower = msg.toLowerCase();
      const alreadyVerified = msg === "ALREADY_VERIFIED" || lower.includes("already");
      if (alreadyVerified) {
        toast({
          title: t("footer.newsletter.alreadyTitle"),
          description: t("footer.newsletter.duplicate"),
        });
        return;
      }
      const description = lower.includes("duplicate") || lower.includes("unique") || lower.includes("409")
        ? t("footer.newsletter.duplicate")
        : lower.includes("row level security")
          ? t("footer.newsletter.rls")
          : msg || t("footer.newsletter.errorBody");
      toast({
        title: t("footer.newsletter.errorTitle"),
        description,
        variant: "destructive",
      });
    }
  }

  return (
    <section className="palladio-footer__newsletter" aria-labelledby="footer-newsletter-title">
      <div className="palladio-footer__newsletter-copy">
        <h2 id="footer-newsletter-title" className="palladio-footer__menu-label">
          {t("footer.newsletter.title")}
        </h2>
        <p className="palladio-footer__info-text">{t("footer.newsletter.blurb")}</p>
      </div>

      <form className="palladio-footer__newsletter-form" onSubmit={handleSubmit} noValidate>
        <input
          ref={honeypotRef}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="palladio-footer__newsletter-honeypot"
        />

        <label className="sr-only" htmlFor="footer-newsletter-email">
          {t("footer.newsletter.email")}
        </label>
        <input
          id="footer-newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          disabled={submitting}
          placeholder={t("footer.newsletter.placeholder")}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "success") setStatus("idle");
          }}
          className="palladio-footer__newsletter-input"
        />
        <button
          type="submit"
          className="palladio-footer__newsletter-submit"
          disabled={submitting}
        >
          {submitting ? t("footer.newsletter.submitting") : t("footer.newsletter.submit")}
        </button>
      </form>

      <p className="palladio-footer__newsletter-note" role={status === "success" ? "status" : undefined}>
        {status === "success" ? (
          t("footer.newsletter.successInline")
        ) : (
          <>
            {t("footer.newsletter.privacyBefore")}{" "}
            <Link to="/privacy" className="palladio-footer__info-link">
              {t("footer.privacy")}
            </Link>
            {t("footer.newsletter.privacyAfter")}
          </>
        )}
      </p>
    </section>
  );
}
