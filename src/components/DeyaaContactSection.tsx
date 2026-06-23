import { useState, useRef, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { usePalladioContactEntrance } from "@/hooks/usePalladioContactEntrance";
import { useCreateContactMessage } from "@/hooks/useContactMessages";
import { deyaaContactTopics } from "@/data/deyaaContactTopics";
import { contactFormValidationMessages } from "@/data/deyaaFormValidationMessages";
import type { FormValidationIssue } from "@/data/deyaaFormValidationMessages";
import {
  applyContactFormValidationFocus,
  clearFieldValidity,
  getFirstContactFormIssue,
  setGreekFieldValidity,
} from "@/lib/contactFormValidation";
import { FormValidationNotice } from "@/components/FormValidationNotice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NotARobotCheckbox } from "@/components/NotARobotCheckbox";

interface DeyaaContactSectionProps {
  id?: string;
  downloadsId?: string;
  className?: string;
  sectionLabel?: string;
  sectionIndex?: string;
  headline?: string;
  downloadsTitle?: string;
  downloadsDescription?: string;
  downloadsCtaLabel?: string;
  downloadsHref?: string;
  privacyHref?: string;
  showDownloads?: boolean;
  showSectionAnchor?: boolean;
}

interface ContactFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  topic: string;
  supplyNumber: string;
  address: string;
  message: string;
  privacyAccepted: boolean;
}

const initialFormState: ContactFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  topic: "",
  supplyNumber: "",
  address: "",
  message: "",
  privacyAccepted: false,
};

/**
 * Palladio #contacts [05] + #go-to-downloads — contact form and documents CTA.
 */
export function DeyaaContactSection({
  id = "section-05",
  downloadsId = "section-05-downloads",
  className,
  sectionLabel = "Επικοινωνία",
  sectionIndex = "05",
  headline = "Μιλήστε μαζί μας",
  downloadsTitle = "Χρήσιμα υλικά για λήψη",
  downloadsDescription = "Καταστάσεις, τιμολόγια, έντυπα και τεχνικά στοιχεία. Ένας χώρος σχεδιασμένος για εύκολη και άμεση πρόσβαση στα έγγραφα που χρειάζεστε.",
  downloadsCtaLabel = "Μετάβαση στα έγγραφα",
  downloadsHref = "/services#item-documents",
  privacyHref = "/privacy",
  showDownloads = true,
  showSectionAnchor = true,
}: DeyaaContactSectionProps) {
  const { toast } = useToast();
  const contactRef = useRef<HTMLElement>(null);
  const downloadsRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const topicTriggerRef = useRef<HTMLButtonElement>(null);
  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const [topicError, setTopicError] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [validationIssue, setValidationIssue] = useState<FormValidationIssue | null>(null);
  const [validationIssueKey, setValidationIssueKey] = useState<string | null>(null);
  const createMessage = useCreateContactMessage();

  usePalladioContactEntrance({ contactRef, downloadsRef });

  const clearValidation = () => {
    if (validationIssue) {
      setValidationIssue(null);
      setValidationIssueKey(null);
    }
  };

  const updateField = (field: keyof ContactFormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearValidation();
  };

  const handleCaptchaVerify = (token: string | null) => {
    setCaptchaToken(token);
    if (token) clearValidation();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formEl = formRef.current;
    if (!formEl) return;

    const firstIssue = getFirstContactFormIssue(
      formEl,
      {
        topic: form.topic,
        phone: form.phone,
        privacyAccepted: form.privacyAccepted,
        captchaToken,
      },
      {
        topicTrigger: topicTriggerRef.current,
        captchaContainer: captchaRef.current,
      },
    );

    if (firstIssue) {
      setValidationIssueKey(firstIssue.key);
      setValidationIssue(firstIssue.issue);
      setTopicError(firstIssue.key === "topic");
      applyContactFormValidationFocus(firstIssue);
      return;
    }

    setValidationIssue(null);
    setValidationIssueKey(null);
    setTopicError(false);

    try {
      await createMessage.mutateAsync({
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        topic: form.topic,
        supply_number: form.supplyNumber.trim() || null,
        address: form.address.trim() || null,
        message: form.message.trim(),
        status: "new",
      });

      toast({
        title: "Το μήνυμά σας εστάλη",
        description: "Θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό.",
      });

      setForm(initialFormState);
      setTopicError(false);
      setValidationIssue(null);
      setValidationIssueKey(null);
      setCaptchaToken(null);
      setFormKey((key) => key + 1);
      formRef.current?.reset();
    } catch (error: unknown) {
      setValidationIssueKey("submitError");
      setValidationIssue({
        ...contactFormValidationMessages.submitError,
        description:
          error instanceof Error
            ? `${contactFormValidationMessages.submitError.description} (${error.message})`
            : contactFormValidationMessages.submitError.description,
      });
    }
  };

  return (
    <>
      <section
        ref={contactRef}
        id={id}
        className={cn("palladio-contact", className)}
        aria-label={sectionLabel}
      >
        <div className="palladio-contact__shell">
          {showSectionAnchor && (
            <div className="palladio-contact__anchor">
              <span className="palladio-contact__anchor-label">{sectionLabel}</span>
              <span className="palladio-contact__anchor-index">[{sectionIndex}]</span>
            </div>
          )}

          <div className="palladio-contact__grid">
            <div className="palladio-contact__headline-col">
              <h2 className="palladio-contact__headline">{headline}</h2>
            </div>

            <div className="palladio-contact__form-col">
              <form ref={formRef} className="palladio-contact__form" onSubmit={handleSubmit}>
                <div className="palladio-contact__fields-row">
                  <label className="palladio-contact__field">
                    <span className="palladio-contact__label">Όνομα*</span>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      onInvalid={setGreekFieldValidity}
                      onInput={clearFieldValidity}
                      placeholder="Όνομα"
                      required
                      autoComplete="given-name"
                    />
                  </label>

                  <label className="palladio-contact__field">
                    <span className="palladio-contact__label">Επώνυμο*</span>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      onInvalid={setGreekFieldValidity}
                      onInput={clearFieldValidity}
                      placeholder="Επώνυμο"
                      required
                      autoComplete="family-name"
                    />
                  </label>
                </div>

                <label className="palladio-contact__field">
                  <span className="palladio-contact__label">Email*</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    onInvalid={setGreekFieldValidity}
                    onInput={clearFieldValidity}
                    placeholder="email@example.com"
                    required
                    autoComplete="email"
                  />
                </label>

                <label className="palladio-contact__field palladio-contact__field--phone">
                  <span className="palladio-contact__label">Τηλέφωνο επικοινωνίας*</span>
                  <span className="palladio-contact__phone-wrap">
                    <span className="palladio-contact__phone-prefix" aria-hidden>
                      🇬🇷 +30
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      onInvalid={setGreekFieldValidity}
                      onInput={clearFieldValidity}
                      placeholder="28210 000000"
                      required
                      autoComplete="tel"
                      minLength={8}
                      maxLength={20}
                    />
                  </span>
                </label>

                <div
                  className={cn(
                    "palladio-contact__field palladio-contact__field--select",
                    (topicError || validationIssueKey === "topic") && "is-invalid",
                  )}
                >
                  <span className="palladio-contact__label" id="contact-topic-label">
                    Θέμα*
                  </span>
                  <input
                    type="text"
                    name="topic"
                    value={form.topic}
                    readOnly
                    required
                    tabIndex={-1}
                    aria-hidden
                    className="palladio-contact__sr-only"
                  />
                  <Select
                    key={`contact-topic-${formKey}`}
                    value={form.topic === "" ? undefined : form.topic}
                    onValueChange={(value) => {
                      updateField("topic", value);
                      setTopicError(false);
                    }}
                  >
                    <SelectTrigger
                      ref={topicTriggerRef}
                      id="contact-topic"
                      className="palladio-contact__select-trigger"
                      aria-labelledby="contact-topic-label"
                      aria-required
                      aria-invalid={topicError || validationIssueKey === "topic"}
                    >
                      <SelectValue placeholder="Επιλέξτε θέμα" />
                    </SelectTrigger>
                    <SelectContent
                      className="palladio-contact__select-content"
                      position="popper"
                      sideOffset={6}
                    >
                      {deyaaContactTopics.map((topic) => (
                        <SelectItem
                          key={topic.value}
                          value={topic.value}
                          className="palladio-contact__select-item"
                        >
                          {topic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationIssueKey === "topic" && validationIssue && (
                    <FormValidationNotice
                      {...validationIssue}
                      className="palladio-contact__field-notice"
                    />
                  )}
                </div>

                <label className="palladio-contact__field">
                  <span className="palladio-contact__label">Αριθμός παροχής</span>
                  <input
                    type="text"
                    name="supplyNumber"
                    value={form.supplyNumber}
                    onChange={(e) => updateField("supplyNumber", e.target.value)}
                    placeholder="Αν γνωρίζετε τον αριθμό παροχής / καταμέτρησης"
                    autoComplete="off"
                  />
                </label>

                <label className="palladio-contact__field">
                  <span className="palladio-contact__label">Διεύθυνση παροχής</span>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="Οδός, οικισμός"
                    autoComplete="street-address"
                  />
                </label>

                <label className="palladio-contact__field">
                  <span className="palladio-contact__label">Μήνυμα*</span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    onInvalid={setGreekFieldValidity}
                    onInput={clearFieldValidity}
                    placeholder="Περιγράψτε το αίτημά σας"
                    rows={5}
                    required
                    minLength={10}
                  />
                </label>

                <label className="palladio-contact__checkbox">
                  <input
                    type="checkbox"
                    checked={form.privacyAccepted}
                    onChange={(e) => updateField("privacyAccepted", e.target.checked)}
                    required
                  />
                  <span>
                    Έχω διαβάσει και κατανοώ την{" "}
                    <Link to={privacyHref} className="palladio-contact__privacy-link">
                      πολιτική απορρήτου
                    </Link>
                    *
                  </span>
                </label>

                <div ref={captchaRef}>
                  <NotARobotCheckbox
                    resetKey={formKey}
                    onVerify={handleCaptchaVerify}
                    invalid={validationIssueKey === "captcha"}
                    className="palladio-contact__captcha"
                  />
                </div>

                {validationIssue && validationIssueKey !== "topic" && (
                  <FormValidationNotice
                    {...validationIssue}
                    className="palladio-contact__validation-notice"
                  />
                )}

                <div className="palladio-contact__submit-wrap">
                  <button
                    type="submit"
                    className="palladio-contact__submit"
                    disabled={createMessage.isPending}
                  >
                    {createMessage.isPending ? "Αποστολή…" : "Αποστολή"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {showDownloads && (
        <section
          ref={downloadsRef}
          id={downloadsId}
          className="palladio-contact-downloads"
          aria-label={downloadsTitle}
        >
          <div className="palladio-contact-downloads__inner">
            <div className="palladio-contact-downloads__grid">
              <div className="palladio-contact-downloads__copy">
                <h2 className="palladio-contact-downloads__title">{downloadsTitle}</h2>
                <p className="palladio-contact-downloads__description">
                  {downloadsDescription.split(/\s+/).map((word, index) => (
                    <span key={index} className="palladio-contact-downloads__description-word">
                      {index > 0 ? " " : null}
                      {word}
                    </span>
                  ))}
                </p>
              </div>

              <div className="palladio-contact-downloads__cta-col">
                <Link to={downloadsHref} className="palladio-button button outline white">
                  {downloadsCtaLabel}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
